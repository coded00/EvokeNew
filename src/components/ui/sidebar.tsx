import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Gamepad2, Globe, User, HelpCircle } from "lucide-react";

interface SidebarProps {
  currentPath: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/home');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return currentPath === path;
  };

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-white shadow-lg z-40 flex flex-col items-center py-6">
      {/* Logo */}
      <div className="mb-8">
        <button 
          onClick={handleLogoClick}
          className="w-14 h-14 flex items-center justify-center transition-all duration-300 hover:scale-105"
        >
          <img 
            src="/src/assets/icons/Evoke - Icon 1 (1).png" 
            alt="EVOKE Logo" 
            className="w-full h-full object-contain drop-shadow-md"
          />
        </button>
      </div>

      {/* Navigation Icons */}
      <div className="flex flex-col space-y-6">
        <button
          onClick={() => handleNavigation('/messages')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            isActive('/messages') 
              ? 'bg-[#FC1924] text-white shadow-lg' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <MessageCircle className="w-6 h-6" />
        </button>

        <button
          onClick={() => handleNavigation('/games')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            isActive('/games') 
              ? 'bg-[#FC1924] text-white shadow-lg' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Gamepad2 className="w-6 h-6" />
        </button>

        <button
          onClick={() => handleNavigation('/discovery')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            isActive('/discovery') 
              ? 'bg-[#FC1924] text-white shadow-lg' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Globe className="w-6 h-6" />
        </button>

        <button
          onClick={() => handleNavigation('/profile')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            isActive('/profile') 
              ? 'bg-[#FC1924] text-white shadow-lg' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <User className="w-6 h-6" />
        </button>
      </div>

      {/* Support Icon at Bottom */}
      <div className="mt-auto mb-8">
        <button
          onClick={() => handleNavigation('/support')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            isActive('/support') 
              ? 'bg-[#FC1924] text-white shadow-lg' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};