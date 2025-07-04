import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
}

export const SignUp = (): JSX.Element => {
  const [isSignIn, setIsSignIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms & policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSignInClick = () => {
    navigate('/home');
  };

  const handleSignUpSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to home page after successful signup
      navigate('/home');
    } catch (error) {
      console.error('Signup error:', error);
      // Handle error - could show a toast notification
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'apple') => {
    setIsLoading(true);
    
    try {
      // Simulate social login
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/home');
    } catch (error) {
      console.error(`${provider} signin error:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#111111] flex flex-row justify-center w-full h-screen overflow-hidden">
      <div className="bg-[#111111] w-full h-full relative flex">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="bg-transparent border-none shadow-none">
            <CardContent className="p-0 w-[404px]">
              <div className="mb-14">
                <h1 className="[font-family:'Space_Grotesk',Helvetica] font-medium text-white text-[32px]">
                  Get Started Now
                </h1>
              </div>

              <div className="flex flex-col space-y-5">
                <div className="flex flex-col space-y-2">
                  <label className="[font-family:'Space_Grotesk',Helvetica] font-medium text-white text-sm">
                    Name
                  </label>
                  <Input
                    className={`h-12 bg-[#181818] border-[#d9d9d9] rounded-[5px] text-[#d9d9d9] [font-family:'Poppins',Helvetica] text-sm font-medium px-4 py-3 ${
                      errors.name ? 'border-red-500' : ''
                    }`}
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="[font-family:'Space_Grotesk',Helvetica] font-medium text-white text-sm">
                    Email address
                  </label>
                  <Input
                    className={`h-12 bg-[#181818] border-[#d9d9d9] rounded-[5px] text-[#d9d9d9] [font-family:'Poppins',Helvetica] text-sm font-medium px-4 py-3 ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                    placeholder="Enter your email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="[font-family:'Space_Grotesk',Helvetica] font-medium text-white text-sm">
                    Password
                  </label>
                  <Input
                    type="password"
                    className={`h-12 bg-[#181818] border-[#d9d9d9] rounded-[5px] text-[#d9d9d9] [font-family:'Poppins',Helvetica] text-sm font-medium px-4 py-3 ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="[font-family:'Space_Grotesk',Helvetica] font-medium text-white text-sm">
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    className={`h-12 bg-[#181818] border-[#d9d9d9] rounded-[5px] text-[#d9d9d9] [font-family:'Poppins',Helvetica] text-sm font-medium px-4 py-3 ${
                      errors.confirmPassword ? 'border-red-500' : ''
                    }`}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox
                    id="terms"
                    className="w-4 h-4 rounded-sm border-white"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="terms"
                    className="[font-family:'Space_Grotesk',Helvetica] font-medium text-white text-sm"
                  >
                    I agree to the{" "}
                    <span className="underline">terms & policy</span>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>
                )}

                <Button 
                  onClick={handleSignUpSubmit}
                  disabled={isLoading}
                  className="w-full h-12 mt-6 bg-[#FC1924] hover:bg-[#e01620] rounded-[5px] [font-family:'Poppins',Helvetica] font-bold text-white text-sm disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    'Signup'
                  )}
                </Button>

                <div className="relative flex items-center py-5">
                  <Separator className="w-full bg-white/20" />
                  <div className="absolute left-1/2 transform -translate-x-1/2 px-2 bg-[#111111] [font-family:'Poppins',Helvetica] font-medium text-white text-sm">
                    Or
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleSocialSignIn('google')}
                    disabled={isLoading}
                    className="flex-1 h-12 gap-2.5 px-5 py-3 rounded-[10px] border-[#d9d9d9] [font-family:'Poppins',Helvetica] font-medium text-white text-xs bg-transparent hover:bg-[#2a2a2a] disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <span className="text-xs">G</span>
                    </div>
                    {isLoading ? 'Signing in...' : 'Sign in with Google'}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleSocialSignIn('apple')}
                    disabled={isLoading}
                    className="flex-1 h-12 gap-2.5 px-5 py-3 rounded-[10px] border-[#d9d9d9] [font-family:'Poppins',Helvetica] font-medium text-white text-xs bg-transparent hover:bg-[#2a2a2a] disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <span className="text-xs">🍎</span>
                    </div>
                    {isLoading ? 'Signing in...' : 'Sign in with Apple'}
                  </Button>
                </div>

                <div className="flex justify-center mt-6 [font-family:'Poppins',Helvetica] font-medium text-sm">
                  <span className="text-white">
                    Have an account?&nbsp;&nbsp;
                  </span>
                  <button 
                    onClick={handleSignInClick}
                    disabled={isLoading}
                    className="text-[#0f3cde] hover:underline cursor-pointer disabled:text-gray-500 disabled:cursor-not-allowed"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Image */}
        <div className="flex-1 relative overflow-hidden">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: `url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDYwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iODAwIiBmaWxsPSIjRkMxOTI0Ii8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjIwMCIgcj0iNDAiIGZpbGw9IiMyMzIzNDUiLz4KPGNpcmNsZSBjeD0iNDUwIiBjeT0iMzAwIiByPSI1MCIgZmlsbD0iIzIzMjM0NSIvPgo8Y2lyY2xlIGN4PSIzMDAiIGN5PSI1MDAiIHI9IjYwIiBmaWxsPSIjMjMyMzQ1Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjYwMCIgcj0iMzUiIGZpbGw9IiMyMzIzNDUiLz4KPGNpcmNsZSBjeD0iNTAwIiBjeT0iNjUwIiByPSI0NSIgZmlsbD0iIzIzMjM0NSIvPgo8cG9seWdvbiBwb2ludHM9IjIwMCwxMDAgMjUwLDUwIDMwMCwxMDAgMjUwLDE1MCIgZmlsbD0iIzIzMjM0NSIvPgo8cG9seWdvbiBwb2ludHM9IjQwMCw0MDAgNDUwLDM1MCA1MDAsNDAwIDQ1MCw0NTAiIGZpbGw9IiMyMzIzNDUiLz4KPHBvbHlnb24gcG9pbnRzPSIxMDAsNDAwIDE1MCwzNTAgMjAwLDQwMCAxNTAsNDUwIiBmaWxsPSIjMjMyMzQ1Ii8+Cjwvc3ZnPgo=)` 
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FC1924]/90 to-[#FC1924]/70"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white animate-fade-in">
                <div className="text-8xl mb-6 animate-bounce">🎉</div>
                <h2 className="text-4xl font-bold mb-4">Join the Vibe</h2>
                <p className="text-xl opacity-90 max-w-md">Connect with amazing people and discover incredible events in your community</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};