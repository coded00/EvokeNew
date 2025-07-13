import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import paymentService from '../services/paymentService';

class PaymentController {
  // Initialize a payment transaction
  initializePayment = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required',
          message: 'User must be authenticated to make payments',
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

      const {
        amount,
        currency,
        email,
        reference,
        callback_url,
        metadata,
        channels,
        split_code,
        subaccount,
        transaction_charge,
        bearer,
        ussd_code,
        bank,
        qr_code,
        invoice_limit,
      } = req.body;

      // Add user information to metadata
      const paymentMetadata = {
        ...metadata,
        userId: req.user.userId,
        username: req.user.username,
        userEmail: req.user.email,
        timestamp: new Date().toISOString(),
      };

      const result = await paymentService.initializePayment({
        amount,
        currency,
        email,
        reference,
        callback_url,
        metadata: paymentMetadata,
        channels,
        split_code,
        subaccount,
        transaction_charge,
        bearer,
        ussd_code,
        bank,
        qr_code,
        invoice_limit,
      });

      if (!result.success) {
        res.status(400).json({
          error: 'Payment initialization failed',
          message: result.error,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Payment initialized successfully',
        data: result.data,
      });
    } catch (error: any) {
      console.error('Initialize payment error:', error);
      res.status(500).json({
        error: 'Payment initialization failed',
        message: 'An error occurred while initializing payment',
      });
    }
  };

  // Verify a payment transaction
  verifyPayment = async (req: Request, res: Response): Promise<void> => {
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

      const { reference } = req.body;

      const result = await paymentService.verifyPayment(reference);

      if (!result.success) {
        res.status(400).json({
          error: 'Payment verification failed',
          message: result.error,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        data: result.data,
      });
    } catch (error: any) {
      console.error('Verify payment error:', error);
      res.status(500).json({
        error: 'Payment verification failed',
        message: 'An error occurred while verifying payment',
      });
    }
  };

  // Refund a payment transaction
  refundPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required',
          message: 'User must be authenticated to process refunds',
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

      const { transaction_id, amount, reason } = req.body;

      const result = await paymentService.refundPayment(transaction_id || '', amount, reason);

      if (!result.success) {
        res.status(400).json({
          error: 'Refund failed',
          message: result.error,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Refund processed successfully',
        data: result.data,
      });
    } catch (error: any) {
      console.error('Refund payment error:', error);
      res.status(500).json({
        error: 'Refund failed',
        message: 'An error occurred while processing refund',
      });
    }
  };

  // Get transaction details
  getTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
      const { transaction_id } = req.params;
      
      if (!transaction_id) {
        res.status(400).json({
          error: 'Transaction ID is required',
          message: 'Please provide a valid transaction ID'
        });
        return;
      }

      const result = await paymentService.getTransaction(transaction_id);
      
      if (result.success) {
        res.status(200).json({
          success: true,
          message: 'Transaction retrieved successfully',
          data: result.data
        });
      } else {
        res.status(400).json({
          error: 'Transaction retrieval failed',
          message: result.message
        });
      }
    } catch (error) {
      console.error('Get transaction error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to retrieve transaction'
      });
    }
  };

  // List transactions
  listTransactions = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required',
          message: 'User must be authenticated to view transactions',
        });
        return;
      }

      const page = parseInt(req.query['page'] as string) || 1;
      const perPage = parseInt(req.query['perPage'] as string) || 50;

      const result = await paymentService.listTransactions(page, perPage);

      if (!result.success) {
        res.status(400).json({
          error: 'Failed to fetch transactions',
          message: result.error,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Transactions retrieved successfully',
        data: result.data,
        meta: result.meta,
      });
    } catch (error: any) {
      console.error('List transactions error:', error);
      res.status(500).json({
        error: 'Failed to fetch transactions',
        message: 'An error occurred while fetching transactions',
      });
    }
  };

  // Create a customer
  createCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required',
          message: 'User must be authenticated to create customers',
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

      const { email, first_name, last_name, phone, metadata } = req.body;

      const result = await paymentService.createCustomer({
        email,
        first_name,
        last_name,
        phone,
        metadata,
      });

      if (!result.success) {
        res.status(400).json({
          error: 'Customer creation failed',
          message: result.error,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Customer created successfully',
        data: result.data,
      });
    } catch (error: any) {
      console.error('Create customer error:', error);
      res.status(500).json({
        error: 'Customer creation failed',
        message: 'An error occurred while creating customer',
      });
    }
  };

  // Get customer details
  getCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
      const { customer_id } = req.params;
      
      if (!customer_id) {
        res.status(400).json({
          error: 'Customer ID is required',
          message: 'Please provide a valid customer ID'
        });
        return;
      }

      const result = await paymentService.getCustomer(customer_id);
      
      if (result.success) {
        res.status(200).json({
          success: true,
          message: 'Customer retrieved successfully',
          data: result.data
        });
      } else {
        res.status(400).json({
          error: 'Customer retrieval failed',
          message: result.message
        });
      }
    } catch (error) {
      console.error('Get customer error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to retrieve customer'
      });
    }
  };

  // Process webhook events
  processWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
      const signature = req.headers['x-paystack-signature'] as string;
      const payload = JSON.stringify(req.body);

      if (!signature) {
        res.status(400).json({
          error: 'Missing signature',
          message: 'Webhook signature is required',
        });
        return;
      }

      // Verify webhook signature
      const isValidSignature = paymentService.verifyWebhookSignature(payload, signature);
      if (!isValidSignature) {
        res.status(401).json({
          error: 'Invalid signature',
          message: 'Webhook signature verification failed',
        });
        return;
      }

      // Process webhook event
      const result = await paymentService.processWebhookEvent(req.body);

      if (!result.success) {
        res.status(400).json({
          error: 'Webhook processing failed',
          message: result.error,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Webhook processed successfully',
        data: result.data,
      });
    } catch (error: any) {
      console.error('Webhook processing error:', error);
      res.status(500).json({
        error: 'Webhook processing failed',
        message: 'An error occurred while processing webhook',
      });
    }
  };

  // Get supported payment methods
  getPaymentMethods = async (_req: Request, res: Response): Promise<void> => {
    try {
      const methods = paymentService.getSupportedPaymentMethods();
      
      res.status(200).json({
        success: true,
        data: methods
      });
    } catch (error) {
      console.error('Get payment methods error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to retrieve payment methods'
      });
    }
  };

  // Get supported currencies
  getCurrencies = async (_req: Request, res: Response): Promise<void> => {
    try {
      const currencies = paymentService.getSupportedCurrencies();
      
      res.status(200).json({
        success: true,
        data: currencies
      });
    } catch (error) {
      console.error('Get currencies error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to retrieve currencies'
      });
    }
  };

  // Verify payment service configuration
  verifyConfiguration = async (_req: Request, res: Response): Promise<void> => {
    try {
      const config = paymentService.getConfigurationInfo();
      
      res.status(200).json({
        success: true,
        message: 'Payment service configuration verified',
        data: config
      });
    } catch (error) {
      console.error('Verify configuration error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to verify configuration'
      });
    }
  };

  // Health check for payment service
  healthCheck = async (_req: Request, res: Response): Promise<void> => {
    try {
      const isConfigured = paymentService.isConfigured();
      const configInfo = paymentService.getConfigurationInfo();
      
      res.status(200).json({
        success: true,
        message: 'Payment service health check',
        data: {
          status: isConfigured ? 'healthy' : 'unhealthy',
          configured: isConfigured,
          timestamp: new Date().toISOString(),
          config: configInfo,
        }
      });
    } catch (error) {
      console.error('Health check error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to perform health check'
      });
    }
  };
}

export default new PaymentController(); 