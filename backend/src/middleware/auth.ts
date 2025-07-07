import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import AuthService from '../services/authService';
import { PrismaClient } from '@prisma/client';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        username: string;
        role: UserRole;
      };
    }
  }
}

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

class AuthMiddleware {
  private authService: AuthService;
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
    this.authService = new AuthService(this.prisma);
  }

  // Verify JWT token middleware
  verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        res.status(401).json({
          error: 'Access token required',
          message: 'No authorization header provided',
        });
        return;
      }

      const token = authHeader.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : authHeader;

      if (!token) {
        res.status(401).json({
          error: 'Access token required',
          message: 'No token provided',
        });
        return;
      }

      // Verify token
      const decoded = this.authService.verifyToken(token) as JWTPayload;
      
      if (!decoded) {
        res.status(401).json({
          error: 'Invalid token',
          message: 'Token is invalid or expired',
        });
        return;
      }

      // Check if user still exists and is active
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          isActive: true,
        },
      });

      if (!user || !user.isActive) {
        res.status(401).json({
          error: 'User not found',
          message: 'User account is deactivated or does not exist',
        });
        return;
      }

      // Attach user to request
      req.user = {
        userId: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      };

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(500).json({
        error: 'Authentication error',
        message: 'Internal server error during authentication',
      });
    }
  };

  // Optional token verification (doesn't fail if no token)
  optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        next();
        return;
      }

      const token = authHeader.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : authHeader;

      if (!token) {
        next();
        return;
      }

      // Verify token
      const decoded = this.authService.verifyToken(token) as JWTPayload;
      
      if (!decoded) {
        next();
        return;
      }

      // Check if user still exists and is active
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          isActive: true,
        },
      });

      if (user && user.isActive) {
        req.user = {
          userId: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        };
      }

      next();
    } catch (error) {
      console.error('Optional auth middleware error:', error);
      next();
    }
  };

  // Role-based access control middleware
  requireRole = (roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required',
          message: 'User must be authenticated to access this resource',
        });
        return;
      }

      if (!roles.includes(req.user.role)) {
        res.status(403).json({
          error: 'Insufficient permissions',
          message: `Access denied. Required roles: ${roles.join(', ')}`,
        });
        return;
      }

      next();
    };
  };

  // Require specific role
  requireAdmin = this.requireRole([UserRole.ADMIN]);
  requireOrganizer = this.requireRole([UserRole.ORGANIZER, UserRole.ADMIN]);
  requireModerator = this.requireRole([UserRole.MODERATOR, UserRole.ADMIN]);
  requireUser = this.requireRole([UserRole.USER, UserRole.ORGANIZER, UserRole.MODERATOR, UserRole.ADMIN]);

  // Resource ownership middleware
  requireOwnership = (resourceType: 'user' | 'event' | 'ticket' | 'order') => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required',
          message: 'User must be authenticated to access this resource',
        });
        return;
      }

      const resourceId = req.params.id || req.params.userId || req.params.eventId || req.params.ticketId || req.params.orderId;
      
      if (!resourceId) {
        res.status(400).json({
          error: 'Resource ID required',
          message: 'Resource ID is missing from request',
        });
        return;
      }

      try {
        let isOwner = false;

        switch (resourceType) {
          case 'user':
            isOwner = req.user.userId === resourceId || req.user.role === UserRole.ADMIN;
            break;
          
          case 'event':
            const event = await this.prisma.event.findUnique({
              where: { id: resourceId },
              select: { organizerId: true },
            });
            isOwner = event?.organizerId === req.user.userId || req.user.role === UserRole.ADMIN;
            break;
          
          case 'ticket':
            const ticket = await this.prisma.ticket.findUnique({
              where: { id: resourceId },
              select: { userId: true },
            });
            isOwner = ticket?.userId === req.user.userId || req.user.role === UserRole.ADMIN;
            break;
          
          case 'order':
            const order = await this.prisma.order.findUnique({
              where: { id: resourceId },
              select: { userId: true },
            });
            isOwner = order?.userId === req.user.userId || req.user.role === UserRole.ADMIN;
            break;
        }

        if (!isOwner) {
          res.status(403).json({
            error: 'Access denied',
            message: 'You do not have permission to access this resource',
          });
          return;
        }

        next();
      } catch (error) {
        console.error('Ownership check error:', error);
        res.status(500).json({
          error: 'Internal server error',
          message: 'Error checking resource ownership',
        });
      }
    };
  };

  // Rate limiting for authentication endpoints
  authRateLimit = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
      error: 'Too many authentication attempts',
      message: 'Please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
  };

  // Password strength validation middleware
  validatePassword = (req: Request, res: Response, next: NextFunction): void => {
    const { password } = req.body;

    if (!password) {
      res.status(400).json({
        error: 'Password required',
        message: 'Password is required',
      });
      return;
    }

    // Password strength requirements
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors: string[] = [];

    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`);
    }
    if (!hasUpperCase) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!hasLowerCase) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!hasNumbers) {
      errors.push('Password must contain at least one number');
    }
    if (!hasSpecialChar) {
      errors.push('Password must contain at least one special character');
    }

    if (errors.length > 0) {
      res.status(400).json({
        error: 'Password validation failed',
        message: 'Password does not meet requirements',
        details: errors,
      });
      return;
    }

    next();
  };

  // Email validation middleware
  validateEmail = (req: Request, res: Response, next: NextFunction): void => {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        error: 'Email required',
        message: 'Email is required',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        error: 'Invalid email format',
        message: 'Please provide a valid email address',
      });
      return;
    }

    next();
  };

  // Username validation middleware
  validateUsername = (req: Request, res: Response, next: NextFunction): void => {
    const { username } = req.body;

    if (!username) {
      res.status(400).json({
        error: 'Username required',
        message: 'Username is required',
      });
      return;
    }

    // Username requirements
    const minLength = 3;
    const maxLength = 30;
    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    const errors: string[] = [];

    if (username.length < minLength) {
      errors.push(`Username must be at least ${minLength} characters long`);
    }
    if (username.length > maxLength) {
      errors.push(`Username must be no more than ${maxLength} characters long`);
    }
    if (!usernameRegex.test(username)) {
      errors.push('Username can only contain letters, numbers, and underscores');
    }

    if (errors.length > 0) {
      res.status(400).json({
        error: 'Username validation failed',
        message: 'Username does not meet requirements',
        details: errors,
      });
      return;
    }

    next();
  };

  // OAuth state validation middleware
  validateOAuthState = (req: Request, res: Response, next: NextFunction): void => {
    const { state } = req.query;

    if (!state) {
      res.status(400).json({
        error: 'OAuth state required',
        message: 'OAuth state parameter is missing',
      });
      return;
    }

    // Validate state parameter (implement your state validation logic)
    // This is a basic check - you might want to store and validate against a session
    if (typeof state !== 'string' || state.length < 10) {
      res.status(400).json({
        error: 'Invalid OAuth state',
        message: 'OAuth state parameter is invalid',
      });
      return;
    }

    next();
  };

  // CSRF protection middleware (for OAuth flows)
  csrfProtection = (req: Request, res: Response, next: NextFunction): void => {
    // Implement CSRF protection for OAuth flows
    // This is a placeholder - implement based on your CSRF strategy
    next();
  };

  // Logout middleware (invalidate tokens)
  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'User must be authenticated to logout',
      });
      return;
    }

    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      res.status(400).json({
        error: 'Refresh token required',
        message: 'Refresh token is required for logout',
      });
      return;
    }

    try {
      await this.authService.logout(req.user.userId, refreshToken);
      next();
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        error: 'Logout failed',
        message: 'Error during logout process',
      });
    }
  };
}

export default new AuthMiddleware(); 