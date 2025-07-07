import { Router } from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import authController from '../controllers/authController';
import authMiddleware from '../middleware/auth';

const router = Router();

// Rate limiting for auth endpoints
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts',
    message: 'Please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation rules
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('firstName')
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .trim()
    .escape(),
  body('lastName')
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .trim()
    .escape(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL'),
  body('phone')
    .optional()
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage('Phone number must be in a valid format'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid date'),
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const refreshTokenValidation = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required'),
];

const logoutValidation = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required'),
];

const updateProfileValidation = [
  body('firstName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .trim()
    .escape(),
  body('lastName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .trim()
    .escape(),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL'),
  body('phone')
    .optional()
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage('Phone number must be in a valid format'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid date'),
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
];

const requestPasswordResetValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
];

const resetPasswordValidation = [
  body('resetToken')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
];

// Public routes (no authentication required)

// Health check
router.get('/health', authController.healthCheck);

// User registration
router.post(
  '/register',
  authRateLimit,
  registerValidation,
  authController.register
);

// User login
router.post(
  '/login',
  authRateLimit,
  loginValidation,
  authController.login
);

// OAuth routes
router.get(
  '/oauth/:provider',
  authRateLimit,
  authMiddleware.validateOAuthState,
  (req, res) => {
    // Redirect to OAuth provider
    const { provider } = req.params;
    const { state } = req.query;
    
    // This would redirect to the actual OAuth provider
    // For now, we'll return a mock response
    res.json({
      message: `Redirecting to ${provider} OAuth`,
      state,
    });
  }
);

router.get(
  '/oauth/:provider/callback',
  authRateLimit,
  authMiddleware.validateOAuthState,
  authController.oauthCallback
);

// Refresh token
router.post(
  '/refresh',
  authRateLimit,
  refreshTokenValidation,
  authController.refreshToken
);

// Request password reset
router.post(
  '/forgot-password',
  authRateLimit,
  requestPasswordResetValidation,
  authController.requestPasswordReset
);

// Reset password
router.post(
  '/reset-password',
  authRateLimit,
  resetPasswordValidation,
  authController.resetPassword
);

// Email verification
router.get(
  '/verify-email/:userId',
  authController.verifyEmail
);

// Protected routes (authentication required)

// Logout
router.post(
  '/logout',
  authMiddleware.verifyToken,
  logoutValidation,
  authController.logout
);

// Get user profile
router.get(
  '/profile',
  authMiddleware.verifyToken,
  authController.getProfile
);

// Update user profile
router.put(
  '/profile',
  authMiddleware.verifyToken,
  updateProfileValidation,
  authController.updateProfile
);

// Change password
router.post(
  '/change-password',
  authMiddleware.verifyToken,
  changePasswordValidation,
  authController.changePassword
);

// Admin routes (admin authentication required)

// Get all users (admin only)
router.get(
  '/users',
  authMiddleware.verifyToken,
  authMiddleware.requireAdmin,
  (req, res) => {
    res.json({
      success: true,
      message: 'Admin endpoint - get all users',
      // Implementation would go here
    });
  }
);

// Get user by ID (admin only)
router.get(
  '/users/:userId',
  authMiddleware.verifyToken,
  authMiddleware.requireAdmin,
  (req, res) => {
    res.json({
      success: true,
      message: 'Admin endpoint - get user by ID',
      userId: req.params.userId,
      // Implementation would go here
    });
  }
);

// Update user role (admin only)
router.patch(
  '/users/:userId/role',
  authMiddleware.verifyToken,
  authMiddleware.requireAdmin,
  [
    body('role')
      .isIn(['USER', 'ORGANIZER', 'MODERATOR', 'ADMIN'])
      .withMessage('Role must be one of: USER, ORGANIZER, MODERATOR, ADMIN'),
  ],
  (req, res) => {
    res.json({
      success: true,
      message: 'Admin endpoint - update user role',
      userId: req.params.userId,
      role: req.body.role,
      // Implementation would go here
    });
  }
);

// Deactivate user (admin only)
router.patch(
  '/users/:userId/deactivate',
  authMiddleware.verifyToken,
  authMiddleware.requireAdmin,
  (req, res) => {
    res.json({
      success: true,
      message: 'Admin endpoint - deactivate user',
      userId: req.params.userId,
      // Implementation would go here
    });
  }
);

// OAuth provider configuration routes (admin only)

// Get OAuth providers
router.get(
  '/oauth-providers',
  authMiddleware.verifyToken,
  authMiddleware.requireAdmin,
  (req, res) => {
    res.json({
      success: true,
      message: 'Admin endpoint - get OAuth providers',
      providers: [
        {
          name: 'Google',
          enabled: true,
          clientId: process.env.GOOGLE_CLIENT_ID || 'not-configured',
        },
        {
          name: 'Facebook',
          enabled: false,
          clientId: process.env.FACEBOOK_CLIENT_ID || 'not-configured',
        },
        {
          name: 'GitHub',
          enabled: false,
          clientId: process.env.GITHUB_CLIENT_ID || 'not-configured',
        },
      ],
    });
  }
);

// Update OAuth provider
router.put(
  '/oauth-providers/:provider',
  authMiddleware.verifyToken,
  authMiddleware.requireAdmin,
  [
    body('enabled')
      .isBoolean()
      .withMessage('Enabled must be a boolean'),
    body('clientId')
      .optional()
      .isString()
      .withMessage('Client ID must be a string'),
    body('clientSecret')
      .optional()
      .isString()
      .withMessage('Client secret must be a string'),
  ],
  (req, res) => {
    res.json({
      success: true,
      message: 'Admin endpoint - update OAuth provider',
      provider: req.params.provider,
      config: req.body,
      // Implementation would go here
    });
  }
);

// Error handling middleware for auth routes
router.use((error: any, req: any, res: any, next: any) => {
  console.error('Auth route error:', error);
  
  if (error.type === 'entity.parse.failed') {
    res.status(400).json({
      error: 'Invalid JSON',
      message: 'Request body contains invalid JSON',
    });
    return;
  }

  res.status(500).json({
    error: 'Internal server error',
    message: 'An error occurred in the authentication system',
  });
});

export default router; 