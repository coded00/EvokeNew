import Paystack from 'paystack';
import crypto from 'crypto';

// Payment configuration
export const PAYMENT_CONFIG = {
  // Supported payment methods
  paymentMethods: {
    card: {
      name: 'Card Payment',
      description: 'Credit/Debit Card',
      enabled: true,
    },
    bank: {
      name: 'Bank Transfer',
      description: 'Direct Bank Transfer',
      enabled: true,
    },
    ussd: {
      name: 'USSD',
      description: 'USSD Payment',
      enabled: true,
    },
    mobile_money: {
      name: 'Mobile Money',
      description: 'Mobile Money Payment',
      enabled: true,
    },
    qr: {
      name: 'QR Code',
      description: 'QR Code Payment',
      enabled: true,
    },
  },

  // Transaction statuses
  statuses: {
    pending: 'pending',
    success: 'success',
    failed: 'failed',
    abandoned: 'abandoned',
    cancelled: 'cancelled',
  },

  // Currency configuration
  currencies: {
    NGN: {
      name: 'Nigerian Naira',
      symbol: '₦',
      minAmount: 100, // 100 kobo = 1 NGN
      maxAmount: 100000000, // 1M NGN
    },
    USD: {
      name: 'US Dollar',
      symbol: '$',
      minAmount: 100, // 100 cents = 1 USD
      maxAmount: 1000000, // 1M USD
    },
    GHS: {
      name: 'Ghanaian Cedi',
      symbol: '₵',
      minAmount: 100,
      maxAmount: 1000000,
    },
    KES: {
      name: 'Kenyan Shilling',
      symbol: 'KSh',
      minAmount: 100,
      maxAmount: 1000000,
    },
  },

  // Rate limiting for payment requests
  rateLimits: {
    createTransaction: { maxPerHour: 100, maxPerDay: 1000 },
    verifyTransaction: { maxPerHour: 200, maxPerDay: 2000 },
    refundTransaction: { maxPerHour: 10, maxPerDay: 100 },
  },
};

// Mock transaction storage for development
const mockTransactions = new Map<string, any>();

// Mock payment service for development
class MockPaymentService {
  private isMockMode: boolean;

  constructor() {
    this.isMockMode = !process.env['PAYSTACK_SECRET_KEY'] || process.env['NODE_ENV'] === 'development';
  }

  // Initialize a payment transaction
  async initializePayment(paymentData: PaymentData): Promise<PaymentResult> {
    try {
      // Validate payment data
      const validation = this.validatePaymentData(paymentData);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error || 'Validation failed',
        };
      }

      // Generate reference if not provided
      if (!paymentData.reference) {
        paymentData.reference = this.generateReference();
      }

      // Create mock transaction
      const mockTransaction = {
        id: Math.floor(Math.random() * 1000000),
        reference: paymentData.reference,
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: 'pending',
        authorization_url: `https://mock-paystack.com/checkout/${paymentData.reference}`,
        access_code: `mock_${paymentData.reference}`,
        metadata: paymentData.metadata,
        created_at: new Date().toISOString(),
      };

      // Store mock transaction
      mockTransactions.set(paymentData.reference, mockTransaction);

      return {
        success: true,
        data: {
          authorization_url: mockTransaction.authorization_url,
          access_code: mockTransaction.access_code,
          reference: mockTransaction.reference,
          amount: mockTransaction.amount,
          currency: mockTransaction.currency,
          status: mockTransaction.status,
        },
      };
    } catch (error: any) {
      console.error('Mock payment initialization error:', error);
      return {
        success: false,
        error: 'Failed to initialize payment',
        message: error.message || 'Unknown error',
      };
    }
  }

  // Verify a payment transaction
  async verifyPayment(reference: string): Promise<VerificationResult> {
    try {
      if (!reference) {
        return {
          success: false,
          error: 'Reference is required',
        };
      }

      // Get mock transaction
      const mockTransaction = mockTransactions.get(reference);
      if (!mockTransaction) {
        return {
          success: false,
          error: 'Transaction not found',
        };
      }

      // Simulate payment success (in real implementation, this would check Paystack)
      const isSuccess = Math.random() > 0.1; // 90% success rate for testing

      if (isSuccess) {
        mockTransaction.status = 'success';
        mockTransaction.paid_at = new Date().toISOString();
        mockTransaction.gateway_response = 'Successful';
        mockTransaction.channel = 'card';
        mockTransaction.customer = {
          id: 123,
          first_name: 'John',
          last_name: 'Doe',
          email: mockTransaction.metadata?.email || 'test@example.com',
        };
        mockTransaction.authorization = {
          authorization_code: `AUTH_${reference}`,
          bin: '408408',
          last4: '4081',
          channel: 'card',
          card_type: 'visa',
          bank: 'TEST BANK',
          country_code: 'NG',
          brand: 'visa',
        };
      } else {
        mockTransaction.status = 'failed';
        mockTransaction.gateway_response = 'Transaction failed';
      }

      return {
        success: true,
        data: mockTransaction as TransactionData,
      };
    } catch (error: any) {
      console.error('Mock payment verification error:', error);
      return {
        success: false,
        error: 'Failed to verify payment',
        message: error.message,
      };
    }
  }

  // Get supported payment methods
  getSupportedPaymentMethods(): Record<string, any> {
    return PAYMENT_CONFIG.paymentMethods;
  }

  // Get supported currencies
  getSupportedCurrencies(): Record<string, any> {
    return PAYMENT_CONFIG.currencies;
  }

  // Verify webhook signature (mock implementation)
  verifyWebhookSignature(payload: string, signature: string): boolean {
    // In mock mode, always return true
    return true;
  }

  // Process webhook event (mock implementation)
  async processWebhookEvent(eventData: any): Promise<any> {
    try {
      const { event, data } = eventData;

      switch (event) {
        case 'charge.success':
          return await this.handleSuccessfulCharge(data);
        case 'charge.failed':
          return await this.handleFailedCharge(data);
        case 'transfer.success':
          return await this.handleSuccessfulTransfer(data);
        case 'transfer.failed':
          return await this.handleFailedTransfer(data);
        case 'refund.processed':
          return await this.handleRefundProcessed(data);
        default:
          console.log(`Unhandled webhook event: ${event}`);
          return { success: true, message: 'Event ignored' };
      }
    } catch (error: any) {
      console.error('Webhook processing error:', error);
      return {
        success: false,
        error: 'Failed to process webhook',
        message: error.message,
      };
    }
  }

  // Mock webhook handlers
  private async handleSuccessfulCharge(data: any): Promise<any> {
    console.log('Mock: Successful charge processed', data);
    return { success: true, message: 'Charge success processed' };
  }

  private async handleFailedCharge(data: any): Promise<any> {
    console.log('Mock: Failed charge processed', data);
    return { success: true, message: 'Charge failure processed' };
  }

  private async handleSuccessfulTransfer(data: any): Promise<any> {
    console.log('Mock: Successful transfer processed', data);
    return { success: true, message: 'Transfer success processed' };
  }

  private async handleFailedTransfer(data: any): Promise<any> {
    console.log('Mock: Failed transfer processed', data);
    return { success: true, message: 'Transfer failure processed' };
  }

  private async handleRefundProcessed(data: any): Promise<any> {
    console.log('Mock: Refund processed', data);
    return { success: true, message: 'Refund processed' };
  }

  // Validate payment data
  private validatePaymentData(paymentData: PaymentData): { isValid: boolean; error?: string } {
    if (!paymentData.amount || paymentData.amount < 100) {
      return { isValid: false, error: 'Amount must be at least 100 (in kobo/cents)' };
    }

    if (!paymentData.currency || !(paymentData.currency in PAYMENT_CONFIG.currencies)) {
      return { isValid: false, error: 'Currency not supported' };
    }

    if (!paymentData.email || !this.isValidEmail(paymentData.email)) {
      return { isValid: false, error: 'Invalid email address' };
    }

    const currencyConfig = PAYMENT_CONFIG.currencies[paymentData.currency as keyof typeof PAYMENT_CONFIG.currencies];
    if (paymentData.amount < currencyConfig.minAmount || paymentData.amount > currencyConfig.maxAmount) {
      return { isValid: false, error: `Amount must be between ${currencyConfig.minAmount} and ${currencyConfig.maxAmount}` };
    }

    return { isValid: true };
  }

  // Generate unique reference
  private generateReference(): string {
    return `EVOKE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Validate email
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Check if service is configured
  isConfigured(): boolean {
    return this.isMockMode || (!!process.env['PAYSTACK_SECRET_KEY'] && !!process.env['PAYSTACK_PUBLIC_KEY']);
  }

  // Get configuration status
  getConfigurationStatus(): any {
    return {
      configured: this.isConfigured(),
      mode: this.isMockMode ? 'mock' : 'live',
      publicKey: this.isMockMode ? 'mock_public_key' : process.env['PAYSTACK_PUBLIC_KEY'] || '',
      webhookSecret: this.isMockMode ? 'mock_webhook_secret' : process.env['PAYSTACK_WEBHOOK_SECRET'] || '',
    };
  }
}

export interface PaymentData {
  amount: number; // Amount in kobo (smallest currency unit)
  currency: string;
  email: string;
  reference?: string;
  callback_url?: string;
  metadata?: Record<string, any>;
  channels?: string[];
  split_code?: string;
  subaccount?: string;
  transaction_charge?: number;
  bearer?: 'account' | 'subaccount';
  ussd_code?: string;
  bank?: {
    code: string;
    account_number: string;
  };
  qr_code?: boolean;
  invoice_limit?: number;
}

export interface TransactionData {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  gateway_response: string;
  paid_at?: string;
  channel: string;
  ip_address: string;
  fees: number;
  customer: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    customer_code: string;
    phone?: string;
    metadata?: any;
    risk_action: string;
  };
  authorization: {
    authorization_code: string;
    bin: string;
    last4: string;
    exp_month: string;
    exp_year: string;
    channel: string;
    card_type: string;
    bank: string;
    country_code: string;
    brand: string;
    reusable: boolean;
    signature: string;
    account_name?: string;
  };
  plan?: any;
  split?: any;
  order_id?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentResult {
  success: boolean;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
    amount: number;
    currency: string;
    status: string;
  };
  error?: string;
  message?: string;
}

export interface VerificationResult {
  success: boolean;
  data?: TransactionData;
  error?: string;
  message?: string;
}

export interface RefundResult {
  success: boolean;
  data?: {
    id: number;
    domain: string;
    amount: number;
    currency: string;
    transaction: number;
    status: string;
    refunded_at: string;
    refunded_by: number;
    customer_note: string;
    merchant_note: string;
    refunded_amount: number;
  };
  error?: string;
  message?: string;
}

class PaymentService {
  private paystack: any;
  private secretKey: string;
  private publicKey: string;
  private webhookSecret: string;
  private baseUrl: string;
  private mockService: MockPaymentService;
  private isMockMode: boolean;

  constructor() {
    this.secretKey = process.env['PAYSTACK_SECRET_KEY'] || '';
    this.publicKey = process.env['PAYSTACK_PUBLIC_KEY'] || '';
    this.webhookSecret = process.env['PAYSTACK_WEBHOOK_SECRET'] || '';
    this.baseUrl = process.env['PAYSTACK_BASE_URL'] || 'https://api.paystack.co';
    this.mockService = new MockPaymentService();
    this.isMockMode = !this.secretKey || process.env['NODE_ENV'] === 'development';

    if (this.isMockMode) {
      console.log('🔧 Payment service running in MOCK mode');
    } else if (!this.secretKey) {
      console.warn('⚠️ Paystack secret key not configured, falling back to mock mode');
      this.isMockMode = true;
    }

    if (!this.isMockMode) {
      this.paystack = new Paystack({
        secretKey: this.secretKey,
        publicKey: this.publicKey,
        baseUrl: this.baseUrl,
      });
    }
  }

  // Initialize a payment transaction
  async initializePayment(paymentData: PaymentData): Promise<PaymentResult> {
    if (this.isMockMode) {
      return this.mockService.initializePayment(paymentData);
    }

    try {
      // Validate payment data
      const validation = this.validatePaymentData(paymentData);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error || 'Validation failed',
        };
      }

      // Generate reference if not provided
      if (!paymentData.reference) {
        paymentData.reference = this.generateReference();
      }

      // Create transaction
      const transaction = await this.paystack.transaction.initialize({
        amount: paymentData.amount,
        email: paymentData.email,
        reference: paymentData.reference,
        callback_url: paymentData.callback_url,
        metadata: paymentData.metadata,
        channels: paymentData.channels,
        split_code: paymentData.split_code,
        subaccount: paymentData.subaccount,
        transaction_charge: paymentData.transaction_charge,
        bearer: paymentData.bearer,
        ussd_code: paymentData.ussd_code,
        bank: paymentData.bank,
        qr_code: paymentData.qr_code,
        invoice_limit: paymentData.invoice_limit,
      });

      if (transaction.status) {
        return {
          success: true,
          data: {
            authorization_url: transaction.data.authorization_url,
            access_code: transaction.data.access_code,
            reference: transaction.data.reference,
            amount: transaction.data.amount,
            currency: transaction.data.currency,
            status: transaction.data.status,
          },
        };
      } else {
        return {
          success: false,
          error: transaction.message || 'Failed to initialize payment',
        };
      }
    } catch (error: any) {
      console.error('Payment initialization error:', error);
      return {
        success: false,
        error: 'Failed to initialize payment',
        message: error.message || 'Unknown error',
      };
    }
  }

  // Verify a payment transaction
  async verifyPayment(reference: string): Promise<VerificationResult> {
    if (this.isMockMode) {
      return this.mockService.verifyPayment(reference);
    }

    try {
      if (!reference) {
        return {
          success: false,
          error: 'Reference is required',
        };
      }

      const transaction = await this.paystack.transaction.verify(reference);

      if (transaction.status) {
        return {
          success: true,
          data: transaction.data as TransactionData,
        };
      } else {
        return {
          success: false,
          error: transaction.message || 'Failed to verify payment',
        };
      }
    } catch (error: any) {
      console.error('Payment verification error:', error);
      return {
        success: false,
        error: 'Failed to verify payment',
        message: error.message,
      };
    }
  }

  // Refund a payment transaction
  async refundPayment(transactionId: string, amount?: number, reason?: string): Promise<RefundResult> {
    try {
      if (!transactionId) {
        return {
          success: false,
          error: 'Transaction ID is required',
        };
      }

      const refundData: any = {
        transaction: transactionId,
      };

      if (amount) {
        refundData.amount = amount;
      }

      if (reason) {
        refundData.customer_note = reason;
      }

      const refund = await this.paystack.refund.create(refundData);

      if (refund.status) {
        return {
          success: true,
          data: refund.data,
        };
      } else {
        return {
          success: false,
          error: refund.message || 'Failed to process refund',
        };
      }
    } catch (error: any) {
      console.error('Payment refund error:', error);
      return {
        success: false,
        error: 'Failed to process refund',
        message: error.message,
      };
    }
  }

  // Get transaction details
  async getTransaction(transactionId: string): Promise<VerificationResult> {
    try {
      if (!transactionId) {
        return {
          success: false,
          error: 'Transaction ID is required',
        };
      }

      const transaction = await this.paystack.transaction.fetch(transactionId);

      if (transaction.status) {
        return {
          success: true,
          data: transaction.data as TransactionData,
        };
      } else {
        return {
          success: false,
          error: transaction.message || 'Failed to fetch transaction',
        };
      }
    } catch (error: any) {
      console.error('Get transaction error:', error);
      return {
        success: false,
        error: 'Failed to fetch transaction',
        message: error.message,
      };
    }
  }

  // List transactions
  async listTransactions(page: number = 1, perPage: number = 50): Promise<any> {
    try {
      const transactions = await this.paystack.transaction.list({
        page,
        perPage,
      });

      if (transactions.status) {
        return {
          success: true,
          data: transactions.data,
          meta: transactions.meta,
        };
      } else {
        return {
          success: false,
          error: transactions.message || 'Failed to fetch transactions',
        };
      }
    } catch (error: any) {
      console.error('List transactions error:', error);
      return {
        success: false,
        error: 'Failed to fetch transactions',
        message: error.message,
      };
    }
  }

  // Create a customer
  async createCustomer(customerData: {
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    metadata?: Record<string, any>;
  }): Promise<any> {
    try {
      const customer = await this.paystack.customer.create(customerData);

      if (customer.status) {
        return {
          success: true,
          data: customer.data,
        };
      } else {
        return {
          success: false,
          error: customer.message || 'Failed to create customer',
        };
      }
    } catch (error: any) {
      console.error('Create customer error:', error);
      return {
        success: false,
        error: 'Failed to create customer',
        message: error.message,
      };
    }
  }

  // Get customer details
  async getCustomer(customerId: string): Promise<any> {
    try {
      const customer = await this.paystack.customer.fetch(customerId);

      if (customer.status) {
        return {
          success: true,
          data: customer.data,
        };
      } else {
        return {
          success: false,
          error: customer.message || 'Failed to fetch customer',
        };
      }
    } catch (error: any) {
      console.error('Get customer error:', error);
      return {
        success: false,
        error: 'Failed to fetch customer',
        message: error.message,
      };
    }
  }

  // Verify webhook signature
  verifyWebhookSignature(payload: string, signature: string): boolean {
    if (this.isMockMode) {
      return this.mockService.verifyWebhookSignature(payload, signature);
    }

    try {
      const hash = crypto
        .createHmac('sha512', this.webhookSecret)
        .update(payload)
        .digest('hex');

      return hash === signature;
    } catch (error) {
      console.error('Webhook signature verification error:', error);
      return false;
    }
  }

  // Process webhook event
  async processWebhookEvent(eventData: any): Promise<any> {
    if (this.isMockMode) {
      return this.mockService.processWebhookEvent(eventData);
    }

    try {
      const { event, data } = eventData;

      switch (event) {
        case 'charge.success':
          return await this.handleSuccessfulCharge(data);
        case 'charge.failed':
          return await this.handleFailedCharge(data);
        case 'transfer.success':
          return await this.handleSuccessfulTransfer(data);
        case 'transfer.failed':
          return await this.handleFailedTransfer(data);
        case 'refund.processed':
          return await this.handleRefundProcessed(data);
        default:
          console.log(`Unhandled webhook event: ${event}`);
          return { success: true, message: 'Event ignored' };
      }
    } catch (error: any) {
      console.error('Webhook processing error:', error);
      return {
        success: false,
        error: 'Failed to process webhook',
        message: error.message,
      };
    }
  }

  // Handle successful charge
  private async handleSuccessfulCharge(data: any): Promise<any> {
    console.log('✅ Payment successful:', data.reference);
    
    // Here you would typically:
    // 1. Update your database with the successful transaction
    // 2. Send confirmation email to customer
    // 3. Update inventory/ticket availability
    // 4. Generate tickets/QR codes
    
    return {
      success: true,
      message: 'Payment processed successfully',
      data: {
        reference: data.reference,
        amount: data.amount,
        status: 'success',
      },
    };
  }

  // Handle failed charge
  private async handleFailedCharge(data: any): Promise<any> {
    console.log('❌ Payment failed:', data.reference);
    
    // Here you would typically:
    // 1. Update your database with the failed transaction
    // 2. Send failure notification to customer
    // 3. Restore inventory/ticket availability
    
    return {
      success: true,
      message: 'Payment failure processed',
      data: {
        reference: data.reference,
        status: 'failed',
      },
    };
  }

  // Handle successful transfer
  private async handleSuccessfulTransfer(data: any): Promise<any> {
    console.log('✅ Transfer successful:', data.reference);
    return {
      success: true,
      message: 'Transfer processed successfully',
    };
  }

  // Handle failed transfer
  private async handleFailedTransfer(data: any): Promise<any> {
    console.log('❌ Transfer failed:', data.reference);
    return {
      success: true,
      message: 'Transfer failure processed',
    };
  }

  // Handle refund processed
  private async handleRefundProcessed(data: any): Promise<any> {
    console.log('💰 Refund processed:', data.reference);
    
    // Here you would typically:
    // 1. Update your database with the refund
    // 2. Send refund confirmation to customer
    // 3. Restore inventory/ticket availability
    
    return {
      success: true,
      message: 'Refund processed successfully',
    };
  }

  // Validate payment data
  private validatePaymentData(paymentData: PaymentData): { isValid: boolean; error?: string } {
    if (!paymentData.amount || paymentData.amount <= 0) {
      return { isValid: false, error: 'Amount must be greater than 0' };
    }

    if (!paymentData.email) {
      return { isValid: false, error: 'Email is required' };
    }

    if (!this.isValidEmail(paymentData.email)) {
      return { isValid: false, error: 'Invalid email format' };
    }

    if (!PAYMENT_CONFIG.currencies[paymentData.currency as keyof typeof PAYMENT_CONFIG.currencies]) {
      return { isValid: false, error: 'Unsupported currency' };
    }

    const currencyConfig = PAYMENT_CONFIG.currencies[paymentData.currency as keyof typeof PAYMENT_CONFIG.currencies];
    if (paymentData.amount < currencyConfig.minAmount) {
      return { isValid: false, error: `Amount must be at least ${currencyConfig.symbol}${currencyConfig.minAmount / 100}` };
    }

    if (paymentData.amount > currencyConfig.maxAmount) {
      return { isValid: false, error: `Amount cannot exceed ${currencyConfig.symbol}${currencyConfig.maxAmount / 100}` };
    }

    return { isValid: true };
  }

  // Generate unique reference
  private generateReference(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `EVOKE_${timestamp}_${random}`.toUpperCase();
  }

  // Validate email format
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Get supported payment methods
  getSupportedPaymentMethods(): Record<string, any> {
    return PAYMENT_CONFIG.paymentMethods;
  }

  // Get supported currencies
  getSupportedCurrencies(): Record<string, any> {
    return PAYMENT_CONFIG.currencies;
  }

  // Check if payment service is configured
  isConfigured(): boolean {
    return this.isMockMode || !!(this.secretKey && this.publicKey);
  }

  // Get configuration info
  getConfigurationInfo(): { configured: boolean; publicKey: string; webhookSecret: string } {
    return {
      configured: this.isConfigured(),
      publicKey: this.isMockMode ? 'mock_public_key' : this.publicKey,
      webhookSecret: this.isMockMode ? 'mock_webhook_secret' : (this.webhookSecret ? '***configured***' : 'not configured'),
    };
  }
}

export default new PaymentService(); 