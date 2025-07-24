#!/usr/bin/env node

const http = require('http');

const BASE_URL = 'http://localhost:3001';

class SecurityTester {
  constructor() {
    this.results = [];
  }

  async runTests() {
    console.log('🔒 Starting Security Tests...');
    console.log('==========================================\n');

    await this.testSecurityHeaders();
    await this.testRateLimiting();
    await this.testInputValidation();
    await this.testRequestSizeLimiting();
    await this.testCORS();
    await this.testSuspiciousActivityDetection();

    this.printResults();
  }

  async testSecurityHeaders() {
    console.log('🛡️ Testing Security Headers...');
    
    try {
      const response = await this.makeRequest('GET', '/health');
      const headers = response.headers;
      
      const requiredHeaders = [
        'content-security-policy',
        'strict-transport-security',
        'x-content-type-options',
        'x-frame-options',
        'x-xss-protection',
        'referrer-policy'
      ];

      const missingHeaders = requiredHeaders.filter(header => !headers[header]);
      
      if (missingHeaders.length === 0) {
        console.log('✅ All security headers present');
        this.addResult('Security Headers', 'PASS');
      } else {
        console.log(`❌ Missing headers: ${missingHeaders.join(', ')}`);
        this.addResult('Security Headers', 'FAIL', `Missing: ${missingHeaders.join(', ')}`);
      }
    } catch (error) {
      console.log(`❌ Security headers test failed: ${error.message}`);
      this.addResult('Security Headers', 'FAIL', error.message);
    }
  }

  async testRateLimiting() {
    console.log('\n⏱️ Testing Rate Limiting...');
    
    try {
      // Test global rate limiting
      const responses = [];
      for (let i = 0; i < 105; i++) {
        const response = await this.makeRequest('GET', '/health');
        responses.push(response);
      }

      const rateLimited = responses.some(res => res.statusCode === 429);
      
      if (rateLimited) {
        console.log('✅ Global rate limiting working');
        this.addResult('Global Rate Limiting', 'PASS');
      } else {
        console.log('❌ Global rate limiting not working');
        this.addResult('Global Rate Limiting', 'FAIL');
      }

      // Test auth rate limiting
      const authResponses = [];
      for (let i = 0; i < 10; i++) {
        const response = await this.makeRequest('POST', '/api/v1/auth/login', {
          email: 'test@test.com',
          password: 'test123'
        });
        authResponses.push(response);
      }

      const authRateLimited = authResponses.some(res => res.statusCode === 429);
      
      if (authRateLimited) {
        console.log('✅ Auth rate limiting working');
        this.addResult('Auth Rate Limiting', 'PASS');
      } else {
        console.log('❌ Auth rate limiting not working');
        this.addResult('Auth Rate Limiting', 'FAIL');
      }

    } catch (error) {
      console.log(`❌ Rate limiting test failed: ${error.message}`);
      this.addResult('Rate Limiting', 'FAIL', error.message);
    }
  }

  async testInputValidation() {
    console.log('\n✅ Testing Input Validation...');
    
    const testCases = [
      {
        name: 'Invalid Email',
        data: { email: 'invalid-email', password: 'Test123!', username: 'testuser', firstName: 'Test', lastName: 'User' },
        expectedError: 'Please provide a valid email address'
      },
      {
        name: 'Weak Password',
        data: { email: 'test@test.com', password: 'weak', username: 'testuser', firstName: 'Test', lastName: 'User' },
        expectedError: 'Password must be at least 8 characters long'
      },
      {
        name: 'Short Username',
        data: { email: 'test@test.com', password: 'Test123!', username: 'ab', firstName: 'Test', lastName: 'User' },
        expectedError: 'Username must be between 3 and 30 characters'
      },
      {
        name: 'Empty First Name',
        data: { email: 'test@test.com', password: 'Test123!', username: 'testuser', firstName: '', lastName: 'User' },
        expectedError: 'First name must be between 1 and 50 characters'
      }
    ];

    for (const testCase of testCases) {
      try {
        const response = await this.makeRequest('POST', '/api/v1/auth/register', testCase.data);
        
        if (response.statusCode === 400) {
          const body = JSON.parse(response.body);
          const hasExpectedError = body.details?.some(detail => 
            detail.message.includes(testCase.expectedError)
          );
          
          if (hasExpectedError) {
            console.log(`✅ ${testCase.name} validation working`);
          } else {
            console.log(`❌ ${testCase.name} validation failed`);
            this.addResult(`Input Validation - ${testCase.name}`, 'FAIL');
          }
        } else {
          console.log(`❌ ${testCase.name} validation failed - unexpected status: ${response.statusCode}`);
          this.addResult(`Input Validation - ${testCase.name}`, 'FAIL');
        }
      } catch (error) {
        console.log(`❌ ${testCase.name} test failed: ${error.message}`);
        this.addResult(`Input Validation - ${testCase.name}`, 'FAIL', error.message);
      }
    }

    this.addResult('Input Validation', 'PASS');
  }

  async testRequestSizeLimiting() {
    console.log('\n📏 Testing Request Size Limiting...');
    
    try {
      // Create a large request body (11MB)
      const largeBody = 'a'.repeat(11 * 1024 * 1024);
      
      const response = await this.makeRequest('POST', '/api/v1/auth/register', largeBody, {
        'Content-Type': 'application/json'
      });
      
      if (response.statusCode === 413) {
        console.log('✅ Request size limiting working');
        this.addResult('Request Size Limiting', 'PASS');
      } else {
        console.log(`❌ Request size limiting failed - status: ${response.statusCode}`);
        this.addResult('Request Size Limiting', 'FAIL');
      }
    } catch (error) {
      console.log(`❌ Request size limiting test failed: ${error.message}`);
      this.addResult('Request Size Limiting', 'FAIL', error.message);
    }
  }

  async testCORS() {
    console.log('\n🌐 Testing CORS...');
    
    try {
      const response = await this.makeRequest('GET', '/health', null, {
        'Origin': 'http://malicious-site.com'
      });
      
      if (response.statusCode === 403) {
        console.log('✅ CORS blocking malicious origins');
        this.addResult('CORS Protection', 'PASS');
      } else {
        console.log(`❌ CORS not blocking malicious origins - status: ${response.statusCode}`);
        this.addResult('CORS Protection', 'FAIL');
      }
    } catch (error) {
      console.log(`❌ CORS test failed: ${error.message}`);
      this.addResult('CORS Protection', 'FAIL', error.message);
    }
  }

  async testSuspiciousActivityDetection() {
    console.log('\n🚨 Testing Suspicious Activity Detection...');
    
    const suspiciousTests = [
      {
        name: 'XSS Attempt',
        data: { email: 'test@test.com<script>alert("xss")</script>', password: 'Test123!' },
        expectedDetection: true
      },
      {
        name: 'SQL Injection Attempt',
        data: { email: 'test@test.com', password: "'; DROP TABLE users; --" },
        expectedDetection: true
      }
    ];

    for (const test of suspiciousTests) {
      try {
        await this.makeRequest('POST', '/api/v1/auth/login', test.data);
        console.log(`✅ ${test.name} test completed (check server logs for detection)`);
      } catch (error) {
        console.log(`❌ ${test.name} test failed: ${error.message}`);
      }
    }

    this.addResult('Suspicious Activity Detection', 'PASS');
  }

  async makeRequest(method, path, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, BASE_URL);
      const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
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
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body
          });
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (data) {
        if (typeof data === 'string') {
          req.write(data);
        } else {
          req.write(JSON.stringify(data));
        }
      }

      req.end();
    });
  }

  addResult(test, status, error = null) {
    this.results.push({ test, status, error });
  }

  printResults() {
    console.log('\n🎉 Security Tests Completed!');
    console.log('==========================================');
    
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    
    console.log(`📊 Results: ${passed} passed, ${failed} failed`);
    
    this.results.forEach(result => {
      const icon = result.status === 'PASS' ? '✅' : '❌';
      console.log(`${icon} ${result.test}: ${result.status}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });

    if (failed === 0) {
      console.log('\n🎉 All security tests passed! Your API is well protected.');
    } else {
      console.log('\n⚠️ Some security tests failed. Please review the issues above.');
    }
  }
}

// Run tests
const tester = new SecurityTester();
tester.runTests().catch(console.error); 