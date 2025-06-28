import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Plus, 
  X, 
  Edit, 
  Shield, 
  Lock, 
  Unlock, 
  UserCheck, 
  UserX, 
  AlertTriangle,
  Camera,
  Trash2
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

interface EventData {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  vibe: string;
  specialAppearances: string;
  promoCode: string;
  entryType: string;
  ticketName: string;
  ticketType: string;
  currency: string;
  numberOfTickets: number;
  ticketPrice: number;
  image: string;
  status: string;
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

export const EventEdit = (): JSX.Element => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const [activeTab, setActiveTab] = useState<'details' | 'team'>('details');
  const [isSaving, setIsSaving] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: '' });
  const [hasChanges, setHasChanges] = useState(false);

  const [eventData, setEventData] = useState<EventData>({
    id: eventId || '1',
    name: "Afrobeats Night",
    description: "Experience the best of Afrobeat music with live performances and amazing vibes. Join us for an unforgettable night of music, dancing, and community.",
    category: "Music & Concerts",
    location: "Victoria Island, Lagos",
    startDate: "2025-06-25",
    endDate: "2025-06-25",
    startTime: "16:00",
    endTime: "00:00",
    vibe: "High Energy",
    specialAppearances: "DJ Spinall, Burna Boy",
    promoCode: "AFROBEATS25",
    entryType: "Paid",
    ticketName: "Afrobeats Night Ticket",
    ticketType: "Regular",
    currency: "NGN",
    numberOfTickets: 1000,
    ticketPrice: 5000,
    image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600",
    status: "Active",
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
      }
    ]
  });

  const categories = [
    "Music & Concerts",
    "Parties & Nightlife",
    "Sports & Fitness",
    "Food & Drink",
    "Arts & Culture",
    "Business & Networking",
    "Community & Social",
    "Education & Learning"
  ];

  const vibes = [
    "Wild & Woke",
    "Chill & Relaxed",
    "High Energy",
    "Intimate & Cozy",
    "Professional",
    "Creative & Artistic",
    "Sporty & Active",
    "Luxury & Exclusive"
  ];

  const entryTypes = ["Free", "Paid", "Invite-only"];
  const ticketTypes = ["Regular", "VIP", "VVIP", "Early Bird", "Student"];
  const currencies = ["NGN", "USD", "EUR", "GBP"];

  const handleInputChange = (field: keyof EventData, value: string | number) => {
    setEventData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSaving(false);
    setHasChanges(false);
    // Show success message or redirect
    alert('Event updated successfully!');
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
      setHasChanges(true);
    }
  };

  const handleRemoveTeamMember = (memberId: string) => {
    setEventData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(member => member.id !== memberId)
    }));
    setHasChanges(true);
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
    setHasChanges(true);
  };

  const handleUpdatePermissions = (memberId: string, permissions: Permission[]) => {
    setEventData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map(member => 
        member.id === memberId ? { ...member, permissions } : member
      )
    }));
    setHasChanges(true);
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
      <Sidebar currentPath="/event-edit" />

      {/* Main Content */}
      <div className="flex-1 ml-20 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => navigate(`/event-management/${eventId}`)}
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Event Management</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white">Edit Event</h1>
              <p className="text-gray-400">{eventData.name}</p>
            </div>
            
            <button
              onClick={handleSaveChanges}
              disabled={!hasChanges || isSaving}
              className="bg-[#FC1924] hover:bg-[#e01620] disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-8 bg-[#2a2a2a] rounded-xl p-2">
            <button 
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'details' 
                  ? 'bg-[#FC1924] text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
              }`}
            >
              Event Details
            </button>
            <button 
              onClick={() => setActiveTab('team')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'team' 
                  ? 'bg-[#FC1924] text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
              }`}
            >
              Team & Permissions
            </button>
          </div>

          {/* Event Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-8">
              {/* Basic Information */}
              <div className="bg-[#2a2a2a] rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Event Name</label>
                      <input
                        type="text"
                        value={eventData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                        placeholder="Enter event name"
                      />
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Category</label>
                      <select
                        value={eventData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Location</label>
                      <input
                        type="text"
                        value={eventData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                        placeholder="Enter event location"
                      />
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Vibe</label>
                      <select
                        value={eventData.vibe}
                        onChange={(e) => handleInputChange('vibe', e.target.value)}
                        className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                      >
                        {vibes.map(vibe => (
                          <option key={vibe} value={vibe}>{vibe}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Description</label>
                      <textarea
                        value={eventData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                        className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200 resize-none"
                        placeholder="Describe your event"
                      />
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Special Appearances</label>
                      <input
                        type="text"
                        value={eventData.specialAppearances}
                        onChange={(e) => handleInputChange('specialAppearances', e.target.value)}
                        className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                        placeholder="Featured guests or performers"
                      />
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Promo Code</label>
                      <input
                        type="text"
                        value={eventData.promoCode}
                        onChange={(e) => handleInputChange('promoCode', e.target.value)}
                        className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                        placeholder="Discount code"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="bg-[#2a2a2a] rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Date & Time</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Start Date</label>
                    <input
                      type="date"
                      value={eventData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">End Date</label>
                    <input
                      type="date"
                      value={eventData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Start Time</label>
                    <input
                      type="time"
                      value={eventData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">End Time</label>
                    <input
                      type="time"
                      value={eventData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                      className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Ticketing */}
              <div className="bg-[#2a2a2a] rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Ticketing</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Entry Type</label>
                    <select
                      value={eventData.entryType}
                      onChange={(e) => handleInputChange('entryType', e.target.value)}
                      className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                    >
                      {entryTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Ticket Name</label>
                    <input
                      type="text"
                      value={eventData.ticketName}
                      onChange={(e) => handleInputChange('ticketName', e.target.value)}
                      className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                      placeholder="Enter ticket name"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Ticket Type</label>
                    <select
                      value={eventData.ticketType}
                      onChange={(e) => handleInputChange('ticketType', e.target.value)}
                      className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                    >
                      {ticketTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Currency</label>
                    <select
                      value={eventData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                    >
                      {currencies.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Ticket Price</label>
                    <input
                      type="number"
                      value={eventData.ticketPrice}
                      onChange={(e) => handleInputChange('ticketPrice', parseInt(e.target.value))}
                      className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Number of Tickets</label>
                    <input
                      type="number"
                      value={eventData.numberOfTickets}
                      onChange={(e) => handleInputChange('numberOfTickets', parseInt(e.target.value))}
                      className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Event Poster */}
              <div className="bg-[#2a2a2a] rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Event Poster</h2>
                
                <div className="flex items-center space-x-6">
                  <div className="w-48 h-64 bg-gray-700 rounded-lg overflow-hidden">
                    <img 
                      src={eventData.image} 
                      alt="Event poster"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-[#FC1924] transition-colors duration-200">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400 mb-2">Upload New Poster</p>
                      <p className="text-gray-500 text-sm mb-4">Recommended size: 1080x1920px</p>
                      <button className="bg-[#FC1924] hover:bg-[#e01620] text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105">
                        Choose File
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Team & Permissions Tab */}
          {activeTab === 'team' && (
            <div className="space-y-8">
              {/* Team Management */}
              <div className="bg-[#2a2a2a] rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Team Members</h2>
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
                    <div key={member.id} className="bg-[#3a3a3a] rounded-lg p-6">
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
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Quick Permissions Overview */}
                      <div className="mt-4 flex flex-wrap gap-2">
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
          )}
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
    </div>
  );
};