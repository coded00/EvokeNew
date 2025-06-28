import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Gamepad2, Globe, User, HelpCircle } from "lucide-react";

interface SidebarProps {
  currentPath: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
  const navigate = useNavigate();

  const getIconClass = (path: string) => {
    const isActive = currentPath === path;
    return `w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${
      isActive 
        ? getActiveClass(path)
        : 'bg-gray-100 hover:bg-gray-200'
    }`;
  };

  const getActiveClass = (path: string) => {
    switch (path) {
      case '/messages': return 'bg-pink-100';
      case '/games': return 'bg-purple-100';
      case '/discovery': return 'bg-blue-100';
      case '/profile': return 'bg-orange-100';
      case '/support': return 'bg-yellow-100';
      case '/calendar': return 'bg-green-100';
      default: return 'bg-gray-100';
    }
  };

  const getIconColor = (path: string) => {
    const isActive = currentPath === path;
    if (isActive) {
      switch (path) {
        case '/messages': return 'text-pink-600';
        case '/games': return 'text-purple-600';
        case '/discovery': return 'text-blue-600';
        case '/profile': return 'text-orange-600';
        case '/support': return 'text-yellow-600';
        case '/calendar': return 'text-green-600';
        default: return 'text-gray-600';
      }
    }
    return 'text-gray-600 group-hover:text-gray-800';
  };

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-white flex flex-col items-center py-6 space-y-8 z-10 shadow-lg">
      {/* EVOKE Logo with subtle animation */}
      <div 
        className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center transform hover:scale-110 transition-all duration-300 cursor-pointer animate-pulse-subtle"
        onClick={() => navigate('/home')}
      >
        <div className="w-8 h-8 bg-white rounded-lg animate-float"></div>
      </div>

      <div className="flex flex-col space-y-6">
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

        <div 
          className="group cursor-pointer"
          onClick={() => navigate('/games')}
        >
          <div className={getIconClass('/games')}>
            <Gamepad2 className={`w-6 h-6 ${getIconColor('/games')}`} />
          </div>
        </div>

        <div 
          className="group cursor-pointer"
          onClick={() => navigate('/discovery')}
        >
          <div className={getIconClass('/discovery')}>
            <Globe className={`w-6 h-6 ${getIconColor('/discovery')}`} />
          </div>
        </div>

        <div 
          className="group cursor-pointer"
          onClick={() => navigate('/profile')}
        >
          <div className={getIconClass('/profile')}>
            <User className={`w-6 h-6 ${getIconColor('/profile')}`} />
          </div>
        </div>

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