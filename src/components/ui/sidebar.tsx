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
    <div className="fixed left-0 top-0 h-full w-16 lg:w-20 bg-[#2a2a2a] flex flex-col items-center py-4 lg:py-8 z-40 border-r border-black">
      {/* Logo */}
      <div 
        className="cursor-pointer transition-transform duration-300 hover:scale-110"
        onClick={() => handleNavigation('/home')}
      >
        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-[#FC1924] to-[#e01620] rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg lg:text-xl">E</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col space-y-2 lg:space-y-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <div key={item.path} className="relative group">
              <button
                onClick={() => handleNavigation(item.path)}
              className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group relative ${
                  active 
                    ? 'bg-[#FC1924] text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-6 h-6" />
              <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
              
              {/* Tooltip */}
              <div className="absolute left-12 lg:left-16 bg-black text-white px-2 py-1 rounded text-xs lg:text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.label}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Support at bottom */}
      <div className="flex flex-col space-y-2 lg:space-y-4">
        <button
          onClick={() => handleNavigation('/support')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            isActive('/support')
              ? 'bg-[#FC1924] text-white shadow-lg' 
          className="w-10 h-10 lg:w-12 lg:h-12 bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 group relative"
          <div className="absolute left-12 lg:left-16 bg-black text-white px-2 py-1 rounded text-xs lg:text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        >
          <HelpCircle className="w-5 h-5 lg:w-6 lg:h-6" />
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