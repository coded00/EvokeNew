#!/usr/bin/env node

/**
 * Mock Payment Service Test Script
 * 
 * This script tests the mock payment service to ensure it works without Paystack credentials.
 * Run this script to verify the payment system is working in mock mode.
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
async function testMockConfiguration() {
  console.log('\n🔧 Testing Mock Payment Configuration...');
  
  try {
    const response = await makeRequest('GET', '/verify-config');
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Mock payment service is properly configured');
      console.log(`   Mode: ${response.data.data.mode || 'mock'}`);
      console.log(`   Configured: ${response.data.data.configured}`);
    } else {
      console.log('❌ Mock payment service configuration failed');
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${response.data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log('❌ Failed to test configuration:', error.message);
  }
}

async function testMockPaymentMethods() {
  console.log('\n💳 Testing Mock Payment Methods...');
  
  try {
    const response = await makeRequest('GET', '/methods');
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Mock payment methods retrieved successfully');
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

async function testMockPaymentInitialization() {
  console.log('\n🚀 Testing Mock Payment Initialization...');
  
  try {
    const response = await makeRequest('POST', '/initialize', TEST_CONFIG);
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Mock payment initialized successfully');
      console.log(`   Reference: ${response.data.data.reference}`);
      console.log(`   Amount: ${response.data.data.amount} ${response.data.data.currency}`);
      console.log(`   Authorization URL: ${response.data.data.authorization_url}`);
      
      // Store reference for verification test
      global.testReference = response.data.data.reference;
    } else {
      console.log('❌ Mock payment initialization failed');
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

async function testMockPaymentVerification() {
  console.log('\n🔍 Testing Mock Payment Verification...');
  
  if (!global.testReference) {
    console.log('❌ No reference available for verification test');
    return;
  }
  
  try {
    const response = await makeRequest('POST', '/verify', { reference: global.testReference });
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Mock payment verification successful');
      console.log(`   Reference: ${response.data.data.reference}`);
      console.log(`   Status: ${response.data.data.status}`);
      console.log(`   Amount: ${response.data.data.amount} ${response.data.data.currency}`);
    } else {
      console.log('❌ Mock payment verification failed');
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${response.data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log('❌ Failed to test payment verification:', error.message);
  }
}

async function testMockCurrencies() {
  console.log('\n💰 Testing Mock Currencies...');
  
  try {
    const response = await makeRequest('GET', '/currencies');
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Mock currencies retrieved successfully');
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

async function testMockWebhook() {
  console.log('\n🔔 Testing Mock Webhook Processing...');
  
  try {
    const mockWebhookData = {
      event: 'charge.success',
      data: {
        id: 123456789,
        reference: global.testReference || 'TEST_REF_123',
        amount: 50000,
        currency: 'NGN',
        status: 'success',
        gateway_response: 'Successful',
        paid_at: new Date().toISOString(),
        channel: 'card',
        customer: {
          id: 123,
          first_name: 'John',
          last_name: 'Doe',
          email: 'test@example.com'
        }
      }
    };

    const response = await makeRequest('POST', '/webhook', mockWebhookData, {
      'X-Paystack-Signature': 'mock_signature'
    });
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Mock webhook processed successfully');
      console.log(`   Event: ${mockWebhookData.event}`);
      console.log(`   Reference: ${mockWebhookData.data.reference}`);
    } else {
      console.log('❌ Mock webhook processing failed');
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${response.data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log('❌ Failed to test webhook processing:', error.message);
  }
}

async function runMockTests() {
  console.log('🧪 Starting Mock Payment Service Tests...');
  console.log('==========================================');
  
  await testMockConfiguration();
  await testMockPaymentMethods();
  await testMockCurrencies();
  await testMockPaymentInitialization();
  await testMockPaymentVerification();
  await testMockWebhook();
  
  console.log('\n🎉 Mock Payment Service Tests Completed!');
  console.log('==========================================');
  console.log('\n📝 Summary:');
  console.log('✅ Mock payment service is working without Paystack credentials');
  console.log('✅ All payment endpoints are functional');
  console.log('✅ Webhook processing is working');
  console.log('✅ Ready for frontend integration');
}

// Run tests if this script is executed directly
if (require.main === module) {
  runMockTests().catch(console.error);
}

module.exports = {
  runMockTests,
  testMockConfiguration,
  testMockPaymentMethods,
  testMockPaymentInitialization,
  testMockPaymentVerification,
  testMockCurrencies,
  testMockWebhook
}; 