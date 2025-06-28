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
  TrendingUp
} from "lucide-react";
import { Sidebar } from "../../components/ui/sidebar";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
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

export const EventManagement = (): JSX.Element => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const [activeTab, setActiveTab] = useState<'details' | 'team' | 'attendees' | 'promotion'>('details');
  const [isEditing, setIsEditing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', role: '' });

  // Mock event data based on the image
  const [eventData, setEventData] = useState<EventDetails>({
    id: eventId || '1',
    name: "Afrobeats Night",
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
      { id: '1', name: 'Solomon Odetunde', role: 'Event Owner' },
      { id: '2', name: 'Aina Ayoola', role: 'Select Role' },
      { id: '3', name: 'Adebayo', role: 'Select Role' },
      { id: '4', name: 'Solomon Odetunde', role: 'Select Role' }
    ]
  });

  const handleSaveChanges = () => {
    setIsEditing(false);
    // In a real app, this would save to the backend
    console.log('Saving changes:', eventData);
  };

  const handleCancelEvent = () => {
    setEventData(prev => ({ ...prev, status: 'Cancelled' }));
    setShowCancelModal(false);
    // In a real app, this would update the backend
  };

  const handleAddTeamMember = () => {
    if (newMember.name && newMember.role) {
      const newTeamMember: TeamMember = {
        id: Date.now().toString(),
        name: newMember.name,
        role: newMember.role
      };
      setEventData(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, newTeamMember]
      }));
      setNewMember({ name: '', role: '' });
      setShowAddMemberModal(false);
    }
  };

  const handleRemoveTeamMember = (memberId: string) => {
    setEventData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(member => member.id !== memberId)
    }));
  };

  const handleScanTickets = () => {
    navigate('/ticket-scanner');
  };

  const handlePromoteEvent = () => {
    // In a real app, this would open promotion tools
    alert('Promotion tools coming soon!');
  };

  const handleViewAttendees = () => {
    navigate(`/event-dashboard/${eventId}`);
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
              onClick={() => navigate('/profile')}
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
            <div className="bg-black rounded-lg p-6 text-center">
              <div className="text-green-400 text-3xl font-bold">{eventData.ticketsSold}</div>
              <div className="text-gray-400 text-sm">/ {eventData.numberOfTickets}</div>
              <div className="text-white text-sm mt-2">Tickets Sold</div>
            </div>
            
            <div className="bg-black rounded-lg p-6 text-center">
              <div className="text-green-400 text-3xl font-bold">2.5</div>
              <div className="text-gray-400 text-sm">/ 5M</div>
              <div className="text-white text-sm mt-2">Revenue</div>
            </div>
            
            <div className="bg-black rounded-lg p-6 text-center">
              <div className="text-green-400 text-3xl font-bold">5</div>
              <div className="text-white text-sm mt-2">Team</div>
            </div>
            
            <div className="bg-black rounded-lg p-6 text-center">
              <div className="text-green-400 text-3xl font-bold">12</div>
              <div className="text-white text-sm mt-2">Events listed</div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Event Poster */}
            <div className="lg:col-span-1">
              <div className="bg-[#2a2a2a] rounded-xl p-6">
                <img 
                  src={eventData.image} 
                  alt={eventData.name}
                  className="w-full h-96 object-cover rounded-lg mb-4"
                />
              </div>
            </div>

            {/* Right Side - Event Details */}
            <div className="lg:col-span-2">
              <div className="bg-[#2a2a2a] rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Event Details</h2>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-[#FC1924] hover:bg-[#e01620] text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Start Date:</label>
                      {isEditing ? (
                        <input 
                          type="text"
                          value={eventData.startDate}
                          onChange={(e) => setEventData(prev => ({ ...prev, startDate: e.target.value }))}
                          className="w-full bg-[#3a3a3a] text-white px-3 py-2 rounded border border-gray-600"
                        />
                      ) : (
                        <div className="text-white">{eventData.startDate}</div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Start Time:</label>
                      {isEditing ? (
                        <input 
                          type="text"
                          value={eventData.startTime}
                          onChange={(e) => setEventData(prev => ({ ...prev, startTime: e.target.value }))}
                          className="w-full bg-[#3a3a3a] text-white px-3 py-2 rounded border border-gray-600"
                        />
                      ) : (
                        <div className="text-white">{eventData.startTime}</div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Ticket Type:</label>
                      {isEditing ? (
                        <select 
                          value={eventData.ticketType}
                          onChange={(e) => setEventData(prev => ({ ...prev, ticketType: e.target.value }))}
                          className="w-full bg-[#3a3a3a] text-white px-3 py-2 rounded border border-gray-600"
                        >
                          <option value="Regular">Regular</option>
                          <option value="VIP">VIP</option>
                          <option value="Premium">Premium</option>
                        </select>
                      ) : (
                        <div className="text-white">{eventData.ticketType}</div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Status:</label>
                      <div className="text-white">{eventData.status}</div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Ticket Price:</label>
                      {isEditing ? (
                        <input 
                          type="number"
                          value={eventData.ticketPrice}
                          onChange={(e) => setEventData(prev => ({ ...prev, ticketPrice: parseInt(e.target.value) }))}
                          className="w-full bg-[#3a3a3a] text-white px-3 py-2 rounded border border-gray-600"
                        />
                      ) : (
                        <div className="text-white">₦{eventData.ticketPrice}</div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">End Date:</label>
                      {isEditing ? (
                        <input 
                          type="text"
                          value={eventData.endDate}
                          onChange={(e) => setEventData(prev => ({ ...prev, endDate: e.target.value }))}
                          className="w-full bg-[#3a3a3a] text-white px-3 py-2 rounded border border-gray-600"
                        />
                      ) : (
                        <div className="text-white">{eventData.endDate}</div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">End Time:</label>
                      {isEditing ? (
                        <input 
                          type="text"
                          value={eventData.endTime}
                          onChange={(e) => setEventData(prev => ({ ...prev, endTime: e.target.value }))}
                          className="w-full bg-[#3a3a3a] text-white px-3 py-2 rounded border border-gray-600"
                        />
                      ) : (
                        <div className="text-white">{eventData.endTime}</div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Visibility:</label>
                      {isEditing ? (
                        <select 
                          value={eventData.visibility}
                          onChange={(e) => setEventData(prev => ({ ...prev, visibility: e.target.value }))}
                          className="w-full bg-[#3a3a3a] text-white px-3 py-2 rounded border border-gray-600"
                        >
                          <option value="Public">Public</option>
                          <option value="Private">Private</option>
                        </select>
                      ) : (
                        <div className="text-white">{eventData.visibility}</div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Number of Tickets:</label>
                      {isEditing ? (
                        <input 
                          type="number"
                          value={eventData.numberOfTickets}
                          onChange={(e) => setEventData(prev => ({ ...prev, numberOfTickets: parseInt(e.target.value) }))}
                          className="w-full bg-[#3a3a3a] text-white px-3 py-2 rounded border border-gray-600"
                        />
                      ) : (
                        <div className="text-white">{eventData.numberOfTickets}</div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Currency:</label>
                      {isEditing ? (
                        <select 
                          value={eventData.currency}
                          onChange={(e) => setEventData(prev => ({ ...prev, currency: e.target.value }))}
                          className="w-full bg-[#3a3a3a] text-white px-3 py-2 rounded border border-gray-600"
                        >
                          <option value="NGN">NGN</option>
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                        </select>
                      ) : (
                        <div className="text-white">{eventData.currency}</div>
                      )}
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 flex justify-end">
                    <button 
                      onClick={handleSaveChanges}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              {/* Team & Roles Section */}
              <div className="bg-[#2a2a2a] rounded-xl p-6 mt-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Team & Roles</h2>
                  <button 
                    onClick={() => setShowAddMemberModal(true)}
                    className="bg-[#FC1924] hover:bg-[#e01620] text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add A New Member</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {eventData.teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between bg-[#3a3a3a] rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{member.name.charAt(0)}</span>
                        </div>
                        <span className="text-white">{member.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <select 
                          value={member.role}
                          onChange={(e) => {
                            setEventData(prev => ({
                              ...prev,
                              teamMembers: prev.teamMembers.map(m => 
                                m.id === member.id ? { ...m, role: e.target.value } : m
                              )
                            }));
                          }}
                          className="bg-[#4a4a4a] text-white px-3 py-1 rounded text-sm border border-gray-600"
                        >
                          <option value="Event Owner">Event Owner</option>
                          <option value="Manager">Manager</option>
                          <option value="Coordinator">Coordinator</option>
                          <option value="Staff">Staff</option>
                          <option value="Select Role">Select Role</option>
                        </select>
                        {member.role !== 'Event Owner' && (
                          <button 
                            onClick={() => handleRemoveTeamMember(member.id)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Attendees Section */}
          <div className="bg-[#2a2a2a] rounded-xl p-6 mt-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <button 
              onClick={handleScanTickets}
              className="bg-[#FC1924] hover:bg-[#e01620] text-white py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <QrCode className="w-5 h-5" />
              <span>Scan ticket (Barcode)</span>
            </button>
            
            <button 
              onClick={handlePromoteEvent}
              className="bg-[#FC1924] hover:bg-[#e01620] text-white py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Share className="w-5 h-5" />
              <span>Promot Event</span>
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
                disabled={!newMember.name || !newMember.role}
                className="flex-1 bg-[#FC1924] hover:bg-[#e01620] text-white py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Add Member
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