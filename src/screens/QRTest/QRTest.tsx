import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Settings, Download } from 'lucide-react';
import QRCodeDisplay from '../../components/ui/qr-code-display';
import QRCodeService, { TicketData, QRCodeOptions } from '../../lib/qrCodeService';
import useQRCode from '../../lib/hooks/useQRCode';

interface EventData {
  id: string;
  name: string;
  date: string;
  location: string;
  ticketTypes: Array<{
    name: string;
    type: string;
    price: number;
    description: string;
    quantity: number;
  }>;
}

export const QRTest = (): JSX.Element => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [qrOptions, setQrOptions] = useState<QRCodeOptions>({
    width: 256,
    height: 256,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'M'
  });

  // Form states for generating tickets
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [selectedTicketType, setSelectedTicketType] = useState<string>('');
  const [attendeeName, setAttendeeName] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [showEventForm, setShowEventForm] = useState<boolean>(false);

  const { generateBulkQRCodes, isLoading, error } = useQRCode();

  // Mock events data - in real app this would come from API/database
  const mockEvents: EventData[] = [
    {
      id: "EVT-001",
      name: "Wet & Rave",
      date: "2025-06-12T12:00:00Z",
      location: "252b Ikoroduc cresent Dolphin estate Ikoyi",
      ticketTypes: [
        { name: "Regular", type: "Regular", price: 1000, description: "General admission", quantity: 100 },
        { name: "VIP", type: "VIP", price: 2500, description: "VIP access with perks", quantity: 50 },
        { name: "VVIP", type: "VVIP", price: 5000, description: "Premium experience", quantity: 25 }
      ]
    },
    {
      id: "EVT-002", 
      name: "Summer Festival",
      date: "2025-07-15T18:00:00Z",
      location: "Victoria Island Beach",
      ticketTypes: [
        { name: "Early Bird", type: "Early Bird", price: 800, description: "Limited early access", quantity: 75 },
        { name: "Regular", type: "Regular", price: 1200, description: "General admission", quantity: 200 },
        { name: "Premium", type: "Premium", price: 3000, description: "Premium experience", quantity: 100 }
      ]
    },
    {
      id: "EVT-003",
      name: "Tech Conference 2025",
      date: "2025-08-20T09:00:00Z", 
      location: "Lagos Convention Center",
      ticketTypes: [
        { name: "Student", type: "Student", price: 500, description: "Student discount", quantity: 50 },
        { name: "Regular", type: "Regular", price: 1500, description: "General admission", quantity: 150 },
        { name: "Professional", type: "Professional", price: 2500, description: "Professional access", quantity: 100 }
      ]
    }
  ];

  const addRandomTicket = () => {
    const newTicket = QRCodeService.createTicketData(
      `EVT-${Date.now()}`,
      `USER-${Math.random().toString(36).substring(2, 8)}`,
      ['Regular', 'VIP', 'VVIP'][Math.floor(Math.random() * 3)],
      ['Wet & Rave', 'Summer Festival', 'Tech Conference'][Math.floor(Math.random() * 3)],
      ['John Doe', 'Jane Smith', 'Bob Johnson'][Math.floor(Math.random() * 3)],
      Math.floor(Math.random() * 5000) + 1000,
      'NGN'
    );
    setTickets([...tickets, newTicket]);
  };

  const generateTicketsForEvent = () => {
    if (!selectedEvent || !selectedTicketType || !attendeeName || quantity <= 0) {
      alert('Please fill in all fields');
      return;
    }

    const event = mockEvents.find(e => e.id === selectedEvent);
    const ticketType = event?.ticketTypes.find(t => t.name === selectedTicketType);
    
    if (!event || !ticketType) {
      alert('Invalid event or ticket type');
      return;
    }

    const newTickets: TicketData[] = [];
    
    for (let i = 0; i < quantity; i++) {
      const ticket = QRCodeService.createTicketData(
        event.id,
        `USER-${Math.random().toString(36).substring(2, 8)}`,
        ticketType.type,
        event.name,
        `${attendeeName} ${i + 1 > 1 ? `(${i + 1})` : ''}`,
        ticketType.price,
        'NGN'
      );
      newTickets.push(ticket);
    }

    setTickets([...tickets, ...newTickets]);
    
    // Reset form
    setSelectedTicketType('');
    setAttendeeName('');
    setQuantity(1);
  };

  const removeTicket = (index: number) => {
    setTickets(tickets.filter((_, i) => i !== index));
  };

  const handleBulkDownload = async () => {
    if (tickets.length === 0) return;

    try {
      const qrCodes = await generateBulkQRCodes(tickets, qrOptions);
      
      // Download each QR code
      qrCodes.forEach(({ ticketId, qrCodeDataURL }) => {
        const link = document.createElement('a');
        link.href = qrCodeDataURL;
        link.download = `ticket-${ticketId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    } catch (err) {
      console.error('Bulk download failed:', err);
    }
  };

  const selectedEventData = mockEvents.find(e => e.id === selectedEvent);

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
          <h1 className="text-3xl font-bold text-white">QR Code Generator</h1>
          <p className="text-gray-400">Generate QR codes for tickets and events</p>
        </div>
        
        <div className="w-24"></div>
      </div>

      {/* QR Options */}
      <div className="bg-[#2a2a2a] rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">QR Code Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Width</label>
            <input
              type="number"
              value={qrOptions.width}
              onChange={(e) => setQrOptions({...qrOptions, width: parseInt(e.target.value)})}
              className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Height</label>
            <input
              type="number"
              value={qrOptions.height}
              onChange={(e) => setQrOptions({...qrOptions, height: parseInt(e.target.value)})}
              className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Margin</label>
            <input
              type="number"
              value={qrOptions.margin}
              onChange={(e) => setQrOptions({...qrOptions, margin: parseInt(e.target.value)})}
              className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Error Correction</label>
            <select
              value={qrOptions.errorCorrectionLevel}
              onChange={(e) => setQrOptions({...qrOptions, errorCorrectionLevel: e.target.value as any})}
              className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="L">Low (7%)</option>
              <option value="M">Medium (15%)</option>
              <option value="Q">Quartile (25%)</option>
              <option value="H">High (30%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Event Ticket Generation Form */}
      <div className="bg-[#2a2a2a] rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Generate Event Tickets</h2>
          <button
            onClick={() => setShowEventForm(!showEventForm)}
            className="flex items-center space-x-2 bg-[#FC1924] hover:bg-[#e01620] text-white px-3 py-2 rounded-lg transition-all duration-300"
          >
            <Settings className="w-4 h-4" />
            <span>{showEventForm ? 'Hide' : 'Show'} Form</span>
          </button>
        </div>

        {showEventForm && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Select Event</label>
              <select
                value={selectedEvent}
                onChange={(e) => {
                  setSelectedEvent(e.target.value);
                  setSelectedTicketType('');
                }}
                className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="">Choose an event</option>
                {mockEvents.map(event => (
                  <option key={event.id} value={event.id}>
                    {event.name} - {new Date(event.date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Ticket Type</label>
              <select
                value={selectedTicketType}
                onChange={(e) => setSelectedTicketType(e.target.value)}
                disabled={!selectedEvent}
                className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-3 py-2 text-white disabled:opacity-50"
              >
                <option value="">Select ticket type</option>
                {selectedEventData?.ticketTypes.map(ticketType => (
                  <option key={ticketType.name} value={ticketType.name}>
                    {ticketType.name} - ₦{ticketType.price.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Attendee Name</label>
              <input
                type="text"
                value={attendeeName}
                onChange={(e) => setAttendeeName(e.target.value)}
                placeholder="Enter attendee name"
                className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                min="1"
                max="10"
                className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={generateTicketsForEvent}
                disabled={!selectedEvent || !selectedTicketType || !attendeeName || quantity <= 0}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all duration-300"
              >
                Generate Tickets
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex space-x-4 mt-4">
          <button
            onClick={addRandomTicket}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            <span>Add Random Ticket</span>
          </button>
          
          <button
            onClick={handleBulkDownload}
            disabled={tickets.length === 0 || isLoading}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>Download All ({tickets.length})</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-8">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket, index) => (
          <div key={ticket.ticketId} className="bg-[#2a2a2a] rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{ticket.eventName}</h3>
                <p className="text-[#FC1924] font-semibold">{ticket.ticketType}</p>
              </div>
              <button
                onClick={() => removeTicket(index)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <QRCodeDisplay
              ticketData={ticket}
              options={qrOptions}
              showDownload={true}
              showRefresh={true}
              className="mb-4"
            />
            
            <div className="text-sm text-gray-400 space-y-1">
              <p>ID: {ticket.ticketId}</p>
              <p>Attendee: {ticket.attendeeName}</p>
              <p>Price: ₦{ticket.price.toLocaleString()}</p>
              <p>Date: {new Date(ticket.purchaseDate).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>

      {tickets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No tickets generated yet. Use the form above to create tickets for events.</p>
        </div>
      )}
    </div>
  );
}; 