import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, AlertCircle } from 'lucide-react';
import { TicketData, QRCodeOptions } from '../../lib/qrCodeService';
import useQRCode from '../../lib/hooks/useQRCode';

interface QRCodeDisplayProps {
  ticketData: TicketData;
  options?: QRCodeOptions;
  showDownload?: boolean;
  showRefresh?: boolean;
  className?: string;
  onQRGenerated?: (qrCodeDataURL: string) => void;
  onError?: (error: string) => void;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  ticketData,
  options = {},
  showDownload = true,
  showRefresh = true,
  className = '',
  onQRGenerated,
  onError
}) => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const { generateQRCode, isLoading, error, clearError } = useQRCode();

  const generateQR = async () => {
    try {
      clearError();
      const dataURL = await generateQRCode(ticketData, options);
      setQrCodeDataURL(dataURL);
      onQRGenerated?.(dataURL);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate QR code';
      onError?.(errorMessage);
    }
  };

  useEffect(() => {
    generateQR();
  }, [ticketData, options]);

  const handleDownload = () => {
    if (!qrCodeDataURL) return;

    const link = document.createElement('a');
    link.href = qrCodeDataURL;
    link.download = `ticket-${ticketData.ticketId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefresh = () => {
    generateQR();
  };

  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center p-6 bg-gray-100 rounded-lg ${className}`}>
        <RefreshCw className="w-8 h-8 animate-spin text-gray-600 mb-2" />
        <p className="text-sm text-gray-600">Generating QR Code...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
        <p className="text-sm text-red-600 mb-2">Failed to generate QR code</p>
        <p className="text-xs text-red-500 mb-3">{error}</p>
        {showRefresh && (
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center p-4 bg-white border border-gray-200 rounded-lg ${className}`}>
      {qrCodeDataURL && (
        <>
          <img
            src={qrCodeDataURL}
            alt={`QR Code for ticket ${ticketData.ticketId}`}
            className="w-48 h-48 object-contain mb-4"
          />
          
          <div className="text-center mb-4">
            <p className="text-sm font-medium text-gray-900">Ticket ID: {ticketData.ticketId}</p>
            <p className="text-xs text-gray-500">{ticketData.eventName}</p>
            <p className="text-xs text-gray-500">{ticketData.attendeeName}</p>
          </div>

          <div className="flex space-x-2">
            {showDownload && (
              <button
                onClick={handleDownload}
                className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            )}
            
            {showRefresh && (
              <button
                onClick={handleRefresh}
                className="flex items-center space-x-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default QRCodeDisplay; 