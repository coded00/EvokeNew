import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle, Gamepad2, Globe, User, HelpCircle } from 'lucide-react';

interface SidebarProps {
  currentPath?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path || currentPath === path;
  };

  const navigationItems = [
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
    { path: '/games', icon: Gamepad2, label: 'Games' },
    { path: '/discovery', icon: Globe, label: 'Discovery' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-[#2a2a2a] border-r border-gray-700 flex flex-col items-center py-6 z-50">
      {/* Logo */}
      <div className="mb-8">
        <button 
          onClick={() => handleNavigation('/home')}
          className="w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110"
        >
          <div className="text-2xl font-bold text-[#FC1924]">E</div>
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 flex flex-col space-y-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group ${
                isActive(item.path)
                  ? 'bg-[#FC1924] text-white shadow-lg shadow-[#FC1924]/25'
                  : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
              }`}
              title={item.label}
            >
              <Icon className="w-6 h-6" />
            </button>
          );
        })}
      </div>

      {/* Support Section */}
      <div className="mt-auto">
        <button
          onClick={() => handleNavigation('/support')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group ${
            isActive('/support')
              ? 'bg-[#FC1924] text-white shadow-lg shadow-[#FC1924]/25'
              : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
          }`}
          title="Support"
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};