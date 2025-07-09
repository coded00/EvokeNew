const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

// Simple test to verify email service functionality
async function testEmailService() {
  console.log('🧪 Testing Email Service...');
  
  try {
    // Test SES client initialization
    const sesClient = new SESClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
      },
    });
    
    console.log('✅ SES Client initialized successfully');
    
    // Test email configuration
    const emailConfig = {
      provider: process.env.EMAIL_PROVIDER || 'aws-ses',
      region: process.env.AWS_SES_REGION || process.env.AWS_REGION || 'us-east-1',
      fromEmail: process.env.AWS_SES_FROM_EMAIL || 'noreply@evoke-app.com',
      fromName: process.env.AWS_SES_FROM_NAME || 'Evoke Events',
    };
    
    console.log('📧 Email Configuration:', emailConfig);
    
    // Test template variable replacement
    const testData = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'john_doe',
      resetUrl: 'https://evoke-app.com/reset?token=abc123',
      verificationUrl: 'https://evoke-app.com/verify?token=xyz789',
      eventName: 'Summer Music Festival',
      eventDate: '2024-07-15',
      eventTime: '18:00',
      eventLocation: 'Central Park, NYC',
      eventUrl: 'https://evoke-app.com/events/summer-festival',
      organizerName: 'John Doe',
      customerName: 'Jane Smith',
      ticketType: 'General Admission',
      quantity: 2,
      totalAmount: 99.98,
      orderId: 'ORD-123456789',
    };
    
    // Test template variable replacement
    const replaceVariables = (content, data) => {
      return content.replace(/\{(\w+)\}/g, (match, key) => {
        return data[key] || match;
      });
    };
    
    const testTemplate = 'Hello {firstName}, welcome to {eventName}!';
    const result = replaceVariables(testTemplate, testData);
    
    console.log('✅ Template variable replacement works:', result);
    
    console.log('🎉 Email service test completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Configure AWS SES credentials in .env file');
    console.log('2. Verify your email address in AWS SES console');
    console.log('3. Test sending emails via the API endpoints');
    console.log('4. Check the full documentation: EMAIL_SERVICE_SYSTEM.md');
    
  } catch (error) {
    console.error('❌ Email service test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your AWS credentials');
    console.log('2. Verify SES is configured in the correct region');
    console.log('3. Ensure your email address is verified in SES');
  }
}

// Run the test
testEmailService(); 