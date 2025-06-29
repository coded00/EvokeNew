import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  MessageCircle, 
  Gamepad2, 
  Globe, 
  User, 
  HelpCircle,
  Ticket
} from 'lucide-react';

interface SidebarProps {
  currentPath?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentRoute = currentPath || location.pathname;

  const menuItems = [
    { icon: Home, path: '/home', label: 'Home' },
    { icon: Calendar, path: '/calendar', label: 'Calendar' },
    { icon: Ticket, path: '/my-tickets', label: 'My Tickets' },
    { icon: MessageCircle, path: '/messages', label: 'Messages' },
    { icon: Gamepad2, path: '/games', label: 'Games' },
    { icon: Globe, path: '/discovery', label: 'Discovery' },
    { icon: User, path: '/profile', label: 'Profile' },
    { icon: HelpCircle, path: '/support', label: 'Support' },
  ];

  const handleLogoClick = () => {
    navigate('/home');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-[#2a2a2a] flex flex-col items-center py-6 z-50 border-r border-gray-700">
      {/* Logo */}
      <div 
        className="w-12 h-12 bg-gradient-to-br from-[#FC1924] to-red-600 rounded-xl flex items-center justify-center mb-8 cursor-pointer transition-all duration-300 hover:scale-110"
        onClick={handleLogoClick}
      >
        <span className="text-white font-bold text-xl">E</span>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col space-y-4 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.path || 
                          (item.path === '/home' && currentRoute === '/') ||
                          currentRoute.startsWith(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group relative ${
                isActive 
                  ? 'bg-[#FC1924] text-white shadow-lg shadow-red-500/25' 
                  : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
              }`}
              title={item.label}
            >
              <Icon className="w-6 h-6" />
              
              {/* Tooltip */}
              <div className="absolute left-16 bg-gray-900 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};