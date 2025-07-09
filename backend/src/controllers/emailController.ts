import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import emailService, { EMAIL_CONFIG } from '../services/emailService';

class EmailController {
  // Send a custom email
  sendCustomEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required',
          message: 'User must be authenticated to send emails',
        });
        return;
      }

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'Validation failed',
          message: 'Please check your input',
          details: errors.array(),
        });
        return;
      }

      const { to, subject, html, text, template, templateData } = req.body;

      const result = await emailService.sendEmail({
        to,
        subject,
        html,
        text,
        template,
        templateData,
      });

      if (!result.success) {
        res.status(500).json({
          error: 'Email sending failed',
          message: result.error,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Email sent successfully',
        data: {
          messageId: result.messageId,
          provider: result.provider,
        },
      });
    } catch (error: any) {
      console.error('Send custom email error:', error);
      res.status(500).json({
        error: 'Email sending failed',
        message: 'An error occurred while sending the email',
      });
    }
  };

  // Send welcome email
  sendWelcomeEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required',
          message: 'User must be authenticated to send welcome emails',
        });
        return;
      }

      const { email, firstName, lastName, username } = req.body;

      if (!email) {
        res.status(400).json({
          error: 'Email required',
          message: 'Email address is required',
        });
        return;
      }

      const result = await emailService.sendWelcomeEmail(email, {
        firstName,
        lastName,
        username: username || req.user.username,
      });

      if (!result.success) {
        res.status(500).json({
          error: 'Welcome email sending failed',
          message: result.error,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Welcome email sent successfully',
        data: {
          messageId: result.messageId,
          provider: result.provider,
        },
      });
    } catch (error: any) {
      console.error('Send welcome email error:', error);
      res.status(500).json({
        error: 'Welcome email sending failed',
        message: 'An error occurred while sending the welcome email',
      });
    }
  };

  // Send password reset email
  sendPasswordResetEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'Validation failed',
          message: 'Please check your input',
          details: errors.array(),
        });
        return;
      }

      const { email, resetToken, firstName } = req.body;

      if (!email || !resetToken) {
        res.status(400).json({
          error: 'Missing required fields',
          message: 'Email and reset token are required',
        });
        return;
      }

      const result = await emailService.sendPasswordResetEmail(email, resetToken, {
        firstName,
      });

      if (!result.success) {
        res.status(500).json({
          error: 'Password reset email sending failed',
          message: result.error,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Password reset email sent successfully',
        data: {
          messageId: result.messageId,
          provider: result.provider,
        },
      });
    } catch (error: any) {
      console.error('Send password reset email error:', error);
      res.status(500).json({
        error: 'Password reset email sending failed',
        message: 'An error occurred while sending the password reset email',
      });
    }
  };

  // Send email verification
  sendEmailVerification = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required',
          message: 'User must be authenticated to send verification emails',
        });
        return;
      }

      const { email, verificationToken, firstName } = req.body;

      if (!email || !verificationToken) {
        res.status(400).json({
          error: 'Missing required fields',
          message: 'Email and verification token are required',
        });
        return;
      }

      const result = await emailService.sendEmailVerification(email, verificationToken, {
        firstName,
      });

      if (!result.success) {
        res.status(500).json({
          error: 'Email verification sending failed',
          message: result.error,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Email verification sent successfully',
        data: {
          messageId: result.messageId,
          provider: result.provider,
        },
      });
    } catch (error: any) {
      console.error('Send email verification error:', error);
      res.status(500).json({
        error: 'Email verification sending failed',
        message: 'An error occurred while sending the verification email',
      });
    }
  };

  // Send event confirmation email
  sendEventConfirmation = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required',
          message: 'User must be authenticated to send event confirmation emails',
        });
        return;
      }

      const {
        organizerEmail,
        eventName,
        eventDate,
        eventTime,
        eventLocation,
        eventUrl,
        organizerName,
      } = req.body;

      if (!organizerEmail || !eventName) {
        res.status(400).json({
          error: 'Missing required fields',
          message: 'Organizer email and event name are required',
        });
        return;
      }

      const result = await emailService.sendEventConfirmation(organizerEmail, {
        eventName,
        eventDate,
        eventTime,
        eventLocation,
        eventUrl,
        organizerName,
      });

      if (!result.success) {
        res.status(500).json({
          error: 'Event confirmation email sending failed',
          message: result.error,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Event confirmation email sent successfully',
        data: {
          messageId: result.messageId,
          provider: result.provider,
        },
      });
    } catch (error: any) {
      console.error('Send event confirmation error:', error);
      res.status(500).json({
        error: 'Event confirmation email sending failed',
        message: 'An error occurred while sending the event confirmation email',
      });
    }
  };

  // Send ticket purchase confirmation
  sendTicketPurchaseConfirmation = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        customerEmail,
        eventName,
        eventDate,
        eventTime,
        eventLocation,
        ticketType,
        quantity,
        totalAmount,
        orderId,
        customerName,
      } = req.body;

      if (!customerEmail || !eventName || !orderId) {
        res.status(400).json({
          error: 'Missing required fields',
          message: 'Customer email, event name, and order ID are required',
        });
        return;
      }

      const result = await emailService.sendTicketPurchaseConfirmation(customerEmail, {
        eventName,
        eventDate,
        eventTime,
        eventLocation,
        ticketType,
        quantity,
        totalAmount,
        orderId,
        customerName,
      });

      if (!result.success) {
        res.status(500).json({
          error: 'Ticket purchase confirmation email sending failed',
          message: result.error,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Ticket purchase confirmation email sent successfully',
        data: {
          messageId: result.messageId,
          provider: result.provider,
        },
      });
    } catch (error: any) {
      console.error('Send ticket purchase confirmation error:', error);
      res.status(500).json({
        error: 'Ticket purchase confirmation email sending failed',
        message: 'An error occurred while sending the ticket purchase confirmation email',
      });
    }
  };

  // Verify email configuration
  verifyEmailConfiguration = async (req: Request, res: Response): Promise<void> => {
    try {
      const isValid = await emailService.verifyConfiguration();

      if (!isValid) {
        res.status(500).json({
          error: 'Email configuration verification failed',
          message: 'Email service is not properly configured',
        });
        return;
      }

      const providerInfo = emailService.getProviderInfo();

      res.status(200).json({
        success: true,
        message: 'Email configuration is valid',
        data: {
          provider: providerInfo.provider,
          region: providerInfo.region,
          fromEmail: providerInfo.fromEmail,
          fromName: providerInfo.fromName,
        },
      });
    } catch (error: any) {
      console.error('Verify email configuration error:', error);
      res.status(500).json({
        error: 'Email configuration verification failed',
        message: 'An error occurred while verifying email configuration',
      });
    }
  };

  // Get email templates
  getEmailTemplates = async (req: Request, res: Response): Promise<void> => {
    try {
      res.status(200).json({
        success: true,
        data: {
          templates: EMAIL_CONFIG.templates,
          rateLimits: EMAIL_CONFIG.rateLimits,
        },
      });
    } catch (error: any) {
      console.error('Get email templates error:', error);
      res.status(500).json({
        error: 'Failed to get email templates',
        message: 'An error occurred while retrieving email templates',
      });
    }
  };

  // Get email provider information
  getEmailProviderInfo = async (req: Request, res: Response): Promise<void> => {
    try {
      const providerInfo = emailService.getProviderInfo();

      res.status(200).json({
        success: true,
        data: providerInfo,
      });
    } catch (error: any) {
      console.error('Get email provider info error:', error);
      res.status(500).json({
        error: 'Failed to get email provider information',
        message: 'An error occurred while retrieving email provider information',
      });
    }
  };
}

export default new EmailController(); 