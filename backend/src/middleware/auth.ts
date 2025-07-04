import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { User } from '../types';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Middleware to authenticate JWT token
 */
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Access token is required',
      });
      return;
    }

    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    
    // In a real app, you would fetch the user from database here
    // For now, we'll create a mock user object
    const user: User = {
      id: decoded.userId,
      email: decoded.email,
      name: 'Mock User', // This would come from database
      role: decoded.role as User['role'],
      isVerified: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: 'Token expired',
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Authentication error',
      });
    }
  }
};

/**
 * Middleware to check if user has required role
 */
export const requireRole = (roles: User['role'][]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
};

/**
 * Middleware to check if user is the owner of a resource
 */
export const requireOwnership = (resourceUserIdField: string = 'userId') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    // Allow admins to access any resource
    if (req.user.role === 'admin') {
      next();
      return;
    }

    // Check if user owns the resource
    const resourceUserId = (req.params as any)[resourceUserIdField] || (req.body as any)[resourceUserIdField];
    
    if (resourceUserId && resourceUserId !== req.user.id) {
      res.status(403).json({
        success: false,
        error: 'Access denied',
      });
      return;
    }

    next();
  };
};

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
      
      const user: User = {
        id: decoded.userId,
        email: decoded.email,
        name: 'Mock User',
        role: decoded.role as User['role'],
        isVerified: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      req.user = user;
    }
    
    next();
  } catch (error) {
    // Don't fail on token errors, just continue without user
    next();
  }
};

/**
 * Generate JWT token
 */
export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as jwt.SignOptions);
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  } as jwt.SignOptions);
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, config.jwt.refreshSecret) as { userId: string };
}; 