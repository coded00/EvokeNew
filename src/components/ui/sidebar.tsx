import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  MessageCircle, 
  Gamepad2, 
  Globe, 
  User, 
  HelpCircle,
  Ticket,
  QrCode
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, path: '/home', label: 'Home' },
    { icon: Calendar, path: '/calendar', label: 'Calendar' },
    { icon: MessageCircle, path: '/messages', label: 'Messages' },
    { icon: Gamepad2, path: '/games', label: 'Games' },
    { icon: Globe, path: '/discovery', label: 'Discovery' },
    { icon: Ticket, path: '/my-tickets', label: 'My Tickets' },
    { icon: QrCode, path: '/ticket-scanner', label: 'Scanner' },
    { icon: User, path: '/profile', label: 'Profile' },
    { icon: HelpCircle, path: '/support', label: 'Support' }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed left-0 top-0 h-full w-16 lg:w-20 bg-[#2a2a2a] border-r border-gray-700 z-40">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 lg:h-20 border-b border-gray-700">
        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-[#FC1924] to-pink-500 rounded-lg flex items-center justify-center animate-pulse-subtle">
          <span className="text-white font-bold text-lg lg:text-xl">E</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col items-center py-4 lg:py-6 space-y-2 lg:space-y-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path || currentPath.startsWith(item.path);
          
          return (
            <div key={item.path} className="relative group">
              <button
                onClick={() => handleNavigation(item.path)}
                className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                  isActive 
                    ? 'bg-[#FC1924] text-white shadow-lg' 
                    : 'bg-[#3a3a3a] text-gray-400 hover:bg-[#4a4a4a] hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
              
              {/* Tooltip */}
              <div className="absolute left-full ml-2 lg:ml-3 top-1/2 -translate-y-1/2 bg-black text-white px-2 lg:px-3 py-1 lg:py-2 rounded-lg text-xs lg:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.label}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-black"></div>
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
};