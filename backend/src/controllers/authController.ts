import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import AuthService from '../services/authService';
import { PrismaClient } from '@prisma/client';

class AuthController {
  private authService: AuthService;
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
    this.authService = new AuthService(this.prisma);
  }

  // User registration
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'Validation failed',
          message: 'Please check your input',
          details: errors.array(),
        });
        return;
      }

      const { email, username, firstName, lastName, password, avatar, phone, dateOfBirth } = req.body;

      const result = await this.authService.register({
        email,
        username,
        firstName,
        lastName,
        password,
        avatar,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            username: result.user.username,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            avatar: result.user.avatar,
            isVerified: result.user.isVerified,
            role: result.user.role,
            createdAt: result.user.createdAt,
          },
          tokens: result.tokens,
        },
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.message.includes('already exists')) {
        res.status(409).json({
          error: 'User already exists',
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        error: 'Registration failed',
        message: 'An error occurred during registration',
      });
    }
  };

  // User login
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'Validation failed',
          message: 'Please check your input',
          details: errors.array(),
        });
        return;
      }

      const { email, password } = req.body;

      const result = await this.authService.login({ email, password });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            username: result.user.username,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            avatar: result.user.avatar,
            isVerified: result.user.isVerified,
            role: result.user.role,
            createdAt: result.user.createdAt,
          },
          tokens: result.tokens,
        },
      });
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.message.includes('Invalid credentials') || error.message.includes('deactivated')) {
        res.status(401).json({
          error: 'Authentication failed',
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        error: 'Login failed',
        message: 'An error occurred during login',
      });
    }
  };

  // OAuth authentication
  oauthCallback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { provider } = req.params;
      const { code, state } = req.query;

      if (!code || !state) {
        res.status(400).json({
          error: 'OAuth callback failed',
          message: 'Missing required OAuth parameters',
        });
        return;
      }

      // Exchange code for access token and get user profile
      const profile = await this.getOAuthProfile(provider as string, code as string);
      
      const result = await this.authService.authenticateWithOAuth(profile);

      res.status(200).json({
        success: true,
        message: result.isNewUser ? 'OAuth registration successful' : 'OAuth login successful',
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            username: result.user.username,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            avatar: result.user.avatar,
            isVerified: result.user.isVerified,
            role: result.user.role,
            createdAt: result.user.createdAt,
          },
          tokens: result.tokens,
          isNewUser: result.isNewUser,
        },
      });
    } catch (error: any) {
      console.error('OAuth callback error:', error);
      
      res.status(500).json({
        error: 'OAuth authentication failed',
        message: 'An error occurred during OAuth authentication',
      });
    }
  };

  // Get OAuth profile (placeholder implementation)
  private async getOAuthProfile(provider: string, code: string): Promise<any> {
    // This would integrate with actual OAuth providers
    // For now, return a mock profile
    return {
      provider: provider as 'google' | 'facebook' | 'github',
      providerId: `oauth_${provider}_${Date.now()}`,
      email: `oauth_${provider}_user@example.com`,
      firstName: 'OAuth',
      lastName: 'User',
      avatar: 'https://example.com/avatar.jpg',
    };
  };

  // Refresh access token
  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          error: 'Refresh token required',
          message: 'Refresh token is required',
        });
        return;
      }

      const result = await this.authService.refreshAccessToken(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken: result.accessToken,
          expiresIn: result.expiresIn,
        },
      });
    } catch (error: any) {
      console.error('Token refresh error:', error);
      
      if (error.message.includes('Invalid refresh token')) {
        res.status(401).json({
          error: 'Invalid refresh token',
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        error: 'Token refresh failed',
        message: 'An error occurred during token refresh',
      });
    }
  };

  // Logout
  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required',
          message: 'User must be authenticated to logout',
        });
        return;
      }

      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          error: 'Refresh token required',
          message: 'Refresh token is required for logout',
        });
        return;
      }

      await this.authService.logout(req.user.userId, refreshToken);

      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      
      res.status(500).json({
        error: 'Logout failed',
        message: 'An error occurred during logout',
      });
    }
  };

  // Get user profile
  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required',
          message: 'User must be authenticated to access profile',
        });
        return;
      }

      const user = await this.authService.getUserProfile(req.user.userId);

      if (!user) {
        res.status(404).json({
          error: 'User not found',
          message: 'User profile not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            phone: user.phone,
            dateOfBirth: user.dateOfBirth,
            isVerified: user.isVerified,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
      });
    } catch (error: any) {
      console.error('Get profile error:', error);
      
      res.status(500).json({
        error: 'Profile retrieval failed',
        message: 'An error occurred while retrieving profile',
      });
    }
  };

  // Update user profile
  updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required',
          message: 'User must be authenticated to update profile',
        });
        return;
      }

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'Validation failed',
          message: 'Please check your input',
          details: errors.array(),
        });
        return;
      }

      const { firstName, lastName, avatar, phone, dateOfBirth } = req.body;

      const user = await this.authService.updateUserProfile(req.user.userId, {
        firstName,
        lastName,
        avatar,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            phone: user.phone,
            dateOfBirth: user.dateOfBirth,
            isVerified: user.isVerified,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
      });
    } catch (error: any) {
      console.error('Update profile error:', error);
      
      res.status(500).json({
        error: 'Profile update failed',
        message: 'An error occurred while updating profile',
      });
    }
  };

  // Change password
  changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required',
          message: 'User must be authenticated to change password',
        });
        return;
      }

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'Validation failed',
          message: 'Please check your input',
          details: errors.array(),
        });
        return;
      }

      const { currentPassword, newPassword } = req.body;

      await this.authService.changePassword(req.user.userId, currentPassword, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error: any) {
      console.error('Change password error:', error);
      
      if (error.message.includes('Current password is incorrect')) {
        res.status(400).json({
          error: 'Password change failed',
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        error: 'Password change failed',
        message: 'An error occurred while changing password',
      });
    }
  };

  // Request password reset
  requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'Validation failed',
          message: 'Please check your input',
          details: errors.array(),
        });
        return;
      }

      const { email } = req.body;

      const resetToken = await this.authService.requestPasswordReset(email);

      // In a real application, you would send this token via email
      // For development, we'll return it in the response
      res.status(200).json({
        success: true,
        message: 'Password reset email sent',
        data: {
          resetToken, // Remove this in production
        },
      });
    } catch (error: any) {
      console.error('Request password reset error:', error);
      
      if (error.message.includes('User not found')) {
        res.status(404).json({
          error: 'User not found',
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        error: 'Password reset request failed',
        message: 'An error occurred while requesting password reset',
      });
    }
  };

  // Reset password
  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'Validation failed',
          message: 'Please check your input',
          details: errors.array(),
        });
        return;
      }

      const { resetToken, newPassword } = req.body;

      await this.authService.resetPassword(resetToken, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password reset successfully',
      });
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      if (error.message.includes('Invalid or expired reset token')) {
        res.status(400).json({
          error: 'Password reset failed',
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        error: 'Password reset failed',
        message: 'An error occurred while resetting password',
      });
    }
  };

  // Verify email
  verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;

      await this.authService.verifyEmail(userId);

      res.status(200).json({
        success: true,
        message: 'Email verified successfully',
      });
    } catch (error: any) {
      console.error('Email verification error:', error);
      
      res.status(500).json({
        error: 'Email verification failed',
        message: 'An error occurred while verifying email',
      });
    }
  };

  // Health check for auth service
  healthCheck = async (req: Request, res: Response): Promise<void> => {
    try {
      res.status(200).json({
        success: true,
        message: 'Auth service is healthy',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Auth health check error:', error);
      
      res.status(500).json({
        error: 'Auth service health check failed',
        message: 'An error occurred during health check',
      });
    }
  };
}

export default new AuthController(); 