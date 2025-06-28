import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  Ticket, 
  Users, 
  DollarSign, 
  TrendingUp,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Download,
  Share,
  Star,
  Eye,
  Edit,
  BarChart3,
  UserPlus,
  Settings,
  Camera,
  Badge,
  Trophy,
  Heart
} from "lucide-react";
import { Sidebar } from "../../components/ui/sidebar";

export const Profile = (): JSX.Element | null => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'tickets' | 'events' | 'management'>('overview');
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);
  const [currentUsedTicketIndex, setCurrentUsedTicketIndex] = useState(0);

  // Mock user data
  const userData = {
    name: "Solomon Adebayo",
    bio: "Event enthusiast & community builder",
    location: "Lagos, Nigeria",
    profileImage: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
    stats: {
      eventsAttended: 24,
      eventsHosted: 8,
      ticketsPurchased: 32,
      revenueGenerated: 2450000
    },
    badges: ["Early Adopter", "Community Builder", "Top Host"]
  };

  // Mock event management data
  const managementStats = [
    { label: "Events Listed", value: "12", color: "from-blue-500 to-cyan-500" },
    { label: "Tickets Sold", value: "2,940", color: "from-green-500 to-emerald-500" },
    { label: "Revenue", value: "₦24.5m", color: "from-purple-500 to-pink-500" },
    { label: "Active Events", value: "3", color: "from-orange-500 to-red-500" }
  ];

  const managedEvents = [
    {
      id: 1,
      name: "Afrobeat Night",
      date: "5th June",
      image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300",
      ticketsAvailable: 1000,
      ticketsSold: 450,
      status: "Active",
      statusColor: "bg-green-500"
    },
    {
      id: 2,
      name: "Wet & Rave",
      date: "5th June",
      image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300",
      ticketsAvailable: 1000,
      ticketsSold: 650,
      status: "Ended",
      statusColor: "bg-gray-500"
    },
    {
      id: 3,
      name: "Saturday Night",
      date: "5th June",
      image: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300",
      ticketsAvailable: 1000,
      ticketsSold: 0,
      status: "Cancelled",
      statusColor: "bg-red-500"
    },
    {
      id: 4,
      name: "Rave & Splash",
      date: "5th June",
      image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300",
      ticketsAvailable: 1000,
      ticketsSold: 450,
      status: "Draft",
      statusColor: "bg-orange-500"
    }
  ];

  // Mock tickets data
  const activeTickets = [
    {
      id: 1,
      eventName: "Wet & Rave",
      date: "May 24 2025",
      time: "9:00 am",
      location: "1 Agulyi Ironsi St, Malta...",
      quantity: 1,
      price: 500,
      qrCode: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSIyMCIgeT0iMjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iYmxhY2siLz4KPHJlY3QgeD0iNjAiIHk9IjIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9ImJsYWNrIi8+CjxyZWN0IHg9IjEwMCIgeT0iMjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iYmxhY2siLz4KPHJlY3QgeD0iMTQwIiB5PSIyMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJibGFjayIvPgo8cmVjdCB4PSIxODAiIHk9IjIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9ImJsYWNrIi8+CjxyZWN0IHg9IjIwIiB5PSI2MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJibGFjayIvPgo8cmVjdCB4PSI4MCIgeT0iNjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iYmxhY2siLz4KPHJlY3QgeD0iMTIwIiB5PSI2MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJibGFjayIvPgo8cmVjdCB4PSIxODAiIHk9IjYwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo="
    }
  ];

  const usedTickets = [
    {
      id: 2,
      eventName: "Wet & Rave",
      date: "May 24 2025",
      time: "9:00 am",
      location: "1 Agulyi Ironsi St, Malta...",
      quantity: 1,
      price: 500,
      status: "USED",
      qrCode: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSIyMCIgeT0iMjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iYmxhY2siLz4KPHJlY3QgeD0iNjAiIHk9IjIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9ImJsYWNrIi8+CjxyZWN0IHg9IjEwMCIgeT0iMjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iYmxhY2siLz4KPHJlY3QgeD0iMTQwIiB5PSIyMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJibGFjayIvPgo8cmVjdCB4PSIxODAiIHk9IjIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9ImJsYWNrIi8+CjxyZWN0IHg9IjIwIiB5PSI2MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJibGFjayIvPgo8cmVjdCB4PSI4MCIgeT0iNjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iYmxhY2siLz4KPHJlY3QgeD0iMTIwIiB5PSI2MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJibGFjayIvPgo8cmVjdCB4PSIxODAiIHk9IjYwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo="
    }
  ];

  const attendedEvents = [
    {
      id: 1,
      name: "Summer Vibes Festival",
      date: "June 15, 2024",
      ticketType: "VIP",
      rating: 5,
      image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300"
    },
    {
      id: 2,
      name: "Tech Conference 2024",
      date: "May 20, 2024",
      ticketType: "Regular",
      rating: 4,
      image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300"
    }
  ];

  const upcomingEvents = [
    {
      id: 3,
      name: "Wet & Rave",
      date: "July 10, 2024",
      countdown: "15 days",
      image: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300"
    }
  ];

  const handleBackToHome = () => {
    navigate('/home');
  };

  const handleEventManagement = () => {
    navigate('/event-management');
  };

  const nextTicket = () => {
    setCurrentTicketIndex((prev) => (prev + 1) % activeTickets.length);
  };

  const prevTicket = () => {
    setCurrentTicketIndex((prev) => (prev - 1 + activeTickets.length) % activeTickets.length);
  };

  const nextUsedTicket = () => {
    setCurrentUsedTicketIndex((prev) => (prev + 1) % usedTickets.length);
  };

  const prevUsedTicket = () => {
    setCurrentUsedTicketIndex((prev) => (prev - 1 + usedTickets.length) % usedTickets.length);
  };

  // Profile Overview Tab
  if (activeTab === 'overview') {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex relative overflow-hidden font-['Space_Grotesk']">
        <Sidebar currentPath="/profile" />

        <div className="flex-1 ml-20 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <button 
              onClick={handleBackToHome}
              className="flex items-center space-x-2 mb-8 text-white/80 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>

            {/* Profile Header */}
            <div className="bg-[#2a2a2a] rounded-2xl p-8 mb-8 animate-fade-in">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img 
                      src={userData.profileImage} 
                      alt={userData.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-[#FC1924]"
                    />
                    <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#FC1924] rounded-full flex items-center justify-center hover:bg-[#e01620] transition-colors duration-200">
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{userData.name}</h1>
                    <p className="text-gray-400 mb-2">{userData.bio}</p>
                    <div className="flex items-center space-x-2 text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{userData.location}</span>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      {userData.badges.map((badge, index) => (
                        <span key={index} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button className="bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white animate-slide-up">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Events Attended</p>
                    <p className="text-3xl font-bold">{userData.stats.eventsAttended}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-200" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-6 text-white animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Events Hosted</p>
                    <p className="text-3xl font-bold">{userData.stats.eventsHosted}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-200" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Tickets Purchased</p>
                    <p className="text-3xl font-bold">{userData.stats.ticketsPurchased}</p>
                  </div>
                  <Ticket className="w-8 h-8 text-purple-200" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Revenue Generated</p>
                    <p className="text-3xl font-bold">₦{(userData.stats.revenueGenerated / 1000000).toFixed(1)}M</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-orange-200" />
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-1 mb-8 bg-[#2a2a2a] rounded-xl p-2">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'overview' 
                    ? 'bg-[#FC1924] text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
                }`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('tickets')}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'tickets' 
                    ? 'bg-[#FC1924] text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
                }`}
              >
                My Tickets
              </button>
              <button 
                onClick={() => setActiveTab('events')}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'events' 
                    ? 'bg-[#FC1924] text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
                }`}
              >
                My Events
              </button>
              <button 
                onClick={() => setActiveTab('management')}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'management' 
                    ? 'bg-[#FC1924] text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
                }`}
              >
                Event Management
              </button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#2a2a2a] rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Upcoming Events</h3>
                {upcomingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-center space-x-4 bg-[#3a3a3a] rounded-lg p-4">
                        <img src={event.image} alt={event.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1">
                          <h4 className="text-white font-semibold">{event.name}</h4>
                          <p className="text-gray-400 text-sm">{event.date}</p>
                          <p className="text-[#FC1924] text-sm font-medium">{event.countdown} to go</p>
                        </div>
                        <button className="bg-[#FC1924] hover:bg-[#e01620] text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105">
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No upcoming events</p>
                )}
              </div>

              <div className="bg-[#2a2a2a] rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Ticket className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-sm">Purchased ticket for Wet & Rave</p>
                      <p className="text-gray-400 text-xs">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-sm">Rated Summer Vibes Festival</p>
                      <p className="text-gray-400 text-xs">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-sm">Created Afrobeat Night event</p>
                      <p className="text-gray-400 text-xs">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // My Tickets Tab
  if (activeTab === 'tickets') {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex relative overflow-hidden font-['Space_Grotesk']">
        <Sidebar currentPath="/profile" />

        <div className="flex-1 ml-20 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold text-white">Ticket Bucket</h1>
              <div className="flex space-x-1 bg-[#2a2a2a] rounded-xl p-2">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className="py-3 px-6 rounded-lg font-semibold transition-all duration-300 text-gray-400 hover:text-white hover:bg-[#3a3a3a]"
                >
                  Overview
                </button>
                <button 
                  onClick={() => navigate('/my-tickets')}
                  className="flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 text-gray-400 hover:text-white hover:bg-[#3a3a3a]"
                >
                  My Tickets
                </button>
                <button 
                  onClick={() => setActiveTab('events')}
                  className="py-3 px-6 rounded-lg font-semibold transition-all duration-300 text-gray-400 hover:text-white hover:bg-[#3a3a3a]"
                >
                  My Events
                </button>
                <button 
                  onClick={() => setActiveTab('management')}
                  className="py-3 px-6 rounded-lg font-semibold transition-all duration-300 text-gray-400 hover:text-white hover:bg-[#3a3a3a]"
                >
                  Event Management
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Active Tickets */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Active Tickets</h2>
                <div className="relative">
                  {activeTickets.length > 0 ? (
                    <div className="bg-white rounded-2xl p-6 shadow-xl animate-fade-in">
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{activeTickets[currentTicketIndex].eventName}</h3>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <Calendar className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-700">{activeTickets[currentTicketIndex].date}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Clock className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-700">{activeTickets[currentTicketIndex].time}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <MapPin className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-700">{activeTickets[currentTicketIndex].location}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Ticket className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-700">{activeTickets[currentTicketIndex].quantity} Ticket</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-100 border-t-2 border-dashed border-green-300 p-4 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900">Total Price:</span>
                          <span className="font-bold text-xl text-gray-900">₦{activeTickets[currentTicketIndex].price}</span>
                        </div>
                      </div>

                      <div className="flex justify-center mb-6">
                        <img 
                          src={activeTickets[currentTicketIndex].qrCode} 
                          alt="QR Code" 
                          className="w-32 h-32"
                        />
                      </div>

                      <div className="text-center text-sm text-gray-600">
                        <p>Check your email <span className="text-blue-600">solomonadebayo@gmail.com</span></p>
                        <p>for more info about the event in other to know how to get there</p>
                        <p className="font-semibold mt-2">Invite friends</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#2a2a2a] rounded-2xl p-8 text-center">
                      <Ticket className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No active tickets</p>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  {activeTickets.length > 1 && (
                    <div className="flex justify-center space-x-4 mt-6">
                      <button 
                        onClick={prevTicket}
                        className="w-12 h-12 bg-[#FC1924] hover:bg-[#e01620] rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={nextTicket}
                        className="w-12 h-12 bg-[#FC1924] hover:bg-[#e01620] rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Used Tickets */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Used Tickets</h2>
                <div className="relative">
                  {usedTickets.length > 0 ? (
                    <div className="bg-gray-400 rounded-2xl p-6 shadow-xl animate-fade-in relative">
                      <div className="absolute inset-0 bg-gray-600 bg-opacity-50 rounded-2xl"></div>
                      <div className="relative z-10">
                        <div className="mb-6">
                          <h3 className="text-2xl font-bold text-gray-900 mb-4">{usedTickets[currentUsedTicketIndex].eventName}</h3>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <Calendar className="w-5 h-5 text-gray-700" />
                              <span className="text-gray-800">{usedTickets[currentUsedTicketIndex].date}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Clock className="w-5 h-5 text-gray-700" />
                              <span className="text-gray-800">{usedTickets[currentUsedTicketIndex].time}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <MapPin className="w-5 h-5 text-gray-700" />
                              <span className="text-gray-800">{usedTickets[currentUsedTicketIndex].location}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Ticket className="w-5 h-5 text-gray-700" />
                              <span className="text-gray-800">{usedTickets[currentUsedTicketIndex].quantity} Ticket</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-300 border-t-2 border-dashed border-gray-500 p-4 mb-6">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-900">Total Price:</span>
                            <span className="font-bold text-xl text-gray-900">{usedTickets[currentUsedTicketIndex].status}</span>
                          </div>
                        </div>

                        <div className="flex justify-center mb-6 relative">
                          <img 
                            src={usedTickets[currentUsedTicketIndex].qrCode} 
                            alt="QR Code" 
                            className="w-32 h-32 opacity-50"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[#FC1924] text-4xl font-bold transform -rotate-45">Used</span>
                          </div>
                        </div>

                        <div className="text-center text-sm text-gray-700">
                          <p>Check your email <span className="text-blue-700">solomonadebayo@gmail.com</span></p>
                          <p>for more info about the event in other to know how to get there</p>
                          <p className="font-semibold mt-2">Invite friends</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#2a2a2a] rounded-2xl p-8 text-center">
                      <Ticket className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No used tickets</p>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  {usedTickets.length > 1 && (
                    <div className="flex justify-center space-x-4 mt-6">
                      <button 
                        onClick={prevUsedTicket}
                        className="w-12 h-12 bg-[#FC1924] hover:bg-[#e01620] rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={nextUsedTicket}
                        className="w-12 h-12 bg-[#FC1924] hover:bg-[#e01620] rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // My Events Tab
  if (activeTab === 'events') {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex relative overflow-hidden font-['Space_Grotesk']">
        <Sidebar currentPath="/profile" />

        <div className="flex-1 ml-20 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold text-white">My Events</h1>
              <div className="flex space-x-1 bg-[#2a2a2a] rounded-xl p-2">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className="py-3 px-6 rounded-lg font-semibold transition-all duration-300 text-gray-400 hover:text-white hover:bg-[#3a3a3a]"
                >
                  Overview
                </button>
                <button 
                  onClick={() => setActiveTab('tickets')}
                  className="py-3 px-6 rounded-lg font-semibold transition-all duration-300 text-gray-400 hover:text-white hover:bg-[#3a3a3a]"
                >
                  My Tickets
                </button>
                <button 
                  onClick={() => setActiveTab('events')}
                  className="py-3 px-6 rounded-lg font-semibold transition-all duration-300 bg-[#FC1924] text-white"
                >
                  My Events
                </button>
                <button 
                  onClick={() => setActiveTab('management')}
                  className="py-3 px-6 rounded-lg font-semibold transition-all duration-300 text-gray-400 hover:text-white hover:bg-[#3a3a3a]"
                >
                  Event Management
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Past Events */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Past Events Attended</h2>
                <div className="space-y-4">
                  {attendedEvents.map((event) => (
                    <div key={event.id} className="bg-[#2a2a2a] rounded-xl p-6 animate-fade-in">
                      <div className="flex items-center space-x-4">
                        <img src={event.image} alt={event.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{event.name}</h3>
                          <p className="text-gray-400 text-sm">{event.date}</p>
                          <p className="text-gray-500 text-sm">Ticket: {event.ticketType}</p>
                          <div className="flex items-center space-x-1 mt-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < event.rating ? 'text-yellow-500 fill-current' : 'text-gray-600'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button className="bg-[#FC1924] hover:bg-[#e01620] text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 text-sm">
                            Review
                          </button>
                          <button className="bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 text-sm">
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Events */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Upcoming Events</h2>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="bg-[#2a2a2a] rounded-xl p-6 animate-fade-in">
                      <div className="flex items-center space-x-4">
                        <img src={event.image} alt={event.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{event.name}</h3>
                          <p className="text-gray-400 text-sm">{event.date}</p>
                          <p className="text-[#FC1924] text-sm font-medium">{event.countdown} to go</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button className="bg-[#FC1924] hover:bg-[#e01620] text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 text-sm">
                            Remind Me
                          </button>
                          <button className="bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 text-sm">
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Event Management Tab
  if (activeTab === 'management') {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex relative overflow-hidden font-['Space_Grotesk']">
        <Sidebar currentPath="/profile" />

        <div className="flex-1 ml-20 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold text-white">Event Management</h1>
              <div className="flex space-x-1 bg-[#2a2a2a] rounded-xl p-2">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className="py-3 px-6 rounded-lg font-semibold transition-all duration-300 text-gray-400 hover:text-white hover:bg-[#3a3a3a]"
                >
                  Overview
                </button>
                <button 
                  onClick={() => setActiveTab('tickets')}
                  className="py-3 px-6 rounded-lg font-semibold transition-all duration-300 text-gray-400 hover:text-white hover:bg-[#3a3a3a]"
                >
                  My Tickets
                </button>
                <button 
                  onClick={() => setActiveTab('events')}
                  className="py-3 px-6 rounded-lg font-semibold transition-all duration-300 text-gray-400 hover:text-white hover:bg-[#3a3a3a]"
                >
                  My Events
                </button>
                <button 
                  onClick={() => setActiveTab('management')}
                  className="py-3 px-6 rounded-lg font-semibold transition-all duration-300 bg-[#FC1924] text-white"
                >
                  Event Management
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {managementStats.map((stat, index) => (
                <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white animate-slide-up cursor-pointer hover:scale-105 transition-transform duration-300`} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="text-center">
                    <p className="text-3xl font-bold mb-2">{stat.value}</p>
                    <p className="text-sm opacity-90">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Filters and Search */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex-1 min-w-64 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search by event name"
                  className="w-full pl-10 pr-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                />
              </div>
              <select className="bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200">
                <option value="">Status</option>
                <option value="active">Active</option>
                <option value="ended">Ended</option>
                <option value="cancelled">Cancelled</option>
                <option value="draft">Draft</option>
              </select>
              <select className="bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200">
                <option value="">Sort By</option>
                <option value="date">Date</option>
                <option value="sales">Sales</option>
                <option value="revenue">Revenue</option>
              </select>
            </div>

            {/* Events List */}
            <div className="bg-[#2a2a2a] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Events</h2>
                <button className="text-[#FC1924] hover:text-[#e01620] font-semibold transition-colors duration-200">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {managedEvents.map((event, index) => (
                  <div key={event.id} className="bg-[#3a3a3a] rounded-xl p-4 hover:bg-[#4a4a4a] transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-center space-x-4">
                      <img src={event.image} alt={event.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-white font-semibold">{event.name}</h3>
                          <span className={`${event.statusColor} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                            {event.status}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">Date: {event.date}</p>
                        <div className="flex items-center space-x-6 text-sm">
                          <span className="text-gray-300">Tickets Available: {event.ticketsAvailable}</span>
                          <span className="text-gray-300">Tickets Sold: {event.ticketsSold}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 h-2 bg-gray-600 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#FC1924] rounded-full transition-all duration-500"
                                style={{ width: `${(event.ticketsSold / event.ticketsAvailable) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-[#FC1924] font-medium">{Math.round((event.ticketsSold / event.ticketsAvailable) * 100)}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-[#FC1924] hover:bg-[#e01620] text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 text-sm">
                          View
                        </button>
                        <button className="bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white p-2 rounded-lg transition-all duration-300 hover:scale-105">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white p-2 rounded-lg transition-all duration-300 hover:scale-105">
                          <BarChart3 className="w-4 h-4" />
                        </button>
                        <button className="bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white p-2 rounded-lg transition-all duration-300 hover:scale-105">
                          <Share className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-8">
                <span className="text-gray-400 text-sm">Page 1 of 4</span>
                <button className="bg-[#FC1924] hover:bg-[#e01620] text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105">
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};