import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  User, 
  MessageCircle, 
  Gamepad2, 
  Globe, 
  HelpCircle,
  Plus
} from "lucide-react";

interface SidebarProps {
  currentPath?: string;
}

export const Sidebar = ({ currentPath }: SidebarProps): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    navigate('/home');
  };

  const menuItems = [
    { icon: MessageCircle, path: '/messages', label: 'Vibe Community' },
    { icon: Gamepad2, path: '/games', label: 'Games' },
    { icon: Globe, path: '/discovery', label: 'Discovery' },
    { icon: User, path: '/profile', label: 'Profile' },
    { icon: HelpCircle, path: '/support', label: 'Support' }
  ];

  const isActive = (path: string) => {
    return location.pathname === path || currentPath === path;
  };

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-white border-r-2 border-black flex flex-col items-center py-6 z-50">
      {/* Logo */}
      <div 
        className="w-12 h-12 mb-8 cursor-pointer transition-all duration-300 hover:scale-110 animate-pulse-subtle"
        onClick={handleLogoClick}
      >
        <img 
          src="/src/assets/icons/Evoke - Icon 1 (1).png" 
          alt="EVOKE" 
          className="w-full h-full object-contain"
        />
      </div>

      {/* Menu Items */}
      <div className="flex flex-col space-y-6 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <div key={item.path} className="relative group">
              <button
                onClick={() => navigate(item.path)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                  active 
                    ? 'bg-red-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-6 h-6" />
              </button>
              
              {/* Tooltip */}
              <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                {item.label}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};