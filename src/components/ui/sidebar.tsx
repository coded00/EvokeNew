import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Gamepad2, Globe, User, HelpCircle } from "lucide-react";

interface SidebarProps {
  currentPath: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
  const navigate = useNavigate();

  const isActive = (path: string) => currentPath === path;

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-white flex flex-col items-center py-6 space-y-8 z-10 shadow-lg">
      {/* Logo */}
      <div 
        className="w-16 h-16 flex items-center justify-center transform hover:scale-110 transition-all duration-300 cursor-pointer"
        onClick={() => navigate('/home')}
      >
        <img 
          src="/src/assets/icons/Evoke - Icon 1 (1).png" 
          alt="EVOKE Logo" 
          className="w-14 h-14 object-contain"
        />
      </div>

      <div className="flex flex-col space-y-6">
        <div 
          className="relative group cursor-pointer"
          onClick={() => navigate('/messages')}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${
            isActive('/messages') ? 'bg-pink-100' : 'bg-gray-100 hover:bg-pink-100'
          }`}>
            <MessageCircle className={`w-6 h-6 ${
              isActive('/messages') ? 'text-pink-600' : 'text-gray-600 group-hover:text-pink-600'
            }`} />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FC1924] rounded-full flex items-center justify-center animate-pulse">
            <span className="text-xs text-white font-bold">2</span>
          </div>
        </div>

        <div 
          className="group cursor-pointer"
          onClick={() => navigate('/games')}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${
            isActive('/games') ? 'bg-purple-100' : 'bg-gray-100 hover:bg-purple-100'
          }`}>
            <Gamepad2 className={`w-6 h-6 ${
              isActive('/games') ? 'text-purple-600' : 'text-gray-600 group-hover:text-purple-600'
            }`} />
          </div>
        </div>

        <div 
          className="group cursor-pointer"
          onClick={() => navigate('/discovery')}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${
            isActive('/discovery') ? 'bg-blue-100' : 'bg-gray-100 hover:bg-blue-100'
          }`}>
            <Globe className={`w-6 h-6 ${
              isActive('/discovery') ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'
            }`} />
          </div>
        </div>

        <div 
          className="group cursor-pointer"
          onClick={() => navigate('/profile')}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${
            isActive('/profile') ? 'bg-orange-100' : 'bg-gray-100 hover:bg-orange-100'
          }`}>
            <User className={`w-6 h-6 ${
              isActive('/profile') ? 'text-orange-600' : 'text-gray-600 group-hover:text-orange-600'
            }`} />
          </div>
        </div>

        <div 
          className="group cursor-pointer"
          onClick={() => navigate('/support')}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${
            isActive('/support') ? 'bg-yellow-100' : 'bg-gray-100 hover:bg-yellow-100'
          }`}>
            <HelpCircle className={`w-6 h-6 ${
              isActive('/support') ? 'text-yellow-600' : 'text-gray-600 group-hover:text-yellow-600'
            }`} />
          </div>
        </div>
      </div>
    </div>
  );
};