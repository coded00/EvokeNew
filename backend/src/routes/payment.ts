import { Router } from 'express';
import { body, param } from 'express-validator';
import rateLimit from 'express-rate-limit';
import paymentController from '../controllers/paymentController';
import authMiddleware from '../middleware/auth';

const router = Router();

// Rate limiting for payment endpoints
const paymentRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 payment requests per windowMs
  message: {
    error: 'Too many payment requests',
    message: 'Please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation rules
const initializePaymentValidation = [
  body('amount')
    .isInt({ min: 100 })
    .withMessage('Amount must be at least 100 (in kobo/cents)'),
  body('currency')
    .isIn(['NGN', 'USD', 'GHS', 'KES'])
    .withMessage('Currency must be one of: NGN, USD, GHS, KES'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('reference')
    .optional()
    .isString()
    .withMessage('Reference must be a string'),
  body('callback_url')
    .optional()
    .isURL()
    .withMessage('Callback URL must be a valid URL'),
  body('metadata')
    .optional()
    .isObject()
    .withMessage('Metadata must be an object'),
  body('channels')
    .optional()
    .isArray()
    .withMessage('Channels must be an array'),
  body('split_code')
    .optional()
    .isString()
    .withMessage('Split code must be a string'),
  body('subaccount')
    .optional()
    .isString()
    .withMessage('Subaccount must be a string'),
  body('transaction_charge')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Transaction charge must be a non-negative integer'),
  body('bearer')
    .optional()
    .isIn(['account', 'subaccount'])
    .withMessage('Bearer must be either "account" or "subaccount"'),
  body('ussd_code')
    .optional()
    .isString()
    .withMessage('USSD code must be a string'),
  body('bank')
    .optional()
    .isObject()
    .withMessage('Bank must be an object'),
  body('qr_code')
    .optional()
    .isBoolean()
    .withMessage('QR code must be a boolean'),
  body('invoice_limit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Invoice limit must be a positive integer'),
];

const verifyPaymentValidation = [
  body('reference')
    .notEmpty()
    .withMessage('Reference is required')
    .isString()
    .withMessage('Reference must be a string'),
];

const refundPaymentValidation = [
  body('transaction_id')
    .notEmpty()
    .withMessage('Transaction ID is required')
    .isString()
    .withMessage('Transaction ID must be a string'),
  body('amount')
    .optional()
    .isInt({ min: 100 })
    .withMessage('Amount must be at least 100 (in kobo/cents)'),
  body('reason')
    .optional()
    .isString()
    .withMessage('Reason must be a string'),
];

const createCustomerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('first_name')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  body('last_name')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage('Phone number must be in a valid format'),
  body('metadata')
    .optional()
    .isObject()
    .withMessage('Metadata must be an object'),
];

const transactionIdValidation = [
  param('transaction_id')
    .notEmpty()
    .withMessage('Transaction ID is required')
    .isString()
    .withMessage('Transaction ID must be a string'),
];

const customerIdValidation = [
  param('customer_id')
    .notEmpty()
    .withMessage('Customer ID is required')
    .isString()
    .withMessage('Customer ID must be a string'),
];

// Initialize payment
router.post(
  '/initialize',
  authMiddleware.verifyToken,
  paymentRateLimit,
  initializePaymentValidation,
  paymentController.initializePayment
);

// Verify payment
router.post(
  '/verify',
  paymentRateLimit,
  verifyPaymentValidation,
  paymentController.verifyPayment
);

// Refund payment
router.post(
  '/refund',
  authMiddleware.verifyToken,
  paymentRateLimit,
  refundPaymentValidation,
  paymentController.refundPayment
);

// Get transaction details
router.get(
  '/transaction/:transaction_id',
  authMiddleware.verifyToken,
  transactionIdValidation,
  paymentController.getTransaction
);

// List transactions
router.get(
  '/transactions',
  authMiddleware.verifyToken,
  paymentController.listTransactions
);

// Create customer
router.post(
  '/customer',
  authMiddleware.verifyToken,
  paymentRateLimit,
  createCustomerValidation,
  paymentController.createCustomer
);

// Get customer details
router.get(
  '/customer/:customer_id',
  authMiddleware.verifyToken,
  customerIdValidation,
  paymentController.getCustomer
);

// Process webhook events
router.post(
  '/webhook',
  paymentController.processWebhook
);

// Get supported payment methods
router.get(
  '/methods',
  paymentController.getPaymentMethods
);

// Get supported currencies
router.get(
  '/currencies',
  paymentController.getCurrencies
);

// Verify payment service configuration
router.get(
  '/verify-config',
  paymentController.verifyConfiguration
);

// Health check for payment service
router.get(
  '/health',
  paymentController.healthCheck
);

export default router; 