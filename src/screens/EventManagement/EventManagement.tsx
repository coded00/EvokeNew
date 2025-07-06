import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Edit, 
  Users, 
  QrCode, 
  Share, 
  Calendar, 
  MapPin, 
  Clock, 
  Ticket,
  Plus,
  X,
  Check,
  AlertTriangle,
  Eye,
  Download,
  UserPlus,
  Settings,
  BarChart3,
  TrendingUp,
  Shield,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  Camera,
  Scan
} from "lucide-react";
import { Sidebar } from "../../components/ui/sidebar";

interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
  permissions: Permission[];
  status: 'active' | 'pending' | 'inactive';
  joinedDate: string;
}

interface EventDetails {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  ticketType: string;
  visibility: string;
  numberOfTickets: number;
  status: string;
  ticketPrice: number;
  currency: string;
  image: string;
  location: string;
  description: string;
  ticketsSold: number;
  revenue: number;
  teamMembers: TeamMember[];
}

const defaultPermissions: Permission[] = [
  { id: 'scan_tickets', name: 'Scan Tickets', description: 'Can scan and validate event tickets', enabled: false },
  { id: 'view_attendees', name: 'View Attendees', description: 'Can view attendee list and details', enabled: false },
  { id: 'edit_event', name: 'Edit Event', description: 'Can modify event details and settings', enabled: false },
  { id: 'manage_team', name: 'Manage Team', description: 'Can add/remove team members and assign roles', enabled: false },
  { id: 'view_analytics', name: 'View Analytics', description: 'Can access event analytics and reports', enabled: false },
  { id: 'promote_event', name: 'Promote Event', description: 'Can share and promote the event', enabled: false },
  { id: 'cancel_event', name: 'Cancel Event', description: 'Can cancel or suspend the event', enabled: false }
];

const rolePermissions = {
  'Event Owner': ['scan_tickets', 'view_attendees', 'edit_event', 'manage_team', 'view_analytics', 'promote_event', 'cancel_event'],
  'Manager': ['scan_tickets', 'view_attendees', 'edit_event', 'view_analytics', 'promote_event'],
  'Coordinator': ['scan_tickets', 'view_attendees', 'promote_event'],
  'Staff': ['scan_tickets'],
  'Security': ['scan_tickets', 'view_attendees']
};

export const EventManagement = (): JSX.Element => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'attendees' | 'promotion'>('overview');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: '' });

  // Mock event data based on the image
  const [eventData, setEventData] = useState<EventDetails>({
    id: eventId || '1',
    name: "Afrobeat Night",
    startDate: "25/June/2025",
    endDate: "25/6/2025",
    startTime: "4 PM",
    endTime: "12 AM",
    ticketType: "Regular",
    visibility: "Public",
    numberOfTickets: 1000,
    status: "Live",
    ticketPrice: 5000,
    currency: "NGN",
    image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600",
    location: "Victoria Island, Lagos",
    description: "Experience the best of Afrobeat music with live performances and amazing vibes",
    ticketsSold: 450,
    revenue: 2500000,
    teamMembers: [
      { 
        id: '1', 
        name: 'Solomon Odetunde', 
        role: 'Event Owner',
        email: 'solomon@example.com',
        status: 'active',
        joinedDate: '2025-01-01',
        permissions: defaultPermissions.map(p => ({ 
          ...p, 
          enabled: rolePermissions['Event Owner'].includes(p.id) 
        }))
      },
      { 
        id: '2', 
        name: 'Aina Ayoola', 
        role: 'Manager',
        email: 'aina@example.com',
        status: 'active',
        joinedDate: '2025-01-05',
        permissions: defaultPermissions.map(p => ({ 
          ...p, 
          enabled: rolePermissions['Manager'].includes(p.id) 
        }))
      },
      { 
        id: '3', 
        name: 'Adebayo Johnson', 
        role: 'Coordinator',
        email: 'adebayo@example.com',
        status: 'pending',
        joinedDate: '2025-01-10',
        permissions: defaultPermissions.map(p => ({ 
          ...p, 
          enabled: rolePermissions['Coordinator'].includes(p.id) 
        }))
      },
      { 
        id: '4', 
        name: 'Sarah Williams', 
        role: 'Staff',
        email: 'sarah@example.com',
        status: 'active',
        joinedDate: '2025-01-12',
        permissions: defaultPermissions.map(p => ({ 
          ...p, 
          enabled: rolePermissions['Staff'].includes(p.id) 
        }))
      }
    ]
  });

  const handleEditEvent = () => {
    navigate(`/event-edit/${eventId}`);
  };

  const handleCancelEvent = () => {
    setEventData(prev => ({ ...prev, status: 'Cancelled' }));
    setShowCancelModal(false);
  };

  const handleAddTeamMember = () => {
    if (newMember.name && newMember.email && newMember.role) {
      const newTeamMember: TeamMember = {
        id: Date.now().toString(),
        name: newMember.name,
        email: newMember.email,
        role: newMember.role,
        status: 'pending',
        joinedDate: new Date().toISOString().split('T')[0],
        permissions: defaultPermissions.map(p => ({ 
          ...p, 
          enabled: rolePermissions[newMember.role as keyof typeof rolePermissions]?.includes(p.id) || false
        }))
      };
      setEventData(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, newTeamMember]
      }));
      setNewMember({ name: '', email: '', role: '' });
      setShowAddMemberModal(false);
    }
  };

  const handleRemoveTeamMember = (memberId: string) => {
    setEventData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(member => member.id !== memberId)
    }));
  };

  const handleUpdateMemberRole = (memberId: string, newRole: string) => {
    setEventData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map(member => 
        member.id === memberId 
          ? { 
              ...member, 
              role: newRole,
              permissions: defaultPermissions.map(p => ({ 
                ...p, 
                enabled: rolePermissions[newRole as keyof typeof rolePermissions]?.includes(p.id) || false
              }))
            } 
          : member
      )
    }));
  };

  const handleUpdatePermissions = (memberId: string, permissions: Permission[]) => {
    setEventData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map(member => 
        member.id === memberId ? { ...member, permissions } : member
      )
    }));
  };

  const handleScanTickets = () => {
    navigate('/ticket-scanner');
  };

  const handlePromoteEvent = () => {
    alert('Promotion tools coming soon! This will include social sharing, boosting, and marketing features.');
  };

  const handleViewAttendees = () => {
    navigate(`/event-dashboard/${eventId}`);
  };

  const handleBackToProfile = () => {
    navigate('/profile', { state: { activeTab: 'management' } });
  };

  const openPermissionsModal = (member: TeamMember) => {
    setSelectedMember(member);
    setShowPermissionsModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <UserCheck className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'inactive': return <UserX className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex relative overflow-hidden font-['Space_Grotesk']">
      <Sidebar currentPath="/event-management" />

      {/* Main Content */}
      <div className="flex-1 ml-20 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={handleBackToProfile}
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Profile</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white">{eventData.name}</h1>
              <div className="flex items-center justify-center space-x-4 mt-2">
                <span className="text-purple-400 font-semibold">Countdown: 3d 5hr 45mins</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  eventData.status === 'Live' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                }`}>
                  {eventData.status}
                </span>
              </div>
            </div>
            
            <div className="w-24"></div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-black rounded-lg p-6 text-center border border-black">
              <div className="text-green-400 text-3xl font-bold">{eventData.ticketsSold}</div>
              <div className="text-gray-400 text-sm">/ {eventData.numberOfTickets}</div>
              <div className="text-white text-sm mt-2">Tickets Sold</div>
            </div>
            
            <div className="bg-black rounded-lg p-6 text-center border border-black">
              <div className="text-green-400 text-3xl font-bold">2.5</div>
              <div className="text-gray-400 text-sm">/ 5M</div>
              <div className="text-white text-sm mt-2">Revenue</div>
            </div>
            
            <div className="bg-black rounded-lg p-6 text-center border border-black">
              <div className="text-green-400 text-3xl font-bold">{eventData.teamMembers.length}</div>
              <div className="text-white text-sm mt-2">Team</div>
            </div>
            
            <div className="bg-black rounded-lg p-6 text-center border border-black">
              <div className="text-green-400 text-3xl font-bold">12</div>
              <div className="text-white text-sm mt-2">Events listed</div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Event Poster */}
            <div className="lg:col-span-1">
              <div className="bg-[#2a2a2a] rounded-xl p-6 border border-black">
                <img 
                  src={eventData.image} 
                  alt={eventData.name}
                  className="w-full h-96 object-cover rounded-lg mb-4"
                />
              </div>
            </div>

            {/* Right Side - Event Details */}
            <div className="lg:col-span-2">
              <div className="bg-[#2a2a2a] rounded-xl p-6 border border-black">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Event Details</h2>
                  <button 
                    onClick={handleEditEvent}
                    className="bg-[#FC1924] hover:bg-[#e01620] text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Start Date:</label>
                      <div className="text-white">{eventData.startDate}</div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Start Time:</label>
                      <div className="text-white">{eventData.startTime}</div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Ticket Type:</label>
                      <div className="text-white">{eventData.ticketType}</div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Status:</label>
                      <div className="text-white">{eventData.status}</div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Ticket Price:</label>
                      <div className="text-white">₦{eventData.ticketPrice}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">End Date:</label>
                      <div className="text-white">{eventData.endDate}</div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">End Time:</label>
                      <div className="text-white">{eventData.endTime}</div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Visibility:</label>
                      <div className="text-white">{eventData.visibility}</div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Number of Tickets:</label>
                      <div className="text-white">{eventData.numberOfTickets}</div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Currency:</label>
                      <div className="text-white">{eventData.currency}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Team & Permissions Section */}
              <div className="bg-[#2a2a2a] rounded-xl p-6 mt-6 border border-black">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Team & Permissions</h2>
                  <button 
                    onClick={() => setShowAddMemberModal(true)}
                    className="bg-[#FC1924] hover:bg-[#e01620] text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Member</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {eventData.teamMembers.map((member) => (
                    <div key={member.id} className="bg-[#3a3a3a] rounded-lg p-4 border border-black">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-lg font-bold">{member.name.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-semibold">{member.name}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(member.status)}`}>
                                {getStatusIcon(member.status)}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm">{member.email}</p>
                            <p className="text-gray-500 text-xs">Joined: {member.joinedDate}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <select 
                            value={member.role}
                            onChange={(e) => handleUpdateMemberRole(member.id, e.target.value)}
                            className="bg-[#4a4a4a] text-white px-3 py-2 rounded border border-gray-600"
                            disabled={member.role === 'Event Owner'}
                          >
                            <option value="Event Owner">Event Owner</option>
                            <option value="Manager">Manager</option>
                            <option value="Coordinator">Coordinator</option>
                            <option value="Staff">Staff</option>
                            <option value="Security">Security</option>
                          </select>
                          
                          <button 
                            onClick={() => openPermissionsModal(member)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition-all duration-300 flex items-center space-x-1"
                          >
                            <Shield className="w-4 h-4" />
                            <span>Permissions</span>
                          </button>
                          
                          {member.role !== 'Event Owner' && (
                            <button 
                              onClick={() => handleRemoveTeamMember(member.id)}
                              className="text-red-400 hover:text-red-300 transition-colors duration-200 p-2"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Quick Permissions Overview */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {member.permissions.filter(p => p.enabled).map((permission) => (
                          <span key={permission.id} className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                            {permission.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Attendees Section */}
          <div className="bg-[#2a2a2a] rounded-xl p-6 mt-8 border border-black">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Attendees:</h2>
              <div className="flex items-center space-x-4">
                <span className="text-white text-lg font-semibold">{eventData.ticketsSold}/{eventData.numberOfTickets}</span>
                <button 
                  onClick={handleViewAttendees}
                  className="bg-[#FC1924] hover:bg-[#e01620] text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  View
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <button 
              onClick={handleScanTickets}
              className="bg-[#FC1924] hover:bg-[#e01620] text-white py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Scan className="w-5 h-5" />
              <span>Scan QR Codes</span>
            </button>
            
            <button 
              onClick={() => navigate(`/qr-test/${eventId}`)}
              className="bg-[#FC1924] hover:bg-[#e01620] text-white py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <QrCode className="w-5 h-5" />
              <span>Generate QR</span>
            </button>
            
            <button 
              onClick={handlePromoteEvent}
              className="bg-[#FC1924] hover:bg-[#e01620] text-white py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <TrendingUp className="w-5 h-5" />
              <span>Promote Event</span>
            </button>

            <button 
              onClick={() => navigate(`/event-dashboard/${eventId}`)}
              className="bg-[#FC1924] hover:bg-[#e01620] text-white py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <BarChart3 className="w-5 h-5" />
              <span>View Analytics</span>
            </button>
          </div>

          {/* Cancel Event Button */}
          <div className="mt-6 flex justify-center">
            <button 
              onClick={() => setShowCancelModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>Cancel Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Team Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#2a2a2a] rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-white mb-6">Add Team Member</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter member name"
                  className="w-full bg-[#3a3a3a] border border-gray-600 text-white rounded-lg px-4 py-3"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                  className="w-full bg-[#3a3a3a] border border-gray-600 text-white rounded-lg px-4 py-3"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Role</label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full bg-[#3a3a3a] border border-gray-600 text-white rounded-lg px-4 py-3"
                >
                  <option value="">Select Role</option>
                  <option value="Manager">Manager</option>
                  <option value="Coordinator">Coordinator</option>
                  <option value="Staff">Staff</option>
                  <option value="Security">Security</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="flex-1 bg-transparent border border-gray-600 text-white py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTeamMember}
                disabled={!newMember.name || !newMember.email || !newMember.role}
                className="flex-1 bg-[#FC1924] hover:bg-[#e01620] text-white py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#2a2a2a] rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Manage Permissions</h2>
              <button 
                onClick={() => setShowPermissionsModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">{selectedMember.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">{selectedMember.name}</h3>
                  <p className="text-gray-400 text-sm">{selectedMember.role}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {selectedMember.permissions.map((permission) => (
                <div key={permission.id} className="bg-[#3a3a3a] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          permission.enabled ? 'bg-green-500' : 'bg-gray-600'
                        }`}>
                          {permission.enabled ? <Unlock className="w-5 h-5 text-white" /> : <Lock className="w-5 h-5 text-white" />}
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{permission.name}</h4>
                          <p className="text-gray-400 text-sm">{permission.description}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const updatedPermissions = selectedMember.permissions.map(p =>
                          p.id === permission.id ? { ...p, enabled: !p.enabled } : p
                        );
                        handleUpdatePermissions(selectedMember.id, updatedPermissions);
                        setSelectedMember({ ...selectedMember, permissions: updatedPermissions });
                      }}
                      disabled={selectedMember.role === 'Event Owner'}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        permission.enabled
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      } ${selectedMember.role === 'Event Owner' ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                    >
                      {permission.enabled ? 'Revoke' : 'Grant'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowPermissionsModal(false)}
                className="bg-[#FC1924] hover:bg-[#e01620] text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Event Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#2a2a2a] rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Cancel Event</h2>
              <p className="text-gray-300 mb-6">
                Are you sure you want to cancel this event? This action cannot be undone and all attendees will be notified.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 bg-transparent border border-gray-600 text-white py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-gray-800"
                >
                  Keep Event
                </button>
                <button
                  onClick={handleCancelEvent}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  Cancel Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};