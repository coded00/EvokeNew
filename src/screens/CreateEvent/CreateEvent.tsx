import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Plus, X, Check } from "lucide-react";
import { Sidebar } from "../../components/ui/sidebar";

interface EventData {
  name: string;
  categories: string[];
  description: string;
  poster: File | null;
  location: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  vibes: string[];
  eventTask: string;
  specialAppearances: string;
  promoCode: string;
  entryType: string;
  currency: string;
  ticketTypes: Array<{
    name: string;
    type: string;
    price: number;
    description: string;
    quantity: number;
  }>;
  teamMembers: Array<{ name: string; responsibility: string }>;
}

export const CreateEvent = (): JSX.Element | null => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [eventData, setEventData] = useState<EventData>({
    name: "",
    categories: [],
    description: "",
    poster: null,
    location: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    vibes: [],
    eventTask: "",
    specialAppearances: "",
    promoCode: "",
    entryType: "",
    currency: "NGN",
    ticketTypes: [],
    teamMembers: []
  });

  const handleBackToCreateVibe = useCallback(() => {
    navigate('/create-vibe');
  }, [navigate]);

  const handleBackToHome = useCallback(() => {
    navigate('/home');
  }, [navigate]);

  const handleInputChange = useCallback((field: keyof EventData, value: string | number | string[]) => {
    setEventData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleFileUpload = useCallback((file: File) => {
    setEventData(prev => ({ ...prev, poster: file }));
  }, []);

  const addTeamMember = useCallback(() => {
    setEventData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { name: "", responsibility: "" }]
    }));
  }, []);

  const updateTeamMember = useCallback((index: number, field: 'name' | 'responsibility', value: string) => {
    setEventData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }));
  }, []);

  const removeTeamMember = useCallback((index: number) => {
    setEventData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  }, []);

  const addTicketType = useCallback(() => {
    setEventData(prev => ({
      ...prev,
      ticketTypes: [...prev.ticketTypes, {
        name: "",
        type: "",
        price: 0,
        description: "",
        quantity: 0
      }]
    }));
  }, []);

  const updateTicketType = useCallback((index: number, field: keyof EventData['ticketTypes'][0], value: string | number) => {
    setEventData(prev => ({
      ...prev,
      ticketTypes: prev.ticketTypes.map((ticket, i) => 
        i === index ? { ...ticket, [field]: value } : ticket
      )
    }));
  }, []);

  const removeTicketType = useCallback((index: number) => {
    setEventData(prev => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter((_, i) => i !== index)
    }));
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handlePublish = useCallback(async () => {
    setIsPublishing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsPublishing(false);
    setShowSuccess(true);
  }, []);

  const handleCategoryToggle = useCallback((category: string) => {
    setEventData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  }, []);

  const handleVibeToggle = useCallback((vibe: string) => {
    setEventData(prev => ({
      ...prev,
      vibes: prev.vibes.includes(vibe)
        ? prev.vibes.filter(v => v !== vibe)
        : [...prev.vibes, vibe]
    }));
  }, []);

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
                Event Dashboard
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
              <div className="text-center text-white animate-fade-in">
                <div className="text-8xl mb-6 animate-bounce">🎉</div>
                <h3 className="text-3xl font-bold mb-2">Create Amazing Events</h3>
                <p className="text-lg opacity-90">Bring people together for unforgettable experiences</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 ml-[calc(50%+80px)] p-8 flex items-center justify-center">
          <div className="w-full max-w-lg animate-slide-in-right">
            <button 
              onClick={handleBackToCreateVibe}
              className="flex items-center space-x-2 mb-8 text-white/80 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <h2 className="text-3xl font-bold text-white mb-8 text-center">Create Event</h2>

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
                <label className="block text-white text-sm font-medium mb-2">Categories</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => handleCategoryToggle(category)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        eventData.categories.includes(category)
                          ? 'bg-[#FC1924] text-white'
                          : 'bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                {eventData.categories.length > 0 && (
                  <p className="text-gray-400 text-sm mt-2">
                    Selected: {eventData.categories.join(', ')}
                  </p>
                )}
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
                Next {'→'}
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
              <div className="text-center text-white animate-fade-in">
                <div className="text-6xl mb-4">📍</div>
                <h3 className="text-3xl font-bold mb-2">Set the Details</h3>
                <p className="text-lg opacity-90">When and where will your event happen?</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 ml-[calc(50%+80px)] p-8 flex items-center justify-center">
          <div className="w-full max-w-lg animate-slide-in-right">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Create Details</h2>

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
                <div className="grid grid-cols-2 gap-2">
                  {vibes.map(vibe => (
                    <button
                      key={vibe}
                      onClick={() => handleVibeToggle(vibe)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        eventData.vibes.includes(vibe)
                          ? 'bg-[#FC1924] text-white'
                          : 'bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
                      }`}
                    >
                      {vibe}
                    </button>
                  ))}
                </div>
                {eventData.vibes.length > 0 && (
                  <p className="text-gray-400 text-sm mt-2">
                    Selected: {eventData.vibes.join(', ')}
                  </p>
                )}
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
                Next {'→'}
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
              <div className="text-center text-white animate-fade-in">
                <div className="text-6xl mb-4">🎫</div>
                <h3 className="text-3xl font-bold mb-2">Set Up Ticketing</h3>
                <p className="text-lg opacity-90">Configure pricing and manage your team</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 ml-[calc(50%+80px)] p-8 flex items-center justify-center">
          <div className="w-full max-w-lg animate-slide-in-right">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Ticketing</h2>

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
                <h3 className="text-xl font-bold text-white mb-4">Ticket Types</h3>
                <p className="text-gray-400 text-sm mb-4">Add different ticket types with pricing</p>
                
                <div className="space-y-4">
                  {eventData.ticketTypes.map((ticket, index) => (
                    <div key={index} className="bg-[#3a3a3a] rounded-lg p-4 border border-gray-600">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-lg font-semibold text-white">Ticket Type {index + 1}</h4>
                        <button 
                          onClick={() => removeTicketType(index)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white text-sm font-medium mb-2">Ticket Name</label>
                          <input
                            type="text"
                            value={ticket.name}
                            onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                            className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                            placeholder="e.g., Early Bird, VIP"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white text-sm font-medium mb-2">Ticket Type</label>
                          <select
                            value={ticket.type}
                            onChange={(e) => updateTicketType(index, 'type', e.target.value)}
                            className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200 appearance-none"
                          >
                            <option value="">Select type</option>
                            {ticketTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-white text-sm font-medium mb-2">Price ({eventData.currency})</label>
                          <input
                            type="number"
                            value={ticket.price}
                            onChange={(e) => updateTicketType(index, 'price', parseFloat(e.target.value) || 0)}
                            className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white text-sm font-medium mb-2">Quantity</label>
                          <input
                            type="number"
                            value={ticket.quantity}
                            onChange={(e) => updateTicketType(index, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <label className="block text-white text-sm font-medium mb-2">Description</label>
                        <textarea
                          value={ticket.description}
                          onChange={(e) => updateTicketType(index, 'description', e.target.value)}
                          className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
                          placeholder="Describe what's included with this ticket type"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                  
                  {eventData.ticketTypes.length === 0 && (
                    <button 
                      onClick={addTicketType}
                      className="w-full bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border-2 border-dashed border-gray-600"
                    >
                      + Add Ticket Type
                    </button>
                  )}
                  
                  {eventData.ticketTypes.length > 0 && (
                    <button 
                      onClick={addTicketType}
                      className="w-full bg-[#FC1924] hover:bg-[#e01620] text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                    >
                      + Add Another Ticket Type
                    </button>
                  )}
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
                  <label className="block text-white text-sm font-medium mb-2">Total Tickets</label>
                  <input
                    type="number"
                    value={eventData.ticketTypes.reduce((sum, ticket) => sum + ticket.quantity, 0)}
                    className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none transition-all duration-200"
                    placeholder="0"
                    disabled
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
                Next {'→'}
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
              <div className="text-center text-white animate-fade-in">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-3xl font-bold mb-2">Review & Publish</h3>
                <p className="text-lg opacity-90">Everything looks good? Let's make it live!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Summary */}
        <div className="flex-1 ml-[calc(50%+80px)] p-8 flex items-center justify-center">
          <div className="w-full max-w-lg animate-slide-in-right">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Event Summary</h2>

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
                      <span className="text-gray-400 text-sm">Entry Type</span>
                      <p className="text-white text-sm">{eventData.entryType || "Not set"}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Currency</span>
                      <p className="text-white text-sm">{eventData.currency}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Total Tickets</span>
                      <p className="text-white text-sm">{eventData.ticketTypes.reduce((sum, ticket) => sum + ticket.quantity, 0)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#2a2a2a] rounded-lg p-4">
                <span className="text-gray-400 text-sm">Categories:</span>
                <p className="text-white mt-1">{eventData.categories.join(', ') || "Not set"}</p>
              </div>

              <div className="bg-[#2a2a2a] rounded-lg p-4">
                <span className="text-gray-400 text-sm">Vibes:</span>
                <p className="text-white mt-1">{eventData.vibes.join(', ') || "Not set"}</p>
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

              {/* Ticket Types Summary */}
              {eventData.ticketTypes.length > 0 && (
                <div className="bg-[#2a2a2a] rounded-lg p-4">
                  <span className="text-gray-400 text-sm">Ticket Types</span>
                  <div className="mt-3 space-y-3">
                    {eventData.ticketTypes.map((ticket, index) => (
                      <div key={index} className="bg-[#3a3a3a] rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white font-semibold">{ticket.name || `Ticket ${index + 1}`}</p>
                            <p className="text-gray-400 text-sm">{ticket.type}</p>
                            {ticket.description && (
                              <p className="text-gray-400 text-xs mt-1">{ticket.description}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-[#FC1924] font-bold">{eventData.currency} {ticket.price.toLocaleString()}</p>
                            <p className="text-gray-400 text-sm">{ticket.quantity} tickets</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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