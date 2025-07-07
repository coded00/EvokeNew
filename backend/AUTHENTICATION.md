# EVOKE Authentication System Documentation

## Overview

The EVOKE platform implements a comprehensive authentication system with JWT tokens, OAuth integration, and role-based access control. This system provides secure user authentication, authorization, and session management.

## Architecture

### Components

1. **AuthService** - Core authentication logic
2. **AuthMiddleware** - Request authentication and authorization
3. **AuthController** - HTTP request handling
4. **OAuthService** - Third-party OAuth integration
5. **JWT Token Management** - Access and refresh tokens
6. **Password Security** - Bcrypt hashing and validation

## JWT Token System

### Token Types

#### Access Token
- **Purpose**: Short-lived token for API access
- **Expiration**: 7 days (configurable)
- **Payload**: User ID, email, username, role
- **Usage**: Bearer token in Authorization header

#### Refresh Token
- **Purpose**: Long-lived token for token renewal
- **Expiration**: 30 days
- **Storage**: Hashed in database
- **Usage**: Secure token refresh endpoint

### Token Structure

```typescript
interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
```

### Security Features

- **CUID Primary Keys**: Collision-resistant unique identifiers
- **Bcrypt Password Hashing**: 12 rounds of salting
- **Token Blacklisting**: Refresh token invalidation
- **Rate Limiting**: 5 requests per 15 minutes for auth endpoints
- **Input Validation**: Comprehensive request validation
- **CSRF Protection**: State parameter validation for OAuth

## OAuth Integration

### Supported Providers

1. **Google OAuth 2.0**
   - Scope: `openid email profile`
   - Endpoint: `https://accounts.google.com/o/oauth2/v2/auth`
   - Profile API: `https://www.googleapis.com/oauth2/v2/userinfo`

2. **Facebook OAuth 2.0**
   - Scope: `email public_profile`
   - Endpoint: `https://www.facebook.com/v12.0/dialog/oauth`
   - Profile API: `https://graph.facebook.com/me`

3. **GitHub OAuth 2.0**
   - Scope: `read:user user:email`
   - Endpoint: `https://github.com/login/oauth/authorize`
   - Profile API: `https://api.github.com/user`

### OAuth Flow

1. **Initiation**: User clicks OAuth provider button
2. **Redirect**: User redirected to provider with state parameter
3. **Authorization**: User authorizes application
4. **Callback**: Provider redirects back with authorization code
5. **Token Exchange**: Server exchanges code for access token
6. **Profile Fetch**: Server fetches user profile from provider
7. **User Creation/Linking**: Create new user or link to existing
8. **JWT Generation**: Generate EVOKE JWT tokens

### OAuth Configuration

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# OAuth Settings
ENABLED_OAUTH_PROVIDERS=google,facebook,github
API_BASE_URL=http://localhost:3001
```

## Role-Based Access Control (RBAC)

### User Roles

1. **USER** - Basic user permissions
   - View events
   - Purchase tickets
   - Manage profile
   - Access personal data

2. **ORGANIZER** - Event management permissions
   - All USER permissions
   - Create and manage events
   - Manage event tickets
   - View event analytics

3. **MODERATOR** - Content moderation permissions
   - All ORGANIZER permissions
   - Moderate user content
   - Review events
   - Manage categories

4. **ADMIN** - Full system access
   - All MODERATOR permissions
   - Manage all users
   - System configuration
   - OAuth provider management

### Permission Matrix

| Resource | USER | ORGANIZER | MODERATOR | ADMIN |
|----------|------|-----------|-----------|-------|
| View Events | ✅ | ✅ | ✅ | ✅ |
| Purchase Tickets | ✅ | ✅ | ✅ | ✅ |
| Create Events | ❌ | ✅ | ✅ | ✅ |
| Manage Own Events | ❌ | ✅ | ✅ | ✅ |
| Moderate Content | ❌ | ❌ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ❌ | ✅ |
| System Config | ❌ | ❌ | ❌ | ✅ |

## API Endpoints

### Public Endpoints

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `GET /auth/verify-email/:userId` - Email verification

#### OAuth
- `GET /auth/oauth/:provider` - OAuth initiation
- `GET /auth/oauth/:provider/callback` - OAuth callback

### Protected Endpoints

#### User Management
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile
- `POST /auth/change-password` - Change password
- `POST /auth/logout` - User logout

### Admin Endpoints

#### User Administration
- `GET /auth/users` - Get all users
- `GET /auth/users/:userId` - Get user by ID
- `PATCH /auth/users/:userId/role` - Update user role
- `PATCH /auth/users/:userId/deactivate` - Deactivate user

#### OAuth Management
- `GET /auth/oauth-providers` - Get OAuth providers
- `PUT /auth/oauth-providers/:provider` - Update OAuth provider

## Security Features

### Password Requirements

- **Minimum Length**: 8 characters
- **Complexity**: Must contain uppercase, lowercase, number, and special character
- **Validation**: Real-time client and server validation
- **Hashing**: Bcrypt with 12 salt rounds

### Input Validation

#### Registration
```typescript
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('username').isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/),
  body('firstName').isLength({ min: 1, max: 50 }).trim().escape(),
  body('lastName').isLength({ min: 1, max: 50 }).trim().escape(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
  body('avatar').optional().isURL(),
  body('phone').optional().matches(/^\+?[\d\s\-\(\)]+$/),
  body('dateOfBirth').optional().isISO8601(),
];
```

#### Login
```typescript
const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];
```

### Rate Limiting

- **Auth Endpoints**: 5 requests per 15 minutes per IP
- **Login Attempts**: 5 attempts per 15 minutes per IP
- **Registration**: 3 registrations per hour per IP
- **Password Reset**: 3 requests per hour per IP

### Token Security

- **JWT Secret**: Environment variable with fallback
- **Token Expiration**: Configurable via environment
- **Refresh Token Rotation**: New refresh token on each use
- **Token Blacklisting**: Invalidated refresh tokens stored

## Error Handling

### Authentication Errors

```typescript
// 401 Unauthorized
{
  "error": "Invalid token",
  "message": "Token is invalid or expired"
}

// 403 Forbidden
{
  "error": "Insufficient permissions",
  "message": "Access denied. Required roles: ADMIN"
}

// 409 Conflict
{
  "error": "User already exists",
  "message": "User with this email or username already exists"
}
```

### Validation Errors

```typescript
// 400 Bad Request
{
  "error": "Validation failed",
  "message": "Please check your input",
  "details": [
    {
      "type": "field",
      "value": "weak",
      "msg": "Password must contain at least one uppercase letter",
      "path": "password",
      "location": "body"
    }
  ]
}
```

## Middleware Stack

### Authentication Middleware

1. **verifyToken** - JWT token verification
2. **optionalAuth** - Optional authentication
3. **requireRole** - Role-based access control
4. **requireOwnership** - Resource ownership verification

### Validation Middleware

1. **validatePassword** - Password strength validation
2. **validateEmail** - Email format validation
3. **validateUsername** - Username format validation
4. **validateOAuthState** - OAuth state validation

### Security Middleware

1. **csrfProtection** - CSRF protection for OAuth
2. **authRateLimit** - Rate limiting for auth endpoints
3. **logout** - Secure token invalidation

## Database Integration

### User Model Integration

The authentication system integrates with the Prisma User model:

```typescript
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  username      String    @unique
  firstName     String
  lastName      String
  passwordHash  String
  avatar        String?
  phone         String?
  dateOfBirth   DateTime?
  isVerified    Boolean   @default(false)
  isActive      Boolean   @default(true)
  role          UserRole  @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

### Future Enhancements

1. **RefreshToken Model** - Database storage for refresh tokens
2. **OAuthAccount Model** - OAuth provider account linking
3. **PasswordReset Model** - Password reset token storage
4. **Session Model** - User session tracking

## Testing

### Unit Tests

```typescript
describe('AuthService', () => {
  describe('register', () => {
    it('should create new user with valid data', async () => {
      // Test implementation
    });
    
    it('should reject duplicate email', async () => {
      // Test implementation
    });
  });
  
  describe('login', () => {
    it('should authenticate valid credentials', async () => {
      // Test implementation
    });
    
    it('should reject invalid credentials', async () => {
      // Test implementation
    });
  });
});
```

### Integration Tests

```typescript
describe('Auth API', () => {
  describe('POST /auth/register', () => {
    it('should register new user', async () => {
      // Test implementation
    });
  });
  
  describe('POST /auth/login', () => {
    it('should login existing user', async () => {
      // Test implementation
    });
  });
});
```

## Deployment Considerations

### Environment Variables

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Password Security
BCRYPT_ROUNDS=12

# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# API Configuration
API_BASE_URL=https://api.evoke.com
ENABLED_OAUTH_PROVIDERS=google,facebook,github
```

### Security Checklist

- [ ] JWT secret is strong and unique
- [ ] OAuth client secrets are secure
- [ ] HTTPS is enabled in production
- [ ] Rate limiting is configured
- [ ] Input validation is active
- [ ] Password requirements are enforced
- [ ] Token expiration is reasonable
- [ ] Refresh token rotation is enabled
- [ ] CORS is properly configured
- [ ] Error messages don't leak information

## Monitoring and Logging

### Authentication Events

- User registration
- User login/logout
- Password changes
- OAuth authentication
- Token refresh
- Failed authentication attempts
- Role changes

### Security Monitoring

- Rate limit violations
- Invalid token attempts
- OAuth callback errors
- Password reset requests
- Account deactivation

## Troubleshooting

### Common Issues

1. **JWT Token Expired**
   - Use refresh token to get new access token
   - Check token expiration configuration

2. **OAuth Callback Errors**
   - Verify OAuth provider configuration
   - Check redirect URI settings
   - Validate state parameter

3. **Rate Limiting**
   - Wait for rate limit window to expire
   - Check IP address configuration
   - Review rate limit settings

4. **Password Reset Issues**
   - Verify email address
   - Check reset token expiration
   - Ensure email service is configured

### Debug Mode

Enable debug logging for authentication:

```env
NODE_ENV=development
LOG_LEVEL=debug
```

This will provide detailed logs for authentication flows and error debugging.

---

This authentication system provides a secure, scalable foundation for the EVOKE platform with comprehensive OAuth integration and role-based access control. 