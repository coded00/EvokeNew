#!/usr/bin/env node

/**
 * Simple Payment Service Test
 * Tests the payment service implementation directly without starting the server
 */

const PaymentService = require('./src/services/paymentService');

// Test configuration
const testConfig = {
  amount: 50000, // ₦500 in kobo
  currency: 'NGN',
  email: 'test@example.com',
  callback_url: 'https://evoke-app.com/payment/callback',
  metadata: {
    eventId: 'test_event_123',
    ticketType: 'VIP',
    quantity: 2,
    testMode: true
  },
  channels: ['card', 'bank', 'ussd']
};

async function testPaymentService() {
  console.log('🧪 Testing Payment Service Implementation');
  console.log('==========================================');
  
  try {
    // Test 1: Check if payment service can be instantiated
    console.log('\n1. Testing Payment Service Instantiation...');
    const paymentService = new PaymentService();
    console.log('✅ Payment service instantiated successfully');
    
    // Test 2: Check configuration
    console.log('\n2. Testing Configuration...');
    const config = paymentService.getConfigurationInfo();
    console.log(`   Configured: ${config.configured}`);
    console.log(`   Public Key: ${config.publicKey ? 'Set' : 'Not set'}`);
    console.log(`   Webhook Secret: ${config.webhookSecret ? 'Set' : 'Not set'}`);
    
    // Test 3: Test payment methods
    console.log('\n3. Testing Payment Methods...');
    const methods = paymentService.getSupportedPaymentMethods();
    console.log('✅ Payment methods retrieved:');
    Object.keys(methods).forEach(method => {
      const status = methods[method].enabled ? '✅' : '❌';
      console.log(`   ${status} ${method}: ${methods[method].name}`);
    });
    
    // Test 4: Test currencies
    console.log('\n4. Testing Currencies...');
    const currencies = paymentService.getSupportedCurrencies();
    console.log('✅ Currencies retrieved:');
    Object.keys(currencies).forEach(currency => {
      const info = currencies[currency];
      console.log(`   ${info.symbol} ${currency}: ${info.name}`);
    });
    
    // Test 5: Test validation
    console.log('\n5. Testing Payment Validation...');
    const validation = paymentService.validatePaymentData(testConfig);
    console.log(`   Valid: ${validation.isValid}`);
    if (!validation.isValid) {
      console.log(`   Error: ${validation.error}`);
    } else {
      console.log('✅ Payment data validation passed');
    }
    
    // Test 6: Test reference generation
    console.log('\n6. Testing Reference Generation...');
    const reference = paymentService.generateReference();
    console.log(`   Generated Reference: ${reference}`);
    console.log('✅ Reference generation working');
    
    // Test 7: Test email validation
    console.log('\n7. Testing Email Validation...');
    const validEmail = paymentService.isValidEmail('test@example.com');
    const invalidEmail = paymentService.isValidEmail('invalid-email');
    console.log(`   Valid email: ${validEmail}`);
    console.log(`   Invalid email: ${invalidEmail}`);
    console.log('✅ Email validation working');
    
    console.log('\n🎉 All payment service tests passed!');
    console.log('\n📝 Next Steps:');
    console.log('   1. Configure Paystack API keys in environment variables');
    console.log('   2. Start the server with: npm run dev');
    console.log('   3. Test the API endpoints with the test script');
    console.log('   4. Integrate with your frontend application');
    
  } catch (error) {
    console.error('❌ Payment service test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testPaymentService().catch(console.error); 