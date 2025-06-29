import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle, Gamepad2, Globe, User, HelpCircle } from 'lucide-react';

interface SidebarProps {
  currentPath: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || currentPath === path;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const navItems = [
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
    { path: '/games', icon: Gamepad2, label: 'Games' },
    { path: '/discovery', icon: Globe, label: 'Discovery' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-white border-r border-gray-200 flex flex-col items-center z-40">
      {/* Logo */}
      <div className="mt-8 mb-12">
        <div className="w-12 h-12 flex items-center justify-center animate-spin-slow">
          <img 
            src="/src/assets/icons/Evoke - Icon 1 (1).png" 
            alt="EVOKE Logo" 
            className="w-10 h-10 object-contain animate-pulse-subtle"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
          />
        </div>
      </div>

      {/* Navigation Icons */}
      <div className="flex flex-col space-y-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.path} className="relative group">
              <button
                onClick={() => handleNavigation(item.path)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                  isActive(item.path)
                    ? 'bg-[#FC1924] text-white shadow-lg'
                    : 'text-gray-600 hover:text-[#FC1924] hover:bg-gray-50'
                }`}
              >
                <Icon className="w-6 h-6" />
              </button>
              
              {/* Tooltip */}
              <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Support Icon - Positioned at bottom */}
      <div className="mt-auto mb-8">
        <div className="relative group">
          <button
            onClick={() => handleNavigation('/support')}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
              isActive('/support')
                ? 'bg-[#FC1924] text-white shadow-lg'
                : 'text-gray-600 hover:text-[#FC1924] hover:bg-gray-50'
            }`}
          >
            <HelpCircle className="w-6 h-6" />
          </button>
          
          {/* Tooltip */}
          <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            Support
          </div>
        </div>
      </div>
    </div>
  );
};