import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, Camera, Send, Users, TrendingUp } from 'lucide-react';

// Social media platform icons (using Lucide icons as placeholders)
const platformIcons = {
  whatsapp: MessageCircle,
  instagram: Camera,
  twitter: Send,
  snapchat: Camera,
  facebook: Users
};

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

const EventPromotionModal: React.FC<EventPromotionModalProps> = ({ eventData, isOpen, onClose }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [showGenerated, setShowGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const platforms = [
    { id: 'whatsapp', name: 'WhatsApp', color: 'bg-green-500', icon: MessageCircle },
    { id: 'instagram', name: 'Instagram', color: 'bg-pink-500', icon: Camera },
    { id: 'twitter', name: 'X (Twitter)', color: 'bg-black', icon: Send },
    { id: 'snapchat', name: 'Snapchat', color: 'bg-yellow-400', icon: Camera },
    { id: 'facebook', name: 'Facebook', color: 'bg-blue-600', icon: Users }
  ];

  // Generate promotional content
  const generateContent = () => {
    const captions: Record<string, string> = {
      whatsapp: `🎉 *${eventData.name}* is happening!\n\n📅 ${eventData.date} at ${eventData.time}\n📍 ${eventData.location}\n💰 ${eventData.price}\n\n🔥 Vibe: ${eventData.vibe}\n\nDon't miss out! Get your tickets now 🎫`,
      
      instagram: `🎵 Ready for an unforgettable night? ${eventData.name} is calling your name! ✨\n\n📅 ${eventData.date}\n⏰ ${eventData.time}\n📍 ${eventData.location}\n💸 ${eventData.price}\n\nBring your energy and let's create magic together! 🔥`,
      
      twitter: `🎉 ${eventData.name} is happening ${eventData.date}!\n\n📍 ${eventData.location}\n⏰ ${eventData.time}\n💰 ${eventData.price}\n\nGet ready for the ${eventData.vibe.toLowerCase()} vibes! 🔥`,
      
      snapchat: `🎵 ${eventData.name} 🎵\n${eventData.date} • ${eventData.time}\n📍 ${eventData.location}\n\nLet's vibe together! 🔥✨`,
      
      facebook: `🎉 Exciting news! ${eventData.name} is happening and you're invited!\n\n📅 When: ${eventData.date} at ${eventData.time}\n📍 Where: ${eventData.location}\n💰 Tickets: ${eventData.price}\n\nJoin us for an amazing night filled with ${eventData.vibe.toLowerCase()} vibes! This is going to be epic! 🔥\n\nTag your friends who need to be there! 👥`
    };

    const hashtags = `#${eventData.name.replace(/\s+/g, '')} #LagosEvents #Afrobeat #NightLife #${eventData.location.replace(/\s+/g, '')} #EvokeEvents #LagosVibes #${eventData.date.replace(/\s+/g, '')}`;

    return { captions, hashtags };
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleGenerateContent = () => {
    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform!');
      return;
    }
    setShowGenerated(true);
  };

  const handleDirectShare = (platform: string) => {
    const { captions, hashtags } = generateContent();
    const fullContent = `${captions[platform]}\n\n${hashtags}`;
    
    const shareUrls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(fullContent)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullContent)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(fullContent)}`,
      // Instagram and Snapchat don't support direct web sharing
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    } else {
      // Copy to clipboard for Instagram/Snapchat
      handleCopyToClipboard(platform);
    }
  };

  const handleCopyToClipboard = (platform: string) => {
    const { captions, hashtags } = generateContent();
    const fullContent = `${captions[platform]}\n\n${hashtags}`;
    
    navigator.clipboard.writeText(fullContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCopyAll = () => {
    const { captions, hashtags } = generateContent();
    let allContent = '';
    
    selectedPlatforms.forEach(platform => {
      allContent += `--- ${platforms.find(p => p.id === platform)?.name} ---\n`;
      allContent += `${captions[platform]}\n\n${hashtags}\n\n`;
    });
    
    navigator.clipboard.writeText(allContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const resetModal = () => {
    setSelectedPlatforms([]);
    setShowGenerated(false);
    setCopied(false);
  };

  const closeModal = () => {
    onClose();
    resetModal();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 font-['Space_Grotesk']">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-black">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {!showGenerated ? 'Promote Event' : 'Generated Content'}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {!showGenerated ? (
          // Platform Selection View
          <div className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Where would you like to share this event?
              </h3>
              <p className="text-gray-600">
                Select one or more platforms to generate promotional content
              </p>
            </div>

            {/* Event Preview */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
              <div className="flex items-center gap-4">
                <img
                  src={eventData.poster}
                  alt={eventData.name}
                  className="w-16 h-16 rounded-lg object-cover border border-gray-300"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{eventData.name}</h4>
                  <p className="text-sm text-gray-600">{eventData.date} • {eventData.location}</p>
                </div>
              </div>
            </div>

            {/* Platform Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                const isSelected = selectedPlatforms.includes(platform.id);
                
                return (
                  <button
                    key={platform.id}
                    onClick={() => handlePlatformToggle(platform.id)}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                      isSelected
                        ? 'border-[#FC1924] bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg ${platform.color} flex items-center justify-center`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <span className="font-medium text-gray-900">{platform.name}</span>
                    {isSelected && (
                      <Check size={20} className="text-[#FC1924] ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateContent}
              disabled={selectedPlatforms.length === 0}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 ${
                selectedPlatforms.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#FC1924] hover:bg-[#e01620] text-white'
              }`}
            >
              Generate Content ({selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''})
            </button>
          </div>
        ) : (
          // Generated Content View
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Your promotional content is ready!
              </h3>
              <p className="text-gray-600">
                Share directly or copy the content to your clipboard
              </p>
            </div>

            {/* Generated Content for Each Platform */}
            <div className="space-y-4 mb-6">
              {selectedPlatforms.map(platformId => {
                const platform = platforms.find(p => p.id === platformId);
                const { captions, hashtags } = generateContent();
                const Icon = platform!.icon;
                
                return (
                  <div key={platformId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${platform!.color} flex items-center justify-center`}>
                          <Icon size={16} className="text-white" />
                        </div>
                        <span className="font-medium text-gray-900">{platform!.name}</span>
                      </div>
                      <div className="flex gap-2">
                        {(platformId === 'whatsapp' || platformId === 'twitter' || platformId === 'facebook') && (
                          <button
                            onClick={() => handleDirectShare(platformId)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-all duration-300 hover:scale-105"
                          >
                            Share
                          </button>
                        )}
                        <button
                          onClick={() => handleCopyToClipboard(platformId)}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm font-medium transition-all duration-300 hover:scale-105 flex items-center gap-1"
                        >
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                          Copy
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-sm text-gray-800 whitespace-pre-line">
                        {captions[platformId]}
                      </p>
                      <p className="text-sm text-blue-600 mt-2">
                        {hashtags}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCopyAll}
                className="flex-1 bg-[#FC1924] hover:bg-[#e01620] text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                Copy All Content
              </button>
              <button
                onClick={resetModal}
                className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPromotionModal;