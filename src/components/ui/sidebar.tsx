import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Gamepad2, Globe, User, HelpCircle } from 'lucide-react';

interface SidebarProps {
  currentPath: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
  const navigate = useNavigate();

  const sidebarItems = [
    { 
      icon: MessageCircle, 
      path: '/messages', 
      label: 'Messages',
      onClick: () => navigate('/messages')
    },
    { 
      icon: Gamepad2, 
      path: '/games', 
      label: 'Games',
      onClick: () => navigate('/games')
    },
    { 
      icon: Globe, 
      path: '/discovery', 
      label: 'Discovery',
      onClick: () => navigate('/discovery')
    },
    { 
      icon: User, 
      path: '/profile', 
      label: 'Profile',
      onClick: () => navigate('/profile')
    },
    { 
      icon: HelpCircle, 
      path: '/support', 
      label: 'Support',
      onClick: () => navigate('/support')
    }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 z-40 shadow-lg">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-[#FC1924] to-[#e01620] rounded-xl flex items-center justify-center animate-pulse-subtle hover:animate-float transition-all duration-300 hover:scale-110 cursor-pointer">
          <span className="text-white text-2xl font-bold">E</span>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col space-y-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path || 
                          (item.path === '/profile' && currentPath.startsWith('/profile')) ||
                          (item.path === '/messages' && currentPath.startsWith('/messages')) ||
                          (item.path === '/games' && currentPath.startsWith('/games')) ||
                          (item.path === '/discovery' && currentPath.startsWith('/discovery')) ||
                          (item.path === '/support' && currentPath.startsWith('/support'));

          return (
            <div key={item.path} className="relative group">
              <button
                onClick={item.onClick}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                  isActive 
                    ? 'bg-[#FC1924] text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                }`}
              >
                <Icon className="w-6 h-6" />
              </button>
              
              {/* Tooltip */}
              <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.label}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};