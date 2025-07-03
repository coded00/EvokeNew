import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Search, 
  Zap, 
  User, 
  MessageCircle, 
  Gamepad2, 
  HelpCircle,
  Globe
} from 'lucide-react';

interface SidebarProps {
  currentPath?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Search, label: 'Discovery', path: '/discovery' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: Zap, label: 'Create Vibe', path: '/create-vibe' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: MessageCircle, label: 'Vibe Community', path: '/messages' },
    { icon: Gamepad2, label: 'Games', path: '/games' },
    { icon: HelpCircle, label: 'Support', path: '/support' }
  ];

  const isActive = (path: string) => {
    return currentPath === path || location.pathname === path;
  };

  const handleLogoClick = () => {
    navigate('/home');
  };

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-[#2a2a2a] flex flex-col items-center py-6 z-50 border-r border-black">
      {/* Logo */}
      <div 
        className="w-12 h-12 bg-gradient-to-br from-[#FC1924] to-[#e01620] rounded-xl flex items-center justify-center mb-8 cursor-pointer transition-all duration-300 hover:scale-110 animate-pulse-subtle"
        onClick={handleLogoClick}
      >
        <span className="text-white font-bold text-xl">E</span>
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col space-y-6 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group relative ${
                active 
                  ? 'bg-[#FC1924] text-white shadow-lg' 
                  : 'bg-[#3a3a3a] text-gray-400 hover:bg-[#4a4a4a] hover:text-white'
              }`}
              title={item.label}
            >
              <Icon className="w-6 h-6" />
              
              {/* Tooltip */}
              <div className="absolute left-16 bg-black text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};