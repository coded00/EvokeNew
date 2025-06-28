import React from 'react';

interface LoadingProps {
  text?: string;
}

export const FullScreenLoading: React.FC<LoadingProps> = ({ text = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-[#1a1a1a] flex items-center justify-center z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FC1924] mb-4"></div>
        <p className="text-white text-lg">{text}</p>
      </div>
    </div>
  );
};

export const ButtonLoading: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      <span>Loading...</span>
    </div>
  );
};

// New Glitch Loading Screen Component
export const GlitchLoadingScreen: React.FC<LoadingProps> = ({ text = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-[#1a1a1a] flex items-center justify-center z-50">
      {/* Blurred Background Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      {/* Main Loading Content */}
      <div className="relative z-10 text-center">
        {/* EVOKE Logo with Glitch Effect */}
        <div className="mb-8">
          <div className="relative inline-block">
            {/* Main Logo */}
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center animate-glitch-main">
              <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center">
                <span className="text-4xl font-bold bg-gradient-to-br from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  E
                </span>
              </div>
            </div>
            
            {/* Glitch Layers */}
            <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-red-500 to-yellow-500 rounded-2xl flex items-center justify-center animate-glitch-layer-1 opacity-70">
              <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center">
                <span className="text-4xl font-bold bg-gradient-to-br from-red-500 to-yellow-500 bg-clip-text text-transparent">
                  E
                </span>
              </div>
            </div>
            
            <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center animate-glitch-layer-2 opacity-70">
              <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center">
                <span className="text-4xl font-bold bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  E
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* EVOKE Text with Glitch Effect */}
        <div className="relative mb-6">
          <h1 className="text-6xl font-bold text-white animate-glitch-text">
            EVOKE
          </h1>
          <h1 className="absolute inset-0 text-6xl font-bold text-red-500 animate-glitch-text-red opacity-70">
            EVOKE
          </h1>
          <h1 className="absolute inset-0 text-6xl font-bold text-cyan-500 animate-glitch-text-cyan opacity-70">
            EVOKE
          </h1>
        </div>

        {/* Loading Text */}
        <p className="text-xl text-gray-300 animate-pulse">{text}</p>
        
        {/* Loading Dots */}
        <div className="flex justify-center space-x-2 mt-4">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* Glitch Lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 right-0 h-px bg-white animate-glitch-line-1 opacity-30"></div>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-red-500 animate-glitch-line-2 opacity-30"></div>
          <div className="absolute top-3/4 left-0 right-0 h-px bg-cyan-500 animate-glitch-line-3 opacity-30"></div>
        </div>
      </div>
    </div>
  );
};

// Hook for showing loading screen during navigation
export const useLoadingScreen = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const showLoading = (duration: number = 2000) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, duration);
  };

  return { isLoading, showLoading, LoadingComponent: GlitchLoadingScreen };
};