// Simple test script to verify upload system
const express = require('express');
const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');

// Mock environment variables
process.env.AWS_ACCESS_KEY_ID = 'test-key';
process.env.AWS_SECRET_ACCESS_KEY = 'test-secret';
process.env.AWS_REGION = 'us-east-1';
process.env.AWS_S3_BUCKET = 'test-bucket';

const app = express();
const PORT = 3002;

// S3 Client setup
const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// File upload configuration
const FILE_UPLOAD_CONFIG = {
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
  },
};

// Create upload middleware
const createUploadMiddleware = (category) => {
  const config = FILE_UPLOAD_CONFIG.categories[category];
  
  return multer({
    storage: multerS3({
      s3: s3Client,
      bucket: process.env.AWS_S3_BUCKET,
      metadata: (req, file, cb) => {
        cb(null, {
          fieldName: file.fieldname,
          originalName: file.originalname,
          mimeType: file.mimetype,
          category,
          uploadedAt: new Date().toISOString(),
        });
      },
      key: (req, file, cb) => {
        const userId = 'test-user';
        const timestamp = Date.now();
        const fileExtension = require('path').extname(file.originalname);
        const fileName = `${file.originalname.replace(/\.[^/.]+$/, '')}_${timestamp}${fileExtension}`;
        const key = `${config.folder}/${userId}/${fileName}`;
        cb(null, key);
      },
      contentType: (req, file, cb) => {
        cb(null, file.mimetype);
      },
    }),
    limits: {
      fileSize: config.maxSize,
    },
    fileFilter: (req, file, cb) => {
      if (config.types.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Invalid file type. Allowed types: ${config.types.join(', ')}`));
      }
    },
  });
};

// Test upload endpoint
app.post('/upload/:category', (req, res, next) => {
  const { category } = req.params;
  
  if (!FILE_UPLOAD_CONFIG.categories[category]) {
    return res.status(400).json({
      error: 'Invalid category',
      message: `Invalid category: ${category}`,
    });
  }

  const uploadMiddleware = createUploadMiddleware(category);
  uploadMiddleware.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        error: 'Upload failed',
        message: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: 'No file provided',
        message: 'Please select a file to upload',
      });
    }

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        fileUrl: req.file.location,
        fileKey: req.file.key,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
      },
    });
  });
});

// Get upload limits
app.get('/limits/:category', (req, res) => {
  const { category } = req.params;
  
  if (!FILE_UPLOAD_CONFIG.categories[category]) {
    return res.status(400).json({
      error: 'Invalid category',
      message: `Invalid category: ${category}`,
    });
  }

  const config = FILE_UPLOAD_CONFIG.categories[category];
  
  res.status(200).json({
    success: true,
    data: {
      category,
      maxSize: config.maxSize,
      maxSizeFormatted: `${Math.round(config.maxSize / (1024 * 1024))} MB`,
      allowedTypes: config.types,
      folder: config.folder,
    },
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Upload test server is running',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Upload test server running on port ${PORT}`);
  console.log(`📤 Test upload: http://localhost:${PORT}/upload/profileImage`);
  console.log(`📋 Get limits: http://localhost:${PORT}/limits/profileImage`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

module.exports = app; 