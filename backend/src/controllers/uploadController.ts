import { Request, Response } from 'express';
import { param } from 'express-validator';
import uploadService, { FILE_UPLOAD_CONFIG, UploadConfig } from '../services/uploadService';

class UploadController {
  // Upload a single file
  uploadFile = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required',
          message: 'User must be authenticated to upload files',
        });
        return;
      }

      const { category } = req.params;
      const file = req.file;

      if (!file) {
        res.status(400).json({
          error: 'No file provided',
          message: 'Please select a file to upload',
        });
        return;
      }

      if (!category || !uploadService.validateUploadConfig(category)) {
        res.status(400).json({
          error: 'Invalid upload category',
          message: `Invalid category: ${category}. Valid categories: ${Object.keys(FILE_UPLOAD_CONFIG.categories).join(', ')}`,
        });
        return;
      }

      const uploadConfig: UploadConfig = {
        category: category as keyof typeof FILE_UPLOAD_CONFIG.categories,
        userId: req.user.userId,
      };

      const result = await uploadService.uploadSingleFile(file, uploadConfig);

      if (!result.success) {
        res.status(400).json({
          error: 'Upload failed',
          message: result.error,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          fileUrl: result.fileUrl,
          fileKey: result.fileKey,
          fileName: result.fileName,
          fileSize: result.fileSize,
          mimeType: result.mimeType,
        },
      });
    } catch (error: any) {
      console.error('Upload controller error:', error);
      res.status(500).json({
        error: 'Upload failed',
        message: 'An error occurred during file upload',
      });
    }
  };

  // Delete a file
  deleteFile = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required',
          message: 'User must be authenticated to delete files',
        });
        return;
      }

      const { fileKey } = req.params;

      if (!fileKey) {
        res.status(400).json({
          error: 'File key required',
          message: 'File key is required to delete a file',
        });
        return;
      }

      const success = await uploadService.deleteFile(fileKey);

      if (!success) {
        res.status(500).json({
          error: 'Delete failed',
          message: 'Failed to delete file',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'File deleted successfully',
      });
    } catch (error: any) {
      console.error('Delete file controller error:', error);
      res.status(500).json({
        error: 'Delete failed',
        message: 'An error occurred while deleting the file',
      });
    }
  };

  // Get upload limits for a category
  getUploadLimits = async (req: Request, res: Response): Promise<void> => {
    try {
      const { category } = req.params;

      if (!category || !uploadService.validateUploadConfig(category)) {
        res.status(400).json({
          error: 'Invalid category',
          message: `Invalid category: ${category}. Valid categories: ${Object.keys(FILE_UPLOAD_CONFIG.categories).join(', ')}`,
        });
        return;
      }

      const limits = uploadService.getUploadLimits(category as keyof typeof FILE_UPLOAD_CONFIG.categories);

      res.status(200).json({
        success: true,
        data: {
          category,
          ...limits,
        },
      });
    } catch (error: any) {
      console.error('Get upload limits error:', error);
      res.status(500).json({
        error: 'Failed to get upload limits',
        message: 'An error occurred while retrieving upload limits',
      });
    }
  };

  // Get all upload categories and their limits
  getAllUploadLimits = async (_req: Request, res: Response): Promise<void> => {
    try {
      const categories = Object.keys(FILE_UPLOAD_CONFIG.categories);
      const limits: Record<string, any> = {};

      categories.forEach((category) => {
        limits[category] = uploadService.getUploadLimits(category as keyof typeof FILE_UPLOAD_CONFIG.categories);
      });

      res.status(200).json({
        success: true,
        data: {
          categories: limits,
          totalCategories: categories.length,
        },
      });
    } catch (error: any) {
      console.error('Get all upload limits error:', error);
      res.status(500).json({
        error: 'Failed to get upload limits',
        message: 'An error occurred while retrieving upload limits',
      });
    }
  };

  // Generate presigned URL for private file access
  generatePresignedUrl = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required',
          message: 'User must be authenticated to generate presigned URLs',
        });
        return;
      }

      const { fileKey } = req.params;
      const { expiresIn = 3600 } = req.query;

      if (!fileKey) {
        res.status(400).json({
          error: 'File key required',
          message: 'File key is required to generate presigned URL',
        });
        return;
      }

      const presignedUrl = await uploadService.generatePresignedUrl(fileKey, Number(expiresIn));

      res.status(200).json({
        success: true,
        data: {
          presignedUrl,
          expiresIn: Number(expiresIn),
          fileKey,
        },
      });
    } catch (error: any) {
      console.error('Generate presigned URL error:', error);
      res.status(500).json({
        error: 'Failed to generate presigned URL',
        message: 'An error occurred while generating presigned URL',
      });
    }
  };

  // Get file information
  getFileInfo = async (req: Request, res: Response): Promise<void> => {
    try {
      const { fileKey } = req.params;

      if (!fileKey) {
        res.status(400).json({
          error: 'File key required',
          message: 'File key is required to get file information',
        });
        return;
      }

      const fileInfo = await uploadService.getFileInfo(fileKey);

      res.status(200).json({
        success: true,
        data: {
          fileKey,
          ...fileInfo,
        },
      });
    } catch (error: any) {
      console.error('Get file info error:', error);
      res.status(500).json({
        error: 'Failed to get file information',
        message: 'An error occurred while retrieving file information',
      });
    }
  };
}

export default new UploadController(); 