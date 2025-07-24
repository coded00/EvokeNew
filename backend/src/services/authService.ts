import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { createHash, randomBytes } from 'crypto';

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  role: any; // Changed from UserRole to any as UserRole is removed
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface OAuthProfile {
  provider: 'google' | 'facebook' | 'github';
  providerId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: Date;
}

class AuthService {
  private prisma: PrismaClient;
  private jwtSecret: string;
  private jwtExpiresIn: string;
  // private refreshTokenExpiresIn: string = '30d'; // Will be used when implementing refresh token storage

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.jwtSecret = process.env['JWT_SECRET'] || 'fallback-secret-key';
    this.jwtExpiresIn = process.env['JWT_EXPIRES_IN'] || '7d';
  }

  // Password hashing
  async hashPassword(password: string): Promise<string> {
    const saltRounds = parseInt(process.env['BCRYPT_ROUNDS'] || '12');
    return bcrypt.hash(password, saltRounds);
  }

  // Password verification
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Generate JWT token
  generateAccessToken(user: any): string {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn } as jwt.SignOptions);
  }

  // Generate refresh token
  generateRefreshToken(userId: string): string {
    const refreshToken = randomBytes(40).toString('hex');
    
    // TODO: Implement refresh token storage with database
    // For now, we'll use a simple approach
    return refreshToken;
  }

  // Verify JWT token
  verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as JWTPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  // Generate auth tokens
  async generateAuthTokens(user: any): Promise<AuthTokens> { // Changed from User to any
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user.id);
    
    // Store refresh token in database
    await this.storeRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.getTokenExpirationTime(),
    };
  }

  // Store refresh token
  private async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    // TODO: Implement refresh token storage with database
    console.log(`Storing refresh token for user ${userId}`);
  }

  // Get token expiration time in seconds
  private getTokenExpirationTime(): number {
    const expiresIn = this.jwtExpiresIn;
    if (expiresIn.includes('d')) {
      return parseInt(expiresIn.replace('d', '')) * 24 * 60 * 60;
    } else if (expiresIn.includes('h')) {
      return parseInt(expiresIn.replace('h', '')) * 60 * 60;
    } else if (expiresIn.includes('m')) {
      return parseInt(expiresIn.replace('m', '')) * 60;
    } else {
      return parseInt(expiresIn);
    }
  }

  // User registration
  async register(data: RegisterData): Promise<{ user: any; tokens: AuthTokens }> { // Changed from User to any
    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username },
        ],
      },
    });

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    // Hash password
    const passwordHash = await this.hashPassword(data.password);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        passwordHash,
        avatar: data.avatar || null,
        phone: data.phone || null,
        dateOfBirth: data.dateOfBirth || null,
        role: 'USER', // Assuming 'USER' is the correct role
      },
    });

    // Generate tokens
    const tokens = await this.generateAuthTokens(user);

    return { user, tokens };
  }

  // User login
  async login(credentials: LoginCredentials): Promise<{ user: any; tokens: AuthTokens }> { // Changed from User to any
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await this.verifyPassword(credentials.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateAuthTokens(user);

    return { user, tokens };
  }

  // OAuth authentication
  async authenticateWithOAuth(profile: OAuthProfile): Promise<{ user: any; tokens: AuthTokens; isNewUser: boolean }> { // Changed from User to any
    // Check if user exists by OAuth provider ID
    let user = await this.findUserByOAuthProvider(profile.provider, profile.providerId);

    if (!user) {
      // Check if user exists by email
      user = await this.prisma.user.findUnique({
        where: { email: profile.email },
      });

      if (user) {
        // Link OAuth account to existing user
        await this.linkOAuthAccount(user.id, profile);
      } else {
        // Create new user
        user = await this.createUserFromOAuth(profile);
      }
    }

    // Generate tokens
    const tokens = await this.generateAuthTokens(user);

    return { 
      user, 
      tokens, 
      isNewUser: !user.isVerified // Assume new user if not verified
    };
  }

  // Find user by OAuth provider
  private async findUserByOAuthProvider(provider: string, providerId: string): Promise<any | null> { // Changed from User to any
    // This would query an OAuth accounts table
    // For now, return null as we haven't created that model yet
    return null;
  }

  // Link OAuth account to existing user
  private async linkOAuthAccount(userId: string, profile: OAuthProfile): Promise<void> {
    // Store OAuth account link in database
    console.log(`Linking ${profile.provider} account to user ${userId}`);
  }

  // Create user from OAuth profile
  private async createUserFromOAuth(profile: OAuthProfile): Promise<any> { // Changed from User to any
    // Generate unique username
    const baseUsername = `${profile.firstName.toLowerCase()}${profile.lastName.toLowerCase()}`;
    let username = baseUsername;
    let counter = 1;

    while (await this.prisma.user.findUnique({ where: { username } })) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    return this.prisma.user.create({
      data: {
        email: profile.email,
        username,
        firstName: profile.firstName,
        lastName: profile.lastName,
        avatar: profile.avatar || null,
        passwordHash: '', // OAuth users don't have passwords
        isVerified: true, // OAuth users are pre-verified
        role: 'USER', // Assuming 'USER' is the correct role
      },
    });
  }

  // Refresh access token
  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
    // Verify refresh token
    const refreshTokenHash = createHash('sha256').update(refreshToken).digest('hex');
    
    // Find refresh token in database
    // For now, we'll use a simple approach
    const isValid = await this.validateRefreshToken(refreshTokenHash);
    
    if (!isValid) {
      throw new Error('Invalid refresh token');
    }

    // Get user from refresh token
    const userId = await this.getUserIdFromRefreshToken(refreshTokenHash);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    // Generate new access token
    const accessToken = this.generateAccessToken(user);

    return {
      accessToken,
      expiresIn: this.getTokenExpirationTime(),
    };
  }

  // Validate refresh token
  private async validateRefreshToken(refreshTokenHash: string): Promise<boolean> {
    // Check if refresh token exists and is not expired
    // For now, return true as we haven't implemented the RefreshToken model
    return true;
  }

  // Get user ID from refresh token
  private async getUserIdFromRefreshToken(refreshTokenHash: string): Promise<string> {
    // Query database to get user ID from refresh token
    // For now, return a placeholder
    return 'placeholder-user-id';
  }

  // Logout (invalidate refresh token)
  async logout(userId: string, refreshToken: string): Promise<void> {
    const refreshTokenHash = createHash('sha256').update(refreshToken).digest('hex');
    
    // Remove refresh token from database
    await this.invalidateRefreshToken(refreshTokenHash);
  }

  // Invalidate refresh token
  private async invalidateRefreshToken(refreshTokenHash: string): Promise<void> {
    // Remove refresh token from database
    console.log(`Invalidating refresh token: ${refreshTokenHash}`);
  }

  // Change password
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await this.verifyPassword(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await this.hashPassword(newPassword);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      throw new Error('User not found');
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenHash = createHash('sha256').update(resetToken).digest('hex');
    
    // Set expiration (1 hour)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Store reset token in database
    await this.storePasswordResetToken(user.id, resetTokenHash, expiresAt);

    return resetToken;
  }

  // Store password reset token
  private async storePasswordResetToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    // Store in database (implement when PasswordReset model is created)
    console.log(`Storing password reset token for user ${userId}`);
  }

  // Reset password
  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    const resetTokenHash = createHash('sha256').update(resetToken).digest('hex');
    
    // Verify reset token
    const userId = await this.verifyPasswordResetToken(resetTokenHash);
    
    if (!userId) {
      throw new Error('Invalid or expired reset token');
    }

    // Hash new password
    const newPasswordHash = await this.hashPassword(newPassword);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    // Invalidate reset token
    await this.invalidatePasswordResetToken(resetTokenHash);
  }

  // Verify password reset token
  private async verifyPasswordResetToken(tokenHash: string): Promise<string | null> {
    // Check if token exists and is not expired
    // For now, return null as we haven't implemented the PasswordReset model
    return null;
  }

  // Invalidate password reset token
  private async invalidatePasswordResetToken(tokenHash: string): Promise<void> {
    // Remove reset token from database
    console.log(`Invalidating password reset token: ${tokenHash}`);
  }

  // Verify email
  async verifyEmail(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });
  }

  // Get user profile
  async getUserProfile(userId: string): Promise<any | null> { // Changed from User to any
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        phone: true,
        dateOfBirth: true,
        isVerified: true,
        isActive: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // Update user profile
  async updateUserProfile(userId: string, data: Partial<RegisterData>): Promise<any> { // Changed from User to any
    const updateData: any = {};

    if (data.firstName) updateData.firstName = data.firstName;
    if (data.lastName) updateData.lastName = data.lastName;
    if (data.avatar) updateData.avatar = data.avatar;
    if (data.phone) updateData.phone = data.phone;
    if (data.dateOfBirth) updateData.dateOfBirth = data.dateOfBirth;

    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }
}

export default AuthService; 