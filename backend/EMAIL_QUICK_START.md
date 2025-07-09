# Email Service Quick Start Guide

## Quick Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Add these to your `.env` file:

```bash
# Email Configuration
EMAIL_PROVIDER=aws-ses
AWS_SES_REGION=us-east-1
AWS_SES_FROM_EMAIL=noreply@evoke-app.com
AWS_SES_FROM_NAME=Evoke Events

# AWS Credentials
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000
```

### 3. AWS SES Setup (5 minutes)

1. **Go to AWS SES Console**
   - Navigate to https://console.aws.amazon.com/ses/
   - Select your region (e.g., us-east-1)

2. **Verify Email Address**
   - Click "Verified identities"
   - Click "Create identity"
   - Choose "Email address"
   - Enter: `noreply@evoke-app.com`
   - Click "Create identity"
   - Check your email and click the verification link

3. **Request Production Access** (optional for testing)
   - In SES console, go to "Sending statistics"
   - Click "Request production access"
   - Fill out the form for production limits

### 4. Test the Email Service

Start the server:
```bash
npm run dev
```

Test email configuration:
```bash
curl http://localhost:3001/api/v1/email/verify
```

Send a test welcome email:
```bash
curl -X POST http://localhost:3001/api/v1/email/welcome \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "username": "john_doe"
  }'
```

## Common Use Cases

### 1. Send Welcome Email After Registration

```typescript
// In your auth controller after successful registration
const result = await emailService.sendWelcomeEmail(user.email, {
  firstName: user.firstName,
  lastName: user.lastName,
  username: user.username,
});

if (result.success) {
  console.log('Welcome email sent:', result.messageId);
}
```

### 2. Send Password Reset Email

```typescript
// In your auth controller
const resetToken = await authService.requestPasswordReset(email);
const result = await emailService.sendPasswordResetEmail(email, resetToken, {
  firstName: user.firstName,
});

if (result.success) {
  console.log('Password reset email sent:', result.messageId);
}
```

### 3. Send Event Confirmation

```typescript
// After event creation
const result = await emailService.sendEventConfirmation(organizer.email, {
  eventName: event.name,
  eventDate: event.date,
  eventTime: event.time,
  eventLocation: event.location,
  eventUrl: `https://evoke-app.com/events/${event.id}`,
  organizerName: organizer.firstName,
});
```

### 4. Send Ticket Purchase Confirmation

```typescript
// After successful ticket purchase
const result = await emailService.sendTicketPurchaseConfirmation(customer.email, {
  eventName: event.name,
  eventDate: event.date,
  eventTime: event.time,
  eventLocation: event.location,
  ticketType: ticket.type,
  quantity: order.quantity,
  totalAmount: order.totalAmount,
  orderId: order.id,
  customerName: customer.firstName,
});
```

## Frontend Integration

### React Hook Example

```typescript
// hooks/useEmailService.ts
import { useState } from 'react';

interface EmailServiceResponse {
  success: boolean;
  message: string;
  data?: {
    messageId: string;
    provider: string;
  };
}

export const useEmailService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendWelcomeEmail = async (email: string, userData: any, token: string): Promise<EmailServiceResponse> => {
    setLoading(true);
    setError(null);

    try {
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

      const result = await response.json();
      
      if (!result.success) {
        setError(result.message);
      }

      return result;
    } catch (err) {
      const errorMessage = 'Failed to send welcome email';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    sendWelcomeEmail,
    loading,
    error,
  };
};
```

### Usage in Component

```typescript
// components/RegistrationForm.tsx
import { useEmailService } from '../hooks/useEmailService';

const RegistrationForm = () => {
  const { sendWelcomeEmail, loading, error } = useEmailService();

  const handleRegistration = async (userData: any) => {
    // After successful registration and getting JWT token
    const result = await sendWelcomeEmail(userData.email, userData, jwtToken);
    
    if (result.success) {
      console.log('Welcome email sent successfully!');
      // Show success message to user
    } else {
      console.error('Failed to send welcome email:', result.message);
      // Show error message to user
    }
  };

  return (
    <div>
      {/* Your registration form */}
      {loading && <p>Sending welcome email...</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};
```

## SMTP Fallback Setup

If you prefer to use SMTP instead of AWS SES:

### 1. Update Environment Variables

```bash
# Email Configuration
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 2. Gmail App Password Setup

1. Enable 2-Factor Authentication on your Google account
2. Go to Google Account Settings > Security
3. Generate an App Password for "Mail"
4. Use this password as `SMTP_PASS`

### 3. Test SMTP Configuration

```bash
curl http://localhost:3001/api/v1/email/verify
```

## Troubleshooting

### Email Not Sending

1. **Check AWS Credentials**
   ```bash
   curl http://localhost:3001/api/v1/email/verify
   ```

2. **Verify SES Identity**
   - Go to AWS SES Console
   - Check if your email/domain is verified

3. **Check Rate Limits**
   - AWS SES has sandbox limits (200 emails/day)
   - Request production access for higher limits

### Common Error Messages

- **"Email configuration verification failed"**: Check AWS credentials and SES setup
- **"Rate limit exceeded"**: Wait or upgrade SES limits
- **"Invalid email address"**: Check email format
- **"Template not found"**: Use one of the predefined templates

### Debug Mode

Enable detailed logging:
```bash
LOG_LEVEL=debug npm run dev
```

## Next Steps

1. **Customize Email Templates**: Modify templates in `emailService.ts`
2. **Add More Email Types**: Create new templates for specific use cases
3. **Set Up Email Tracking**: Implement email open/click tracking
4. **Configure Bounce Handling**: Set up bounce and complaint handling in SES
5. **Add Email Analytics**: Track email performance and delivery rates

## Support

- Check the full documentation: `EMAIL_SERVICE_SYSTEM.md`
- Review AWS SES documentation: https://docs.aws.amazon.com/ses/
- Contact the development team for additional support 