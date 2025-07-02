import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Share2, QrCode, Calendar, MapPin, Clock, Users, Check } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import QRCodeDisplay from "../../components/ui/qr-code-display";
import QRCodeService, { TicketData } from "../../lib/qrCodeService";

interface Ticket {
  id: string;
  type: string;
  eventName: string;
  date: string;
  time: string;
  location: string;
  host: string;
  price: number;
  ticketData?: TicketData;
}

export const TicketSuccess = (): JSX.Element => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // Initialize tickets with proper QR code data
  useEffect(() => {
    const initializeTickets = () => {
      const mockTickets: Ticket[] = [
        {
          id: "TKT-001",
          type: "VIP",
          eventName: "Wet & Rave",
          date: "12th Of June 2025",
          time: "12 noon - Till mama calls",
          location: "252b Ikoroduc cresent Dolphin estate Ikoyi",
          host: "Freezy Kee",
          price: 1000
        },
        {
          id: "TKT-002",
          type: "VIP",
          eventName: "Wet & Rave",
          date: "12th Of June 2025",
          time: "12 noon - Till mama calls",
          location: "252b Ikoroduc cresent Dolphin estate Ikoyi",
          host: "Freezy Kee",
          price: 1000
        }
      ];

      // Generate proper ticket data for each ticket
      const ticketsWithData = mockTickets.map(ticket => ({
        ...ticket,
        ticketData: QRCodeService.createTicketData(
          "EVT-123", // eventId
          "USER-456", // userId
          ticket.type,
          ticket.eventName,
          "John Doe", // attendeeName - in real app this would come from user data
          ticket.price,
          "NGN" // currency
        )
      }));

      setTickets(ticketsWithData);
    };

    initializeTickets();
  }, []);

  const handleDownloadTicket = (ticketId: string) => {
    // In a real app, this would generate and download a PDF
    try {
      // Simulate download process
      console.info(`Downloading ticket ${ticketId}...`);
      // TODO: Implement actual PDF generation and download
      // For now, show a success message
      alert('Ticket download started! (Feature coming soon)');
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const handleShareTicket = (ticketId: string) => {
    // In a real app, this would share the ticket
    try {
      console.info(`Sharing ticket ${ticketId}...`);
      // TODO: Implement actual sharing functionality
      // For now, show a success message
      alert('Share feature coming soon!');
    } catch (error) {
      console.error('Share failed:', error);
      alert('Share failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-8 font-['Space_Grotesk']">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate('/home')}
          className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Purchase Successful!</h1>
          <p className="text-green-400 text-lg">Your tickets are ready</p>
        </div>
        
        <div className="w-24"></div> {/* Spacer for centering */}
      </div>

      {/* Success Message */}
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6 mb-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Payment Confirmed!</h2>
        <p className="text-gray-300">You have successfully purchased {tickets.length} ticket(s)</p>
        <p className="text-green-400 font-semibold">Total: ₦{(tickets.reduce((sum, ticket) => sum + ticket.price, 0)).toLocaleString()}</p>
      </div>

      {/* Tickets */}
      <div className="space-y-6">
        {tickets.map((ticket, index) => (
          <Card key={ticket.id} className="bg-[#2a2a2a] border-gray-700">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Side - Ticket Details */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">{ticket.eventName}</h3>
                      <p className="text-[#FC1924] font-semibold">{ticket.type} Ticket</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-lg">₦{ticket.price.toLocaleString()}</p>
                      <p className="text-gray-400 text-sm">Ticket #{ticket.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-white font-medium">Date</p>
                        <p className="text-gray-400 text-sm">{ticket.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-white font-medium">Time</p>
                        <p className="text-gray-400 text-sm">{ticket.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-white font-medium">Location</p>
                        <p className="text-gray-400 text-sm">{ticket.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-white font-medium">Host</p>
                        <p className="text-gray-400 text-sm">{ticket.host}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      onClick={() => handleDownloadTicket(ticket.id)}
                      className="flex-1 bg-[#FC1924] hover:bg-[#e01620] text-white py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={() => handleShareTicket(ticket.id)}
                      className="flex-1 bg-transparent border border-gray-600 text-white py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-gray-800"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Right Side - QR Code */}
                <div className="flex flex-col items-center justify-center space-y-4">
                  {ticket.ticketData && (
                    <QRCodeDisplay
                      ticketData={ticket.ticketData}
                      options={{
                        width: 128,
                        height: 128,
                        color: {
                          dark: '#000000',
                          light: '#FFFFFF'
                        }
                      }}
                      showDownload={false}
                      showRefresh={false}
                      className="bg-white p-2 rounded-lg"
                    />
                  )}
                  <div className="text-center">
                    <p className="text-white font-semibold">Scan for Entry</p>
                    <p className="text-gray-400 text-sm">Show this QR code at the event</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Button
          onClick={() => navigate('/home')}
          className="flex-1 bg-[#FC1924] hover:bg-[#e01620] text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
        >
          Back to Home
        </Button>
        <Button
          onClick={() => navigate('/my-tickets')}
          className="flex-1 bg-transparent border border-gray-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-gray-800"
        >
          View My Tickets
        </Button>
      </div>

      {/* Additional Info */}
      <div className="mt-8 bg-[#2a2a2a] rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Important Information</h3>
        <div className="space-y-3 text-gray-300">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-[#FC1924] rounded-full mt-2 flex-shrink-0"></div>
            <p>Please arrive 15 minutes before the event starts</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-[#FC1924] rounded-full mt-2 flex-shrink-0"></div>
            <p>Bring a valid ID for verification</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-[#FC1924] rounded-full mt-2 flex-shrink-0"></div>
            <p>You can download or share your tickets anytime</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-[#FC1924] rounded-full mt-2 flex-shrink-0"></div>
            <p>For support, contact us at support@evoke.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 