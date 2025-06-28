import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  ArrowRight, 
  Filter, 
  X, 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  Share, 
  Heart,
  Ticket
} from "lucide-react";
import { Sidebar } from "../../components/ui/sidebar";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  vibe: string;
  type: string;
  price: number;
  image: string;
}

export const Calendar = (): JSX.Element => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5)); // June 2025
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filters, setFilters] = useState({
    location: '',
    vibe: '',
    type: ''
  });

  // Mock events data
  const events: Event[] = [
    {
      id: 1,
      title: "Wet & Rave",
      date: "2025-06-05",
      time: "8:00 PM",
      location: "252b Ikoroduc cresent Dolphin estate Ikoyi",
      description: "Come and have the best time of your life at wet and wild girls and drinks money nah water",
      vibe: "Wild & Woke",
      type: "Party",
      price: 500,
      image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: 2,
      title: "Afrobeat Night",
      date: "2025-06-10",
      time: "9:00 PM",
      location: "Victoria Island, Lagos",
      description: "Experience the best of Afrobeat music with live performances",
      vibe: "Musical Vibes",
      type: "Concert",
      price: 750,
      image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: 3,
      title: "Tech Meetup",
      date: "2025-06-15",
      time: "6:00 PM",
      location: "Lekki Phase 1, Lagos",
      description: "Connect with fellow tech enthusiasts and innovators",
      vibe: "Professional",
      type: "Networking",
      price: 0,
      image: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: 4,
      title: "Summer Pool Party",
      date: "2025-06-20",
      time: "2:00 PM",
      location: "Ikoyi, Lagos",
      description: "Beat the heat with an amazing pool party experience",
      vibe: "Chill & Relaxed",
      type: "Party",
      price: 1000,
      image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: 5,
      title: "Art Exhibition",
      date: "2025-06-25",
      time: "4:00 PM",
      location: "National Theatre, Lagos",
      description: "Discover amazing local and international artworks",
      vibe: "Creative & Artistic",
      type: "Exhibition",
      price: 300,
      image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const hasEventsOnDate = (date: Date) => {
    return getEventsForDate(date).length > 0;
  };

  const handleDateClick = (date: Date) => {
    const dateEvents = getEventsForDate(date);
    if (dateEvents.length > 0) {
      setSelectedDate(date);
      setShowEventModal(true);
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(false);
    setShowEventDetail(true);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleCreateEvent = () => {
    navigate('/create-vibe');
  };

  const handleBuyTicket = (event: Event) => {
    navigate(`/ticket-purchase/${event.id}`);
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex relative overflow-hidden font-['Space_Grotesk']">
      <Sidebar currentPath="/calendar" />

      {/* Main Content */}
      <div className="flex-1 ml-20 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button onClick={handlePrevMonth} className="w-10 h-10 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-4xl font-bold text-white">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h1>
              <button onClick={handleNextMonth} className="w-10 h-10 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select 
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                className="bg-[#2a2a2a] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
              >
                <option value="">All Locations</option>
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Port Harcourt">Port Harcourt</option>
              </select>
              
              <select 
                value={filters.vibe}
                onChange={(e) => setFilters({...filters, vibe: e.target.value})}
                className="bg-[#2a2a2a] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
              >
                <option value="">All Vibes</option>
                <option value="Wild & Woke">Wild & Woke</option>
                <option value="Chill & Relaxed">Chill & Relaxed</option>
                <option value="Professional">Professional</option>
                <option value="Creative & Artistic">Creative & Artistic</option>
              </select>
              
              <select 
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="bg-[#2a2a2a] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FC1924] transition-all duration-200"
              >
                <option value="">All Types</option>
                <option value="Party">Party</option>
                <option value="Concert">Concert</option>
                <option value="Networking">Networking</option>
                <option value="Exhibition">Exhibition</option>
              </select>
              
              <button className="bg-[#FC1924] hover:bg-[#e01620] text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="bg-white rounded-2xl p-6 shadow-2xl animate-fade-in">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {dayNames.map((day) => (
                <div key={day} className="text-center font-semibold text-gray-700 py-3 bg-gray-100 rounded-lg">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`
                    h-24 border border-gray-200 rounded-lg p-2 cursor-pointer transition-all duration-300 hover:shadow-lg
                    ${day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'}
                    ${day && hasEventsOnDate(day) ? 'border-[#FC1924] bg-red-50' : ''}
                  `}
                  onClick={() => day && handleDateClick(day)}
                >
                  {day && (
                    <>
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {day.getDate()}
                      </div>
                      {hasEventsOnDate(day) && (
                        <div className="flex flex-wrap gap-1">
                          {getEventsForDate(day).slice(0, 2).map((event, eventIndex) => (
                            <div
                              key={eventIndex}
                              className="w-2 h-2 bg-[#FC1924] rounded-full animate-pulse"
                            />
                          ))}
                          {getEventsForDate(day).length > 2 && (
                            <div className="text-xs text-[#FC1924] font-bold">
                              +{getEventsForDate(day).length - 2}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events Sidebar */}
          <div className="mt-8 bg-[#2a2a2a] rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              {events.slice(0, 3).map((event) => (
                <div key={event.id} className="bg-[#3a3a3a] rounded-lg p-4 hover:bg-[#4a4a4a] transition-all duration-300 cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <img src={event.image} alt={event.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">{event.title}</h4>
                      <p className="text-gray-400 text-sm">{new Date(event.date).toLocaleDateString()} • {event.time}</p>
                    </div>
                    <div className="text-[#FC1924] font-bold">
                      {event.price === 0 ? 'Free' : `₦${event.price}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={handleCreateEvent}
              className="w-full mt-6 bg-[#FC1924] hover:bg-[#e01620] text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Create Event
            </button>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Events on {selectedDate.toLocaleDateString()}
              </h3>
              <button 
                onClick={() => setShowEventModal(false)}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-3">
              {getEventsForDate(selectedDate).map((event) => (
                <div 
                  key={event.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-[#FC1924] transition-colors duration-200 cursor-pointer"
                  onClick={() => handleEventClick(event)}
                >
                  <div className="flex items-center space-x-3">
                    <img src={event.image} alt={event.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600">{event.time} • {event.location}</p>
                      <p className="text-sm text-[#FC1924] font-medium">
                        {event.price === 0 ? 'Free' : `₦${event.price}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {showEventDetail && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h2>
              <button 
                onClick={() => setShowEventDetail(false)}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img 
                  src={selectedEvent.image} 
                  alt={selectedEvent.title} 
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{new Date(selectedEvent.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedEvent.location}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About Event</h3>
                <p className="text-gray-600 mb-4">{selectedEvent.description}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vibe:</span>
                    <span className="font-medium text-gray-900">{selectedEvent.vibe}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium text-gray-900">{selectedEvent.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-bold text-[#FC1924]">
                      {selectedEvent.price === 0 ? 'Free' : `₦${selectedEvent.price}`}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => handleBuyTicket(selectedEvent)}
                    className="w-full bg-[#FC1924] hover:bg-[#e01620] text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>Buy Ticket</span>
                  </button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
                      <Heart className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
                      <Share className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};