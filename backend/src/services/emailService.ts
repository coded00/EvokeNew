import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { createTransport } from 'nodemailer';

// Email configuration
export const EMAIL_CONFIG = {
  // Email types and their templates
  templates: {
    welcome: {
      subject: 'Welcome to Evoke - Your Account is Ready!',
      template: 'welcome-email',
    },
    passwordReset: {
      subject: 'Reset Your Evoke Password',
      template: 'password-reset',
    },
    emailVerification: {
      subject: 'Verify Your Evoke Email Address',
      template: 'email-verification',
    },
    eventConfirmation: {
      subject: 'Event Confirmation - {eventName}',
      template: 'event-confirmation',
    },
    ticketPurchase: {
      subject: 'Ticket Purchase Confirmation - {eventName}',
      template: 'ticket-purchase',
    },
    eventReminder: {
      subject: 'Event Reminder - {eventName}',
      template: 'event-reminder',
    },
    eventCancellation: {
      subject: 'Event Cancelled - {eventName}',
      template: 'event-cancellation',
    },
    accountDeactivation: {
      subject: 'Account Deactivation Notice',
      template: 'account-deactivation',
    },
    securityAlert: {
      subject: 'Security Alert - New Login Detected',
      template: 'security-alert',
    },
  },

  // Rate limiting for email sending
  rateLimits: {
    welcome: { maxPerHour: 10, maxPerDay: 100 },
    passwordReset: { maxPerHour: 5, maxPerDay: 50 },
    emailVerification: { maxPerHour: 10, maxPerDay: 200 },
    eventConfirmation: { maxPerHour: 20, maxPerDay: 500 },
    ticketPurchase: { maxPerHour: 30, maxPerDay: 1000 },
    eventReminder: { maxPerHour: 50, maxPerDay: 2000 },
    eventCancellation: { maxPerHour: 10, maxPerDay: 100 },
    accountDeactivation: { maxPerHour: 5, maxPerDay: 50 },
    securityAlert: { maxPerHour: 10, maxPerDay: 100 },
  },
};

export interface EmailData {
  to: string;
  toName?: string;
  from?: string;
  fromName?: string;
  subject?: string;
  template?: string;
  templateData?: Record<string, any>;
  html?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType: string;
  }>;
}

export interface EmailResult {
  success: boolean;
  messageId?: string | undefined;
  error?: string;
  provider: 'aws-ses' | 'smtp';
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

class EmailService {
  private sesClient: SESClient;
  private smtpTransporter: any;
  private provider: 'aws-ses' | 'smtp';
  private fromEmail: string;
  private fromName: string;
  private region: string;

  constructor() {
    this.provider = (process.env['EMAIL_PROVIDER'] as 'aws-ses' | 'smtp') || 'aws-ses';
    this.fromEmail = process.env['AWS_SES_FROM_EMAIL'] || process.env['SMTP_USER'] || 'noreply@evoke-app.com';
    this.fromName = process.env['AWS_SES_FROM_NAME'] || 'Evoke Events';
    this.region = process.env['AWS_SES_REGION'] || process.env['AWS_REGION'] || 'us-east-1';

    // Initialize AWS SES client
    this.sesClient = new SESClient({
      region: this.region,
      credentials: {
        accessKeyId: process.env['AWS_ACCESS_KEY_ID'] || '',
        secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'] || '',
      },
    });

    // Initialize SMTP transporter as fallback
    if (this.provider === 'smtp' || process.env['SMTP_HOST']) {
      this.smtpTransporter = createTransport({
        host: process.env['SMTP_HOST'],
        port: parseInt(process.env['SMTP_PORT'] || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env['SMTP_USER'],
          pass: process.env['SMTP_PASS'],
        },
      });
    }
  }

  // Send email using the configured provider
  async sendEmail(emailData: EmailData): Promise<EmailResult> {
    try {
      if (this.provider === 'aws-ses') {
        return await this.sendEmailViaSES(emailData);
      } else {
        return await this.sendEmailViaSMTP(emailData);
      }
    } catch (error) {
      console.error('Email sending error:', error);
      return {
        success: false,
        error: 'Failed to send email',
        provider: this.provider,
      };
    }
  }

  // Send email via AWS SES
  private async sendEmailViaSES(emailData: EmailData): Promise<EmailResult> {
    try {
      const { html, text } = await this.generateEmailContent(emailData);
      
      const command = new SendEmailCommand({
        Source: `${this.fromName} <${this.fromEmail}>`,
        Destination: {
          ToAddresses: [emailData.to],
        },
        Message: {
          Subject: {
            Data: emailData.subject || 'Message from Evoke',
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: html,
              Charset: 'UTF-8',
            },
            Text: {
              Data: text,
              Charset: 'UTF-8',
            },
          },
        },
        ReplyToAddresses: [this.fromEmail],
      });

      const response = await this.sesClient.send(command);

      return {
        success: true,
        messageId: response.MessageId || undefined,
        provider: 'aws-ses',
      };
    } catch (error) {
      console.error('SES email error:', error);
      return {
        success: false,
        error: 'Failed to send email via SES',
        provider: 'aws-ses',
      };
    }
  }

  // Send email via SMTP
  private async sendEmailViaSMTP(emailData: EmailData): Promise<EmailResult> {
    try {
      const { html, text } = await this.generateEmailContent(emailData);
      
      const mailOptions = {
        from: `${this.fromName} <${this.fromEmail}>`,
        to: emailData.to,
        subject: emailData.subject || 'Message from Evoke',
        html,
        text,
        attachments: emailData.attachments,
      };

      const info = await this.smtpTransporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: info.messageId,
        provider: 'smtp',
      };
    } catch (error) {
      console.error('SMTP email error:', error);
      return {
        success: false,
        error: 'Failed to send email via SMTP',
        provider: 'smtp',
      };
    }
  }

  // Generate email content from template or provided content
  private async generateEmailContent(emailData: EmailData): Promise<{ html: string; text: string }> {
    if (emailData.html && emailData.text) {
      return {
        html: emailData.html,
        text: emailData.text,
      };
    }

    if (emailData.template) {
      return await this.generateTemplateContent(emailData.template, emailData.templateData || {});
    }

    // Default content
    return {
      html: '<h1>Message from Evoke</h1><p>This is a default email template.</p>',
      text: 'Message from Evoke\n\nThis is a default email template.',
    };
  }

  // Generate content from email templates
  private async generateTemplateContent(templateName: string, data: Record<string, any>): Promise<{ html: string; text: string }> {
    const templates: Record<string, EmailTemplate> = {
      'welcome-email': {
        subject: 'Welcome to Evoke!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Welcome to Evoke</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #4F46E5;">Welcome to Evoke!</h1>
              <p>Hi ${data.firstName || 'there'},</p>
              <p>Welcome to Evoke! We're excited to have you join our community of event enthusiasts.</p>
              <p>Your account has been successfully created and you can now:</p>
              <ul>
                <li>Discover amazing events</li>
                <li>Create and manage your own events</li>
                <li>Connect with other event organizers</li>
                <li>Purchase tickets securely</li>
              </ul>
              <p>If you have any questions, feel free to reach out to our support team.</p>
              <p>Best regards,<br>The Evoke Team</p>
            </div>
          </body>
          </html>
        `,
        text: `
Welcome to Evoke!

Hi ${data.firstName || 'there'},

Welcome to Evoke! We're excited to have you join our community of event enthusiasts.

Your account has been successfully created and you can now:
- Discover amazing events
- Create and manage your own events
- Connect with other event organizers
- Purchase tickets securely

If you have any questions, feel free to reach out to our support team.

Best regards,
The Evoke Team
        `,
      },
      'password-reset': {
        subject: 'Reset Your Evoke Password',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Password Reset</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #DC2626;">Reset Your Password</h1>
              <p>Hi ${data.firstName || 'there'},</p>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              <p style="text-align: center;">
                <a href="${data.resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
              </p>
              <p>This link will expire in 1 hour for security reasons.</p>
              <p>If you didn't request this password reset, you can safely ignore this email.</p>
              <p>Best regards,<br>The Evoke Team</p>
            </div>
          </body>
          </html>
        `,
        text: `
Reset Your Password

Hi ${data.firstName || 'there'},

We received a request to reset your password. Click the link below to create a new password:

${data.resetUrl}

This link will expire in 1 hour for security reasons.

If you didn't request this password reset, you can safely ignore this email.

Best regards,
The Evoke Team
        `,
      },
      'email-verification': {
        subject: 'Verify Your Email Address',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Email Verification</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #059669;">Verify Your Email</h1>
              <p>Hi ${data.firstName || 'there'},</p>
              <p>Please verify your email address by clicking the button below:</p>
              <p style="text-align: center;">
                <a href="${data.verificationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Verify Email</a>
              </p>
              <p>This link will expire in 24 hours.</p>
              <p>Best regards,<br>The Evoke Team</p>
            </div>
          </body>
          </html>
        `,
        text: `
Verify Your Email

Hi ${data.firstName || 'there'},

Please verify your email address by clicking the link below:

${data.verificationUrl}

This link will expire in 24 hours.

Best regards,
The Evoke Team
        `,
      },
      'event-confirmation': {
        subject: `Event Confirmation - ${data.eventName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Event Confirmation</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #059669;">Event Confirmed!</h1>
              <p>Hi ${data.organizerName},</p>
              <p>Your event "${data.eventName}" has been successfully created and is now live!</p>
              <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Event Details:</h3>
                <p><strong>Event:</strong> ${data.eventName}</p>
                <p><strong>Date:</strong> ${data.eventDate}</p>
                <p><strong>Time:</strong> ${data.eventTime}</p>
                <p><strong>Location:</strong> ${data.eventLocation}</p>
                <p><strong>Event URL:</strong> <a href="${data.eventUrl}">${data.eventUrl}</a></p>
              </div>
              <p>You can manage your event from your dashboard.</p>
              <p>Best regards,<br>The Evoke Team</p>
            </div>
          </body>
          </html>
        `,
        text: `
Event Confirmed!

Hi ${data.organizerName},

Your event "${data.eventName}" has been successfully created and is now live!

Event Details:
- Event: ${data.eventName}
- Date: ${data.eventDate}
- Time: ${data.eventTime}
- Location: ${data.eventLocation}
- Event URL: ${data.eventUrl}

You can manage your event from your dashboard.

Best regards,
The Evoke Team
        `,
      },
      'ticket-purchase': {
        subject: `Ticket Purchase Confirmation - ${data.eventName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Ticket Purchase Confirmation</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #059669;">Ticket Purchase Confirmed!</h1>
              <p>Hi ${data.customerName},</p>
              <p>Thank you for your ticket purchase! Here are your ticket details:</p>
              <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Ticket Details:</h3>
                <p><strong>Event:</strong> ${data.eventName}</p>
                <p><strong>Date:</strong> ${data.eventDate}</p>
                <p><strong>Time:</strong> ${data.eventTime}</p>
                <p><strong>Location:</strong> ${data.eventLocation}</p>
                <p><strong>Ticket Type:</strong> ${data.ticketType}</p>
                <p><strong>Quantity:</strong> ${data.quantity}</p>
                <p><strong>Total Amount:</strong> $${data.totalAmount}</p>
                <p><strong>Order ID:</strong> ${data.orderId}</p>
              </div>
              <p>Your tickets will be available in your account dashboard.</p>
              <p>Best regards,<br>The Evoke Team</p>
            </div>
          </body>
          </html>
        `,
        text: `
Ticket Purchase Confirmed!

Hi ${data.customerName},

Thank you for your ticket purchase! Here are your ticket details:

Ticket Details:
- Event: ${data.eventName}
- Date: ${data.eventDate}
- Time: ${data.eventTime}
- Location: ${data.eventLocation}
- Ticket Type: ${data.ticketType}
- Quantity: ${data.quantity}
- Total Amount: $${data.totalAmount}
- Order ID: ${data.orderId}

Your tickets will be available in your account dashboard.

Best regards,
The Evoke Team
        `,
      },
    };

    const template = templates[templateName];
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`);
    }

    // Replace template variables
    const replaceVariables = (content: string): string => {
      return content.replace(/\{(\w+)\}/g, (match, key) => {
        return data[key as keyof typeof data] || match;
      });
    };

    return {
      html: replaceVariables(template.html),
      text: replaceVariables(template.text),
    };
  }

  // Send welcome email
  async sendWelcomeEmail(userEmail: string, userData: { firstName?: string; lastName?: string; username: string }): Promise<EmailResult> {
    return this.sendEmail({
      to: userEmail,
      template: 'welcome-email',
      templateData: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
      },
    });
  }

  // Send password reset email
  async sendPasswordResetEmail(userEmail: string, resetToken: string, userData: { firstName?: string }): Promise<EmailResult> {
    const resetUrl = `${process.env['FRONTEND_URL'] || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    return this.sendEmail({
      to: userEmail,
      template: 'password-reset',
      templateData: {
        firstName: userData.firstName,
        resetUrl,
      },
    });
  }

  // Send email verification
  async sendEmailVerification(userEmail: string, verificationToken: string, userData: { firstName?: string }): Promise<EmailResult> {
    const verificationUrl = `${process.env['FRONTEND_URL'] || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    
    return this.sendEmail({
      to: userEmail,
      template: 'email-verification',
      templateData: {
        firstName: userData.firstName,
        verificationUrl,
      },
    });
  }

  // Send event confirmation
  async sendEventConfirmation(organizerEmail: string, eventData: {
    eventName: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
    eventUrl: string;
    organizerName: string;
  }): Promise<EmailResult> {
    return this.sendEmail({
      to: organizerEmail,
      template: 'event-confirmation',
      templateData: eventData,
    });
  }

  // Send ticket purchase confirmation
  async sendTicketPurchaseConfirmation(customerEmail: string, ticketData: {
    eventName: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
    ticketType: string;
    quantity: number;
    totalAmount: number;
    orderId: string;
    customerName: string;
  }): Promise<EmailResult> {
    return this.sendEmail({
      to: customerEmail,
      template: 'ticket-purchase',
      templateData: ticketData,
    });
  }

  // Verify email configuration
  async verifyConfiguration(): Promise<boolean> {
    try {
      if (this.provider === 'aws-ses') {
        // Test SES configuration
        const command = new SendEmailCommand({
          Source: this.fromEmail,
          Destination: {
            ToAddresses: ['test@example.com'],
          },
          Message: {
            Subject: {
              Data: 'Test Email',
              Charset: 'UTF-8',
            },
            Body: {
              Text: {
                Data: 'This is a test email',
                Charset: 'UTF-8',
              },
            },
          },
        });

        await this.sesClient.send(command);
        return true;
      } else {
        // Test SMTP configuration
        await this.smtpTransporter.verify();
        return true;
      }
    } catch (error) {
      console.error('Email configuration verification failed:', error);
      return false;
    }
  }

  // Get email provider information
  getProviderInfo(): { provider: string; region?: string; fromEmail: string; fromName: string } {
    return {
      provider: this.provider,
      region: this.provider === 'aws-ses' ? this.region : undefined,
      fromEmail: this.fromEmail,
      fromName: this.fromName,
    };
  }
}

export default new EmailService(); 