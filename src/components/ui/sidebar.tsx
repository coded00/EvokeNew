import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Gamepad2, Globe, User, HelpCircle } from "lucide-react";

interface SidebarProps {
  currentPath: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/home');
  };

  const menuItems = [
    { icon: MessageCircle, path: "/messages", label: "Messages" },
    { icon: Gamepad2, path: "/games", label: "Games" },
    { icon: Globe, path: "/discovery", label: "Discovery" },
    { icon: User, path: "/profile", label: "Profile" },
  ];

  const isActive = (path: string) => currentPath === path;

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-white flex flex-col items-center py-6 z-40 shadow-lg">
      {/* Logo */}
      <div 
        className="mb-8 cursor-pointer"
        onClick={handleLogoClick}
      >
        <img 
          src="/src/assets/icons/Evoke - Icon 1 (1).png" 
          alt="EVOKE Logo" 
          className="w-12 h-12"
        />
      </div>

      {/* Navigation Icons */}
      <div className="flex flex-col space-y-4 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                isActive(item.path)
                  ? 'bg-[#FC1924] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={item.label}
            >
              <Icon className="w-6 h-6" />
            </button>
          );
        })}
      </div>

      {/* Support Icon - Positioned at bottom */}
      <div className="mt-auto">
        <button
          onClick={() => navigate("/support")}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            isActive("/support")
              ? 'bg-[#FC1924] text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title="Support"
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};