import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle, Gamepad2, Globe, User, HelpCircle } from 'lucide-react';

interface SidebarProps {
  currentPath: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { icon: MessageCircle, path: '/messages', label: 'Messages' },
    { icon: Gamepad2, path: '/games', label: 'Games' },
    { icon: Globe, path: '/discovery', label: 'Discovery' },
    { icon: User, path: '/profile', label: 'Profile' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || currentPath === path;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 z-40 shadow-sm">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-12 h-12 flex items-center justify-center">
          <img 
            src="/src/assets/icons/Evoke - Icon 1 (1) copy.png" 
            alt="EVOKE" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col space-y-4 flex-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group relative ${
                active 
                  ? 'bg-[#FC1924] text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
              }`}
              title={item.label}
            >
              <Icon className="w-6 h-6" />
              
              {/* Tooltip */}
              <div className="absolute left-16 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Support Section */}
      <div className="mt-auto">
        <button
          onClick={() => handleNavigation('/support')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group relative ${
            isActive('/support')
              ? 'bg-[#FC1924] text-white shadow-lg' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
          }`}
          title="Support"
        >
          <HelpCircle className="w-6 h-6" />
          
          {/* Tooltip */}
          <div className="absolute left-16 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            Support
          </div>
        </button>
      </div>
    </div>
  );
};