import { Router } from 'express';
import emailController from '../controllers/emailController';
import authMiddleware from '../middleware/auth';
import { createRateLimiters, validateInput } from '../middleware/security';

const router = Router();

// Initialize rate limiters
const rateLimiters = createRateLimiters();

// TODO: Update validation rules with commonValidations when all rules are available
const customEmailValidation: any[] = [];
const welcomeEmailValidation: any[] = [];
const passwordResetEmailValidation: any[] = [];
const emailVerificationValidation: any[] = [];
const eventConfirmationValidation: any[] = [];
const ticketPurchaseValidation: any[] = [];

// Send custom email
router.post(
  '/custom',
  authMiddleware.verifyToken,
  rateLimiters.emailLimiter,
  customEmailValidation,
  validateInput,
  emailController.sendCustomEmail
);

// Send welcome email
router.post(
  '/welcome',
  authMiddleware.verifyToken,
  rateLimiters.emailLimiter,
  welcomeEmailValidation,
  validateInput,
  emailController.sendWelcomeEmail
);

// Send password reset email
router.post(
  '/password-reset',
  rateLimiters.emailLimiter,
  passwordResetEmailValidation,
  validateInput,
  emailController.sendPasswordResetEmail
);

// Send email verification
router.post(
  '/verification',
  authMiddleware.verifyToken,
  rateLimiters.emailLimiter,
  emailVerificationValidation,
  validateInput,
  emailController.sendEmailVerification
);

// Send event confirmation email
router.post(
  '/event-confirmation',
  authMiddleware.verifyToken,
  rateLimiters.emailLimiter,
  eventConfirmationValidation,
  validateInput,
  emailController.sendEventConfirmation
);

// Send ticket purchase confirmation
router.post(
  '/ticket-purchase',
  rateLimiters.emailLimiter,
  ticketPurchaseValidation,
  validateInput,
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