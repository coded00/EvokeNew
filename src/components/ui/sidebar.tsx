import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Users, 
  MessageCircle, 
  Gamepad2, 
  Globe, 
  User, 
  HelpCircle,
  Ticket
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, path: '/home', label: 'Home' },
    { icon: Calendar, path: '/calendar', label: 'Calendar' },
    { icon: Globe, path: '/discovery', label: 'Discovery' },
    { icon: MessageCircle, path: '/messages', label: 'Messages' },
    { icon: Gamepad2, path: '/games', label: 'Games' },
    { icon: Ticket, path: '/my-tickets', label: 'My Tickets' },
    { icon: User, path: '/profile', label: 'Profile' },
    { icon: HelpCircle, path: '/support', label: 'Support' }
  ];

  const isActive = (path: string) => {
    return location.pathname === path || currentPath === path;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-[#2a2a2a] border-r border-gray-700 flex flex-col items-center py-6 z-40">
      {/* Logo */}
      <div className="mb-8 relative group">
        <div className="w-12 h-12 bg-gradient-to-br from-[#FC1924] to-[#e01620] rounded-xl flex items-center justify-center shadow-lg animate-pulse-subtle hover:animate-float transition-all duration-300 hover:scale-110 cursor-pointer">
          <span className="text-white text-2xl font-bold">E</span>
        </div>
        
        {/* Tooltip */}
        <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-black text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          EVOKE
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <div key={item.path} className="relative group">
              <button
                onClick={() => handleNavigation(item.path)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                  active 
                    ? 'bg-[#FC1924] text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
                }`}
              >
                <Icon className="w-6 h-6" />
              </button>
              
              {/* Tooltip */}
              <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-black text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
};