# Mock Payment System Setup

This guide explains how to set up and use the mock payment system for development without requiring a Paystack account.

## Overview

The Evoke payment system now includes a **mock payment service** that simulates Paystack functionality for development and testing. This allows you to:

- Develop and test payment flows without real payment credentials
- Test all payment endpoints and webhooks
- Integrate frontend payment features
- Debug payment-related issues

## Features

### ✅ Mock Payment Service
- **Payment Initialization**: Creates mock payment transactions
- **Payment Verification**: Simulates payment verification with 90% success rate
- **Webhook Processing**: Handles mock webhook events
- **Multi-Currency Support**: Supports NGN, USD, GHS, KES
- **Multiple Payment Methods**: Card, Bank Transfer, USSD, Mobile Money, QR

### ✅ Frontend Integration
- **Payment Service Hook**: `usePaymentService` for React components
- **Payment Callback Page**: Handles payment verification after checkout
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: Proper loading indicators during payment processing

## Quick Start

### 1. Backend Setup

The mock payment service is **automatically enabled** when:
- No Paystack credentials are provided
- `NODE_ENV` is set to `development`

**No additional configuration required!** The system will automatically fall back to mock mode.

### 2. Test the Mock Payment Service

Start the backend server:
```bash
cd backend
npm run dev
```

Run the mock payment tests:
```bash
node scripts/test-mock-payment.js
```

Expected output:
```
🧪 Starting Mock Payment Service Tests...
==========================================
🔧 Testing Mock Payment Configuration...
✅ Mock payment service is properly configured
   Mode: mock
   Configured: true

💳 Testing Mock Payment Methods...
✅ Mock payment methods retrieved successfully
   ✅ card: Card Payment
   ✅ bank: Bank Transfer
   ✅ ussd: USSD
   ✅ mobile_money: Mobile Money
   ✅ qr: QR Code

💰 Testing Mock Currencies...
✅ Mock currencies retrieved successfully
   ₦ NGN: Nigerian Naira
   $ USD: US Dollar
   ₵ GHS: Ghanaian Cedi
   KSh KES: Kenyan Shilling

🚀 Testing Mock Payment Initialization...
✅ Mock payment initialized successfully
   Reference: EVOKE_1234567890_abc123
   Amount: 50000 NGN
   Authorization URL: https://mock-paystack.com/checkout/EVOKE_1234567890_abc123

🔍 Testing Mock Payment Verification...
✅ Mock payment verification successful
   Reference: EVOKE_1234567890_abc123
   Status: success
   Amount: 50000 NGN

🔔 Testing Mock Webhook Processing...
✅ Mock webhook processed successfully
   Event: charge.success
   Reference: EVOKE_1234567890_abc123

🎉 Mock Payment Service Tests Completed!
==========================================

📝 Summary:
✅ Mock payment service is working without Paystack credentials
✅ All payment endpoints are functional
✅ Webhook processing is working
✅ Ready for frontend integration
```

### 3. Frontend Integration

The frontend payment integration is already set up with:

#### Payment Service Hook
```typescript
import { usePaymentService } from '../../lib/hooks/usePaymentService';

const { initializePayment, verifyPayment, loading, error } = usePaymentService();
```

#### Ticket Purchase Component
The `TicketPurchase` component now uses real payment API calls with mock fallback.

#### Payment Callback Page
The `PaymentCallback` component handles payment verification after checkout.

## API Endpoints

All payment endpoints work in mock mode:

### Initialize Payment
```bash
POST /api/v1/payment/initialize
```

### Verify Payment
```bash
POST /api/v1/payment/verify
```

### Get Payment Methods
```bash
GET /api/v1/payment/methods
```

### Get Currencies
```bash
GET /api/v1/payment/currencies
```

### Verify Configuration
```bash
GET /api/v1/payment/verify-config
```

### Process Webhook
```bash
POST /api/v1/payment/webhook
```

## Mock Payment Flow

### 1. Payment Initialization
```typescript
const paymentData = {
  amount: 50000, // ₦500 in kobo
  currency: 'NGN',
  email: 'user@example.com',
  callback_url: 'https://evoke-app.com/payment/callback',
  metadata: {
    eventId: 'event_123',
    ticketType: 'VIP',
    quantity: 2
  },
  channels: ['card', 'bank', 'ussd']
};

const result = await initializePayment(paymentData, token);
// Returns: { success: true, data: { authorization_url: 'https://mock-paystack.com/...' } }
```

### 2. Payment Verification
```typescript
const result = await verifyPayment('EVOKE_1234567890_abc123');
// Returns: { success: true, data: { status: 'success', amount: 50000, ... } }
```

### 3. Webhook Processing
```typescript
// Mock webhook events are automatically processed
// charge.success, charge.failed, transfer.success, etc.
```

## Mock Payment Behavior

### Success Rate
- **90% success rate** for payment verification
- **10% failure rate** for testing error scenarios

### Mock Data
- **Transaction IDs**: Auto-generated with `EVOKE_` prefix
- **Customer Data**: Mock customer information
- **Payment Methods**: All methods enabled
- **Currencies**: All supported currencies available

### Mock URLs
- **Authorization URL**: `https://mock-paystack.com/checkout/{reference}`
- **Access Code**: `mock_{reference}`
- **Reference**: `EVOKE_{timestamp}_{random}`

## Testing Scenarios

### 1. Successful Payment Flow
1. Initialize payment → Get authorization URL
2. Simulate payment completion
3. Verify payment → Success response
4. Process webhook → Success event

### 2. Failed Payment Flow
1. Initialize payment → Get authorization URL
2. Simulate payment failure
3. Verify payment → Failure response
4. Process webhook → Failure event

### 3. Error Scenarios
- Invalid amount (too small/large)
- Unsupported currency
- Invalid email format
- Missing required fields

## Development Workflow

### 1. Start Development
```bash
# Backend
cd backend
npm run dev

# Frontend
cd ..
npm run dev
```

### 2. Test Payment Flow
1. Navigate to ticket purchase page
2. Select tickets and proceed to payment
3. Fill payment form and submit
4. Verify payment callback handling

### 3. Debug Payment Issues
- Check browser console for API errors
- Check backend logs for payment processing
- Use mock test script to verify endpoints

## Switching to Live Paystack

When ready to use real Paystack:

1. **Get Paystack Credentials**
   - Sign up at https://paystack.com
   - Get API keys from dashboard
   - Configure webhooks

2. **Set Environment Variables**
   ```bash
   PAYSTACK_SECRET_KEY=sk_live_your_secret_key
   PAYSTACK_PUBLIC_KEY=pk_live_your_public_key
   PAYSTACK_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

3. **Test Live Integration**
   ```bash
   node scripts/test-payment.js
   ```

## Troubleshooting

### Payment Not Initializing
- Check backend server is running
- Verify API endpoints are accessible
- Check browser console for errors

### Payment Verification Failing
- Ensure reference is correct
- Check mock transaction storage
- Verify API response format

### Webhook Issues
- Check webhook signature verification
- Verify webhook event format
- Check backend logs for processing errors

## Benefits

### ✅ Development Speed
- No need for real payment credentials during development
- Instant feedback on payment flows
- Easy testing of edge cases

### ✅ Cost Savings
- No transaction fees during development
- No need for test payment accounts
- Free testing of all payment scenarios

### ✅ Reliability
- Consistent mock responses
- Predictable success/failure rates
- No external service dependencies

### ✅ Security
- No real payment data in development
- Safe testing environment
- No risk of accidental charges

## Next Steps

1. **Test the complete payment flow** using the mock system
2. **Integrate with your authentication system** for real user tokens
3. **Add database integration** for storing payment records
4. **Implement email notifications** for payment confirmations
5. **Add payment analytics** and reporting features

The mock payment system provides a solid foundation for developing and testing payment features without the complexity and cost of real payment processing. 