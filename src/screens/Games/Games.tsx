import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Gamepad2 } from "lucide-react";
import { Sidebar } from "../../components/ui/sidebar";

export const Games = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex relative overflow-hidden font-['Space_Grotesk']">
      <Sidebar currentPath="/games" />

      {/* Main Content */}
      <div className="flex-1 ml-20 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/home')}
            className="absolute top-8 left-28 flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>

          {/* Coming Soon Content */}
          <div className="animate-bounce">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Gamepad2 className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-4 animate-pulse">
            Games
          </h1>
          
          <div className="text-2xl text-purple-400 font-semibold mb-8 animate-fade-in-delay">
            Coming Soon
          </div>
          
          <p className="text-xl text-gray-400 max-w-md mx-auto leading-relaxed animate-slide-up">
            Get ready for an amazing gaming experience! We're working on something special that will bring the community together through interactive games and challenges.
          </p>
          
          <div className="mt-12 flex justify-center space-x-4">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};