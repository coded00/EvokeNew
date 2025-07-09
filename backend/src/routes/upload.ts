import { Router } from 'express';
import { param } from 'express-validator';
import rateLimit from 'express-rate-limit';
import uploadController from '../controllers/uploadController';
import authMiddleware from '../middleware/auth';
import uploadService, { FILE_UPLOAD_CONFIG } from '../services/uploadService';

const router = Router();

// Rate limiting for upload endpoints
const uploadRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 upload requests per windowMs
  message: {
    error: 'Too many upload attempts',
    message: 'Please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation rules
const categoryValidation = [
  param('category')
    .isIn(Object.keys(FILE_UPLOAD_CONFIG.categories))
    .withMessage(`Invalid category. Valid categories: ${Object.keys(FILE_UPLOAD_CONFIG.categories).join(', ')}`),
];

const fileKeyValidation = [
  param('fileKey')
    .notEmpty()
    .withMessage('File key is required')
    .isString()
    .withMessage('File key must be a string'),
];

// Upload a single file
router.post(
  '/:category',
  authMiddleware.verifyToken,
  uploadRateLimit,
  categoryValidation,
  (req: any, res: any, next: any) => {
    const { category } = req.params;
    if (category && uploadService.validateUploadConfig(category)) {
      const uploadMiddleware = uploadService.createUploadMiddleware(category as keyof typeof FILE_UPLOAD_CONFIG.categories);
      uploadMiddleware.single('file')(req, res, next);
    } else {
      next();
    }
  },
  uploadController.uploadFile
);

// Delete a file
router.delete(
  '/:fileKey',
  authMiddleware.verifyToken,
  fileKeyValidation,
  uploadController.deleteFile
);

// Get upload limits for a specific category
router.get(
  '/limits/:category',
  categoryValidation,
  uploadController.getUploadLimits
);

// Get all upload limits
router.get(
  '/limits',
  uploadController.getAllUploadLimits
);

// Generate presigned URL for private file access
router.get(
  '/presigned/:fileKey',
  authMiddleware.verifyToken,
  fileKeyValidation,
  uploadController.generatePresignedUrl
);

// Get file information
router.get(
  '/info/:fileKey',
  fileKeyValidation,
  uploadController.getFileInfo
);

export default router; 