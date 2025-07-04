import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CreditCard, Calendar, MapPin, Clock, Users, Check, Plus, Minus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { FullScreenLoading, ButtonLoading } from "../../components/ui/loading";

interface TicketType {
  name: string;
  price: number;
  description: string;
  available: number;
}

interface EventData {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  image: string;
  host: string;
  ticketTypes: TicketType[];
}

export const TicketPurchase = (): JSX.Element => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const [currentStep, setCurrentStep] = useState<'tickets' | 'payment' | 'success'>('tickets');
  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>({});
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    email: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [event, setEvent] = useState<EventData | null>(null);

  useEffect(() => {
    const mockEvent: EventData = {
      id: eventId || '1',
      title: "Wet & Rave",
      location: "252b Ikoroduc cresent Dolphin estate Ikoyi",
      date: "12th Of June 2025",
      time: "12 noon - Till mama calls",
      image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600",
      host: "Freezy Kee",
      ticketTypes: [
        { name: "Regular", price: 500, description: "Standard entry", available: 50 },
        { name: "VIP", price: 1000, description: "Premium experience", available: 25 },
        { name: "Premium", price: 1500, description: "Ultimate experience", available: 10 }
      ]
    };
    setEvent(mockEvent);
  }, [eventId]);

  const updateTicketQuantity = (ticketType: string, quantity: number) => {
    setSelectedTickets(prev => ({
      ...prev,
      [ticketType]: Math.max(0, quantity)
    }));
  };

  const getTotalQuantity = () => {
    return Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalPrice = () => {
    if (!event) return 0;
    return event.ticketTypes.reduce((total, ticketType) => {
      const quantity = selectedTickets[ticketType.name] || 0;
      return total + (ticketType.price * quantity);
    }, 0);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setCurrentStep('success');
  };

  const handleInputChange = (field: keyof typeof paymentData, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  if (!event) {
    return <FullScreenLoading text="Loading event details..." />;
  }

  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="bg-[#2a2a2a] rounded-2xl p-12 max-w-md w-full text-center animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
          <p className="text-green-400 text-xl mb-8">Your tickets are confirmed</p>
          
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/ticket-success')}
              className="w-full bg-[#FC1924] hover:bg-[#e01620] text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              View Tickets
            </button>
            <button 
              onClick={() => navigate('/home')}
              className="w-full bg-transparent border border-gray-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-gray-800"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-8 font-['Space_Grotesk']">
      <div className="flex items-center space-x-4 mb-8">
        <button 
          onClick={() => navigate('/home')}
          className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Events</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="bg-[#2a2a2a] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-24 h-24 bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${event.image})` }}></div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{event.title}</h2>
                  <div className="space-y-2 text-gray-300">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Hosted by {event.host}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {currentStep === 'tickets' && (
            <Card className="bg-[#2a2a2a] border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Select Tickets</h3>
                <div className="space-y-4">
                  {event.ticketTypes.map((ticketType) => (
                    <div key={ticketType.name} className="border border-gray-600 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{ticketType.name}</h4>
                          <p className="text-gray-400 text-sm">{ticketType.description}</p>
                          <p className="text-[#FC1924] font-bold text-lg">₦{ticketType.price.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-sm">{ticketType.available} available</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <button
                              onClick={() => updateTicketQuantity(ticketType.name, (selectedTickets[ticketType.name] || 0) - 1)}
                              className="w-8 h-8 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center text-white transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-white font-semibold w-8 text-center">
                              {selectedTickets[ticketType.name] || 0}
                            </span>
                            <button
                              onClick={() => updateTicketQuantity(ticketType.name, (selectedTickets[ticketType.name] || 0) + 1)}
                              disabled={(selectedTickets[ticketType.name] || 0) >= ticketType.available}
                              className="w-8 h-8 bg-[#FC1924] hover:bg-[#e01620] disabled:bg-gray-600 rounded-full flex items-center justify-center text-white transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 'payment' && (
            <Card className="bg-[#2a2a2a] border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Payment Information</span>
                </h3>
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Card Number</label>
                    <Input
                      type="text"
                      value={paymentData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      className="bg-[#1a1a1a] border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Expiry Date</label>
                      <Input
                        type="text"
                        value={paymentData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        placeholder="MM/YY"
                        className="bg-[#1a1a1a] border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">CVV</label>
                      <Input
                        type="text"
                        value={paymentData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        placeholder="123"
                        className="bg-[#1a1a1a] border-gray-600 text-white"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Cardholder Name</label>
                    <Input
                      type="text"
                      value={paymentData.cardName}
                      onChange={(e) => handleInputChange('cardName', e.target.value)}
                      placeholder="John Doe"
                      className="bg-[#1a1a1a] border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      value={paymentData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john@example.com"
                      className="bg-[#1a1a1a] border-gray-600 text-white"
                      required
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="bg-[#2a2a2a] border-gray-700 sticky top-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                {event.ticketTypes.map((ticketType) => {
                  const quantity = selectedTickets[ticketType.name] || 0;
                  if (quantity === 0) return null;
                  return (
                    <div key={ticketType.name} className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">{ticketType.name}</p>
                        <p className="text-gray-400 text-sm">Qty: {quantity}</p>
                      </div>
                      <p className="text-white font-semibold">₦{(ticketType.price * quantity).toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-600 pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Subtotal</span>
                  <span className="text-white font-semibold">₦{getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Service Fee</span>
                  <span className="text-white font-semibold">₦{(getTotalPrice() * 0.05).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-[#FC1924]">₦{(getTotalPrice() * 1.05).toLocaleString()}</span>
                </div>
              </div>

              {currentStep === 'tickets' && (
                <Button
                  onClick={() => setCurrentStep('payment')}
                  disabled={getTotalQuantity() === 0}
                  className="w-full mt-6 bg-[#FC1924] hover:bg-[#e01620] text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  Continue to Payment
                </Button>
              )}

              {currentStep === 'payment' && (
                <Button
                  onClick={handlePaymentSubmit}
                  disabled={isProcessing}
                  className="w-full mt-6 bg-[#FC1924] hover:bg-[#e01620] text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <ButtonLoading />
                  ) : (
                    `Pay ₦${(getTotalPrice() * 1.05).toLocaleString()}`
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 