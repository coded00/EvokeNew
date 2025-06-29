import React from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

interface SidebarProps {
  currentPath: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, path: "/home", label: "Home" },
    { icon: Calendar, path: "/calendar", label: "Calendar" },
    { icon: Globe, path: "/discovery", label: "Discovery" },
    { icon: MessageCircle, path: "/messages", label: "Messages" },
    { icon: Gamepad2, path: "/games", label: "Games" },
    { icon: Ticket, path: "/my-tickets", label: "My Tickets" },
    { icon: User, path: "/profile", label: "Profile" },
    { icon: HelpCircle, path: "/support", label: "Support" }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-[#2a2a2a] flex flex-col items-center py-6 z-40">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center animate-pulse-subtle">
          <span className="text-white font-bold text-xl animate-float">E</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col space-y-4 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path || 
                          (currentPath.startsWith('/event') && item.path === '/profile') ||
                          (currentPath.startsWith('/create') && item.path === '/home') ||
                          (currentPath.startsWith('/ticket') && item.path === '/my-tickets');
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group relative ${
                isActive 
                  ? 'bg-[#FC1924] text-white shadow-lg' 
                  : 'bg-[#3a3a3a] text-gray-400 hover:bg-[#4a4a4a] hover:text-white'
              }`}
              title={item.label}
            >
              <Icon className="w-6 h-6" />
              
              {/* Tooltip */}
              <div className="absolute left-16 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};