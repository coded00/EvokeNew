import { useState } from 'react';

// Types
export interface PaymentData {
  amount: number;
  currency: string;
  email: string;
  reference?: string;
  callback_url?: string;
  metadata?: Record<string, any>;
  channels?: string[];
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
    amount: number;
    currency: string;
    status: string;
  };
}

export interface VerificationResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    reference: string;
    amount: number;
    currency: string;
    status: string;
    gateway_response: string;
    paid_at?: string;
    channel: string;
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
    };
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
    };
  };
}

export interface PaymentServiceResponse {
  success: boolean;
  message?: string;
  data?: any;
}

// Payment Service Hook
export const usePaymentService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

  // Initialize payment
  const initializePayment = async (
    paymentData: PaymentData, 
    token: string
  ): Promise<PaymentResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/payment/initialize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();
      
      if (!result.success) {
        setError(result.message || 'Payment initialization failed');
      }

      return result;
    } catch (err: any) {
      const errorMessage = 'Failed to initialize payment';
      setError(errorMessage);
      return { 
        success: false, 
        message: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };

  // Verify payment
  const verifyPayment = async (reference: string): Promise<VerificationResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/payment/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reference }),
      });

      const result = await response.json();
      
      if (!result.success) {
        setError(result.message || 'Payment verification failed');
      }

      return result;
    } catch (err: any) {
      const errorMessage = 'Failed to verify payment';
      setError(errorMessage);
      return { 
        success: false, 
        message: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };

  // Get payment methods
  const getPaymentMethods = async (): Promise<PaymentServiceResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/payment/methods`);
      const result = await response.json();
      
      if (!result.success) {
        setError(result.message || 'Failed to get payment methods');
      }

      return result;
    } catch (err: any) {
      const errorMessage = 'Failed to get payment methods';
      setError(errorMessage);
      return { 
        success: false, 
        message: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };

  // Get currencies
  const getCurrencies = async (): Promise<PaymentServiceResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/payment/currencies`);
      const result = await response.json();
      
      if (!result.success) {
        setError(result.message || 'Failed to get currencies');
      }

      return result;
    } catch (err: any) {
      const errorMessage = 'Failed to get currencies';
      setError(errorMessage);
      return { 
        success: false, 
        message: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };

  // Check payment configuration
  const checkConfiguration = async (): Promise<PaymentServiceResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/payment/verify-config`);
      const result = await response.json();
      
      if (!result.success) {
        setError(result.message || 'Payment service not configured');
      }

      return result;
    } catch (err: any) {
      const errorMessage = 'Failed to check payment configuration';
      setError(errorMessage);
      return { 
        success: false, 
        message: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return {
    // Methods
    initializePayment,
    verifyPayment,
    getPaymentMethods,
    getCurrencies,
    checkConfiguration,
    clearError,
    
    // State
    loading,
    error,
  };
}; 