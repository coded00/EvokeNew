import React, { useState, useEffect } from "react";
import { Bell, MessageCircle, Gamepad2, Globe, User, HelpCircle, X, Search, Calendar, MapPin, Zap, ChevronLeft, ChevronRight, Share, Heart, Plus, Minus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SEO from "../../components/SEO";
import { Sidebar } from "../../components/ui/sidebar";
import { useLoadingScreen } from "../../components/ui/loading";

export const Home = (): JSX.Element => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'events', 'ticket'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [ticketType, setTicketType] = useState('Regular');
  const { isLoading, showLoading, LoadingComponent } = useLoadingScreen();

  const notifications = [
    {
      id: 1,
      title: "You have a new Vibe Request",
      subtitle: "From FreakyzEE",
      time: "2 min ago",
      type: "request",
      actions: ["Accept", "Decline"]
    },
    {
      id: 2,
      title: "Link up Request Accepted",
      subtitle: "5 out of 10 Vibes",
      time: "5 min ago",
      type: "accepted",
      actions: ["View"]
    },
    {
      id: 3,
      title: "You have 45 reactions to your Message",
      subtitle: "In Obi's Lounge",
      time: "10 min ago",
      type: "reaction"
    },
    {
      id: 4,
      title: "Event Reminder",
      subtitle: "Beach Party starts in 1 hour",
      time: "1 hour ago",
      type: "reminder"
    },
    {
      id: 5,
      title: "New Friend Request",
      subtitle: "From Alex_Music",
      time: "2 hours ago",
      type: "friend",
      actions: ["Accept", "Decline"]
    }
  ];

  const promoSlides = [
    {
      id: 1,
      title: "Wet & Wild",
      subtitle: "Come and have the best time of your life at wet and wild girls and drinks money nah water",
      image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800",
      cta: "Buy Ticket"
    },
    {
      id: 2,
      title: "Summer Vibes",
      subtitle: "Join the hottest summer party with amazing DJs and unlimited fun",
      image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800",
      cta: "Get Tickets"
    },
    {
      id: 3,
      title: "Night Fever",
      subtitle: "Dance the night away with the best music and incredible atmosphere",
      image: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=800",
      cta: "Join Now"
    }
  ];

  const events = [
    {
      id: 1,
      title: "Wet & Rave",
      location: "252b Ikoroduc cresent Dolphin estate Ikoyi",
      date: "12th Of June 2025",
      price: "8K",
      originalPrice: 500,
      image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600",
      host: "Freezy Kee",
      startTime: "12 noon",
      endTime: "Till mama calls",
      about: "Our Love Letter event to our prospective members. It's Games, It's magic, it's community, It's love!!! Come connect with people over a cup of coffee",
      vibes: ["Wild & Woke", "18+ & Unhinged", "18+ & Unhinged"],
      attending: 4,
      countdown: "3d 6hr 45mins",
      ticketTypes: {
        Regular: 500,
        VIP: 1000,
        Premium: 1500
      }
    },
    {
      id: 2,
      title: "Rave & Splash",
      location: "252b Ikoroduc cresent Dolphin estate Ikoyi",
      date: "10th June 2025",
      price: "10K",
      originalPrice: 750,
      image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=600",
      host: "DJ Splash",
      startTime: "8 PM",
      endTime: "4 AM",
      about: "The ultimate water party experience with world-class DJs and amazing vibes",
      vibes: ["Wet & Wild", "Party Mode", "18+ Only"],
      attending: 12,
      countdown: "5d 2hr 15mins",
      ticketTypes: {
        Regular: 750,
        VIP: 1250,
        Premium: 1750
      }
    },
    {
      id: 3,
      title: "Kreators Park Takeover",
      location: "252b Ikoroduc cresent Dolphin estate Ikoyi",
      date: "10th June 2025",
      price: "20K",
      originalPrice: 1200,
      image: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=600",
      host: "Kreators Collective",
      startTime: "6 PM",
      endTime: "2 AM",
      about: "Creative minds unite for an unforgettable night of art, music, and connection",
      vibes: ["Creative", "Artistic", "Networking"],
      attending: 8,
      countdown: "7d 12hr 30mins",
      ticketTypes: {
        Regular: 1200,
        VIP: 2000,
        Premium: 2500
      }
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    if (currentView === 'home') {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [currentView, promoSlides.length]);

  const handleCardClick = (cardType: string) => {
    if (cardType === 'events') {
      showLoading(1500);
      setTimeout(() => setCurrentView('events'), 1500);
    } else if (cardType === 'create-vibe') {
      showLoading(1200);
      setTimeout(() => navigate('/create-vibe'), 1200);
    } else if (cardType === 'profile') {
      showLoading(1000);
      setTimeout(() => navigate('/profile'), 1000);
    } else if (cardType === 'calendar') {
      showLoading(1300);
      setTimeout(() => navigate('/calendar'), 1300);
    } else if (cardType === 'find-vibe') {
      // Show coming soon message for Find a Vibe
      alert('Find a Vibe feature coming soon! Connect with like-minded people and join existing vibes in your area.');
    }
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setCurrentView('ticket');
    setTicketQuantity(1);
    setTicketType('Regular');
  };

  const handleBuyTicket = (event: any) => {
    showLoading(1000);
    setTimeout(() => navigate(`/event/${event.id}`), 1000);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedEvent(null);
  };

  const handleBackToEvents = () => {
    setCurrentView('events');
    setSelectedEvent(null);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promoSlides.length) % promoSlides.length);
  };

  const getNotificationIcon = (type: string) => {
    const iconClass = "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm";
    switch (type) {
      case 'request':
        return <div className={`${iconClass} bg-gradient-to-br from-purple-500 to-pink-500`}>VR</div>;
      case 'accepted':
        return <div className={`${iconClass} bg-gradient-to-br from-green-500 to-emerald-500`}>✓</div>;
      case 'reaction':
        return <div className={`${iconClass} bg-gradient-to-br from-orange-500 to-red-500`}>45</div>;
      case 'reminder':
        return <div className={`${iconClass} bg-gradient-to-br from-blue-500 to-cyan-500`}>⏰</div>;
      case 'friend':
        return <div className={`${iconClass} bg-gradient-to-br from-indigo-500 to-purple-500`}>👤</div>;
      default:
        return <div className={`${iconClass} bg-gradient-to-br from-gray-500 to-slate-500`}>•</div>;
    }
  };

  const getCurrentPrice = () => {
    if (!selectedEvent) return 0;
    return selectedEvent.ticketTypes[ticketType] * ticketQuantity;
  };

  // Show loading screen if loading
  if (isLoading) {
    return <LoadingComponent />;
  }

  // Home View
  if (currentView === 'home') {
    return (
      <>
        <SEO 
          title="Home"
          description="Welcome to EVOKE - Discover amazing events, create your own vibes, and connect with communities. Find events, manage your schedule, and experience unforgettable moments."
          keywords="events, discover events, create vibe, calendar, event management, social events"
        />
        <div className="min-h-screen bg-[#1a1a1a] flex relative overflow-hidden font-['Space_Grotesk']">
          <Sidebar currentPath="/home" />

          {/* Main Content */}
          <div className="flex-1 ml-20 p-8 transition-all duration-500 ease-in-out">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 lg:mb-12 space-y-4 lg:space-y-0">
              <div className="animate-fade-in">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Welcome Solomon</h1>
                <p className="text-lg sm:text-xl text-gray-400">What would you like to do today?</p>
              </div>

              {/* User Profile */}
              <div className="flex items-center space-x-3 lg:space-x-4 animate-fade-in w-full lg:w-auto justify-end">
                <div className="relative cursor-pointer group" onClick={toggleNotifications}>
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <Bell className="w-6 h-6 text-gray-400 group-hover:text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 bg-[#FC1924] rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-xs text-white font-bold">5</span>
                  </div>
                </div>

                <div 
                  className="flex items-center space-x-2 lg:space-x-3 bg-[#2a2a2a] rounded-xl px-3 lg:px-4 py-2 hover:bg-[#3a3a3a] transition-all duration-300 cursor-pointer hover:scale-105"
                  onClick={() => handleCardClick('profile')}
                >
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">S</span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-white font-medium text-sm lg:text-base">Solomon</p>
                    <p className="text-gray-400 text-xs lg:text-sm">Creator</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Promotional Slider */}
            <div className="relative mb-8 lg:mb-12 animate-slide-up">
              <div className="relative h-48 sm:h-56 lg:h-64 rounded-2xl overflow-hidden shadow-2xl">
                <div 
                  className="flex transition-transform duration-700 ease-in-out h-full"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {promoSlides.map((slide) => (
                    <div key={slide.id} className="min-w-full h-full relative">
                      <div 
                        className="w-full h-full bg-cover bg-center relative"
                        style={{ backgroundImage: `url(${slide.image})` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-pink-600/80"></div>
                        <div className="relative z-10 p-4 sm:p-6 lg:p-8 h-full flex flex-col lg:flex-row items-center justify-between">
                          <div className="text-white max-w-md text-center lg:text-left">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 lg:mb-4">{slide.title}</h2>
                            <p className="text-sm sm:text-base lg:text-lg mb-4 lg:mb-6 opacity-90 line-clamp-2 lg:line-clamp-none">{slide.subtitle}</p>
                            <button className="bg-[#FC1924] hover:bg-[#e01620] text-white px-6 lg:px-8 py-2 lg:py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm lg:text-base">
                              {slide.cta}
                            </button>
                          </div>
                          <div className="hidden lg:block mt-4 lg:mt-0">
                            <div className="w-48 lg:w-64 h-32 lg:h-40 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
                              <div className="text-white text-center">
                                <div className="text-xl lg:text-2xl font-bold mb-2">TIME</div>
                                <div className="text-xs lg:text-sm opacity-75">DATE</div>
                                <div className="text-xs lg:text-sm opacity-75">LOCATION</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Slider Controls */}
                <button 
                  onClick={prevSlide}
                  className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                </button>
                <button 
                  onClick={nextSlide}
                  className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                </button>

                {/* Slider Indicators */}
                <div className="absolute bottom-2 lg:bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {promoSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 animate-slide-up">
              <div 
                className="relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-slate-100 to-gray-200 border-2 border-black group"
                onClick={() => handleCardClick('events')}
              >
                <div className="h-48 sm:h-56 lg:h-64 p-4 lg:p-6 flex flex-col justify-between relative">
                  <div className="relative z-10">
                    <span className="text-gray-700 text-xs lg:text-sm font-medium uppercase tracking-wider">EVENTS</span>
                    <h3 className="text-gray-900 text-lg sm:text-xl lg:text-2xl font-bold mt-2 mb-1">FIND EVENTS</h3>
                    <p className="text-gray-600 text-xs lg:text-sm">Discover nearby events</p>
                  </div>
                  <div className="absolute bottom-3 lg:bottom-4 right-3 lg:right-4 w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Search className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div 
                className="relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-blue-100 to-cyan-200 border-2 border-black group"
                onClick={() => handleCardClick('create-vibe')}
              >
                <div className="h-48 sm:h-56 lg:h-64 p-4 lg:p-6 flex flex-col justify-between relative">
                  <div className="relative z-10">
                    <span className="text-blue-800 text-xs lg:text-sm font-medium uppercase tracking-wider">SOCIAL</span>
                    <h3 className="text-blue-900 text-lg sm:text-xl lg:text-2xl font-bold mt-2 mb-1">CREATE VIBE</h3>
                    <p className="text-blue-700 text-xs lg:text-sm">Start your own vibe</p>
                  </div>
                  <div className="absolute bottom-3 lg:bottom-4 right-3 lg:right-4 w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Zap className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div 
                className="relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-purple-100 to-pink-200 border-2 border-black group"
                onClick={() => handleCardClick('find-vibe')}
              >
                <div className="h-48 sm:h-56 lg:h-64 p-4 lg:p-6 flex flex-col justify-between relative">
                  <div className="relative z-10">
                    <span className="text-purple-800 text-xs lg:text-sm font-medium uppercase tracking-wider">SOCIAL</span>
                    <h3 className="text-purple-900 text-lg sm:text-xl lg:text-2xl font-bold mt-2 mb-1">FIND A VIBE</h3>
                    <p className="text-purple-700 text-xs lg:text-sm">Join existing vibes</p>
                    <div className="mt-2 lg:mt-3 inline-flex items-center space-x-2 bg-yellow-500/20 text-yellow-700 px-2 lg:px-3 py-1 rounded-full text-xs font-medium">
                      <span>Coming Soon</span>
                    </div>
                  </div>
                  <div className="absolute bottom-3 lg:bottom-4 right-3 lg:right-4 w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <User className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div 
                className="relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-green-100 to-emerald-200 border-2 border-black group"
                onClick={() => handleCardClick('calendar')}
              >
                <div className="h-48 sm:h-56 lg:h-64 p-4 lg:p-6 flex flex-col justify-between relative">
                  <div className="relative z-10">
                    <span className="text-green-800 text-xs lg:text-sm font-medium uppercase tracking-wider">PLANNING</span>
                    <h3 className="text-green-900 text-lg sm:text-xl lg:text-2xl font-bold mt-2 mb-1">CALENDAR</h3>
                    <p className="text-green-700 text-xs lg:text-sm">Manage your schedule</p>
                  </div>
                  <div className="absolute bottom-3 lg:bottom-4 right-3 lg:right-4 w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Calendar className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Panel */}
          <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
            showNotifications ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="p-4 lg:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Notifications</h2>
                <button 
                  onClick={toggleNotifications}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="overflow-y-auto h-full pb-20">
              <div className="p-3 lg:p-4 space-y-3 lg:space-y-4">
                {notifications.map((notification, index) => (
                  <div 
                    key={notification.id} 
                    className="bg-gray-50 hover:bg-gray-100 rounded-xl p-3 lg:p-4 transition-all duration-200 cursor-pointer border border-gray-200 hover:border-gray-300 animate-slide-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs lg:text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{notification.title}</h4>
                        <p className="text-xs lg:text-sm text-gray-600 mb-2 line-clamp-1">{notification.subtitle}</p>
                        <p className="text-xs text-gray-400">{notification.time}</p>
                        {notification.actions && (
                          <div className="flex flex-wrap gap-2 mt-2 lg:mt-3">
                            {notification.actions.map((action, actionIndex) => (
                              <button
                                key={actionIndex}
                                className={`px-2 lg:px-3 py-1 text-xs font-medium rounded-lg transition-colors duration-200 ${
                                  action === 'Accept' || action === 'View'
                                    ? 'bg-[#FC1924] text-white hover:bg-[#e01620]'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {showNotifications && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
              onClick={toggleNotifications}
            />
          )}
        </div>
      </>
    );
  }

  // Events Discovery View
  if (currentView === 'events') {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex flex-col lg:flex-row relative overflow-hidden font-['Space_Grotesk'] animate-slide-in-right">
        <Sidebar currentPath="/home" />

        {/* Main Content */}
        <div className="flex-1 ml-0 lg:ml-20">
          {/* Hero Section */}
          <div className="relative h-64 lg:h-80 bg-gradient-to-br from-purple-600 to-pink-600 overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: 'url(https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1200)' }}
            ></div>
            <div className="relative z-10 p-4 lg:p-8 h-full flex flex-col lg:flex-row items-center justify-between">
              <div className="text-white max-w-md text-center lg:text-left">
                <button 
                  onClick={handleBackToHome}
                  className="flex items-center space-x-2 mb-3 lg:mb-4 text-white/80 hover:text-white transition-colors duration-200 mx-auto lg:mx-0"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Home</span>
                </button>
                <h1 className="text-3xl lg:text-5xl font-bold mb-3 lg:mb-4">Wet & Wild</h1>
                <p className="text-base lg:text-xl mb-4 lg:mb-6 opacity-90 line-clamp-3 lg:line-clamp-none">Come and have the best time of your life at wet and wild girls and drinks money nah water</p>
                <button className="bg-[#FC1924] hover:bg-[#e01620] text-white px-6 lg:px-8 py-2 lg:py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  Buy Ticket
                </button>
              </div>
              <div className="hidden lg:block mt-4 lg:mt-0">
                <div className="w-64 lg:w-80 h-40 lg:h-48 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 p-4 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-2xl lg:text-3xl font-bold mb-2">TIME</div>
                    <div className="text-base lg:text-lg opacity-75 mb-1">DATE</div>
                    <div className="text-sm lg:text-base opacity-75">LOCATION</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-8 bg-white">
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 max-w-4xl">
              <div className="flex-1 min-w-0 lg:min-w-64 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search By Event Name"
                  className="w-full pl-10 pr-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 text-sm lg:text-base"
                />
              </div>
              <div className="relative flex-1 lg:flex-none">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Date"
                  className="w-full lg:w-32 pl-10 pr-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 text-sm lg:text-base"
                />
              </div>
              <div className="relative flex-1 lg:flex-none">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Location"
                  className="w-full lg:w-36 pl-10 pr-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 text-sm lg:text-base"
                />
              </div>
              <div className="relative flex-1 lg:flex-none">
                <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Vibe"
                  className="w-full lg:w-28 pl-10 pr-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 text-sm lg:text-base"
                />
              </div>
              <button className="bg-[#FC1924] hover:bg-[#e01620] text-white px-6 lg:px-8 py-2 lg:py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 text-sm lg:text-base">
                Search
              </button>
            </div>
          </div>

          {/* Events Sections */}
          <div className="p-4 lg:p-8 space-y-8 lg:space-y-12">
            {/* Trending Events */}
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 lg:mb-6 space-y-2 sm:space-y-0">
                <h2 className="text-2xl lg:text-3xl font-bold text-white">Trending Events</h2>
                <div className="flex space-x-2">
                  <button className="w-8 h-8 lg:w-10 lg:h-10 bg-[#FC1924] hover:bg-[#e01620] rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110">
                    <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>
                  <button className="w-8 h-8 lg:w-10 lg:h-10 bg-[#FC1924] hover:bg-[#e01620] rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110">
                    <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {events.map((event, index) => (
                  <div 
                    key={event.id} 
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="relative h-40 lg:h-48">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 lg:top-4 left-2 lg:left-4 flex flex-wrap gap-1 lg:gap-2">
                        <div className="bg-black/70 text-white px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold">
                          {event.price}
                        </div>
                        <div className="bg-green-500 text-white px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold">
                          10K
                        </div>
                        <div className="bg-yellow-500 text-white px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold">
                          20K
                        </div>
                      </div>
                    </div>
                    <div className="p-4 lg:p-6">
                      <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 line-clamp-1">{event.title}</h3>
                      <p className="text-gray-600 text-xs lg:text-sm mb-2 line-clamp-2">{event.location}</p>
                      <p className="text-gray-600 text-xs lg:text-sm mb-3 lg:mb-4">{event.date}</p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuyTicket(event);
                        }}
                        className="w-full bg-[#FC1924] hover:bg-[#e01620] text-white py-2 lg:py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 text-sm lg:text-base"
                      >
                        Buy Ticket
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Events In Lagos */}
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 lg:mb-6 space-y-2 sm:space-y-0">
                <h2 className="text-2xl lg:text-3xl font-bold text-white">Events In Lagos</h2>
                <div className="flex space-x-2">
                  <button className="w-8 h-8 lg:w-10 lg:h-10 bg-[#FC1924] hover:bg-[#e01620] rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110">
                    <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>
                  <button className="w-8 h-8 lg:w-10 lg:h-10 bg-[#FC1924] hover:bg-[#e01620] rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110">
                    <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {events.map((event, index) => (
                  <div 
                    key={`lagos-${event.id}`} 
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in-up"
                    style={{ animationDelay: `${(index + 3) * 0.1}s` }}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="relative h-40 lg:h-48">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 lg:top-4 left-2 lg:left-4 flex flex-wrap gap-1 lg:gap-2">
                        <div className="bg-black/70 text-white px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold">
                          {event.price}
                        </div>
                        <div className="bg-green-500 text-white px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold">
                          10K
                        </div>
                        <div className="bg-yellow-500 text-white px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold">
                          20K
                        </div>
                      </div>
                    </div>
                    <div className="p-4 lg:p-6">
                      <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 line-clamp-1">{event.title}</h3>
                      <p className="text-gray-600 text-xs lg:text-sm mb-2 line-clamp-2">{event.location}</p>
                      <p className="text-gray-600 text-xs lg:text-sm mb-3 lg:mb-4">{event.date}</p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuyTicket(event);
                        }}
                        className="w-full bg-[#FC1924] hover:bg-[#e01620] text-white py-2 lg:py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 text-sm lg:text-base"
                      >
                        Buy Ticket
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Ticket Purchase View
  if (currentView === 'ticket' && selectedEvent) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex flex-col lg:flex-row relative overflow-hidden font-['Space_Grotesk'] animate-slide-in-right">
        <Sidebar currentPath="/home" />

        {/* Main Content */}
        <div className="flex-1 ml-0 lg:ml-20 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <button 
              onClick={handleBackToEvents}
              className="flex items-center space-x-2 mb-4 lg:mb-8 text-white/80 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Events</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
              {/* Event Image */}
              <div className="space-y-4 lg:space-y-6 animate-fade-in">
                <div className="relative h-64 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={selectedEvent.image} 
                    alt={selectedEvent.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 lg:top-4 left-2 lg:left-4 flex flex-wrap gap-1 lg:gap-2">
                    <div className="bg-black/70 text-white px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold">
                      8K
                    </div>
                    <div className="bg-green-500 text-white px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold">
                      10K
                    </div>
                    <div className="bg-yellow-500 text-white px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold">
                      20K
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-4 lg:space-y-6 animate-fade-in-delay">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-3 lg:space-y-0">
                  <h1 className="text-2xl lg:text-4xl font-bold text-white">{selectedEvent.title}</h1>
                  <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                    <span className="text-purple-400 font-semibold text-sm lg:text-base">Countdown: {selectedEvent.countdown}</span>
                    <div className="flex space-x-2">
                      <button className="w-8 h-8 lg:w-10 lg:h-10 bg-[#FC1924] hover:bg-[#e01620] rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110">
                        <Share className="w-4 h-4 lg:w-5 lg:h-5" />
                      </button>
                      <button className="w-8 h-8 lg:w-10 lg:h-10 bg-[#FC1924] hover:bg-[#e01620] rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110">
                        <Heart className="w-4 h-4 lg:w-5 lg:h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-white">
                  <div>
                    <span className="text-gray-400">Hosted By:</span>
                    <span className="ml-2 text-purple-400 font-semibold text-sm lg:text-base">{selectedEvent.host}</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-400">Date:</span>
                    <span className="ml-2 text-sm lg:text-base">{selectedEvent.date}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-400">Start Time:</span>
                      <span className="ml-2 text-sm lg:text-base">{selectedEvent.startTime}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">End Time:</span>
                      <span className="ml-2 text-sm lg:text-base">{selectedEvent.endTime}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-400">Location:</span>
                    <span className="ml-2 text-sm lg:text-base">{selectedEvent.location}</span>
                  </div>

                  <div>
                    <span className="text-gray-400">About Event:</span>
                    <p className="mt-2 text-gray-300 text-sm lg:text-base">{selectedEvent.about}</p>
                  </div>

                  <div>
                    <span className="text-gray-400">Vibe:</span>
                    <div className="flex flex-wrap gap-1 lg:gap-2 mt-2">
                      {selectedEvent.vibes.map((vibe, index) => (
                        <span key={index} className="bg-green-500 text-white px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium">
                          {vibe}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-400">Attending:</span>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex -space-x-1 lg:-space-x-2">
                        {[...Array(Math.min(selectedEvent.attending, 4))].map((_, i) => (
                          <div key={i} className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-white font-bold">{String.fromCharCode(65 + i)}</span>
                          </div>
                        ))}
                      </div>
                      <span className="text-xs lg:text-sm text-gray-400">+{selectedEvent.attending} others</span>
                    </div>
                  </div>
                </div>

                {/* Ticket Selection */}
                <div className="bg-[#2a2a2a] rounded-xl p-4 lg:p-6 space-y-3 lg:space-y-4 animate-slide-up">
                  <h3 className="text-lg lg:text-xl font-bold text-white">Choose your ticket</h3>
                  
                  <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 lg:gap-4">
                    <select 
                      value={ticketType}
                      onChange={(e) => setTicketType(e.target.value)}
                      className="flex-1 lg:flex-none bg-[#3a3a3a] text-white px-3 lg:px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 text-sm lg:text-base"
                    >
                      {Object.keys(selectedEvent.ticketTypes).map((type) => (
                        <option key={type} value={type}>
                          {type} - ₦{selectedEvent.ticketTypes[type]}
                        </option>
                      ))}
                    </select>
                    
                    <div className="flex items-center justify-center space-x-2">
                      <button 
                        onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                        className="w-8 h-8 lg:w-10 lg:h-10 bg-[#FC1924] hover:bg-[#e01620] rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-white font-bold text-lg lg:text-xl w-8 lg:w-10 text-center">{ticketQuantity}</span>
                      <button 
                        onClick={() => setTicketQuantity(ticketQuantity + 1)}
                        className="w-8 h-8 lg:w-10 lg:h-10 bg-[#FC1924] hover:bg-[#e01620] rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => handleBuyTicket(selectedEvent)}
                      className="flex-1 lg:flex-none bg-[#FC1924] hover:bg-[#e01620] text-white px-6 lg:px-8 py-2 lg:py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm lg:text-base"
                    >
                      Buy Ticket - ₦{getCurrentPrice()}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};