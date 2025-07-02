import { useState, useCallback } from 'react';
import QRCodeService, { TicketData, QRCodeOptions } from '../qrCodeService';

interface UseQRCodeReturn {
  generateQRCode: (ticketData: TicketData, options?: QRCodeOptions) => Promise<string>;
  generateBulkQRCodes: (ticketsData: TicketData[], options?: QRCodeOptions) => Promise<{ ticketId: string; qrCodeDataURL: string }[]>;
  validateQRCode: (qrData: string) => { isValid: boolean; ticketData?: TicketData; error?: string };
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useQRCode = (): UseQRCodeReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const generateQRCode = useCallback(async (
    ticketData: TicketData,
    options?: QRCodeOptions
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const qrCodeDataURL = await QRCodeService.generateQRCodeDataURL(ticketData, options);
      return qrCodeDataURL;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate QR code';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateBulkQRCodes = useCallback(async (
    ticketsData: TicketData[],
    options?: QRCodeOptions
  ): Promise<{ ticketId: string; qrCodeDataURL: string }[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const qrCodes = await QRCodeService.generateBulkQRCodes(ticketsData, options);
      return qrCodes;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate bulk QR codes';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const validateQRCode = useCallback((qrData: string) => {
    setError(null);
    try {
      return QRCodeService.validateTicketData(qrData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to validate QR code';
      setError(errorMessage);
      return { isValid: false, error: errorMessage };
    }
  }, []);

  return {
    generateQRCode,
    generateBulkQRCodes,
    validateQRCode,
    isLoading,
    error,
    clearError
  };
};

export default useQRCode; 