import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { body, validationResult } from 'express-validator';

// Enhanced rate limiting configurations
export const createRateLimiters = () => {
  // Global rate limiter (already applied in main app)
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests',
      message: 'Please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
  });

  // Authentication rate limiter (stricter for login/register)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 auth requests per windowMs
    message: {
      error: 'Too many authentication attempts',
      message: 'Please try again in 15 minutes',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful logins
    skipFailedRequests: false,
  });

  // Upload rate limiter
  const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // limit each IP to 10 uploads per hour
    message: {
      error: 'Too many upload attempts',
      message: 'Please try again in an hour',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Payment rate limiter
  const paymentLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // limit each IP to 20 payment requests per hour
    message: {
      error: 'Too many payment attempts',
      message: 'Please try again in an hour',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Email rate limiter
  const emailLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // limit each IP to 5 email requests per hour
    message: {
      error: 'Too many email requests',
      message: 'Please try again in an hour',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // WebSocket connection rate limiter
  const wsLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 WebSocket connections per minute
    message: {
      error: 'Too many WebSocket connections',
      message: 'Please try again in a minute',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  return {
    globalLimiter,
    authLimiter,
    uploadLimiter,
    paymentLimiter,
    emailLimiter,
    wsLimiter,
  };
};

// Enhanced security headers configuration
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "ws:", "wss:"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  frameguard: { action: 'deny' },
  xssFilter: true,
  hidePoweredBy: true,
});

// Input validation middleware
export const validateInput = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.type === 'field' ? err.path : 'unknown',
        message: err.msg,
        value: err.type === 'field' ? err.value : undefined,
      })),
    });
    return;
  }
  next();
};

// Common validation rules
export const commonValidations = {
  email: body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  password: body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  username: body('username')
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username must be 3-30 characters long and contain only letters, numbers, underscores, and hyphens'),
  
  firstName: body('firstName')
    .isLength({ min: 1, max: 50 })
    .trim()
    .escape()
    .withMessage('First name must be 1-50 characters long'),
  
  lastName: body('lastName')
    .isLength({ min: 1, max: 50 })
    .trim()
    .escape()
    .withMessage('Last name must be 1-50 characters long'),
  
  phone: body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  
  eventTitle: body('title')
    .isLength({ min: 1, max: 100 })
    .trim()
    .escape()
    .withMessage('Event title must be 1-100 characters long'),
  
  eventDescription: body('description')
    .isLength({ min: 1, max: 1000 })
    .trim()
    .escape()
    .withMessage('Event description must be 1-1000 characters long'),
  
  ticketPrice: body('price')
    .isFloat({ min: 0 })
    .withMessage('Ticket price must be a positive number'),
  
  ticketQuantity: body('quantity')
    .isInt({ min: 1, max: 10000 })
    .withMessage('Ticket quantity must be between 1 and 10,000'),
  
  avatar: body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL'),
  
  dateOfBirth: body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid date'),
  
  refreshToken: body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required'),
  
  resetToken: body('resetToken')
    .notEmpty()
    .withMessage('Reset token is required'),
  
  role: body('role')
    .isIn(['USER', 'ORGANIZER', 'MODERATOR', 'ADMIN'])
    .withMessage('Role must be one of: USER, ORGANIZER, MODERATOR, ADMIN'),
  
  enabled: body('enabled')
    .isBoolean()
    .withMessage('Enabled must be a boolean'),
  
  clientId: body('clientId')
    .optional()
    .isString()
    .withMessage('Client ID must be a string'),
  
  clientSecret: body('clientSecret')
    .optional()
    .isString()
    .withMessage('Client secret must be a string'),
  
  // Email validation rules
  to: body('to')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  subject: body('subject')
    .isLength({ min: 1, max: 200 })
    .withMessage('Subject must be between 1 and 200 characters'),
  
  html: body('html')
    .optional()
    .isString()
    .withMessage('HTML content must be a string'),
  
  text: body('text')
    .optional()
    .isString()
    .withMessage('Text content must be a string'),
  
  template: body('template')
    .optional()
    .isString()
    .withMessage('Template must be a string'),
  
  templateData: body('templateData')
    .optional()
    .isObject()
    .withMessage('Template data must be an object'),
  
  organizerEmail: body('organizerEmail')
    .isEmail()
    .withMessage('Please provide a valid organizer email address')
    .normalizeEmail(),
  
  eventName: body('eventName')
    .isLength({ min: 1, max: 100 })
    .withMessage('Event name must be between 1 and 100 characters'),
  
  verificationToken: body('verificationToken')
    .isLength({ min: 32, max: 64 })
    .withMessage('Verification token must be between 32 and 64 characters'),
  
  eventDate: body('eventDate')
    .optional()
    .isISO8601()
    .withMessage('Event date must be a valid date'),
  
  eventLocation: body('eventLocation')
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage('Event location must be between 1 and 200 characters'),
  
  ticketType: body('ticketType')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Ticket type must be between 1 and 50 characters'),
  
  ticketPriceFloat: body('ticketPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Ticket price must be a positive number'),
  
  attendeeName: body('attendeeName')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Attendee name must be between 1 and 100 characters'),
  
  attendeeEmail: body('attendeeEmail')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid attendee email address')
    .normalizeEmail(),
};

// Request size limiter middleware
export const requestSizeLimiter = (req: Request, res: Response, next: NextFunction): void => {
  const contentLength = parseInt(req.headers['content-length'] || '0');
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (contentLength > maxSize) {
    res.status(413).json({
      error: 'Request too large',
      message: 'Request body exceeds 10MB limit',
    });
    return;
  }

  next();
};

// IP address validation middleware
export const validateIP = (req: Request, res: Response, next: NextFunction): void => {
  const clientIP = req.ip || req.connection.remoteAddress;
  
  // Block private IP ranges in production
  if (process.env['NODE_ENV'] === 'production') {
    const privateIPRanges = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^127\./,
      /^::1$/,
    ];

    if (clientIP && privateIPRanges.some(range => range.test(clientIP))) {
      res.status(403).json({
        error: 'Access denied',
        message: 'Private IP addresses are not allowed',
      });
      return;
    }
  }

  next();
};

// Request sanitization middleware
export const sanitizeRequest = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = (req.query[key] as string).trim();
      }
    });
  }

  // Sanitize body parameters
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }

  next();
};

// Security logging middleware
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const timestamp = new Date().toISOString();

  // Log suspicious activities
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /union\s+select/i,
    /drop\s+table/i,
    /delete\s+from/i,
  ];

  const requestBody = JSON.stringify(req.body);
  const hasSuspiciousContent = suspiciousPatterns.some(pattern => 
    pattern.test(requestBody) || pattern.test(req.url)
  );

  if (hasSuspiciousContent) {
    console.warn(`🚨 Suspicious activity detected:`, {
      timestamp,
      ip: clientIP,
      userAgent,
      url: req.url,
      method: req.method,
      body: requestBody.substring(0, 200), // Truncate for logging
    });
  }

  next();
};

// CORS configuration
export const corsConfig = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = process.env['ALLOWED_ORIGINS']?.split(',') || [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5174',
      'http://localhost:5175',
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`🚫 CORS blocked request from: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400, // 24 hours
};

// Export all security middleware
export default {
  createRateLimiters,
  securityHeaders,
  validateInput,
  commonValidations,
  requestSizeLimiter,
  validateIP,
  sanitizeRequest,
  securityLogger,
  corsConfig,
}; 