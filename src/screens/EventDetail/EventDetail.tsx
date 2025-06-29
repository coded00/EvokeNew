import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Clock, Users, Share2, Heart, Star, MessageCircle, Ticket, TrendingUp } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

interface EventData {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  image: string;
  host: string;
  about: string;
  vibes: string[];
  attending: number;
  countdown: string;
  ticketTypes: {
    Regular: number;
    VIP: number;
    Premium: number;
  };
  reviews: Array<{
    id: number;
    name: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

export const EventDetail = (): JSX.Element => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<EventData | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  useEffect(() => {
    // Simulate API call
    const fetchEvent = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockEvent: EventData = {
        id: eventId || '1',
        title: "Wet & Rave",
        location: "252b Ikoroduc cresent Dolphin estate Ikoyi",
        date: "12th Of June 2025",
        time: "12 noon - Till mama calls",
        image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600",
        host: "Freezy Kee",
        about: "Our Love Letter event to our prospective members. It's Games, It's magic, it's community, It's love!!! Come connect with people over a cup of coffee and experience the best vibes in town. This is not just an event, it's an experience that will leave you wanting more.",
        vibes: ["Wild & Woke", "18+ & Unhinged", "Party Mode"],
        attending: 4,
        countdown: "3d 6hr 45mins",
        ticketTypes: {
          Regular: 500,
          VIP: 1000,
          Premium: 1500
        },
        reviews: [
          {
            id: 1,
            name: "Sarah Johnson",
            rating: 5,
            comment: "Amazing event! The vibes were incredible and the music was on point. Can't wait for the next one!",
            date: "2 days ago"
          },
          {
            id: 2,
            name: "Mike Chen",
            rating: 4,
            comment: "Great atmosphere and friendly people. The venue was perfect for the event.",
            date: "1 week ago"
          },
          {
            id: 3,
            name: "Lisa Rodriguez",
            rating: 5,
            comment: "Best party I've been to this year! The energy was unmatched.",
            date: "2 weeks ago"
          }
        ]
      };
      
      setEvent(mockEvent);
      setIsLoading(false);
    };

    fetchEvent();
  }, [eventId]);

  // Hide copied message after 3 seconds
  useEffect(() => {
    if (showCopiedMessage) {
      const timer = setTimeout(() => {
        setShowCopiedMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showCopiedMessage]);

  const handleBuyTicket = () => {
    navigate(`/ticket-purchase/${eventId}`);
  };

  const handlePromoteEvent = () => {
    // Future promotional features will be implemented here
    alert('Promote Event feature coming soon! This will include social sharing, boosting, and marketing tools.');
  };

  const handleShare = () => {
    // In a real app, this would share the event
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: `Check out this amazing event: ${event?.title}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      setShowCopiedMessage(true);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FC1924]"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Event Not Found</h1>
          <button 
            onClick={() => navigate('/home')}
            className="bg-[#FC1924] hover:bg-[#e01620] text-white px-6 py-2 rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const averageRating = event.reviews.reduce((sum, review) => sum + review.rating, 0) / event.reviews.length;

  return (
    <div className="min-h-screen bg-[#1a1a1a] font-['Space_Grotesk']">
      {/* Copied Message Notification */}
      {showCopiedMessage && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
              <span className="text-green-500 text-xs">✓</span>
            </div>
            <span>Event link copied to clipboard!</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative h-96">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${event.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/home')}
          className="absolute top-6 left-6 flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex space-x-3">
          <button 
            onClick={handleLike}
            className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
              isLiked ? 'bg-red-500/80 text-white' : 'bg-black/20 text-white hover:bg-red-500/80'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button 
            onClick={handleShare}
            className="p-3 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Event Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{event.title}</h1>
              <div className="flex items-center space-x-4 text-white/90">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{event.time}</span>
                </div>
              </div>
            </div>
            <div className="text-right text-white">
              <div className="text-2xl font-bold">{event.countdown}</div>
              <div className="text-sm opacity-75">Until Event</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card className="bg-[#2a2a2a] border-gray-700">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">About This Event</h2>
                <p className="text-gray-300 leading-relaxed">{event.about}</p>
              </CardContent>
            </Card>

            {/* Vibes Section */}
            <Card className="bg-[#2a2a2a] border-gray-700">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Event Vibes</h2>
                <div className="flex flex-wrap gap-2">
                  {event.vibes.map((vibe, index) => (
                    <span 
                      key={index}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {vibe}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card className="bg-[#2a2a2a] border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Reviews</h2>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className={`w-5 h-5 ${
                            star <= averageRating ? 'text-yellow-400 fill-current' : 'text-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-white font-semibold">{averageRating.toFixed(1)}</span>
                    <span className="text-gray-400">({event.reviews.length} reviews)</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {event.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-700 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-semibold">{review.name}</h3>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{review.comment}</p>
                      <span className="text-gray-500 text-xs">{review.date}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Ticket Info & Actions */}
          <div className="space-y-6">
            {/* Host Info */}
            <Card className="bg-[#2a2a2a] border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Hosted by</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{event.host.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{event.host}</p>
                    <p className="text-gray-400 text-sm">Event Organizer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ticket Types */}
            <Card className="bg-[#2a2a2a] border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Available Tickets</h3>
                <div className="space-y-3">
                  {Object.entries(event.ticketTypes).map(([type, price]) => (
                    <div key={type} className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                      <div>
                        <p className="text-white font-semibold">{type}</p>
                        <p className="text-gray-400 text-sm">Standard entry</p>
                      </div>
                      <p className="text-[#FC1924] font-bold">₦{price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Event Stats */}
            <Card className="bg-[#2a2a2a] border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Event Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Attending</span>
                    <span className="text-white font-semibold">{event.attending} people</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Time Left</span>
                    <span className="text-white font-semibold">{event.countdown}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Buy Ticket Button */}
              <Button
                onClick={handleBuyTicket}
                className="w-full bg-[#FC1924] hover:bg-[#e01620] text-white py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105"
              >
                <Ticket className="w-5 h-5 mr-2" />
                Buy Tickets Now
              </Button>

              {/* Promote Event Button */}
              <Button
                onClick={handlePromoteEvent}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Promote Event
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};