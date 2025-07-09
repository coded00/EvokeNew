import { Router } from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import emailController from '../controllers/emailController';
import authMiddleware from '../middleware/auth';

const router = Router();

// Rate limiting for email endpoints
const emailRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 email requests per windowMs
  message: {
    error: 'Too many email requests',
    message: 'Please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation rules
const customEmailValidation = [
  body('to')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('subject')
    .isLength({ min: 1, max: 200 })
    .withMessage('Subject must be between 1 and 200 characters'),
  body('html')
    .optional()
    .isString()
    .withMessage('HTML content must be a string'),
  body('text')
    .optional()
    .isString()
    .withMessage('Text content must be a string'),
  body('template')
    .optional()
    .isString()
    .withMessage('Template must be a string'),
  body('templateData')
    .optional()
    .isObject()
    .withMessage('Template data must be an object'),
];

const welcomeEmailValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('firstName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  body('lastName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters'),
];

const passwordResetEmailValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('resetToken')
    .isLength({ min: 32, max: 64 })
    .withMessage('Reset token must be between 32 and 64 characters'),
  body('firstName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
];

const emailVerificationValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('verificationToken')
    .isLength({ min: 32, max: 64 })
    .withMessage('Verification token must be between 32 and 64 characters'),
  body('firstName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
];

const eventConfirmationValidation = [
  body('organizerEmail')
    .isEmail()
    .withMessage('Please provide a valid organizer email address')
    .normalizeEmail(),
  body('eventName')
    .isLength({ min: 1, max: 200 })
    .withMessage('Event name must be between 1 and 200 characters'),
  body('eventDate')
    .optional()
    .isISO8601()
    .withMessage('Event date must be a valid date'),
  body('eventTime')
    .optional()
    .isString()
    .withMessage('Event time must be a string'),
  body('eventLocation')
    .optional()
    .isString()
    .withMessage('Event location must be a string'),
  body('eventUrl')
    .optional()
    .isURL()
    .withMessage('Event URL must be a valid URL'),
  body('organizerName')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Organizer name must be between 1 and 100 characters'),
];

const ticketPurchaseValidation = [
  body('customerEmail')
    .isEmail()
    .withMessage('Please provide a valid customer email address')
    .normalizeEmail(),
  body('eventName')
    .isLength({ min: 1, max: 200 })
    .withMessage('Event name must be between 1 and 200 characters'),
  body('orderId')
    .isLength({ min: 1, max: 100 })
    .withMessage('Order ID must be between 1 and 100 characters'),
  body('eventDate')
    .optional()
    .isISO8601()
    .withMessage('Event date must be a valid date'),
  body('eventTime')
    .optional()
    .isString()
    .withMessage('Event time must be a string'),
  body('eventLocation')
    .optional()
    .isString()
    .withMessage('Event location must be a string'),
  body('ticketType')
    .optional()
    .isString()
    .withMessage('Ticket type must be a string'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  body('totalAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Total amount must be a positive number'),
  body('customerName')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Customer name must be between 1 and 100 characters'),
];

// Send custom email
router.post(
  '/custom',
  authMiddleware.verifyToken,
  emailRateLimit,
  customEmailValidation,
  emailController.sendCustomEmail
);

// Send welcome email
router.post(
  '/welcome',
  authMiddleware.verifyToken,
  emailRateLimit,
  welcomeEmailValidation,
  emailController.sendWelcomeEmail
);

// Send password reset email
router.post(
  '/password-reset',
  emailRateLimit,
  passwordResetEmailValidation,
  emailController.sendPasswordResetEmail
);

// Send email verification
router.post(
  '/verification',
  authMiddleware.verifyToken,
  emailRateLimit,
  emailVerificationValidation,
  emailController.sendEmailVerification
);

// Send event confirmation email
router.post(
  '/event-confirmation',
  authMiddleware.verifyToken,
  emailRateLimit,
  eventConfirmationValidation,
  emailController.sendEventConfirmation
);

// Send ticket purchase confirmation
router.post(
  '/ticket-purchase',
  emailRateLimit,
  ticketPurchaseValidation,
  emailController.sendTicketPurchaseConfirmation
);

// Verify email configuration
router.get(
  '/verify',
  emailController.verifyEmailConfiguration
);

// Get email templates
router.get(
  '/templates',
  emailController.getEmailTemplates
);

// Get email provider information
router.get(
  '/provider',
  emailController.getEmailProviderInfo
);

export default router; 