import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle, Gamepad2, Globe, User, HelpCircle } from 'lucide-react';

interface SidebarProps {
  currentPath: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogoClick = () => {
    navigate('/home');
  };

  const isActive = (path: string) => {
    return location.pathname === path || currentPath === path;
  };

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 z-50">
      {/* Logo */}
      <div 
        className="mb-10 cursor-pointer transition-transform duration-300 hover:scale-110"
        onClick={handleLogoClick}
      >
        <img 
          src="/src/assets/icons/Evoke - Icon 1 (1).png" 
          alt="EVOKE Logo" 
          className="w-12 h-12 object-contain"
        />
      </div>

      {/* Main Navigation */}
      <div className="flex flex-col space-y-6 flex-1">
        {/* Vibe Community */}
        <button
          onClick={() => handleNavigation('/messages')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            isActive('/messages') 
              ? 'bg-[#FC1924] text-white shadow-lg' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Vibe Community"
        >
          <MessageCircle className="w-6 h-6" />
        </button>

        {/* Games */}
        <button
          onClick={() => handleNavigation('/games')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            isActive('/games') 
              ? 'bg-[#FC1924] text-white shadow-lg' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Games"
        >
          <Gamepad2 className="w-6 h-6" />
        </button>

        {/* Discovery */}
        <button
          onClick={() => handleNavigation('/discovery')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            isActive('/discovery') 
              ? 'bg-[#FC1924] text-white shadow-lg' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Discovery"
        >
          <Globe className="w-6 h-6" />
        </button>

        {/* Profile */}
        <button
          onClick={() => handleNavigation('/profile')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            isActive('/profile') 
              ? 'bg-[#FC1924] text-white shadow-lg' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Profile"
        >
          <User className="w-6 h-6" />
        </button>
      </div>

      {/* Support Section */}
      <div className="mt-auto">
        <button
          onClick={() => handleNavigation('/support')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            isActive('/support') 
              ? 'bg-[#FC1924] text-white shadow-lg' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Support"
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};