declare module 'paystack' {
  interface PaystackConfig {
    secretKey: string;
    publicKey?: string;
    baseUrl?: string;
  }

  interface PaymentData {
    amount: number;
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

  interface TransactionData {
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

  interface PaymentResponse {
    status: boolean;
    message: string;
    data: {
      authorization_url: string;
      access_code: string;
      reference: string;
      amount: number;
      currency: string;
      status: string;
    };
  }

  interface VerificationResponse {
    status: boolean;
    message: string;
    data: TransactionData;
  }

  interface RefundResponse {
    status: boolean;
    message: string;
    data: {
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
  }

  interface CustomerData {
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    metadata?: Record<string, any>;
  }

  interface CustomerResponse {
    status: boolean;
    message: string;
    data: {
      id: number;
      customer_code: string;
      first_name: string;
      last_name: string;
      email: string;
      phone?: string;
      metadata?: any;
      risk_action: string;
    };
  }

  class Paystack {
    constructor(config: PaystackConfig);
    
    transaction: {
      initialize(data: PaymentData): Promise<PaymentResponse>;
      verify(reference: string): Promise<VerificationResponse>;
      get(transactionId: string): Promise<VerificationResponse>;
      list(params?: { page?: number; perPage?: number }): Promise<any>;
    };
    
    refund: {
      create(data: { transaction: string; amount?: number; reason?: string }): Promise<RefundResponse>;
    };
    
    customer: {
      create(data: CustomerData): Promise<CustomerResponse>;
      get(customerId: string): Promise<CustomerResponse>;
    };
  }

  export default Paystack;
} 