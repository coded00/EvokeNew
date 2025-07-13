#!/usr/bin/env node

/**
 * Payment Service Test Script
 * 
 * This script tests the payment service endpoints to ensure they're working correctly.
 * Run this script after setting up your Paystack configuration.
 */

const http = require('http');

const BASE_URL = 'http://localhost:3001/api/v1/payment';

// Test configuration
const TEST_CONFIG = {
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

// Helper function to make HTTP requests
function makeRequest(method, endpoint, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${endpoint}`;
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: `/api/v1/payment${endpoint}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({
            status: res.statusCode,
            data: response
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: { error: 'Invalid JSON response', body }
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test functions
async function testConfiguration() {
  console.log('\n🔧 Testing Payment Configuration...');
  
  try {
    const response = await makeRequest('GET', '/verify-config');
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Payment service is properly configured');
      console.log(`   Public Key: ${response.data.data.publicKey.substring(0, 20)}...`);
      console.log(`   Webhook Secret: ${response.data.data.webhookSecret ? 'Configured' : 'Not configured'}`);
    } else {
      console.log('❌ Payment service configuration failed');
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${response.data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log('❌ Failed to test configuration:', error.message);
  }
}

async function testPaymentMethods() {
  console.log('\n💳 Testing Payment Methods...');
  
  try {
    const response = await makeRequest('GET', '/methods');
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Payment methods retrieved successfully');
      const methods = response.data.data;
      Object.keys(methods).forEach(method => {
        const status = methods[method].enabled ? '✅' : '❌';
        console.log(`   ${status} ${method}: ${methods[method].name}`);
      });
    } else {
      console.log('❌ Failed to retrieve payment methods');
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${response.data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log('❌ Failed to test payment methods:', error.message);
  }
}

async function testCurrencies() {
  console.log('\n💰 Testing Currencies...');
  
  try {
    const response = await makeRequest('GET', '/currencies');
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Currencies retrieved successfully');
      const currencies = response.data.data;
      Object.keys(currencies).forEach(currency => {
        const info = currencies[currency];
        console.log(`   ${info.symbol} ${currency}: ${info.name}`);
      });
    } else {
      console.log('❌ Failed to retrieve currencies');
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${response.data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log('❌ Failed to test currencies:', error.message);
  }
}

async function testPaymentInitialization() {
  console.log('\n🚀 Testing Payment Initialization...');
  
  try {
    const response = await makeRequest('POST', '/initialize', TEST_CONFIG);
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Payment initialized successfully');
      console.log(`   Reference: ${response.data.data.reference}`);
      console.log(`   Amount: ${response.data.data.amount} ${response.data.data.currency}`);
      console.log(`   Authorization URL: ${response.data.data.authorization_url}`);
    } else {
      console.log('❌ Payment initialization failed');
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${response.data.message || 'Unknown error'}`);
      
      if (response.data.details) {
        response.data.details.forEach(detail => {
          console.log(`   - ${detail.path}: ${detail.msg}`);
        });
      }
    }
  } catch (error) {
    console.log('❌ Failed to test payment initialization:', error.message);
  }
}

async function testHealthCheck() {
  console.log('\n🏥 Testing Health Check...');
  
  try {
    const response = await makeRequest('GET', '/health');
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Payment service is healthy');
      console.log(`   Status: ${response.data.data.status}`);
      console.log(`   Configured: ${response.data.data.configured}`);
      console.log(`   Timestamp: ${response.data.data.timestamp}`);
    } else {
      console.log('❌ Health check failed');
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${response.data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log('❌ Failed to test health check:', error.message);
  }
}

async function testInvalidPayment() {
  console.log('\n🚫 Testing Invalid Payment (Validation)...');
  
  try {
    const invalidConfig = {
      amount: 50, // Too small
      currency: 'EUR', // Not supported
      email: 'invalid-email', // Invalid email
      callback_url: 'https://evoke-app.com/payment/callback'
    };
    
    const response = await makeRequest('POST', '/initialize', invalidConfig);
    
    if (response.status === 400) {
      console.log('✅ Validation is working correctly');
      if (response.data.details) {
        response.data.details.forEach(detail => {
          console.log(`   ❌ ${detail.path}: ${detail.msg}`);
        });
      }
    } else {
      console.log('❌ Validation should have failed');
      console.log(`   Status: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Failed to test invalid payment:', error.message);
  }
}

// Main test runner
async function runTests() {
  console.log('🧪 Payment Service Test Suite');
  console.log('================================');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Test Amount: ${TEST_CONFIG.amount} ${TEST_CONFIG.currency}`);
  console.log(`Test Email: ${TEST_CONFIG.email}`);
  
  // Check if server is running
  try {
    await makeRequest('GET', '/health');
  } catch (error) {
    console.log('\n❌ Server is not running. Please start the server first:');
    console.log('   npm run dev');
    process.exit(1);
  }
  
  // Run tests
  await testConfiguration();
  await testPaymentMethods();
  await testCurrencies();
  await testHealthCheck();
  await testInvalidPayment();
  await testPaymentInitialization();
  
  console.log('\n🎉 Test suite completed!');
  console.log('\n📝 Next Steps:');
  console.log('   1. Check the test results above');
  console.log('   2. If payment initialization succeeded, visit the authorization URL');
  console.log('   3. Use Paystack test cards to complete the payment');
  console.log('   4. Test webhook handling with ngrok or similar tool');
  console.log('   5. Integrate with your frontend application');
}

// Run the tests
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  makeRequest,
  testConfiguration,
  testPaymentMethods,
  testCurrencies,
  testPaymentInitialization,
  testHealthCheck,
  testInvalidPayment,
  runTests
}; 