import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Share2, QrCode, Calendar, MapPin, Clock, Users, Send, Eye, Filter } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

interface Ticket {
  id: string;
  eventName: string;
  date: string;
  time: string;
  location: string;
  host: string;
  qrCode: string;
  price: number;
  type: string;
  status: 'Active' | 'Used' | 'Transferred';
  transferable: boolean;
}

export const MyTickets = (): JSX.Element => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'used' | 'transferred'>('all');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [transferEmail, setTransferEmail] = useState('');
  const [transferMessage, setTransferMessage] = useState('');

  const tickets: Ticket[] = [
    {
      id: "TKT-001",
      eventName: "Wet & Rave",
      date: "12th Of June 2025",
      time: "12 noon - Till mama calls",
      location: "252b Ikoroduc cresent Dolphin estate Ikoyi",
      host: "Freezy Kee",
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TKT-001",
      price: 1000,
      type: "VIP",
      status: "Active",
      transferable: true
    },
    {
      id: "TKT-002",
      eventName: "Summer Vibes Festival",
      date: "15th July 2025",
      time: "8:00 PM - 2:00 AM",
      location: "Beach Resort, Lagos",
      host: "DJ Splash",
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TKT-002",
      price: 500,
      type: "Regular",
      status: "Used",
      transferable: false
    },
    {
      id: "TKT-003",
      eventName: "Tech Conference 2025",
      date: "20th August 2025",
      time: "9:00 AM - 6:00 PM",
      location: "Convention Center, Abuja",
      host: "Tech Events Ltd",
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TKT-003",
      price: 2000,
      type: "Premium",
      status: "Active",
      transferable: true
    }
  ];

  const filteredTickets = tickets.filter(ticket => {
    if (activeFilter === 'all') return true;
    return ticket.status.toLowerCase() === activeFilter;
  });

  const handleDownloadTicket = (ticketId: string) => {
    // In a real app, this would generate and download a PDF
    try {
      console.info(`Downloading ticket ${ticketId}...`);
      // TODO: Implement actual PDF generation and download
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
      alert('Share feature coming soon!');
    } catch (error) {
      console.error('Share failed:', error);
      alert('Share failed. Please try again.');
    }
  };

  const handleTransferTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowTransferModal(true);
  };

  const handleTransferSubmit = async () => {
    if (!selectedTicket || !transferEmail.trim()) return;

    // Simulate transfer process
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would call the API to transfer the ticket
      console.info(`Transferring ticket ${selectedTicket.id} to ${transferEmail}`);
      
      // Show success message
      alert(`Ticket successfully transferred to ${transferEmail}!`);
      
      setShowTransferModal(false);
      setSelectedTicket(null);
      setTransferEmail('');
      setTransferMessage('');
    } catch (error) {
      console.error('Transfer failed:', error);
      alert('Transfer failed. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500';
      case 'Used':
        return 'bg-gray-500';
      case 'Transferred':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
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
          <h1 className="text-3xl font-bold text-white">My Tickets</h1>
          <p className="text-gray-400">Manage and view all your tickets</p>
        </div>
        
        <div className="w-24"></div> {/* Spacer for centering */}
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-8">
        {[
          { key: 'all', label: 'All Tickets', count: tickets.length },
          { key: 'active', label: 'Active', count: tickets.filter(t => t.status === 'Active').length },
          { key: 'used', label: 'Used', count: tickets.filter(t => t.status === 'Used').length },
          { key: 'transferred', label: 'Transferred', count: tickets.filter(t => t.status === 'Transferred').length }
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeFilter === filter.key
                ? 'bg-[#FC1924] text-white'
                : 'bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
            }`}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="bg-[#2a2a2a] border-gray-700 hover:border-gray-600 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{ticket.eventName}</h3>
                  <p className="text-[#FC1924] font-semibold">{ticket.type} Ticket</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>{ticket.date}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>{ticket.time}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{ticket.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Users className="w-4 h-4" />
                  <span>Hosted by {ticket.host}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <p className="text-white font-bold text-lg">₦{ticket.price.toLocaleString()}</p>
                <p className="text-gray-400 text-sm">Ticket #{ticket.id}</p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-4">
                <div className="bg-white p-2 rounded-lg">
                  <img 
                    src={ticket.qrCode} 
                    alt="QR Code" 
                    className="w-24 h-24"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleDownloadTicket(ticket.id)}
                  className="flex-1 bg-[#FC1924] hover:bg-[#e01620] text-white py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                
                <Button
                  onClick={() => handleShareTicket(ticket.id)}
                  className="flex-1 bg-transparent border border-gray-600 text-white py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-gray-800"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>

              {/* Transfer Button (only for active tickets) */}
              {ticket.status === 'Active' && ticket.transferable && (
                <Button
                  onClick={() => handleTransferTicket(ticket)}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  <Send className="w-4 h-4 mr-1" />
                  Transfer Ticket
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transfer Modal */}
      {showTransferModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#2a2a2a] rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-white mb-4">Transfer Ticket</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Recipient Email</label>
                <Input
                  type="email"
                  value={transferEmail}
                  onChange={(e) => setTransferEmail(e.target.value)}
                  placeholder="Enter recipient's email"
                  className="bg-[#1a1a1a] border-gray-600 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Message (Optional)</label>
                <textarea
                  value={transferMessage}
                  onChange={(e) => setTransferMessage(e.target.value)}
                  placeholder="Add a personal message..."
                  className="w-full bg-[#1a1a1a] border border-gray-600 text-white rounded-lg p-3 resize-none"
                  rows={3}
                />
              </div>

              <div className="bg-[#1a1a1a] p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Ticket Details</h3>
                <p className="text-gray-300 text-sm">{selectedTicket.eventName}</p>
                <p className="text-gray-300 text-sm">{selectedTicket.date} at {selectedTicket.time}</p>
                <p className="text-[#FC1924] font-semibold">₦{selectedTicket.price.toLocaleString()}</p>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <p className="text-yellow-300 text-sm">
                  ⚠️ Once transferred, you will lose access to this ticket. This action is irreversible.
                </p>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button
                onClick={() => setShowTransferModal(false)}
                className="flex-1 bg-transparent border border-gray-600 text-white py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleTransferSubmit}
                disabled={!transferEmail.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Confirm Transfer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 