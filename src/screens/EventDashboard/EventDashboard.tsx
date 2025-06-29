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
  EyeOff
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
    <div className="min-h-screen bg-[#0f1419] flex relative overflow-hidden font-['Space_Grotesk']">
      <Sidebar currentPath="/event-dashboard" />

      {/* Main Content */}
      <div className="flex-1 ml-20 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate(`/event-management/${eventId}`)}
                className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Management</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300">
                <QrCode className="w-4 h-4" />
                <span>Generate QR</span>
              </button>
              <button className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-all duration-300">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button 
                onClick={() => navigate(`/event-edit/${eventId}`)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300">
                <Share className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Event Header */}
          <div className="bg-[#1e2328] rounded-2xl p-6 mb-8 border border-gray-700">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 rounded-xl overflow-hidden">
                <img src={eventData.image} alt={eventData.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{eventData.name}</h1>
                <div className="flex items-center space-x-6 text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{eventData.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{eventData.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{eventData.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#1e2328] rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-green-400 text-sm font-semibold">+12%</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stats.totalAttendees}</h3>
              <p className="text-gray-400 text-sm">Total Attendees</p>
            </div>

            <div className="bg-[#1e2328] rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <span className="text-green-400 text-sm font-semibold">{stats.checkInRate}%</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stats.checkedIn}</h3>
              <p className="text-gray-400 text-sm">Checked In</p>
            </div>

            <div className="bg-[#1e2328] rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-green-400 text-sm font-semibold">+8%</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{formatCurrency(stats.totalRevenue)}</h3>
              <p className="text-gray-400 text-sm">Total Revenue</p>
            </div>

            <div className="bg-[#1e2328] rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-orange-400" />
                </div>
                <span className="text-green-400 text-sm font-semibold">68%</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stats.ticketsSold}/{stats.totalCapacity}</h3>
              <p className="text-gray-400 text-sm">Tickets Sold</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-8">
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
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-red-600 text-white'
                      : 'bg-[#1e2328] text-gray-400 hover:text-white hover:bg-[#2a2f36] border border-gray-700'
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
                <div className="bg-[#1e2328] rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                    <h3 className="text-xl font-bold text-white">Real-time Activity</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#2a2f36] rounded-lg border border-gray-600">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">New Check-in</p>
                          <p className="text-gray-400 text-sm">John Doe - VIP Ticket</p>
                        </div>
                      </div>
                      <span className="text-gray-500 text-sm">2 min ago</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[#2a2f36] rounded-lg border border-gray-600">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <Ticket className="w-5 h-5 text-blue-400" />
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

                <div className="bg-[#1e2328] rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 bg-purple-500 rounded"></div>
                    <h3 className="text-xl font-bold text-white">Performance Metrics</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Conversion Rate</span>
                        <span className="text-green-400 font-semibold">12.5%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-green-400 h-2 rounded-full transition-all duration-300" style={{ width: '12.5%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Attendance Rate</span>
                        <span className="text-blue-400 font-semibold">84%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-400 h-2 rounded-full transition-all duration-300" style={{ width: '84%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Attendees Tab */}
            {activeTab === 'attendees' && (
              <div className="bg-[#1e2328] rounded-xl p-6 border border-gray-700">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Attendees</h2>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search attendees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-[#2a2f36] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 border border-gray-600"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="bg-[#2a2f36] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 border border-gray-600"
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
                      <tr className="border-b border-gray-600">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Ticket Type</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Amount</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Check-in Time</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAttendees.map((attendee) => (
                        <tr key={attendee.id} className="border-b border-gray-700 hover:bg-[#2a2f36] transition-colors duration-200">
                          <td className="py-3 px-4 text-white">{attendee.name}</td>
                          <td className="py-3 px-4 text-gray-400">{attendee.email}</td>
                          <td className="py-3 px-4 text-gray-400">{attendee.ticketType}</td>
                          <td className="py-3 px-4 text-white">{formatCurrency(attendee.amount)}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(attendee.checkInStatus)}`}>
                              {getStatusIcon(attendee.checkInStatus)}
                              <span>{attendee.checkInStatus.replace('-', ' ')}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-400">
                            {attendee.checkInTime || '-'}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-green-400 hover:text-green-300 transition-colors duration-200">
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
                    <div key={ticket.name} className="bg-[#1e2328] rounded-xl p-6 border border-gray-700">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-white">{ticket.name}</h3>
                        <span className="text-2xl font-bold text-green-400">{formatCurrency(ticket.price)}</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Sold</span>
                          <span className="text-white">{ticket.sold}/{ticket.total}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(ticket.sold / ticket.total) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Revenue</span>
                          <span className="text-green-400 font-semibold">{formatCurrency(ticket.revenue)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#1e2328] rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-4">QR Code Generator</h3>
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => setShowQRCode(!showQRCode)}
                      className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>{showQRCode ? 'Hide' : 'Show'} QR Code</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-[#2a2f36] hover:bg-[#3a3f46] text-white px-4 py-2 rounded-lg transition-all duration-300 border border-gray-600">
                      <Download className="w-4 h-4" />
                      <span>Download All</span>
                    </button>
                  </div>
                  
                  {showQRCode && (
                    <div className="mt-6 p-6 bg-white rounded-xl inline-block">
                      <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                        <QrCode className="w-32 h-32 text-gray-400" />
                      </div>
                      <p className="text-center text-gray-600 mt-2 text-sm">Event QR Code</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#1e2328] rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-4">Ticket Sales Over Time</h3>
                  <div className="h-64 bg-[#2a2f36] rounded-lg flex items-center justify-center border border-gray-600">
                    <div className="text-center text-gray-400">
                      <BarChart3 className="w-16 h-16 mx-auto mb-4" />
                      <p>Chart visualization would go here</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1e2328] rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-4">Revenue Breakdown</h3>
                  <div className="space-y-4">
                    {ticketTypes.map((ticket) => (
                      <div key={ticket.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-blue-500 rounded"></div>
                          <span className="text-white">{ticket.name}</span>
                        </div>
                        <span className="text-green-400 font-semibold">{formatCurrency(ticket.revenue)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-[#1e2328] rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">Event Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Event Status</label>
                    <select className="w-full bg-[#2a2f36] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 border border-gray-600">
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Notifications</label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-gray-300">Email notifications for new sales</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-gray-300">Push notifications for check-ins</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-all duration-300">
                      Save Changes
                    </button>
                    <button className="bg-[#2a2f36] hover:bg-[#3a3f46] text-white px-6 py-2 rounded-lg transition-all duration-300 border border-gray-600">
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