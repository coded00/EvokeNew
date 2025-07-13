# Payment Service Quick Start Guide

## Quick Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Add these to your `.env` file:

```bash
# Payment Gateway Configuration
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key
PAYSTACK_WEBHOOK_SECRET=whsec_your_paystack_webhook_secret
PAYSTACK_BASE_URL=https://api.paystack.co
```

### 3. Paystack Setup (5 minutes)

1. **Create Paystack Account**
   - Go to https://paystack.com
   - Sign up for a merchant account
   - Complete KYC verification

2. **Get API Keys**
   - Go to Settings > API Keys & Webhooks
   - Copy your Secret Key and Public Key
   - Add to your environment variables

3. **Configure Webhooks**
   - Go to Settings > API Keys & Webhooks
   - Add webhook URL: `https://your-domain.com/api/v1/payment/webhook`
   - Copy the webhook secret and add to environment variables

4. **Test Mode vs Live Mode**
   - Use test keys for development
   - Switch to live keys for production
   - Test with Paystack's test cards

### 4. Test the Payment Service

Start the server:
```bash
npm run dev
```

Test payment configuration:
```bash
curl http://localhost:3001/api/v1/payment/verify-config
```

Initialize a test payment:
```bash
curl -X POST http://localhost:3001/api/v1/payment/initialize \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50000,
    "currency": "NGN",
    "email": "test@example.com",
    "callback_url": "https://evoke-app.com/payment/callback",
    "metadata": {
      "eventId": "event_123",
      "ticketType": "VIP",
      "quantity": 2
    }
  }'
```

## Common Use Cases

### 1. Initialize Payment for Ticket Purchase

```typescript
// In your ticket purchase component
const handleTicketPurchase = async (eventId: string, ticketType: string, quantity: number) => {
  try {
    const paymentData = {
      amount: 50000, // ₦500 in kobo
      currency: 'NGN',
      email: userEmail,
      callback_url: 'https://evoke-app.com/payment/callback',
      metadata: {
        eventId,
        ticketType,
        quantity,
        userId: currentUser.id,
      },
      channels: ['card', 'bank', 'ussd'],
    };

    const response = await fetch('http://localhost:3001/api/v1/payment/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    const result = await response.json();
    
    if (result.success) {
      // Redirect to Paystack checkout
      window.location.href = result.data.authorization_url;
    } else {
      console.error('Payment initialization failed:', result.message);
    }
  } catch (error) {
    console.error('Payment error:', error);
  }
};
```

### 2. Verify Payment in Callback

```typescript
// In your payment callback page
const handlePaymentCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const reference = urlParams.get('reference');
  
  if (reference) {
    try {
      const response = await fetch('http://localhost:3001/api/v1/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reference }),
      });

      const result = await response.json();
      
      if (result.success && result.data.status === 'success') {
        console.log('Payment successful:', result.data);
        // Update UI, send confirmation email, etc.
      } else {
        console.error('Payment failed:', result.message);
      }
    } catch (error) {
      console.error('Verification error:', error);
    }
  }
};
```

### 3. Process Webhook Events

```typescript
// Webhook handler (server-side)
app.post('/api/v1/payment/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-paystack-signature'];
    const payload = JSON.stringify(req.body);

    // Verify webhook signature
    const isValidSignature = paymentService.verifyWebhookSignature(payload, signature);
    if (!isValidSignature) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Process webhook event
    const result = await paymentService.processWebhookEvent(req.body);
    
    if (result.success) {
      // Update database, send emails, etc.
      console.log('Webhook processed:', result.data);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});
```

### 4. Refund a Payment

```typescript
const handleRefund = async (transactionId: string, amount: number, reason: string) => {
  try {
    const response = await fetch('http://localhost:3001/api/v1/payment/refund', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transaction_id: transactionId,
        amount,
        reason,
      }),
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Refund processed:', result.data);
    } else {
      console.error('Refund failed:', result.message);
    }
  } catch (error) {
    console.error('Refund error:', error);
  }
};
```

## Frontend Integration

### React Hook Example

```typescript
// hooks/usePaymentService.ts
import { useState } from 'react';

interface PaymentServiceResponse {
  success: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
    amount: number;
    currency: string;
    status: string;
  };
}

export const usePaymentService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializePayment = async (paymentData: any, token: string): Promise<PaymentServiceResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/v1/payment/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();
      
      if (!result.success) {
        setError(result.message);
      }

      return result;
    } catch (err) {
      const errorMessage = 'Failed to initialize payment';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    initializePayment,
    loading,
    error,
  };
};
```

### Usage in Component

```typescript
// components/TicketPurchase.tsx
import { usePaymentService } from '../hooks/usePaymentService';

const TicketPurchase = () => {
  const { initializePayment, loading, error } = usePaymentService();

  const handlePurchase = async (eventId: string, ticketType: string, quantity: number) => {
    const paymentData = {
      amount: 50000, // ₦500 in kobo
      currency: 'NGN',
      email: userEmail,
      callback_url: 'https://evoke-app.com/payment/callback',
      metadata: {
        eventId,
        ticketType,
        quantity,
        userId: currentUser.id,
      },
      channels: ['card', 'bank', 'ussd'],
    };

    const result = await initializePayment(paymentData, userToken);
    
    if (result.success) {
      window.location.href = result.data!.authorization_url;
    } else {
      console.error('Payment failed:', result.message);
    }
  };

  return (
    <div>
      {/* Your ticket purchase form */}
      {loading && <p>Initializing payment...</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};
```

## Testing

### Test Cards (Paystack Test Mode)

| Card Number | Brand | Status |
|-------------|-------|--------|
| 4084 0840 8408 4081 | Visa | Success |
| 5078 5078 5078 5078 | Mastercard | Success |
| 4000 0000 0000 0002 | Visa | Declined |

### Test Bank Accounts

| Bank | Account Number | Status |
|------|---------------|--------|
| Test Bank | 0000000000 | Success |
| Test Bank | 0000000001 | Failed |

## Troubleshooting

### Payment Not Initializing

1. **Check API Keys**
   ```bash
   curl http://localhost:3001/api/v1/payment/verify-config
   ```

2. **Verify Paystack Account**
   - Check your Paystack dashboard
   - Ensure account is activated
   - Verify API keys are correct

3. **Check Amount Format**
   - Amounts are in kobo (smallest currency unit)
   - ₦1 = 100 kobo
   - $1 = 100 cents

### Payment Verification Failing

1. **Check Reference**
   - Ensure reference is correct
   - Verify transaction exists in Paystack

2. **Check API Keys**
   - Use same keys for initialization and verification
   - Ensure keys are for correct environment

### Webhook Not Working

1. **Check Webhook URL**
   - Ensure URL is publicly accessible
   - Use HTTPS for production

2. **Verify Webhook Secret**
   - Check webhook secret in environment variables
   - Verify signature verification

3. **Check Webhook Events**
   - Ensure required events are enabled
   - Check webhook logs in Paystack dashboard

### Common Error Messages

- **"Payment service not configured"**: Check Paystack API keys
- **"Amount must be at least 100"**: Amount is in kobo/cents
- **"Currency not supported"**: Check supported currencies
- **"Transaction not found"**: Check reference and API keys
- **"Invalid signature"**: Check webhook secret

### Debug Mode

Enable detailed logging:
```bash
LOG_LEVEL=debug npm run dev
```

## Next Steps

1. **Customize Webhook Handling**: Modify webhook handlers for your needs
2. **Add Transaction Storage**: Store transactions in your database
3. **Implement Split Payments**: Add support for split payments
4. **Add Payment Analytics**: Track payment performance
5. **Implement Recurring Payments**: Add subscription support
6. **Add Payment Notifications**: Send SMS/email notifications
7. **Implement Payment Reconciliation**: Add reconciliation tools
8. **Add Payment Reports**: Create payment reports

## Support

- Check the full documentation: `PAYMENT_SERVICE_SYSTEM.md`
- Review Paystack documentation: https://paystack.com/docs
- Contact the development team for additional support 