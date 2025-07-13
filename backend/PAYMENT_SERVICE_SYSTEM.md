# Payment Service System Documentation

## Overview

The Evoke backend includes a comprehensive payment service using Paystack, a leading payment processor in Africa. The system supports multiple payment methods, currencies, webhook handling, and transaction management.

## Features

- **Paystack Integration**: Primary payment gateway with high success rates
- **Multiple Payment Methods**: Card, Bank Transfer, USSD, Mobile Money, QR Code
- **Multi-Currency Support**: NGN, USD, GHS, KES
- **Webhook Handling**: Real-time payment status updates
- **Transaction Management**: Create, verify, refund, and list transactions
- **Customer Management**: Create and manage customer profiles
- **Rate Limiting**: Protection against payment abuse
- **Security**: Webhook signature verification
- **Error Handling**: Comprehensive error handling with detailed messages

## Supported Payment Methods

| Method | Description | Status |
|--------|-------------|--------|
| Card | Credit/Debit Card | ✅ Enabled |
| Bank Transfer | Direct Bank Transfer | ✅ Enabled |
| USSD | USSD Payment | ✅ Enabled |
| Mobile Money | Mobile Money Payment | ✅ Enabled |
| QR Code | QR Code Payment | ✅ Enabled |

## Supported Currencies

| Currency | Name | Symbol | Min Amount | Max Amount |
|----------|------|--------|------------|------------|
| NGN | Nigerian Naira | ₦ | ₦1 | ₦1,000,000 |
| USD | US Dollar | $ | $1 | $1,000,000 |
| GHS | Ghanaian Cedi | ₵ | ₵1 | ₵1,000,000 |
| KES | Kenyan Shilling | KSh | KSh1 | KSh1,000,000 |

## Setup Instructions

### 1. Paystack Configuration

Configure Paystack and add the following environment variables:

```bash
# Payment Gateway Configuration
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key
PAYSTACK_WEBHOOK_SECRET=whsec_your_paystack_webhook_secret
PAYSTACK_BASE_URL=https://api.paystack.co
```

### 2. Paystack Dashboard Setup

1. **Create Paystack Account**:
   - Go to https://paystack.com
   - Sign up for a merchant account
   - Complete KYC verification

2. **Get API Keys**:
   - Go to Settings > API Keys & Webhooks
   - Copy your Secret Key and Public Key
   - Add to your environment variables

3. **Configure Webhooks**:
   - Go to Settings > API Keys & Webhooks
   - Add webhook URL: `https://your-domain.com/api/v1/payment/webhook`
   - Copy the webhook secret and add to environment variables

4. **Test Mode vs Live Mode**:
   - Use test keys for development
   - Switch to live keys for production
   - Test with Paystack's test cards

### 3. Install Dependencies

```bash
cd backend
npm install
```

## API Endpoints

### Base URL
```
http://localhost:3001/api/v1/payment
```

### 1. Initialize Payment
**POST** `/payment/initialize`

Initialize a new payment transaction.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Body:**
```json
{
  "amount": 50000,
  "currency": "NGN",
  "email": "customer@example.com",
  "reference": "EVOKE_123456789",
  "callback_url": "https://evoke-app.com/payment/callback",
  "metadata": {
    "eventId": "event_123",
    "ticketType": "VIP",
    "quantity": 2
  },
  "channels": ["card", "bank", "ussd"],
  "qr_code": true
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Payment initialized successfully",
  "data": {
    "authorization_url": "https://checkout.paystack.com/0x123456789",
    "access_code": "0x123456789",
    "reference": "EVOKE_123456789",
    "amount": 50000,
    "currency": "NGN",
    "status": "pending"
  }
}
```

### 2. Verify Payment
**POST** `/payment/verify`

Verify a payment transaction status.

**Body:**
```json
{
  "reference": "EVOKE_123456789"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "id": 123456789,
    "reference": "EVOKE_123456789",
    "amount": 50000,
    "currency": "NGN",
    "status": "success",
    "gateway_response": "Successful",
    "paid_at": "2024-01-15T10:30:00.000Z",
    "channel": "card",
    "customer": {
      "id": 123,
      "first_name": "John",
      "last_name": "Doe",
      "email": "customer@example.com"
    },
    "authorization": {
      "authorization_code": "AUTH_123456789",
      "bin": "408408",
      "last4": "4081",
      "channel": "card",
      "card_type": "visa",
      "bank": "TEST BANK",
      "country_code": "NG",
      "brand": "visa"
    }
  }
}
```

### 3. Refund Payment
**POST** `/payment/refund`

Refund a payment transaction.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Body:**
```json
{
  "transaction_id": "123456789",
  "amount": 50000,
  "reason": "Customer requested refund"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Refund processed successfully",
  "data": {
    "id": 987654321,
    "domain": "test",
    "amount": 50000,
    "currency": "NGN",
    "transaction": 123456789,
    "status": "success",
    "refunded_at": "2024-01-15T11:00:00.000Z",
    "refunded_amount": 50000
  }
}
```

### 4. Get Transaction Details
**GET** `/payment/transaction/:transaction_id`

Get details of a specific transaction.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Transaction retrieved successfully",
  "data": {
    "id": 123456789,
    "reference": "EVOKE_123456789",
    "amount": 50000,
    "currency": "NGN",
    "status": "success",
    "gateway_response": "Successful",
    "paid_at": "2024-01-15T10:30:00.000Z",
    "channel": "card",
    "customer": {
      "id": 123,
      "first_name": "John",
      "last_name": "Doe",
      "email": "customer@example.com"
    }
  }
}
```

### 5. List Transactions
**GET** `/payment/transactions?page=1&perPage=50`

List all transactions with pagination.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Transactions retrieved successfully",
  "data": [
    {
      "id": 123456789,
      "reference": "EVOKE_123456789",
      "amount": 50000,
      "currency": "NGN",
      "status": "success",
      "channel": "card",
      "paid_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "total": 100,
    "per_page": 50,
    "current_page": 1,
    "last_page": 2
  }
}
```

### 6. Create Customer
**POST** `/payment/customer`

Create a new customer profile.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Body:**
```json
{
  "email": "customer@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+2348012345678",
  "metadata": {
    "userId": "user_123",
    "preferences": {
      "newsletter": true
    }
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Customer created successfully",
  "data": {
    "id": 123,
    "customer_code": "CUS_123456789",
    "first_name": "John",
    "last_name": "Doe",
    "email": "customer@example.com",
    "phone": "+2348012345678",
    "metadata": {
      "userId": "user_123"
    },
    "risk_action": "default"
  }
}
```

### 7. Get Customer Details
**GET** `/payment/customer/:customer_id`

Get details of a specific customer.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Customer retrieved successfully",
  "data": {
    "id": 123,
    "customer_code": "CUS_123456789",
    "first_name": "John",
    "last_name": "Doe",
    "email": "customer@example.com",
    "phone": "+2348012345678",
    "metadata": {
      "userId": "user_123"
    },
    "risk_action": "default"
  }
}
```

### 8. Process Webhook
**POST** `/payment/webhook`

Process Paystack webhook events.

**Headers:**
```
X-Paystack-Signature: <webhook-signature>
Content-Type: application/json
```

**Body:** (Paystack webhook payload)
```json
{
  "event": "charge.success",
  "data": {
    "id": 123456789,
    "reference": "EVOKE_123456789",
    "amount": 50000,
    "currency": "NGN",
    "status": "success",
    "gateway_response": "Successful",
    "paid_at": "2024-01-15T10:30:00.000Z",
    "channel": "card",
    "customer": {
      "id": 123,
      "first_name": "John",
      "last_name": "Doe",
      "email": "customer@example.com"
    }
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Webhook processed successfully",
  "data": {
    "reference": "EVOKE_123456789",
    "status": "success"
  }
}
```

### 9. Get Payment Methods
**GET** `/payment/methods`

Get supported payment methods.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "card": {
      "name": "Card Payment",
      "description": "Credit/Debit Card",
      "enabled": true
    },
    "bank": {
      "name": "Bank Transfer",
      "description": "Direct Bank Transfer",
      "enabled": true
    },
    "ussd": {
      "name": "USSD",
      "description": "USSD Payment",
      "enabled": true
    },
    "mobile_money": {
      "name": "Mobile Money",
      "description": "Mobile Money Payment",
      "enabled": true
    },
    "qr": {
      "name": "QR Code",
      "description": "QR Code Payment",
      "enabled": true
    }
  }
}
```

### 10. Get Currencies
**GET** `/payment/currencies`

Get supported currencies.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "NGN": {
      "name": "Nigerian Naira",
      "symbol": "₦",
      "minAmount": 100,
      "maxAmount": 100000000
    },
    "USD": {
      "name": "US Dollar",
      "symbol": "$",
      "minAmount": 100,
      "maxAmount": 1000000
    },
    "GHS": {
      "name": "Ghanaian Cedi",
      "symbol": "₵",
      "minAmount": 100,
      "maxAmount": 1000000
    },
    "KES": {
      "name": "Kenyan Shilling",
      "symbol": "KSh",
      "minAmount": 100,
      "maxAmount": 1000000
    }
  }
}
```

### 11. Verify Configuration
**GET** `/payment/verify-config`

Verify payment service configuration.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Payment service is properly configured",
  "data": {
    "configured": true,
    "publicKey": "pk_test_...",
    "webhookSecret": "***configured***"
  }
}
```

### 12. Health Check
**GET** `/payment/health`

Check payment service health.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Payment service health check",
  "data": {
    "status": "healthy",
    "configured": true,
    "timestamp": "2024-01-15T10:30:00.000Z",
    "config": {
      "configured": true,
      "publicKey": "pk_test_...",
      "webhookSecret": "***configured***"
    }
  }
}
```

## Error Responses

### Invalid Amount (400)
```json
{
  "error": "Validation failed",
  "message": "Please check your input",
  "details": [
    {
      "type": "field",
      "value": 50,
      "msg": "Amount must be at least 100 (in kobo/cents)",
      "path": "amount",
      "location": "body"
    }
  ]
}
```

### Invalid Currency (400)
```json
{
  "error": "Validation failed",
  "message": "Please check your input",
  "details": [
    {
      "type": "field",
      "value": "EUR",
      "msg": "Currency must be one of: NGN, USD, GHS, KES",
      "path": "currency",
      "location": "body"
    }
  ]
}
```

### Payment Initialization Failed (400)
```json
{
  "error": "Payment initialization failed",
  "message": "Invalid email address"
}
```

### Payment Verification Failed (400)
```json
{
  "error": "Payment verification failed",
  "message": "Transaction not found"
}
```

### Rate Limit Exceeded (429)
```json
{
  "error": "Too many payment requests",
  "message": "Please try again later"
}
```

### Configuration Error (500)
```json
{
  "error": "Payment service not configured",
  "message": "Paystack configuration is missing",
  "data": {
    "configured": false,
    "publicKey": "",
    "webhookSecret": "not configured"
  }
}
```

## Frontend Integration

### React/TypeScript Example

```typescript
interface PaymentResponse {
  success: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
    amount: number;
    currency: string;
    status: string;
  };
}

const initializePayment = async (paymentData: any, token: string): Promise<PaymentResponse> => {
  const response = await fetch('http://localhost:3001/api/v1/payment/initialize', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
  });

  return response.json();
};

// Usage
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

    const result = await initializePayment(paymentData, userToken);
    
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

### JavaScript Example

```javascript
const verifyPayment = async (reference) => {
  const response = await fetch('http://localhost:3001/api/v1/payment/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reference }),
  });

  return response.json();
};

// Usage in callback page
const handlePaymentCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const reference = urlParams.get('reference');
  
  if (reference) {
    try {
      const result = await verifyPayment(reference);
      
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

## Webhook Handling

### Webhook Events

The system handles the following Paystack webhook events:

1. **charge.success**: Payment completed successfully
2. **charge.failed**: Payment failed
3. **transfer.success**: Transfer completed successfully
4. **transfer.failed**: Transfer failed
5. **refund.processed**: Refund processed

### Webhook Security

- Webhook signatures are verified using HMAC SHA512
- Invalid signatures are rejected with 401 status
- Webhook secret is stored securely in environment variables

### Webhook Processing

When a webhook is received:

1. **Signature Verification**: Verify the webhook signature
2. **Event Processing**: Handle the specific event type
3. **Database Update**: Update transaction status in database
4. **Email Notification**: Send confirmation emails
5. **Inventory Update**: Update ticket availability
6. **Ticket Generation**: Generate tickets/QR codes

## Security Considerations

1. **API Key Security**: Secret keys are stored in environment variables
2. **Webhook Verification**: All webhooks are signature-verified
3. **Rate Limiting**: Payment endpoints have rate limiting
4. **Input Validation**: All payment data is validated
5. **HTTPS Only**: All communications use HTTPS
6. **Error Handling**: Sensitive information is not exposed in errors

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

## Monitoring & Logging

The system includes comprehensive logging for:
- Payment initialization attempts and results
- Payment verification attempts and results
- Webhook processing and event handling
- Refund processing and results
- Rate limit violations
- Configuration errors

All logs include user context and payment metadata for debugging and monitoring.

## Troubleshooting

### Common Issues

1. **"Payment service not configured" error**
   - Check Paystack API keys are correct
   - Verify environment variables are set
   - Ensure keys are for the correct environment (test/live)

2. **"Invalid signature" webhook error**
   - Verify webhook secret is correct
   - Check webhook URL is properly configured
   - Ensure webhook is using HTTPS

3. **"Amount must be at least 100" error**
   - Amounts are in kobo (smallest currency unit)
   - ₦1 = 100 kobo
   - $1 = 100 cents

4. **"Currency not supported" error**
   - Check currency is one of: NGN, USD, GHS, KES
   - Verify currency is enabled in your Paystack account

5. **"Transaction not found" error**
   - Check reference is correct
   - Verify transaction exists in Paystack
   - Ensure you're using the correct API keys

### Debug Mode

Enable debug logging by setting:
```bash
LOG_LEVEL=debug
```

This will provide detailed information about payment operations and Paystack interactions.

### Paystack Best Practices

1. **Use Test Mode**: Always test with Paystack's test environment first
2. **Handle Webhooks**: Implement proper webhook handling for real-time updates
3. **Verify Payments**: Always verify payments on your server, not just client-side
4. **Store References**: Store payment references for reconciliation
5. **Monitor Transactions**: Regularly monitor your transaction dashboard
6. **Handle Errors**: Implement proper error handling for failed payments
7. **Use HTTPS**: Always use HTTPS for production webhooks
8. **Rate Limiting**: Implement rate limiting to prevent abuse

## Next Steps

1. **Customize Webhook Handling**: Modify webhook handlers for your specific needs
2. **Add Transaction Storage**: Store transactions in your database
3. **Implement Split Payments**: Add support for split payments to organizers
4. **Add Payment Analytics**: Track payment performance and success rates
5. **Implement Recurring Payments**: Add support for subscription payments
6. **Add Payment Notifications**: Send SMS/email notifications for payments
7. **Implement Payment Reconciliation**: Add tools for payment reconciliation
8. **Add Payment Reports**: Create payment reports and analytics 