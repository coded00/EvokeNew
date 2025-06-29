import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Search, 
  Plus, 
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

  const menuItems = [
    { icon: Home, path: '/home', label: 'Home' },
    { icon: Calendar, path: '/calendar', label: 'Calendar' },
    { icon: Search, path: '/discovery', label: 'Discovery' },
    { icon: Plus, path: '/create-vibe', label: 'Create' },
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
    <div className="fixed left-0 top-0 h-full w-20 bg-[#2a2a2a] flex flex-col items-center py-6 z-40">
      {/* Logo */}
      <div className="mb-8 flex items-center justify-center">
        <div className="w-12 h-12 flex items-center justify-center animate-logo-spin">
          <img 
            src="/src/assets/icons/Evoke - Icon 1 (1) copy.png" 
            alt="EVOKE" 
            className="w-10 h-10 object-contain filter brightness-0 invert"
          />
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col space-y-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group relative ${
                active 
                  ? 'bg-[#FC1924] text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
              }`}
              title={item.label}
            >
              <Icon className="w-6 h-6" />
              
              {/* Tooltip */}
              <div className="absolute left-16 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};