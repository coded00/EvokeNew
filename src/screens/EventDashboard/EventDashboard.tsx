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
  Award,
  Star,
  Globe,
  Layers
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex relative overflow-hidden font-['Space_Grotesk']">
      <Sidebar currentPath="/event-dashboard" />

      {/* Main Content */}
      <div className="flex-1 ml-20 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => navigate(`/event-management/${eventId}`)}
                className="flex items-center space-x-3 text-white/80 hover:text-white transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 backdrop-blur-sm border border-white/10">
                  <ArrowLeft className="w-5 h-5" />
                </div>
                <span className="font-semibold text-lg">Back to Management</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50' : 'bg-gray-500'}`}></div>
                <span className="text-sm font-medium text-emerald-400">{isLive ? 'Live Event' : 'Offline'}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-5 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-violet-500/25">
                <QrCode className="w-4 h-4" />
                <span>Generate QR</span>
              </button>
              <button className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-5 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-500/25">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button 
                onClick={() => navigate(`/event-edit/${eventId}`)}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-5 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/25"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button className="flex items-center space-x-2 bg-gradient-to-r from-[#FC1924] to-red-600 hover:from-[#e01620] hover:to-red-700 text-white px-5 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/25">
                <Share className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Event Hero Section */}
          <div className="relative bg-gradient-to-r from-slate-800/50 via-gray-800/50 to-slate-800/50 rounded-3xl p-8 mb-8 backdrop-blur-sm border border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FC1924]/5 via-purple-600/5 to-blue-600/5"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FC1924]/20 to-purple-600/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-28 h-28 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/20 backdrop-blur-sm">
                  <img src={eventData.image} alt={eventData.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                    {eventData.name}
                  </h1>
                  <div className="flex items-center space-x-8 text-gray-300">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#FC1924]/20 rounded-xl flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-[#FC1924]" />
                      </div>
                      <span className="font-medium text-lg">{eventData.date}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 text-purple-400" />
                      </div>
                      <span className="font-medium text-lg">{eventData.time}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className="font-medium text-lg">{eventData.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-3xl shadow-lg shadow-emerald-500/25">
                  <div className="text-3xl font-bold">Live</div>
                  <div className="text-sm opacity-90 font-medium">Event Status</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="relative bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm border border-blue-500/20 rounded-3xl p-6 text-white overflow-hidden group hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -translate-y-12 translate-x-12"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-400/10 rounded-full translate-y-8 -translate-x-8"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Users className="w-7 h-7 text-blue-400" />
                  </div>
                  <div className="flex items-center space-x-1 text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-bold">+12%</span>
                  </div>
                </div>
                <h3 className="text-4xl font-bold mb-2 text-blue-400">{stats.totalAttendees}</h3>
                <p className="text-blue-200 text-sm font-medium">Total Attendees</p>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 backdrop-blur-sm border border-emerald-500/20 rounded-3xl p-6 text-white overflow-hidden group hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -translate-y-12 translate-x-12"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-emerald-400/10 rounded-full translate-y-8 -translate-x-8"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <CheckCircle className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div className="flex items-center space-x-1 text-emerald-400">
                    <Target className="w-4 h-4" />
                    <span className="text-sm font-bold">{stats.checkInRate}%</span>
                  </div>
                </div>
                <h3 className="text-4xl font-bold mb-2 text-emerald-400">{stats.checkedIn}</h3>
                <p className="text-emerald-200 text-sm font-medium">Checked In</p>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-6 text-white overflow-hidden group hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full -translate-y-12 translate-x-12"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-400/10 rounded-full translate-y-8 -translate-x-8"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <DollarSign className="w-7 h-7 text-purple-400" />
                  </div>
                  <div className="flex items-center space-x-1 text-emerald-400">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-bold">+8%</span>
                  </div>
                </div>
                <h3 className="text-4xl font-bold mb-2 text-purple-400">{formatCurrency(stats.totalRevenue)}</h3>
                <p className="text-purple-200 text-sm font-medium">Total Revenue</p>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-orange-500/10 to-orange-600/10 backdrop-blur-sm border border-orange-500/20 rounded-3xl p-6 text-white overflow-hidden group hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full -translate-y-12 translate-x-12"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-orange-400/10 rounded-full translate-y-8 -translate-x-8"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Ticket className="w-7 h-7 text-orange-400" />
                  </div>
                  <div className="flex items-center space-x-1 text-emerald-400">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-bold">68%</span>
                  </div>
                </div>
                <h3 className="text-4xl font-bold mb-2 text-orange-400">{stats.ticketsSold}/{stats.totalCapacity}</h3>
                <p className="text-orange-200 text-sm font-medium">Tickets Sold</p>
              </div>
            </div>
          </div>

          {/* Enhanced Tabs */}
          <div className="flex space-x-2 mb-8 bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-3xl p-2">
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
                  className={`flex items-center space-x-2 px-6 py-4 rounded-2xl transition-all duration-300 font-medium ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#FC1924] to-red-600 text-white shadow-lg shadow-red-500/25 scale-105'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
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
                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#FC1924]/20 rounded-xl flex items-center justify-center">
                      <Activity className="w-5 h-5 text-[#FC1924]" />
                    </div>
                    <span>Real-time Activity</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-5 bg-slate-700/50 backdrop-blur-sm border border-white/10 rounded-2xl">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">New Check-in</p>
                          <p className="text-gray-400 text-sm">John Doe - VIP Ticket</p>
                        </div>
                      </div>
                      <span className="text-gray-500 text-sm">2 min ago</span>
                    </div>
                    <div className="flex items-center justify-between p-5 bg-slate-700/50 backdrop-blur-sm border border-white/10 rounded-2xl">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                          <Ticket className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">Ticket Purchased</p>
                          <p className="text-gray-400 text-sm">Sarah Wilson - Regular</p>
                        </div>
                      </div>
                      <span className="text-gray-500 text-sm">5 min ago</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center">
                      <Target className="w-5 h-5 text-purple-400" />
                    </div>
                    <span>Performance Metrics</span>
                  </h3>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300 font-medium">Conversion Rate</span>
                        <span className="text-emerald-400 font-bold text-lg">12.5%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-3">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full shadow-lg shadow-emerald-500/25" style={{ width: '12.5%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300 font-medium">Attendance Rate</span>
                        <span className="text-blue-400 font-bold text-lg">84%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-3">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full shadow-lg shadow-blue-500/25" style={{ width: '84%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Attendees Tab */}
            {activeTab === 'attendees' && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#FC1924]/20 rounded-2xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-[#FC1924]" />
                    </div>
                    <span>Event Attendees</span>
                  </h2>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search attendees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-slate-700/50 text-white pl-12 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FC1924] border border-white/10 backdrop-blur-sm"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="bg-slate-700/50 text-white px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FC1924] border border-white/10 backdrop-blur-sm"
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
                      <tr className="border-b border-white/10">
                        <th className="text-left py-4 px-6 text-gray-400 font-semibold">Attendee</th>
                        <th className="text-left py-4 px-6 text-gray-400 font-semibold">Ticket Type</th>
                        <th className="text-left py-4 px-6 text-gray-400 font-semibold">Amount</th>
                        <th className="text-left py-4 px-6 text-gray-400 font-semibold">Status</th>
                        <th className="text-left py-4 px-6 text-gray-400 font-semibold">Check-in Time</th>
                        <th className="text-left py-4 px-6 text-gray-400 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAttendees.map((attendee) => (
                        <tr key={attendee.id} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200">
                          <td className="py-4 px-6">
                            <div>
                              <p className="text-white font-semibold">{attendee.name}</p>
                              <p className="text-gray-400 text-sm">{attendee.email}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                              {attendee.ticketType}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-white font-bold">{formatCurrency(attendee.amount)}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-medium ${getStatusColor(attendee.checkInStatus)}`}>
                              {getStatusIcon(attendee.checkInStatus)}
                              <span>{attendee.checkInStatus.replace('-', ' ')}</span>
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-400">
                            {attendee.checkInTime || '-'}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-400 hover:text-blue-300 transition-colors duration-200 p-2 hover:bg-blue-500/10 rounded-xl">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200 p-2 hover:bg-emerald-500/10 rounded-xl">
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
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {ticketTypes.map((ticket, index) => (
                    <div key={ticket.name} className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:scale-105 transition-all duration-300">
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white">{ticket.name}</h3>
                        <span className="text-3xl font-bold text-emerald-400">{formatCurrency(ticket.price)}</span>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400 font-medium">Sold</span>
                          <span className="text-white font-bold">{ticket.sold}/{ticket.total}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-4">
                          <div 
                            className={`h-4 rounded-full transition-all duration-500 ${
                              index === 0 ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25' :
                              index === 1 ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25' :
                              'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25'
                            }`}
                            style={{ width: `${(ticket.sold / ticket.total) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400 font-medium">Revenue</span>
                          <span className="text-emerald-400 font-bold">{formatCurrency(ticket.revenue)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#FC1924]/20 rounded-xl flex items-center justify-center">
                      <QrCode className="w-5 h-5 text-[#FC1924]" />
                    </div>
                    <span>QR Code Management</span>
                  </h3>
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => setShowQRCode(!showQRCode)}
                      className="flex items-center space-x-2 bg-gradient-to-r from-[#FC1924] to-red-600 hover:from-[#e01620] hover:to-red-700 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/25"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>{showQRCode ? 'Hide' : 'Show'} QR Code</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-500/25">
                      <Download className="w-4 h-4" />
                      <span>Download All</span>
                    </button>
                  </div>
                  
                  {showQRCode && (
                    <div className="mt-8 p-8 bg-white rounded-3xl inline-block shadow-2xl">
                      <div className="w-48 h-48 bg-gray-100 rounded-2xl flex items-center justify-center">
                        <QrCode className="w-32 h-32 text-gray-400" />
                      </div>
                      <p className="text-center text-gray-600 mt-4 text-sm font-semibold">Event QR Code</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-blue-400" />
                    </div>
                    <span>Ticket Sales Over Time</span>
                  </h3>
                  <div className="h-64 bg-slate-700/50 rounded-2xl flex items-center justify-center border border-white/10">
                    <div className="text-center text-gray-400">
                      <BarChart3 className="w-16 h-16 mx-auto mb-4" />
                      <p className="font-medium">Chart visualization would go here</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-600/20 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span>Revenue Breakdown</span>
                  </h3>
                  <div className="space-y-4">
                    {ticketTypes.map((ticket, index) => (
                      <div key={ticket.name} className="flex items-center justify-between p-5 bg-slate-700/50 rounded-2xl border border-white/10">
                        <div className="flex items-center space-x-4">
                          <div className={`w-4 h-4 rounded ${
                            index === 0 ? 'bg-blue-500' : 
                            index === 1 ? 'bg-purple-500' : 
                            'bg-emerald-500'
                          }`}></div>
                          <span className="text-white font-semibold">{ticket.name}</span>
                        </div>
                        <span className="text-emerald-400 font-bold">{formatCurrency(ticket.revenue)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-white mb-8 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-600/20 rounded-xl flex items-center justify-center">
                    <Settings className="w-5 h-5 text-gray-400" />
                  </div>
                  <span>Event Settings</span>
                </h3>
                <div className="space-y-8">
                  <div>
                    <label className="block text-white text-sm font-semibold mb-3">Event Status</label>
                    <select className="w-full bg-slate-700/50 text-white px-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FC1924] border border-white/10 backdrop-blur-sm">
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white text-sm font-semibold mb-4">Notifications</label>
                    <div className="space-y-4">
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded w-5 h-5" />
                        <span className="text-gray-300 font-medium">Email notifications for new sales</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded w-5 h-5" />
                        <span className="text-gray-300 font-medium">Push notifications for check-ins</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button className="bg-gradient-to-r from-[#FC1924] to-red-600 hover:from-[#e01620] hover:to-red-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/25">
                      Save Changes
                    </button>
                    <button className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
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