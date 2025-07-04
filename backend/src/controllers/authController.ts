import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { 
  sendSuccessResponse, 
  asyncHandler,
  validateRequiredFields,
  validateEmail,
  validatePassword,
  generateId,
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  ValidationError,
  NotFoundError
} from '../utils/errorHandler';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../middleware/auth';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';
import config from '../config';

// Mock user database (in real app, this would be a database)
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@evoke.com',
    name: 'Admin User',
    role: 'admin',
    isVerified: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    email: 'organizer@evoke.com',
    name: 'Event Organizer',
    role: 'organizer',
    isVerified: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock refresh tokens (in real app, this would be stored in Redis/database)
const refreshTokens: Map<string, string> = new Map();

/**
 * Register a new user
 */
export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password, name }: RegisterRequest = req.body;

  // Validate required fields
  validateRequiredFields(req.body, ['email', 'password', 'name']);

  // Validate email format
  if (!validateEmail(email)) {
    throw new ValidationError('Invalid email format');
  }

  // Validate password strength
  if (!validatePassword(password)) {
    throw new ValidationError(
      'Password must be at least 8 characters long and contain uppercase, lowercase, and number'
    );
  }

  // Check if user already exists
  const existingUser = mockUsers.find(user => user.email === email);
  if (existingUser) {
    throw new ConflictError('User with this email already exists');
  }

  // Hash password (for future use)
  const saltRounds = config.security.bcryptRounds;
  await bcrypt.hash(password, saltRounds);

  // Create new user
  const newUser: User = {
    id: generateId(),
    email,
    name,
    role: 'user',
    isVerified: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Add to mock database
  mockUsers.push(newUser);

  // Generate tokens
  const accessToken = generateToken({
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
  });

  const refreshToken = generateRefreshToken(newUser.id);
  refreshTokens.set(newUser.id, refreshToken);

  const response: AuthResponse = {
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      isVerified: newUser.isVerified,
      isActive: newUser.isActive,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    },
    accessToken,
    refreshToken,
    expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
  };

  sendSuccessResponse(res, response, 'User registered successfully', 201);
});

/**
 * Login user
 */
export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password }: LoginRequest = req.body;

  // Validate required fields
  validateRequiredFields(req.body, ['email', 'password']);

  // Validate email format
  if (!validateEmail(email)) {
    throw new ValidationError('Invalid email format');
  }

  // Find user (in real app, this would query the database)
  const user = mockUsers.find(u => u.email === email);
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Check if user is active
  if (!user.isActive) {
    throw new UnauthorizedError('Account is deactivated');
  }

  // For mock purposes, we'll use a simple password check
  // In real app, you would verify against hashed password
  const isValidPassword = email === 'admin@evoke.com' && password === 'Admin123!' ||
                         email === 'organizer@evoke.com' && password === 'Organizer123!';

  if (!isValidPassword) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Generate tokens
  const accessToken = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken(user.id);
  refreshTokens.set(user.id, refreshToken);

  const response: AuthResponse = {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    accessToken,
    refreshToken,
    expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
  };

  sendSuccessResponse(res, response, 'Login successful');
});

/**
 * Refresh access token
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new BadRequestError('Refresh token is required');
  }

  try {
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Check if refresh token exists in storage
    const storedToken = refreshTokens.get(decoded.userId);
    if (!storedToken || storedToken !== refreshToken) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Find user
    const user = mockUsers.find(u => u.id === decoded.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found or inactive');
    }

    // Generate new tokens
    const newAccessToken = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = generateRefreshToken(user.id);
    refreshTokens.set(user.id, newRefreshToken);

    const response: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
    };

    sendSuccessResponse(res, response, 'Token refreshed successfully');
  } catch (error) {
    throw new UnauthorizedError('Invalid refresh token');
  }
});

/**
 * Logout user
 */
export const logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      refreshTokens.delete(decoded.userId);
    } catch (error) {
      // Ignore errors during logout
    }
  }

  sendSuccessResponse(res, null, 'Logout successful');
});

/**
 * Get current user profile
 */
export const getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError('Authentication required');
  }

  sendSuccessResponse(res, req.user, 'Profile retrieved successfully');
});

/**
 * Update user profile
 */
export const updateProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError('Authentication required');
  }

  const { name, phone, bio, location } = req.body;

  // Find and update user
  const userIndex = mockUsers.findIndex(u => u.id === req.user!.id);
  if (userIndex === -1) {
    throw new NotFoundError('User not found');
  }

  // Update user fields
  const user = mockUsers[userIndex];
  if (!user) {
    throw new NotFoundError('User not found');
  }
  
  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (bio !== undefined) user.bio = bio;
  if (location !== undefined) user.location = location;
  user.updatedAt = new Date();

  sendSuccessResponse(res, mockUsers[userIndex], 'Profile updated successfully');
}); 