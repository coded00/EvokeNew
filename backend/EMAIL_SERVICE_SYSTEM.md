# Email Service System Documentation

## Overview

The Evoke backend includes a comprehensive email service using AWS SES (Simple Email Service) with SMTP fallback support. The system supports multiple email templates, rate limiting, and both AWS SES and SMTP providers.

## Features

- **AWS SES Integration**: Primary email service with high deliverability
- **SMTP Fallback**: Alternative email provider for development/testing
- **Email Templates**: Pre-built templates for common email types
- **Rate Limiting**: Protection against email abuse
- **Template Variables**: Dynamic content replacement
- **HTML & Text Support**: Both HTML and plain text email formats
- **Error Handling**: Comprehensive error handling with detailed messages
- **Configuration Verification**: Built-in email service verification

## Email Templates & Types

| Template | Subject | Use Case | Rate Limits |
|----------|---------|----------|-------------|
| `welcome-email` | Welcome to Evoke! | New user registration | 10/hour, 100/day |
| `password-reset` | Reset Your Password | Password reset requests | 5/hour, 50/day |
| `email-verification` | Verify Your Email | Email verification | 10/hour, 200/day |
| `event-confirmation` | Event Confirmed! | Event creation confirmation | 20/hour, 500/day |
| `ticket-purchase` | Ticket Purchase Confirmed! | Ticket purchase confirmations | 30/hour, 1000/day |
| `event-reminder` | Event Reminder | Event reminders | 50/hour, 2000/day |
| `event-cancellation` | Event Cancelled | Event cancellations | 10/hour, 100/day |
| `account-deactivation` | Account Deactivation Notice | Account deactivation | 5/hour, 50/day |
| `security-alert` | Security Alert | Security notifications | 10/hour, 100/day |

## Setup Instructions

### 1. AWS SES Configuration

Configure AWS SES and add the following environment variables:

```bash
# Email Configuration
EMAIL_PROVIDER=aws-ses
AWS_SES_REGION=us-east-1
AWS_SES_FROM_EMAIL=noreply@evoke-app.com
AWS_SES_FROM_NAME=Evoke Events

# AWS Credentials (same as S3)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
```

### 2. SMTP Configuration (Fallback)

For development or as a fallback, configure SMTP:

```bash
# Email Configuration
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 3. AWS SES Setup

1. **Create SES Identity**:
   - Go to AWS SES Console
   - Create a verified email address or domain
   - Request production access if needed

2. **Configure Sending Limits**:
   - Set up sending quotas
   - Configure bounce and complaint handling

3. **Set Up DKIM** (recommended):
   - Enable DKIM for your domain
   - Add DNS records as instructed

### 4. Install Dependencies

```bash
cd backend
npm install
```

## API Endpoints

### Base URL
```
http://localhost:3001/api/v1/email
```

### 1. Send Custom Email
**POST** `/email/custom`

Send a custom email with HTML/text content or template.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Body:**
```json
{
  "to": "user@example.com",
  "subject": "Custom Email Subject",
  "html": "<h1>Hello</h1><p>This is a custom email.</p>",
  "text": "Hello\n\nThis is a custom email.",
  "template": "welcome-email",
  "templateData": {
    "firstName": "John",
    "username": "john_doe"
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "data": {
    "messageId": "0000012345678901-12345678-1234-1234-1234-123456789012-000000",
    "provider": "aws-ses"
  }
}
```

### 2. Send Welcome Email
**POST** `/email/welcome`

Send a welcome email to new users.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Body:**
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "username": "john_doe"
}
```

### 3. Send Password Reset Email
**POST** `/email/password-reset`

Send a password reset email.

**Body:**
```json
{
  "email": "user@example.com",
  "resetToken": "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
  "firstName": "John"
}
```

### 4. Send Email Verification
**POST** `/email/verification`

Send an email verification link.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Body:**
```json
{
  "email": "user@example.com",
  "verificationToken": "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
  "firstName": "John"
}
```

### 5. Send Event Confirmation
**POST** `/email/event-confirmation`

Send event creation confirmation to organizers.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Body:**
```json
{
  "organizerEmail": "organizer@example.com",
  "eventName": "Summer Music Festival",
  "eventDate": "2024-07-15",
  "eventTime": "18:00",
  "eventLocation": "Central Park, NYC",
  "eventUrl": "https://evoke-app.com/events/summer-music-festival",
  "organizerName": "John Doe"
}
```

### 6. Send Ticket Purchase Confirmation
**POST** `/email/ticket-purchase`

Send ticket purchase confirmation to customers.

**Body:**
```json
{
  "customerEmail": "customer@example.com",
  "eventName": "Summer Music Festival",
  "eventDate": "2024-07-15",
  "eventTime": "18:00",
  "eventLocation": "Central Park, NYC",
  "ticketType": "General Admission",
  "quantity": 2,
  "totalAmount": 99.98,
  "orderId": "ORD-123456789",
  "customerName": "Jane Smith"
}
```

### 7. Verify Email Configuration
**GET** `/email/verify`

Verify that the email service is properly configured.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email configuration is valid",
  "data": {
    "provider": "aws-ses",
    "region": "us-east-1",
    "fromEmail": "noreply@evoke-app.com",
    "fromName": "Evoke Events"
  }
}
```

### 8. Get Email Templates
**GET** `/email/templates`

Get available email templates and their rate limits.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "templates": {
      "welcome": {
        "subject": "Welcome to Evoke - Your Account is Ready!",
        "template": "welcome-email"
      },
      "passwordReset": {
        "subject": "Reset Your Evoke Password",
        "template": "password-reset"
      }
    },
    "rateLimits": {
      "welcome": {
        "maxPerHour": 10,
        "maxPerDay": 100
      },
      "passwordReset": {
        "maxPerHour": 5,
        "maxPerDay": 50
      }
    }
  }
}
```

### 9. Get Email Provider Information
**GET** `/email/provider`

Get current email provider configuration.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "provider": "aws-ses",
    "region": "us-east-1",
    "fromEmail": "noreply@evoke-app.com",
    "fromName": "Evoke Events"
  }
}
```

## Error Responses

### Invalid Email Address (400)
```json
{
  "error": "Validation failed",
  "message": "Please check your input",
  "details": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Please provide a valid email address",
      "path": "to",
      "location": "body"
    }
  ]
}
```

### Rate Limit Exceeded (429)
```json
{
  "error": "Too many email requests",
  "message": "Please try again later"
}
```

### Email Sending Failed (500)
```json
{
  "error": "Email sending failed",
  "message": "Failed to send email via SES"
}
```

### Configuration Error (500)
```json
{
  "error": "Email configuration verification failed",
  "message": "Email service is not properly configured"
}
```

## Frontend Integration

### React/TypeScript Example

```typescript
interface EmailResponse {
  success: boolean;
  message: string;
  data: {
    messageId: string;
    provider: string;
  };
}

const sendWelcomeEmail = async (email: string, userData: any, token: string): Promise<EmailResponse> => {
  const response = await fetch('http://localhost:3001/api/v1/email/welcome', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
    }),
  });

  return response.json();
};

// Usage
const handleUserRegistration = async (userData: any) => {
  try {
    const result = await sendWelcomeEmail(userData.email, userData, userToken);
    if (result.success) {
      console.log('Welcome email sent:', result.data.messageId);
    }
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};
```

### JavaScript Example

```javascript
const sendPasswordResetEmail = async (email, resetToken, firstName) => {
  const response = await fetch('http://localhost:3001/api/v1/email/password-reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      resetToken,
      firstName,
    }),
  });

  return response.json();
};

// Usage
const handlePasswordReset = async (email) => {
  try {
    const resetToken = generateResetToken(); // Your token generation logic
    const result = await sendPasswordResetEmail(email, resetToken, userFirstName);
    if (result.success) {
      console.log('Password reset email sent:', result.data.messageId);
    }
  } catch (error) {
    console.error('Password reset email failed:', error);
  }
};
```

## Template Variables

Email templates support dynamic variable replacement using `{variableName}` syntax:

### Welcome Email Variables
- `{firstName}` - User's first name
- `{lastName}` - User's last name
- `{username}` - User's username

### Password Reset Variables
- `{firstName}` - User's first name
- `{resetUrl}` - Password reset URL

### Email Verification Variables
- `{firstName}` - User's first name
- `{verificationUrl}` - Email verification URL

### Event Confirmation Variables
- `{eventName}` - Event name
- `{eventDate}` - Event date
- `{eventTime}` - Event time
- `{eventLocation}` - Event location
- `{eventUrl}` - Event URL
- `{organizerName}` - Organizer name

### Ticket Purchase Variables
- `{eventName}` - Event name
- `{eventDate}` - Event date
- `{eventTime}` - Event time
- `{eventLocation}` - Event location
- `{ticketType}` - Ticket type
- `{quantity}` - Number of tickets
- `{totalAmount}` - Total amount
- `{orderId}` - Order ID
- `{customerName}` - Customer name

## Security Considerations

1. **Rate Limiting**: All email endpoints have rate limiting to prevent abuse
2. **Authentication**: Most email endpoints require authentication
3. **Input Validation**: All email addresses and data are validated
4. **Template Security**: Template variables are safely replaced
5. **Provider Security**: AWS SES provides built-in security features

## Monitoring & Logging

The system includes comprehensive logging for:
- Email sending attempts and results
- Rate limit violations
- Configuration errors
- Provider-specific errors

All logs include user context and email metadata for debugging and monitoring.

## Troubleshooting

### Common Issues

1. **"Email configuration verification failed" error**
   - Check AWS credentials are correct
   - Verify SES identity is verified
   - Ensure SES is in the correct region

2. **"Rate limit exceeded" error**
   - Check current rate limits
   - Implement exponential backoff
   - Consider upgrading SES limits

3. **"Invalid email address" error**
   - Verify email format is correct
   - Check for typos in email addresses
   - Ensure email domain is valid

4. **"Template not found" error**
   - Check template name is correct
   - Verify template exists in the system
   - Use one of the predefined templates

5. **"SMTP authentication failed" error**
   - Verify SMTP credentials
   - Check SMTP server settings
   - Ensure 2FA is properly configured for Gmail

### Debug Mode

Enable debug logging by setting:
```bash
LOG_LEVEL=debug
```

This will provide detailed information about email operations and provider interactions.

### AWS SES Best Practices

1. **Verify Your Domain**: Use domain verification instead of email verification for production
2. **Set Up DKIM**: Enable DKIM for better deliverability
3. **Monitor Bounces**: Set up bounce and complaint handling
4. **Request Production Access**: Move out of sandbox mode for production
5. **Use Sending Statistics**: Monitor your sending statistics in SES console

### SMTP Best Practices

1. **Use App Passwords**: For Gmail, use app passwords instead of regular passwords
2. **Enable 2FA**: Enable two-factor authentication on your email account
3. **Use TLS**: Ensure TLS encryption is enabled
4. **Monitor Limits**: Be aware of your SMTP provider's sending limits 