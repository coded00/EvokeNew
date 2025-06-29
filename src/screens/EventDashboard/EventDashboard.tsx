import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Users, 
  Ticket, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Clock,
  QrCode,
  Download,
  Edit,
  Share,
  Bell,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  BarChart3,
  Settings,
  Eye,
  EyeOff,
  Activity,
  Target,
  Zap,
  Award
} from "lucide-react";
import { Sidebar } from "../../components/ui/sidebar";

interface Attendee {
  id: string;
  name: string;
  email: string;
  ticketType: string;
  purchaseDate: string;
  checkInStatus: 'checked-in' | 'not-checked-in' | 'cancelled';
  checkInTime?: string;
  amount: number;
}

interface TicketType {
  name: string;
  price: number;
  sold: number;
  total: number;
  revenue: number;
}

interface EventStats {
  totalAttendees: number;
  checkedIn: number;
  totalRevenue: number;
  ticketsSold: number;
  totalCapacity: number;
  checkInRate: number;
}

export const EventDashboard = (): JSX.Element => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showQRCode, setShowQRCode] = useState(false);
  const [isLive, setIsLive] = useState(true);

  // Mock data - in real app this would come from API
  const eventData = {
    id: eventId || '1',
    name: 'Wet & Wild Summer Party',
    date: '2025-06-15',
    time: '8:00 PM',
    location: '252b Ikoroduc cresent Dolphin estate Ikoyi',
    status: 'active',
    capacity: 500,
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800'
  };

  const stats: EventStats = {
    totalAttendees: 342,
    checkedIn: 287,
    totalRevenue: 2850000,
    ticketsSold: 342,
    totalCapacity: 500,
    checkInRate: 84
  };

  const ticketTypes: TicketType[] = [
    { name: 'Regular', price: 5000, sold: 200, total: 300, revenue: 1000000 },
    { name: 'VIP', price: 10000, sold: 100, total: 150, revenue: 1000000 },
    { name: 'Premium', price: 15000, sold: 42, total: 50, revenue: 630000 }
  ];

  const attendees: Attendee[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', ticketType: 'VIP', purchaseDate: '2025-01-10', checkInStatus: 'checked-in', checkInTime: '2025-06-15 19:30', amount: 10000 },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', ticketType: 'Regular', purchaseDate: '2025-01-12', checkInStatus: 'checked-in', checkInTime: '2025-06-15 20:15', amount: 5000 },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', ticketType: 'Premium', purchaseDate: '2025-01-15', checkInStatus: 'not-checked-in', amount: 15000 },
    { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', ticketType: 'Regular', purchaseDate: '2025-01-18', checkInStatus: 'cancelled', amount: 5000 },
    { id: '5', name: 'David Brown', email: 'david@example.com', ticketType: 'VIP', purchaseDate: '2025-01-20', checkInStatus: 'checked-in', checkInTime: '2025-06-15 21:00', amount: 10000 }
  ];

  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attendee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || attendee.checkInStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked-in': return 'text-green-500 bg-green-100';
      case 'not-checked-in': return 'text-yellow-500 bg-yellow-100';
      case 'cancelled': return 'text-red-500 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'checked-in': return <CheckCircle className="w-4 h-4" />;
      case 'not-checked-in': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] flex relative overflow-hidden font-['Space_Grotesk']">
      <Sidebar currentPath="/event-dashboard" />

      {/* Main Content */}
      <div className="flex-1 ml-20 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => navigate(`/event-management/${eventId}`)}
                className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200 group"
              >
                <div className="w-10 h-10 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <ArrowLeft className="w-5 h-5" />
                </div>
                <span className="font-medium">Back to Management</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                <span className="text-sm font-medium text-gray-400">{isLive ? 'Live Event' : 'Offline'}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg">
                <QrCode className="w-4 h-4" />
                <span>Generate QR</span>
              </button>
              <button className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button 
                onClick={() => navigate(`/event-edit/${eventId}`)}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button className="flex items-center space-x-2 bg-gradient-to-r from-[#FC1924] to-red-600 hover:from-[#e01620] hover:to-red-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg">
                <Share className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Event Hero Section */}
          <div className="bg-gradient-to-r from-[#2a2a2a] via-[#3a3a3a] to-[#2a2a2a] rounded-3xl p-8 mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FC1924]/10 to-purple-600/10"></div>
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/10">
                  <img src={eventData.image} alt={eventData.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {eventData.name}
                  </h1>
                  <div className="flex items-center space-x-6 text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-[#FC1924]" />
                      <span className="font-medium">{eventData.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-[#FC1924]" />
                      <span className="font-medium">{eventData.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-[#FC1924]" />
                      <span className="font-medium">{eventData.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-gradient-to-r from-[#FC1924] to-red-600 text-white px-6 py-3 rounded-2xl shadow-lg">
                  <div className="text-2xl font-bold">Live</div>
                  <div className="text-sm opacity-90">Event Status</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden group hover:scale-105 transition-all duration-300 shadow-xl">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="flex items-center space-x-1 text-green-300">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-semibold">+12%</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.totalAttendees}</h3>
                <p className="text-blue-100 text-sm font-medium">Total Attendees</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white relative overflow-hidden group hover:scale-105 transition-all duration-300 shadow-xl">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="flex items-center space-x-1 text-green-300">
                    <Target className="w-4 h-4" />
                    <span className="text-sm font-semibold">{stats.checkInRate}%</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.checkedIn}</h3>
                <p className="text-green-100 text-sm font-medium">Checked In</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden group hover:scale-105 transition-all duration-300 shadow-xl">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div className="flex items-center space-x-1 text-green-300">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-semibold">+8%</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{formatCurrency(stats.totalRevenue)}</h3>
                <p className="text-purple-100 text-sm font-medium">Total Revenue</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white relative overflow-hidden group hover:scale-105 transition-all duration-300 shadow-xl">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <div className="flex items-center space-x-1 text-green-300">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-semibold">68%</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.ticketsSold}/{stats.totalCapacity}</h3>
                <p className="text-orange-100 text-sm font-medium">Tickets Sold</p>
              </div>
            </div>
          </div>

          {/* Enhanced Tabs */}
          <div className="flex space-x-2 mb-8 bg-[#2a2a2a] rounded-2xl p-2 shadow-xl">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'attendees', label: 'Attendees', icon: Users },
              { id: 'tickets', label: 'Tickets', icon: Ticket },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#FC1924] to-red-600 text-white shadow-lg scale-105'
                      : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-[#2a2a2a] to-[#3a3a3a] rounded-2xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-[#FC1924]" />
                    <span>Real-time Activity</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">New Check-in</p>
                          <p className="text-gray-400 text-sm">John Doe - VIP Ticket</p>
                        </div>
                      </div>
                      <span className="text-gray-500 text-sm">2 min ago</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <Ticket className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Ticket Purchased</p>
                          <p className="text-gray-400 text-sm">Sarah Wilson - Regular</p>
                        </div>
                      </div>
                      <span className="text-gray-500 text-sm">5 min ago</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#2a2a2a] to-[#3a3a3a] rounded-2xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                    <Target className="w-5 h-5 text-[#FC1924]" />
                    <span>Performance Metrics</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Conversion Rate</span>
                      <span className="text-green-400 font-bold">12.5%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '12.5%' }}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Attendance Rate</span>
                      <span className="text-blue-400 font-bold">84%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Attendees Tab */}
            {activeTab === 'attendees' && (
              <div className="bg-gradient-to-br from-[#2a2a2a] to-[#3a3a3a] rounded-2xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                    <Users className="w-6 h-6 text-[#FC1924]" />
                    <span>Event Attendees</span>
                  </h2>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search attendees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-[#1a1a1a] text-white pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FC1924] border border-gray-600"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="bg-[#1a1a1a] text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FC1924] border border-gray-600"
                    >
                      <option value="all">All Status</option>
                      <option value="checked-in">Checked In</option>
                      <option value="not-checked-in">Not Checked In</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-4 px-4 text-gray-400 font-medium">Attendee</th>
                        <th className="text-left py-4 px-4 text-gray-400 font-medium">Ticket Type</th>
                        <th className="text-left py-4 px-4 text-gray-400 font-medium">Amount</th>
                        <th className="text-left py-4 px-4 text-gray-400 font-medium">Status</th>
                        <th className="text-left py-4 px-4 text-gray-400 font-medium">Check-in Time</th>
                        <th className="text-left py-4 px-4 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAttendees.map((attendee) => (
                        <tr key={attendee.id} className="border-b border-gray-800 hover:bg-[#3a3a3a] transition-colors duration-200">
                          <td className="py-4 px-4">
                            <div>
                              <p className="text-white font-medium">{attendee.name}</p>
                              <p className="text-gray-400 text-sm">{attendee.email}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                              {attendee.ticketType}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-white font-semibold">{formatCurrency(attendee.amount)}</td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(attendee.checkInStatus)}`}>
                              {getStatusIcon(attendee.checkInStatus)}
                              <span>{attendee.checkInStatus.replace('-', ' ')}</span>
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-400">
                            {attendee.checkInTime || '-'}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-500 hover:text-blue-400 transition-colors duration-200 p-2 hover:bg-blue-500/10 rounded-lg">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-green-500 hover:text-green-400 transition-colors duration-200 p-2 hover:bg-green-500/10 rounded-lg">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tickets Tab */}
            {activeTab === 'tickets' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {ticketTypes.map((ticket) => (
                    <div key={ticket.name} className="bg-gradient-to-br from-[#2a2a2a] to-[#3a3a3a] rounded-2xl p-6 shadow-xl hover:scale-105 transition-all duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-white">{ticket.name}</h3>
                        <span className="text-2xl font-bold text-green-400">{formatCurrency(ticket.price)}</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Sold</span>
                          <span className="text-white font-semibold">{ticket.sold}/{ticket.total}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(ticket.sold / ticket.total) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Revenue</span>
                          <span className="text-green-400 font-bold">{formatCurrency(ticket.revenue)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-[#2a2a2a] to-[#3a3a3a] rounded-2xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <QrCode className="w-5 h-5 text-[#FC1924]" />
                    <span>QR Code Management</span>
                  </h3>
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => setShowQRCode(!showQRCode)}
                      className="flex items-center space-x-2 bg-gradient-to-r from-[#FC1924] to-red-600 hover:from-[#e01620] hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>{showQRCode ? 'Hide' : 'Show'} QR Code</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg">
                      <Download className="w-4 h-4" />
                      <span>Download All</span>
                    </button>
                  </div>
                  
                  {showQRCode && (
                    <div className="mt-6 p-6 bg-white rounded-2xl inline-block shadow-xl">
                      <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center">
                        <QrCode className="w-32 h-32 text-gray-400" />
                      </div>
                      <p className="text-center text-gray-600 mt-2 text-sm font-medium">Event QR Code</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-[#2a2a2a] to-[#3a3a3a] rounded-2xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-[#FC1924]" />
                    <span>Ticket Sales Over Time</span>
                  </h3>
                  <div className="h-64 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <BarChart3 className="w-16 h-16 mx-auto mb-4" />
                      <p className="font-medium">Chart visualization would go here</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#2a2a2a] to-[#3a3a3a] rounded-2xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-[#FC1924]" />
                    <span>Revenue Breakdown</span>
                  </h3>
                  <div className="space-y-4">
                    {ticketTypes.map((ticket, index) => (
                      <div key={ticket.name} className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded ${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-purple-500' : 'bg-green-500'}`}></div>
                          <span className="text-white font-medium">{ticket.name}</span>
                        </div>
                        <span className="text-green-400 font-bold">{formatCurrency(ticket.revenue)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-gradient-to-br from-[#2a2a2a] to-[#3a3a3a] rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-[#FC1924]" />
                  <span>Event Settings</span>
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Event Status</label>
                    <select className="w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FC1924] border border-gray-600">
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white text-sm font-medium mb-3">Notifications</label>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded w-4 h-4" />
                        <span className="text-gray-300">Email notifications for new sales</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded w-4 h-4" />
                        <span className="text-gray-300">Push notifications for check-ins</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button className="bg-gradient-to-r from-[#FC1924] to-red-600 hover:from-[#e01620] hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg">
                      Save Changes
                    </button>
                    <button className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};