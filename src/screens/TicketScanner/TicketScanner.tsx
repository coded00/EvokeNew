import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Camera, Flashlight, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import QRCodeService, { TicketData } from "../../lib/qrCodeService";

interface ScanResult {
  type: 'success' | 'error' | 'invalid' | 'expired';
  message: string;
  ticketData?: TicketData;
}

export const TicketScanner = (): JSX.Element => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('eventId');
  const [isScanning, setIsScanning] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);

  const handleBackToEventDashboard = () => {
    if (eventId) {
      navigate(`/event-dashboard/${eventId}`);
    } else {
      navigate('/profile');
    }
  };

  const validateTicket = (qrData: string): ScanResult => {
    try {
      // Validate the QR code data using our service
      const validation = QRCodeService.validateTicketData(qrData);
      
      if (!validation.isValid) {
        return {
          type: 'invalid',
          message: validation.error || 'Invalid ticket format'
        };
      }

      const ticketData = validation.ticketData!;

      // Check if ticket is expired (optional - you can remove this if not needed)
      const eventDate = "2025-06-12T12:00:00Z"; // In real app, this would come from event data
      if (QRCodeService.isTicketExpired(ticketData, eventDate)) {
        return {
          type: 'expired',
          message: 'This ticket has expired for this event',
          ticketData
        };
      }

      // Check if ticket has already been used (in real app, this would check against a database)
      const usedTickets = JSON.parse(localStorage.getItem('usedTickets') || '[]');
      if (usedTickets.includes(ticketData.ticketId)) {
        return {
          type: 'invalid',
          message: 'This ticket has already been used',
          ticketData
        };
      }

      // Mark ticket as used (in real app, this would update the database)
      usedTickets.push(ticketData.ticketId);
      localStorage.setItem('usedTickets', JSON.stringify(usedTickets));

      return {
        type: 'success',
        message: 'Ticket validated successfully!',
        ticketData
      };

    } catch (error) {
      return {
        type: 'error',
        message: 'Unable to read QR code. Please ensure the code is clear and try again.'
      };
    }
  };

  const handleScan = () => {
    setIsScanning(true);
    setScanResult(null);
    
    // Simulate QR code scanning process
    setTimeout(() => {
      setIsScanning(false);
      
      // Simulate different scan results with our validation system
      const randomResult = Math.random();
      let result: ScanResult;
      
      if (randomResult < 0.6) {
        // Successful scan - generate valid ticket data
        const validTicketData = QRCodeService.createTicketData(
          "EVT-123",
          "USER-456",
          "VIP",
          "Wet & Rave",
          "John Doe",
          1000,
          "NGN"
        );
        
        result = {
          type: 'success',
          message: 'Ticket validated successfully!',
          ticketData: validTicketData
        };
      } else if (randomResult < 0.8) {
        // Invalid ticket - try to validate invalid data
        result = validateTicket("invalid-qr-data");
      } else if (randomResult < 0.9) {
        // Expired ticket
        const expiredTicketData = QRCodeService.createTicketData(
          "EVT-123",
          "USER-789",
          "Regular",
          "Past Event",
          "Jane Smith",
          500,
          "NGN"
        );
        
        result = {
          type: 'expired',
          message: 'This ticket has expired for this event',
          ticketData: expiredTicketData
        };
      } else {
        // Scan error
        result = {
          type: 'error',
          message: 'Unable to read QR code. Please ensure the code is clear and try again.'
        };
      }
      
      setScanResult(result);
      setScanHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 scans
    }, 2000);
  };

  const toggleFlash = () => {
    setFlashOn(!flashOn);
  };

  // Clear scan result after 5 seconds
  useEffect(() => {
    if (scanResult) {
      const timer = setTimeout(() => {
        setScanResult(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [scanResult]);

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'invalid':
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
      case 'expired':
        return <XCircle className="w-8 h-8 text-orange-500" />;
      case 'error':
        return <XCircle className="w-8 h-8 text-red-500" />;
      default:
        return null;
    }
  };

  const getResultColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'invalid':
        return 'bg-yellow-500';
      case 'expired':
        return 'bg-orange-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden font-['Space_Grotesk']">
      {/* Scan Result Notification */}
      {scanResult && (
        <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-lg animate-fade-in ${getResultColor(scanResult.type)}`}>
          <div className="flex items-center space-x-3 text-white">
            {getResultIcon(scanResult.type)}
            <div>
              <p className="font-semibold">{scanResult.message}</p>
              {scanResult.ticketData && (
                <div className="text-sm mt-1 opacity-90">
                  <p>{scanResult.ticketData.attendeeName} - {scanResult.ticketData.ticketType}</p>
                  <p>Ticket: {scanResult.ticketData.ticketId}</p>
                  <p>Event: {scanResult.ticketData.eventName}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <button 
          onClick={handleBackToEventDashboard}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <ArrowLeft className="w-6 h-6" />
          <span>Back to Event Dashboard</span>
        </button>
        
        <h1 className="text-2xl font-bold text-gray-900">Ticket Scanner</h1>
        
        <button 
          onClick={toggleFlash}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border-2 ${
            flashOn ? 'bg-yellow-500 text-black border-yellow-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300'
          }`}
        >
          <Flashlight className="w-6 h-6" />
        </button>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {/* QR Code Scanner Frame */}
          <div className="relative bg-white rounded-2xl p-8 shadow-2xl border-2 border-black">
            <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center relative overflow-hidden border border-gray-300">
              {/* Camera View Simulation */}
              <div className="w-full h-full relative bg-gradient-to-br from-gray-200 to-gray-300">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <Camera className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg font-semibold">Position QR Code Here</p>
                    <p className="text-sm">Only scan tickets purchased on EVOKE</p>
                  </div>
                </div>
              </div>

              {/* Scanning Animation Overlay */}
              {isScanning && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/30 to-transparent animate-pulse">
                  <div className="w-full h-1 bg-blue-500 animate-bounce" style={{ marginTop: '50%' }}></div>
                </div>
              )}

              {/* Corner Brackets */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-blue-500 rounded-tl-lg"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-blue-500 rounded-tr-lg"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-blue-500 rounded-bl-lg"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-blue-500 rounded-br-lg"></div>
            </div>
          </div>

          {/* Scan Button */}
          <div className="flex justify-center mt-8">
            <button 
              onClick={handleScan}
              disabled={isScanning}
              className={`px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 ${
                isScanning 
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-lg'
              }`}
            >
              {isScanning ? 'Scanning...' : 'Scan QR Code'}
            </button>
          </div>

          {/* Instructions */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm mb-2">
              Position the QR code from purchased tickets within the frame
            </p>
            <p className="text-yellow-600 text-xs">
              ⚠️ Only scans tickets purchased through EVOKE platform
            </p>
          </div>
        </div>
      </div>

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Scans</h2>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {scanHistory.map((scan, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white rounded-lg p-3 border border-gray-200">
                <div className={`w-3 h-3 rounded-full ${getResultColor(scan.type)}`}></div>
                <div className="flex-1">
                  <p className="text-gray-900 text-sm">{scan.message}</p>
                  {scan.ticketData && (
                    <p className="text-gray-600 text-xs">
                      {scan.ticketData.attendeeName} - {scan.ticketData.ticketId}
                    </p>
                  )}
                </div>
                <span className="text-gray-500 text-xs">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};