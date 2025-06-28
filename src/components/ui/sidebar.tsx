import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Gamepad2, Globe, User, HelpCircle } from "lucide-react";

interface SidebarProps {
  currentPath?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
  const navigate = useNavigate();

  const getIconClass = (path: string) => {
    return currentPath === path 
      ? "w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
      : "w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg";
  };

  const getIconColor = (path: string) => {
    return currentPath === path ? "text-white" : "text-gray-600 group-hover:text-gray-800";
  };

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-white flex flex-col items-center py-6 space-y-8 z-10 shadow-lg">
      {/* EVOKE Logo */}
      <div 
        className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center transform hover:scale-110 transition-all duration-300 cursor-pointer"
        onClick={() => navigate('/home')}
      >
        <img 
          src="/src/assets/icons/Evoke - Icon 1 (1).png" 
          alt="EVOKE" 
          className="w-8 h-8 object-contain"
          onError={(e) => {
            // Fallback to text if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.innerHTML = '<div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center"><span class="text-purple-600 font-bold text-xs">E</span></div>';
          }}
        />
      </div>

      <div className="flex flex-col space-y-6">
        {/* Messages */}
        <div 
          className="relative group cursor-pointer"
          onClick={() => navigate('/messages')}
        >
          <div className={getIconClass('/messages')}>
            <MessageCircle className={`w-6 h-6 ${getIconColor('/messages')}`} />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FC1924] rounded-full flex items-center justify-center animate-pulse">
            <span className="text-xs text-white font-bold">2</span>
          </div>
        </div>

        {/* Games */}
        <div 
          className="group cursor-pointer"
          onClick={() => navigate('/games')}
        >
          <div className={getIconClass('/games')}>
            <Gamepad2 className={`w-6 h-6 ${getIconColor('/games')}`} />
          </div>
        </div>

        {/* Discovery */}
        <div 
          className="group cursor-pointer"
          onClick={() => navigate('/discovery')}
        >
          <div className={getIconClass('/discovery')}>
            <Globe className={`w-6 h-6 ${getIconColor('/discovery')}`} />
          </div>
        </div>

        {/* Profile */}
        <div 
          className="group cursor-pointer"
          onClick={() => navigate('/profile')}
        >
          <div className={getIconClass('/profile')}>
            <User className={`w-6 h-6 ${getIconColor('/profile')}`} />
          </div>
        </div>

        {/* Support */}
        <div 
          className="group cursor-pointer"
          onClick={() => navigate('/support')}
        >
          <div className={getIconClass('/support')}>
            <HelpCircle className={`w-6 h-6 ${getIconColor('/support')}`} />
          </div>
        </div>
      </div>
    </div>
  );
};