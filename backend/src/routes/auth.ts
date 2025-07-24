import { Router, Request, Response } from 'express';
import authController from '../controllers/authController';
import authMiddleware from '../middleware/auth';
import { createRateLimiters, validateInput, commonValidations } from '../middleware/security';

const router = Router();

// Initialize rate limiters
const rateLimiters = createRateLimiters();

// Validation rules using common validations
const registerValidation = [
  commonValidations.email,
  commonValidations.username,
  commonValidations.firstName,
  commonValidations.lastName,
  commonValidations.password,
  commonValidations.phone,
  // Additional validations
  commonValidations.avatar,
  commonValidations.dateOfBirth,
];

const loginValidation = [
  commonValidations.email,
  commonValidations.password,
];

const refreshTokenValidation = [
  commonValidations.refreshToken,
];

const logoutValidation = [
  commonValidations.refreshToken,
];

const updateProfileValidation = [
  commonValidations.firstName.optional(),
  commonValidations.lastName.optional(),
  commonValidations.avatar,
  commonValidations.phone,
  commonValidations.dateOfBirth,
];

const changePasswordValidation = [
  commonValidations.password.withMessage('Current password is required'),
  commonValidations.password.withMessage('New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
];

const requestPasswordResetValidation = [
  commonValidations.email,
];

const resetPasswordValidation = [
  commonValidations.resetToken,
  commonValidations.password.withMessage('New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
];

// Public routes (no authentication required)

// Health check
router.get('/health', authController.healthCheck);

// User registration
router.post(
  '/register',
  rateLimiters.authLimiter,
  registerValidation,
  validateInput,
  authController.register
);

// User login
router.post(
  '/login',
  rateLimiters.authLimiter,
  loginValidation,
  validateInput,
  authController.login
);

// OAuth routes
router.get(
  '/oauth/:provider',
  rateLimiters.authLimiter,
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
  rateLimiters.authLimiter,
  authMiddleware.validateOAuthState,
  authController.oauthCallback
);

// Refresh token
router.post(
  '/refresh',
  rateLimiters.authLimiter,
  refreshTokenValidation,
  validateInput,
  authController.refreshToken
);

// Request password reset
router.post(
  '/forgot-password',
  rateLimiters.authLimiter,
  requestPasswordResetValidation,
  validateInput,
  authController.requestPasswordReset
);

// Reset password
router.post(
  '/reset-password',
  rateLimiters.authLimiter,
  resetPasswordValidation,
  validateInput,
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
  validateInput,
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
  validateInput,
  authController.updateProfile
);

// Change password
router.post(
  '/change-password',
  authMiddleware.verifyToken,
  changePasswordValidation,
  validateInput,
  authController.changePassword
);

// Admin routes (admin authentication required)

// Get all users (admin only)
router.get(
  '/users',
  authMiddleware.verifyToken,
  authMiddleware.requireAdmin,
  (_req, res) => {
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
  (req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'Admin endpoint - get user by ID',
      userId: req.params['userId'],
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
    commonValidations.role,
  ],
  validateInput,
  (req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'Admin endpoint - update user role',
      userId: req.params['userId'],
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
  (req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'Admin endpoint - deactivate user',
      userId: req.params['userId'],
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
  (req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'Admin endpoint - get OAuth providers',
      providers: [
        {
          name: 'Google',
          enabled: true,
          clientId: process.env['GOOGLE_CLIENT_ID'] || 'not-configured',
        },
        {
          name: 'Facebook',
          enabled: false,
          clientId: process.env['FACEBOOK_CLIENT_ID'] || 'not-configured',
        },
        {
          name: 'GitHub',
          enabled: false,
          clientId: process.env['GITHUB_CLIENT_ID'] || 'not-configured',
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
    commonValidations.enabled,
    commonValidations.clientId,
    commonValidations.clientSecret,
  ],
  validateInput,
  (req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'Admin endpoint - update OAuth provider',
      provider: req.params['provider'],
      config: req.body,
      // Implementation would go here
    });
  }
);

// Error handling middleware for auth routes
router.use((error: any, _req: any, res: any, _next: any) => {
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