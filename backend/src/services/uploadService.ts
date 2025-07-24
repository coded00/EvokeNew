import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import multer from 'multer';
// @ts-ignore - multer-s3 types are defined in src/types/multer-s3.d.ts
import multerS3 from 'multer-s3';
import path from 'path';
import { Request } from 'express';

// File upload configuration and limits
export const FILE_UPLOAD_CONFIG = {
  // File size limits (in bytes)
  limits: {
    // Profile images (avatars, profile pictures)
    profileImage: 5 * 1024 * 1024, // 5MB
    // Event images (banners, event photos)
    eventImage: 10 * 1024 * 1024, // 10MB
    // Event documents (PDFs, contracts, etc.)
    eventDocument: 25 * 1024 * 1024, // 25MB
    // General images (gallery, etc.)
    generalImage: 8 * 1024 * 1024, // 8MB
    // General documents
    generalDocument: 20 * 1024 * 1024, // 20MB
    // Default limit
    default: 5 * 1024 * 1024, // 5MB
  },

  // Allowed file types
  allowedTypes: {
    images: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    all: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },

  // File type categories
  categories: {
    profileImage: {
      types: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      maxSize: 5 * 1024 * 1024, // 5MB
      folder: 'profile-images',
    },
    eventImage: {
      types: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
      maxSize: 10 * 1024 * 1024, // 10MB
      folder: 'event-images',
    },
    eventDocument: {
      types: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      maxSize: 25 * 1024 * 1024, // 25MB
      folder: 'event-documents',
    },
    generalImage: {
      types: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
      maxSize: 8 * 1024 * 1024, // 8MB
      folder: 'general-images',
    },
    generalDocument: {
      types: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      maxSize: 20 * 1024 * 1024, // 20MB
      folder: 'general-documents',
    },
  },
};

export interface UploadConfig {
  category: keyof typeof FILE_UPLOAD_CONFIG.categories;
  userId: string;
  customFolder?: string;
}

export interface UploadResult {
  success: boolean;
  fileUrl?: string;
  fileKey?: string;
  error?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
}

class UploadService {
  private s3Client: S3Client;
  private bucketName: string;
  private region: string;

  constructor() {
    this.bucketName = process.env['AWS_S3_BUCKET'] || 'evoke-uploads';
    this.region = process.env['AWS_REGION'] || 'us-east-1';

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env['AWS_ACCESS_KEY_ID'] || '',
        secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'] || '',
      },
    });
  }

  // Create multer upload middleware for a specific category
  createUploadMiddleware(category: keyof typeof FILE_UPLOAD_CONFIG.categories) {
    const config = FILE_UPLOAD_CONFIG.categories[category];

    return multer({
      storage: multerS3({
        s3: this.s3Client,
        bucket: this.bucketName,
        metadata: (req: Request, file: Express.Multer.File, cb: (error: any, metadata?: any) => void) => {
          cb(null, {
            fieldName: file.fieldname,
            originalName: file.originalname,
            mimeType: file.mimetype,
            uploadedBy: req.user?.userId || 'anonymous',
            category,
            uploadedAt: new Date().toISOString(),
          });
        },
        key: (req: Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) => {
          const userId = req.user?.userId || 'anonymous';
          const timestamp = Date.now();
          const fileExtension = path.extname(file.originalname);
          const fileName = `${file.originalname.replace(/\.[^/.]+$/, '')}_${timestamp}${fileExtension}`;
          const key = `${config.folder}/${userId}/${fileName}`;
          cb(null, key);
        },
        contentType: (_req: Request, file: Express.Multer.File, cb: (error: any, contentType?: string) => void) => {
          cb(null, file.mimetype);
        },
      }),
      limits: {
        fileSize: config.maxSize,
      },
      fileFilter: (_req: Request, file: Express.Multer.File, cb: (error: any, accept?: boolean) => void) => {
        if (config.types.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error(`Invalid file type. Allowed types: ${config.types.join(', ')}`));
        }
      },
    });
  }

  // Upload a single file
  async uploadSingleFile(
    file: Express.Multer.File,
    config: UploadConfig
  ): Promise<UploadResult> {
    try {
      const categoryConfig = FILE_UPLOAD_CONFIG.categories[config.category];
      
      // Validate file type
      if (!categoryConfig.types.includes(file.mimetype)) {
        return {
          success: false,
          error: `Invalid file type. Allowed types: ${categoryConfig.types.join(', ')}`,
        };
      }

      // Validate file size
      if (file.size > categoryConfig.maxSize) {
        return {
          success: false,
          error: `File size exceeds limit. Maximum size: ${this.formatBytes(categoryConfig.maxSize)}`,
        };
      }

      // Generate file key
      const timestamp = Date.now();
      const fileExtension = path.extname(file.originalname);
      const fileName = `${file.originalname.replace(/\.[^/.]+$/, '')}_${timestamp}${fileExtension}`;
      const fileKey = `${categoryConfig.folder}/${config.userId}/${fileName}`;

      // Upload to S3
      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          originalName: file.originalname,
          uploadedBy: config.userId,
          category: config.category,
          uploadedAt: new Date().toISOString(),
        },
      });

      await this.s3Client.send(uploadCommand);

      const fileUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileKey}`;

      return {
        success: true,
        fileUrl,
        fileKey,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
      };
    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: 'Failed to upload file',
      };
    }
  }

  // Delete a file from S3
  async deleteFile(fileKey: string): Promise<boolean> {
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });

      await this.s3Client.send(deleteCommand);
      return true;
    } catch (error) {
      console.error('Delete file error:', error);
      return false;
    }
  }

  // Generate a presigned URL for file access (if needed for private files)
  async generatePresignedUrl(fileKey: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      console.error('Generate presigned URL error:', error);
      throw new Error('Failed to generate presigned URL');
    }
  }

  // Get file information
  async getFileInfo(fileKey: string): Promise<any> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });

      const response = await this.s3Client.send(command);
      return {
        contentType: response.ContentType,
        contentLength: response.ContentLength,
        lastModified: response.LastModified,
        metadata: response.Metadata,
      };
    } catch (error) {
      console.error('Get file info error:', error);
      throw new Error('Failed to get file information');
    }
  }

  // Format bytes to human readable format
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Validate file upload configuration
  validateUploadConfig(category: string): boolean {
    return category in FILE_UPLOAD_CONFIG.categories;
  }

  // Get upload limits for a category
  getUploadLimits(category: keyof typeof FILE_UPLOAD_CONFIG.categories) {
    const config = FILE_UPLOAD_CONFIG.categories[category];
    return {
      maxSize: config.maxSize,
      maxSizeFormatted: this.formatBytes(config.maxSize),
      allowedTypes: config.types,
      folder: config.folder,
    };
  }
}

export default new UploadService(); 