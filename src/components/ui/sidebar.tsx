import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageCircle, Gamepad2, Globe, User, HelpCircle } from "lucide-react";

interface SidebarProps {
  currentPath?: string;
}

export const Sidebar = ({ currentPath }: SidebarProps): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path || currentPath === path;
  };

  const sidebarItems = [
    { icon: MessageCircle, path: "/messages", label: "Vibe Community" },
    { icon: Gamepad2, path: "/games", label: "Games" },
    { icon: Globe, path: "/discovery", label: "Discovery" },
    { icon: User, path: "/profile", label: "Profile" }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-white shadow-lg z-40 flex flex-col items-center py-6 space-y-6">
      {/* Logo */}
      <div 
        className="cursor-pointer transition-transform duration-300 hover:scale-110"
        onClick={() => handleNavigation('/home')}
      >
        <div className="w-12 h-12 bg-gradient-to-br from-[#FC1924] to-[#e01620] rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">E</span>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col space-y-6 flex-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <div key={item.path} className="relative group">
              <button
                onClick={() => handleNavigation(item.path)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                  active 
                    ? 'bg-[#FC1924] text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-6 h-6" />
              </button>
              
              {/* Tooltip */}
              <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                {item.label}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Support at bottom */}
      <div className="relative group">
        <button
          onClick={() => handleNavigation('/support')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            isActive('/support')
              ? 'bg-[#FC1924] text-white shadow-lg' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <HelpCircle className="w-6 h-6" />
        </button>
        
        {/* Tooltip */}
        <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
          Support
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
        </div>
      </div>
    </div>
  );
};