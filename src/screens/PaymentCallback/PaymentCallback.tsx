import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, X, Loader2 } from 'lucide-react';
import { usePaymentService } from '../../lib/hooks/usePaymentService';

export const PaymentCallback = (): JSX.Element => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('');
  const { verifyPayment, loading, error } = usePaymentService();

  useEffect(() => {
    const handlePaymentCallback = async () => {
      const reference = searchParams.get('reference');
      const trxref = searchParams.get('trxref');

      if (!reference && !trxref) {
        setStatus('failed');
        setMessage('No payment reference found');
        return;
      }

      const paymentReference = reference || trxref;

      try {
        const result = await verifyPayment(paymentReference!);

        if (result.success && result.data) {
          if (result.data.status === 'success') {
            setStatus('success');
            setMessage('Payment completed successfully!');
            
            // Redirect to success page after 3 seconds
            setTimeout(() => {
              navigate('/ticket-success');
            }, 3000);
          } else {
            setStatus('failed');
            setMessage('Payment was not successful');
          }
        } else {
          setStatus('failed');
          setMessage(result.message || 'Payment verification failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('failed');
        setMessage('Failed to verify payment');
      }
    };

    handlePaymentCallback();
  }, [searchParams, verifyPayment, navigate]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="bg-[#2a2a2a] rounded-2xl p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin">
            <Loader2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Verifying Payment</h2>
          <p className="text-gray-400">Please wait while we verify your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
      <div className="bg-[#2a2a2a] rounded-2xl p-12 max-w-md w-full text-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
          status === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {status === 'success' ? (
            <Check className="w-10 h-10 text-white" />
          ) : (
            <X className="w-10 h-10 text-white" />
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">
          {status === 'success' ? 'Payment Successful!' : 'Payment Failed'}
        </h2>
        
        <p className={`text-lg mb-8 ${
          status === 'success' ? 'text-green-400' : 'text-red-400'
        }`}>
          {message}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <button 
            onClick={() => navigate('/home')}
            className="w-full bg-[#FC1924] hover:bg-[#e01620] text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            Back to Home
          </button>
          
          {status === 'success' && (
            <button 
              onClick={() => navigate('/ticket-success')}
              className="w-full bg-transparent border border-gray-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-gray-800"
            >
              View Tickets
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 