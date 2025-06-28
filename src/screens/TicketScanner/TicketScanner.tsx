import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Flashlight, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface ScanResult {
  type: 'success' | 'error' | 'invalid';
  message: string;
  ticketData?: {
    id: string;
    eventName: string;
    attendeeName: string;
    ticketType: string;
    purchaseDate: string;
  };
}

export const TicketScanner = (): JSX.Element => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);

  const handleBackToProfile = () => {
    navigate('/profile');
  };

  const handleScan = () => {
    setIsScanning(true);
    setScanResult(null);
    
    // Simulate QR code scanning process
    setTimeout(() => {
      setIsScanning(false);
      
      // Simulate different scan results
      const randomResult = Math.random();
      let result: ScanResult;
      
      if (randomResult < 0.7) {
        // Successful scan
        result = {
          type: 'success',
          message: 'Ticket validated successfully!',
          ticketData: {
            id: 'TKT-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
            eventName: 'Wet & Rave',
            attendeeName: 'John Doe',
            ticketType: 'VIP',
            purchaseDate: '2025-01-15'
          }
        };
      } else if (randomResult < 0.9) {
        // Invalid ticket
        result = {
          type: 'invalid',
          message: 'Invalid ticket - This ticket has already been used or is not valid for this event.'
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
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col relative overflow-hidden font-['Space_Grotesk']">
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
                  <p>Ticket: {scanResult.ticketData.id}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <button 
          onClick={handleBackToProfile}
          className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="w-6 h-6" />
          <span>Back</span>
        </button>
        
        <h1 className="text-2xl font-bold text-white">Ticket Scanner</h1>
        
        <button 
          onClick={toggleFlash}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            flashOn ? 'bg-yellow-500 text-black' : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'
          }`}
        >
          <Flashlight className="w-6 h-6" />
        </button>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {/* QR Code Scanner Frame */}
          <div className="relative bg-white rounded-2xl p-8 shadow-2xl animate-fade-in">
            <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center relative overflow-hidden">
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
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                  : 'bg-[#FC1924] hover:bg-[#e01620] text-white hover:shadow-lg'
              }`}
            >
              {isScanning ? 'Scanning...' : 'Scan QR Code'}
            </button>
          </div>

          {/* Instructions */}
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm mb-2">
              Position the QR code from purchased tickets within the frame
            </p>
            <p className="text-yellow-400 text-xs">
              ⚠️ Only scans tickets purchased through EVOKE platform
            </p>
          </div>
        </div>
      </div>

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <div className="bg-[#2a2a2a] p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Scans</h2>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {scanHistory.map((scan, index) => (
              <div key={index} className="flex items-center space-x-3 bg-[#3a3a3a] rounded-lg p-3">
                <div className={`w-3 h-3 rounded-full ${getResultColor(scan.type)}`}></div>
                <div className="flex-1">
                  <p className="text-white text-sm">{scan.message}</p>
                  {scan.ticketData && (
                    <p className="text-gray-400 text-xs">
                      {scan.ticketData.attendeeName} - {scan.ticketData.id}
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