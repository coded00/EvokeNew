import React, { useState } from 'react';
import { X, Share2, Copy, Facebook, Twitter, Instagram, MessageCircle, Mail, Download, QrCode, TrendingUp, Users, Calendar, MapPin, Clock, Star } from 'lucide-react';

interface EventData {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  vibe: string;
  price: string;
  organizer: string;
  poster: string;
}

interface EventPromotionModalProps {
  eventData: EventData;
  isOpen: boolean;
  onClose: () => void;
}

const EventPromotionModal: React.FC<EventPromotionModalProps> = ({
  eventData,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'share' | 'promote' | 'analytics'>('share');
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  if (!isOpen) return null;

  const eventUrl = `https://evoke-app.com/event/${eventData.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const shareOptions = [
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: Facebook, 
      color: 'from-blue-600 to-blue-700',
      url: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`
    },
    { 
      id: 'twitter', 
      name: 'Twitter', 
      icon: Twitter, 
      color: 'from-sky-500 to-sky-600',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(eventUrl)}&text=${encodeURIComponent(`Check out ${eventData.name} on EVOKE!`)}`
    },
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: Instagram, 
      color: 'from-pink-500 to-purple-600',
      url: '#'
    },
    { 
      id: 'whatsapp', 
      name: 'WhatsApp', 
      icon: MessageCircle, 
      color: 'from-green-500 to-green-600',
      url: `https://wa.me/?text=${encodeURIComponent(`Check out ${eventData.name} on EVOKE! ${eventUrl}`)}`
    },
    { 
      id: 'email', 
      name: 'Email', 
      icon: Mail, 
      color: 'from-gray-600 to-gray-700',
      url: `mailto:?subject=${encodeURIComponent(`Invitation: ${eventData.name}`)}&body=${encodeURIComponent(`You're invited to ${eventData.name}! Check it out: ${eventUrl}`)}`
    }
  ];

  const promotionStats = [
    { label: 'Potential Reach', value: '2.5K', icon: Users, color: 'text-blue-400' },
    { label: 'Engagement Rate', value: '12.3%', icon: TrendingUp, color: 'text-green-400' },
    { label: 'Shares Expected', value: '45', icon: Share2, color: 'text-purple-400' },
    { label: 'Click-through Rate', value: '8.7%', icon: Star, color: 'text-yellow-400' }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-[#1a1a1a] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-800 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#FC1924] to-[#e01620] p-6">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Promote Event</h2>
                <p className="text-white/80">Boost your event's visibility</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:scale-110"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-800 bg-[#2a2a2a]">
          {[
            { id: 'share', label: 'Share Event', icon: Share2 },
            { id: 'promote', label: 'Boost Promotion', icon: TrendingUp },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-[#FC1924] text-white border-b-2 border-white'
                    : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Share Tab */}
          {activeTab === 'share' && (
            <div className="space-y-8">
              {/* Event Preview Card */}
              <div className="bg-gradient-to-br from-[#2a2a2a] to-[#3a3a3a] rounded-2xl p-6 border border-gray-700">
                <div className="flex items-start space-x-6">
                  <div className="w-24 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0">
                    <img 
                      src={eventData.poster} 
                      alt={eventData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-2xl font-bold text-white">{eventData.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Calendar className="w-4 h-4 text-[#FC1924]" />
                        <span>{eventData.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Clock className="w-4 h-4 text-[#FC1924]" />
                        <span>{eventData.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <MapPin className="w-4 h-4 text-[#FC1924]" />
                        <span className="truncate">{eventData.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Users className="w-4 h-4 text-[#FC1924]" />
                        <span>by {eventData.organizer}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="bg-gradient-to-r from-[#FC1924] to-[#e01620] text-white px-4 py-2 rounded-full text-sm font-semibold">
                        {eventData.price}
                      </span>
                      <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                        {eventData.vibe}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Copy Link Section */}
              <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-gray-700">
                <h4 className="text-lg font-bold text-white mb-4">Share Link</h4>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-[#1a1a1a] rounded-xl p-4 border border-gray-600">
                    <p className="text-gray-300 text-sm font-mono truncate">{eventUrl}</p>
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className={`px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2 ${
                      copiedLink 
                        ? 'bg-green-500 text-white' 
                        : 'bg-[#FC1924] hover:bg-[#e01620] text-white'
                    }`}
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Social Media Platforms */}
              <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-gray-700">
                <h4 className="text-lg font-bold text-white mb-6">Share on Social Media</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shareOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = selectedPlatforms.includes(option.id);
                    return (
                      <div key={option.id} className="relative">
                        <button
                          onClick={() => {
                            handlePlatformToggle(option.id);
                            if (option.url !== '#') {
                              window.open(option.url, '_blank', 'width=600,height=400');
                            }
                          }}
                          className={`w-full p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                            isSelected
                              ? 'border-[#FC1924] bg-[#FC1924]/10'
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left">
                              <p className="text-white font-semibold">{option.name}</p>
                              <p className="text-gray-400 text-sm">Share to {option.name}</p>
                            </div>
                          </div>
                        </button>
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#FC1924] rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
                  <QrCode className="w-5 h-5" />
                  <span>Generate QR Code</span>
                </button>
                <button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Download Assets</span>
                </button>
              </div>
            </div>
          )}

          {/* Promote Tab */}
          {activeTab === 'promote' && (
            <div className="space-y-8">
              {/* Promotion Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {promotionStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="bg-[#2a2a2a] rounded-xl p-6 border border-gray-700 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                      <p className="text-gray-400 text-sm">{stat.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Boost Options */}
              <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-gray-700">
                <h4 className="text-lg font-bold text-white mb-6">Boost Your Event</h4>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-[#FC1924]/10 to-[#e01620]/10 border border-[#FC1924]/30 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h5 className="text-white font-semibold text-lg">Featured Placement</h5>
                        <p className="text-gray-300 text-sm">Get your event featured on the homepage</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#FC1924] font-bold text-xl">₦5,000</p>
                        <p className="text-gray-400 text-sm">24 hours</p>
                      </div>
                    </div>
                    <button className="w-full bg-[#FC1924] hover:bg-[#e01620] text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105">
                      Boost Now
                    </button>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h5 className="text-white font-semibold text-lg">Social Media Push</h5>
                        <p className="text-gray-300 text-sm">Promote across all EVOKE social channels</p>
                      </div>
                      <div className="text-right">
                        <p className="text-purple-400 font-bold text-xl">₦10,000</p>
                        <p className="text-gray-400 text-sm">3 days</p>
                      </div>
                    </div>
                    <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105">
                      Boost Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Analytics Coming Soon</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Track your event's performance, engagement metrics, and audience insights with our advanced analytics dashboard.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#2a2a2a] border-t border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#FC1924] to-[#e01620] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">EVOKE</p>
                <p className="text-gray-400 text-xs">Powered by community</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPromotionModal;