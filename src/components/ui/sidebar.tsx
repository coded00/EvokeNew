import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Gamepad2, Globe, User, HelpCircle } from 'lucide-react';

interface SidebarProps {
  currentPath: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return currentPath === path || currentPath.startsWith(path);
  };

  return (
    <div className="fixed left-0 top-0 h-full w-16 md:w-20 bg-[#2a2a2a] flex flex-col items-center py-4 md:py-6 z-40">
      {/* Logo */}
      <div className="mb-6 md:mb-8">
        <div 
          onClick={() => handleNavigation('/home')}
          className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300 animate-pulse-subtle"
        >
          <span className="text-white font-bold text-lg md:text-xl">E</span>
        </div>
      </div>

      {/* Main Navigation Icons */}
      <div className="flex flex-col space-y-3 md:space-y-4 flex-1">
        {/* Messages */}
        <div className="relative group">
          <button
            onClick={() => handleNavigation('/messages')}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
              isActive('/messages') 
                ? 'bg-[#FC1924] text-white' 
                : 'bg-[#3a3a3a] text-gray-400 hover:text-white hover:bg-[#4a4a4a]'
            }`}
          >
            <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            Messages
          </div>
        </div>

        {/* Games */}
        <div className="relative group">
          <button
            onClick={() => handleNavigation('/games')}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
              isActive('/games') 
                ? 'bg-[#FC1924] text-white' 
                : 'bg-[#3a3a3a] text-gray-400 hover:text-white hover:bg-[#4a4a4a]'
            }`}
          >
            <Gamepad2 className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            Games
          </div>
        </div>

        {/* Discovery */}
        <div className="relative group">
          <button
            onClick={() => handleNavigation('/discovery')}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
              isActive('/discovery') 
                ? 'bg-[#FC1924] text-white' 
                : 'bg-[#3a3a3a] text-gray-400 hover:text-white hover:bg-[#4a4a4a]'
            }`}
          >
            <Globe className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            Discovery
          </div>
        </div>

        {/* Profile */}
        <div className="relative group">
          <button
            onClick={() => handleNavigation('/profile')}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
              isActive('/profile') 
                ? 'bg-[#FC1924] text-white' 
                : 'bg-[#3a3a3a] text-gray-400 hover:text-white hover:bg-[#4a4a4a]'
            }`}
          >
            <User className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            Profile
          </div>
        </div>
      </div>

      {/* Support Icon at Bottom */}
      <div className="relative group">
        <button
          onClick={() => handleNavigation('/support')}
          className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            isActive('/support') 
              ? 'bg-[#FC1924] text-white' 
              : 'bg-[#3a3a3a] text-gray-400 hover:text-white hover:bg-[#4a4a4a]'
          }`}
        >
          <HelpCircle className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          Support
        </div>
      </div>
    </div>
  );
};