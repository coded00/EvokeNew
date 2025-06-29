import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Plus, X, Check } from "lucide-react";
import { Sidebar } from "../../components/ui/sidebar";

interface EventData {
  name: string;
  category: string;
  description: string;
  poster: File | null;
  location: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  vibe: string;
  eventTask: string;
  specialAppearances: string;
  promoCode: string;
  entryType: string;
  ticketName: string;
  ticketType: string;
  currency: string;
  numberOfTickets: string;
  teamMembers: Array<{ name: string; responsibility: string }>;
}

export const CreateEvent = (): JSX.Element | null => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [eventData, setEventData] = useState<EventData>({
    name: "",
    category: "",
    description: "",
    poster: null,
    location: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    vibe: "",
    eventTask: "",
    specialAppearances: "",
    promoCode: "",
    entryType: "",
    ticketName: "",
    ticketType: "",
    currency: "NGN",
    numberOfTickets: "",
    teamMembers: []
  });

  const handleBackToCreateVibe = () => {
    navigate('/create-vibe');
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  const handleInputChange = (field: keyof EventData, value: string) => {
    setEventData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (file: File) => {
    setEventData(prev => ({ ...prev, poster: file }));
  };

  const addTeamMember = () => {
    setEventData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { name: "", responsibility: "" }]
    }));
  };

  const updateTeamMember = (index: number, field: 'name' | 'responsibility', value: string) => {
    setEventData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const removeTeamMember = (index: number) => {
    setEventData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsPublishing(false);
    setShowSuccess(true);
  };

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

  // Success Modal
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex relative overflow-hidden font-['Space_Grotesk']">
        <Sidebar currentPath="/create-event" />
        <div className="flex-1 ml-20 flex items-center justify-center">
          <div className="bg-[#2a2a2a] rounded-2xl p-12 max-w-md w-full text-center animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Event Published</h2>
            <p className="text-green-400 text-xl mb-8">Successfully</p>
            
            <div className="space-y-4">
              <button 
                onClick={() => navigate(`/event-dashboard/1`)}
                className="w-full bg-[#FC1924] hover:bg-[#e01620] text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                Event Management
              </button>
              <button 
                onClick={handleBackToHome}
                className="w-full bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                Home
              </button>
            </div>
            
            <button className="w-full bg-[#FC1924] hover:bg-[#e01620] text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 mt-8">
              Share
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Basic Info
  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex relative overflow-hidden font-['Space_Grotesk']">
        <Sidebar currentPath="/create-event" />
        
        {/* Left Side - Community Image */}
        <div className="fixed left-20 top-0 w-1/2 h-full">
          <div 
            className="w-full h-full bg-cover bg-center relative"
            style={{ 
              backgroundImage: `url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDYwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iODAwIiBmaWxsPSIjRkMxOTI0Ii8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjIwMCIgcj0iNDAiIGZpbGw9IiMyMzIzNDUiLz4KPGNpcmNsZSBjeD0iNDUwIiBjeT0iMzAwIiByPSI1MCIgZmlsbD0iIzIzMjM0NSIvPgo8Y2lyY2xlIGN4PSIzMDAiIGN5PSI1MDAiIHI9IjYwIiBmaWxsPSIjMjMyMzQ1Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjYwMCIgcj0iMzUiIGZpbGw9IiMyMzIzNDUiLz4KPGNpcmNsZSBjeD0iNTAwIiBjeT0iNjUwIiByPSI0NSIgZmlsbD0iIzIzMjM0NSIvPgo8cG9seWdvbiBwb2ludHM9IjIwMCwxMDAgMjUwLDUwIDMwMCwxMDAgMjUwLDE1MCIgZmlsbD0iIzIzMjM0NSIvPgo8cG9seWdvbiBwb2ludHM9IjQwMCw0MDAgNDUwLDM1MCA1MDAsNDAwIDQ1MCw0NTAiIGZpbGw9IiMyMzIzNDUiLz4KPHBvbHlnb24gcG9pbnRzPSIxMDAsNDAwIDE1MCwzNTAgMjAwLDQwMCAxNTAsNDUwIiBmaWxsPSIjMjMyMzQ1Ii8+Cjwvc3ZnPgo=)` 
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FC1924]/90 to-[#FC1924]/70"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-3xl font-bold mb-2">Create Amazing Events</h3>
                <p className="text-lg opacity-90">Bring people together for unforgettable experiences</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 ml-[calc(50%+80px)] p-8 flex items-center">
          <div className="w-full max-w-lg animate-slide-in-right">
            <button 
              onClick={handleBackToCreateVibe}
              className="flex items-center space-x-2 mb-8 text-white/80 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <h2 className="text-3xl font-bold text-white mb-8">Create Event</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={eventData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                  placeholder="Enter event name"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Category</label>
                <div className="relative">
                  <select
                    value={eventData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200 appearance-none"
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#FC1924] rounded"></div>
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Description</label>
                <textarea
                  value={eventData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200 resize-none"
                  placeholder="Describe your event"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Poster</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-[#FC1924] transition-colors duration-200">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">Upload Poster</p>
                  <p className="text-gray-500 text-sm">Recommended size: 1080x1920px</p>
                  <button className="mt-4 bg-[#FC1924] hover:bg-[#e01620] text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105">
                    Upload
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button 
                onClick={nextStep}
                className="bg-[#FC1924] hover:bg-[#e01620] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                Next &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Details
  if (currentStep === 2) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex relative overflow-hidden font-['Space_Grotesk']">
        <Sidebar currentPath="/create-event" />
        
        {/* Left Side - Community Image */}
        <div className="fixed left-20 top-0 w-1/2 h-full">
          <div 
            className="w-full h-full bg-cover bg-center relative"
            style={{ 
              backgroundImage: `url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDYwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iODAwIiBmaWxsPSIjRkMxOTI0Ii8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjIwMCIgcj0iNDAiIGZpbGw9IiMyMzIzNDUiLz4KPGNpcmNsZSBjeD0iNDUwIiBjeT0iMzAwIiByPSI1MCIgZmlsbD0iIzIzMjM0NSIvPgo8Y2lyY2xlIGN4PSIzMDAiIGN5PSI1MDAiIHI9IjYwIiBmaWxsPSIjMjMyMzQ1Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjYwMCIgcj0iMzUiIGZpbGw9IiMyMzIzNDUiLz4KPGNpcmNsZSBjeD0iNTAwIiBjeT0iNjUwIiByPSI0NSIgZmlsbD0iIzIzMjM0NSIvPgo8cG9seWdvbiBwb2ludHM9IjIwMCwxMDAgMjUwLDUwIDMwMCwxMDAgMjUwLDE1MCIgZmlsbD0iIzIzMjM0NSIvPgo8cG9seWdvbiBwb2ludHM9IjQwMCw0MDAgNDUwLDM1MCA1MDAsNDAwIDQ1MCw0NTAiIGZpbGw9IiMyMzIzNDUiLz4KPHBvbHlnb24gcG9pbnRzPSIxMDAsNDAwIDE1MCwzNTAgMjAwLDQwMCAxNTAsNDUwIiBmaWxsPSIjMjMyMzQ1Ii8+Cjwvc3ZnPgo=)` 
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FC1924]/90 to-[#FC1924]/70"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">📍</div>
                <h3 className="text-3xl font-bold mb-2">Set the Details</h3>
                <p className="text-lg opacity-90">When and where will your event happen?</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 ml-[calc(50%+80px)] p-8 flex items-center">
          <div className="w-full max-w-lg animate-slide-in-right">
            <h2 className="text-3xl font-bold text-white mb-8">Create Details</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={eventData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                  placeholder="Enter event location"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Date & Time</label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={eventData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                    placeholder="Start date"
                  />
                  <input
                    type="date"
                    value={eventData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                    placeholder="End date"
                  />
                  <input
                    type="time"
                    value={eventData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className="bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                    placeholder="Start time"
                  />
                  <input
                    type="time"
                    value={eventData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    className="bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                    placeholder="End time"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">What's the Vibe(s)</label>
                <div className="relative">
                  <select
                    value={eventData.vibe}
                    onChange={(e) => handleInputChange('vibe', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200 appearance-none"
                  >
                    <option value="">Select vibe</option>
                    {vibes.map(vibe => (
                      <option key={vibe} value={vibe}>{vibe}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#FC1924] rounded"></div>
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Event Task</label>
                <p className="text-gray-400 text-sm mb-2">To make your event fun add some games</p>
                <p className="text-gray-500 text-xs mb-2">Optional</p>
                <input
                  type="text"
                  value={eventData.eventTask}
                  onChange={(e) => handleInputChange('eventTask', e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200 opacity-60"
                  placeholder="Add event tasks (Coming soon)"
                  disabled
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Special Appearance(s)</label>
                  <p className="text-gray-400 text-sm mb-2">Let your guest who is coming onboard</p>
                  <input
                    type="text"
                    value={eventData.specialAppearances}
                    onChange={(e) => handleInputChange('specialAppearances', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Promo Code</label>
                  <p className="text-gray-400 text-sm mb-2">Discount code to promote event</p>
                  <input
                    type="text"
                    value={eventData.promoCode}
                    onChange={(e) => handleInputChange('promoCode', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button 
                onClick={prevStep}
                className="flex items-center space-x-2 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button 
                onClick={nextStep}
                className="bg-[#FC1924] hover:bg-[#e01620] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                Next &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Ticketing
  if (currentStep === 3) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex relative overflow-hidden font-['Space_Grotesk']">
        <Sidebar currentPath="/create-event" />
        
        {/* Left Side - Community Image */}
        <div className="fixed left-20 top-0 w-1/2 h-full">
          <div 
            className="w-full h-full bg-cover bg-center relative"
            style={{ 
              backgroundImage: `url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDYwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iODAwIiBmaWxsPSIjRkMxOTI0Ii8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjIwMCIgcj0iNDAiIGZpbGw9IiMyMzIzNDUiLz4KPGNpcmNsZSBjeD0iNDUwIiBjeT0iMzAwIiByPSI1MCIgZmlsbD0iIzIzMjM0NSIvPgo8Y2lyY2xlIGN4PSIzMDAiIGN5PSI1MDAiIHI9IjYwIiBmaWxsPSIjMjMyMzQ1Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjYwMCIgcj0iMzUiIGZpbGw9IiMyMzIzNDUiLz4KPGNpcmNsZSBjeD0iNTAwIiBjeT0iNjUwIiByPSI0NSIgZmlsbD0iIzIzMjM0NSIvPgo8cG9seWdvbiBwb2ludHM9IjIwMCwxMDAgMjUwLDUwIDMwMCwxMDAgMjUwLDE1MCIgZmlsbD0iIzIzMjM0NSIvPgo8cG9seWdvbiBwb2ludHM9IjQwMCw0MDAgNDUwLDM1MCA1MDAsNDAwIDQ1MCw0NTAiIGZpbGw9IiMyMzIzNDUiLz4KPHBvbHlnb24gcG9pbnRzPSIxMDAsNDAwIDE1MCwzNTAgMjAwLDQwMCAxNTAsNDUwIiBmaWxsPSIjMjMyMzQ1Ii8+Cjwvc3ZnPgo=)` 
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FC1924]/90 to-[#FC1924]/70"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">🎫</div>
                <h3 className="text-3xl font-bold mb-2">Set Up Ticketing</h3>
                <p className="text-lg opacity-90">Configure pricing and manage your team</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 ml-[calc(50%+80px)] p-8 flex items-center">
          <div className="w-full max-w-lg animate-slide-in-right">
            <h2 className="text-3xl font-bold text-white mb-8">Ticketing</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Entry type</label>
                <div className="relative">
                  <select
                    value={eventData.entryType}
                    onChange={(e) => handleInputChange('entryType', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200 appearance-none"
                  >
                    <option value="">Select entry type</option>
                    {entryTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#FC1924] rounded"></div>
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Name ticket</label>
                <input
                  type="text"
                  value={eventData.ticketName}
                  onChange={(e) => handleInputChange('ticketName', e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                  placeholder="Enter ticket name"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Ticket type (S)</label>
                <div className="relative">
                  <select
                    value={eventData.ticketType}
                    onChange={(e) => handleInputChange('ticketType', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200 appearance-none"
                  >
                    <option value="">Select ticket type</option>
                    {ticketTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#FC1924] rounded"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Currency</label>
                  <div className="relative">
                    <select
                      value={eventData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200 appearance-none"
                    >
                      {currencies.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#FC1924] rounded"></div>
                  </div>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Number of tickets</label>
                  <input
                    type="number"
                    value={eventData.numberOfTickets}
                    onChange={(e) => handleInputChange('numberOfTickets', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">Management</h3>
                <p className="text-gray-400 text-sm mb-4">Add team members</p>
                
                <div className="space-y-3">
                  {eventData.teamMembers.map((member, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                        className="flex-1 bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                        placeholder="Select from your Vibe list"
                      />
                      <button 
                        onClick={() => addTeamMember()}
                        className="bg-[#FC1924] hover:bg-[#e01620] text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                      >
                        +
                      </button>
                      <input
                        type="text"
                        value={member.responsibility}
                        onChange={(e) => updateTeamMember(index, 'responsibility', e.target.value)}
                        className="flex-1 bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                        placeholder="Select their responsibility"
                      />
                      <button 
                        onClick={() => removeTeamMember(index)}
                        className="bg-[#FC1924] hover:bg-[#e01620] text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                      >
                        Set
                      </button>
                    </div>
                  ))}
                  
                  {eventData.teamMembers.length === 0 && (
                    <button 
                      onClick={addTeamMember}
                      className="w-full bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border-2 border-dashed border-gray-600"
                    >
                      + Add Team Member
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button 
                onClick={prevStep}
                className="flex items-center space-x-2 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button 
                onClick={nextStep}
                className="bg-[#FC1924] hover:bg-[#e01620] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                Next &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Summary
  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex relative overflow-hidden font-['Space_Grotesk']">
        <Sidebar currentPath="/create-event" />
        
        {/* Left Side - Community Image */}
        <div className="fixed left-20 top-0 w-1/2 h-full">
          <div 
            className="w-full h-full bg-cover bg-center relative"
            style={{ 
              backgroundImage: `url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDYwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iODAwIiBmaWxsPSIjRkMxOTI0Ii8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjIwMCIgcj0iNDAiIGZpbGw9IiMyMzIzNDUiLz4KPGNpcmNsZSBjeD0iNDUwIiBjeT0iMzAwIiByPSI1MCIgZmlsbD0iIzIzMjM0NSIvPgo8Y2lyY2xlIGN4PSIzMDAiIGN5PSI1MDAiIHI9IjYwIiBmaWxsPSIjMjMyMzQ1Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjYwMCIgcj0iMzUiIGZpbGw9IiMyMzIzNDUiLz4KPGNpcmNsZSBjeD0iNTAwIiBjeT0iNjUwIiByPSI0NSIgZmlsbD0iIzIzMjM0NSIvPgo8cG9seWdvbiBwb2ludHM9IjIwMCwxMDAgMjUwLDUwIDMwMCwxMDAgMjUwLDE1MCIgZmlsbD0iIzIzMjM0NSIvPgo8cG9seWdvbiBwb2ludHM9IjQwMCw0MDAgNDUwLDM1MCA1MDAsNDAwIDQ1MCw0NTAiIGZpbGw9IiMyMzIzNDUiLz4KPHBvbHlnb24gcG9pbnRzPSIxMDAsNDAwIDE1MCwzNTAgMjAwLDQwMCAxNTAsNDUwIiBmaWxsPSIjMjMyMzQ1Ii8+Cjwvc3ZnPgo=)` 
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FC1924]/90 to-[#FC1924]/70"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-3xl font-bold mb-2">Review & Publish</h3>
                <p className="text-lg opacity-90">Everything looks good? Let's make it live!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Summary */}
        <div className="flex-1 ml-[calc(50%+80px)] p-8 flex items-center">
          <div className="w-full max-w-lg animate-slide-in-right">
            <h2 className="text-3xl font-bold text-white mb-8">Event Summary</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#2a2a2a] rounded-lg p-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm">Name</span>
                      <p className="text-white">{eventData.name || "Not set"}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Description</span>
                      <p className="text-white text-sm">{eventData.description || "Not set"}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Location</span>
                      <p className="text-white text-sm">{eventData.location || "Not set"}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Date</span>
                      <p className="text-white text-sm">{eventData.startDate || "Not set"}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Time</span>
                      <p className="text-white text-sm">{eventData.startTime || "Not set"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#2a2a2a] rounded-lg p-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm">Special Appearance</span>
                      <p className="text-white text-sm">{eventData.specialAppearances || "None"}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Ticket Type</span>
                      <p className="text-white text-sm">{eventData.ticketType || "Not set"}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Ticket Name</span>
                      <p className="text-white text-sm">{eventData.ticketName || "Not set"}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Currency</span>
                      <p className="text-white text-sm">{eventData.currency}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Number of Ticket</span>
                      <p className="text-white text-sm">{eventData.numberOfTickets || "0"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#2a2a2a] rounded-lg p-4">
                <span className="text-gray-400 text-sm">Vibes :</span>
                <p className="text-white mt-1">{eventData.vibe || "Not set"}</p>
              </div>

              <div className="bg-[#2a2a2a] rounded-lg p-4">
                <span className="text-gray-400 text-sm">Team</span>
                <div className="mt-2">
                  {eventData.teamMembers.length > 0 ? (
                    eventData.teamMembers.map((member, index) => (
                      <p key={index} className="text-white text-sm">
                        {member.name} - {member.responsibility}
                      </p>
                    ))
                  ) : (
                    <p className="text-white text-sm">No team members added</p>
                  )}
                </div>
              </div>

              {/* Event Poster Preview */}
              <div className="bg-[#2a2a2a] rounded-lg p-4 flex justify-center">
                <div className="w-32 h-48 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-2xl font-bold mb-2">Rave &</div>
                    <div className="text-2xl font-bold mb-4">Splash</div>
                    <div className="text-xs">let's get wild</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-8">
              <button 
                onClick={prevStep}
                className="flex items-center space-x-2 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              
              <button className="text-white hover:text-gray-300 transition-colors duration-200">
                Edit
              </button>
              
              <button 
                onClick={handlePublish}
                disabled={isPublishing}
                className="bg-[#FC1924] hover:bg-[#e01620] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPublishing ? "Publishing..." : "Publish Event"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};