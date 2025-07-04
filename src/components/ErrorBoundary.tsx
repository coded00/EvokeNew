import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // In a real app, you would send this to your error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    // Use window.location for navigation since this is a class component
    // In a real app, you might want to use a different approach
    window.location.href = '/home';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-8 font-['Space_Grotesk']">
          <Card className="bg-[#2a2a2a] border-gray-700 max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">⚠️</span>
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-4">
                Oops! Something went wrong
              </h1>
              
              <p className="text-gray-400 mb-6">
                We encountered an unexpected error. Don't worry, our team has been notified and is working to fix it.
              </p>

              {typeof window !== 'undefined' && window.location.hostname === 'localhost' && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="text-red-400 cursor-pointer mb-2">
                    Error Details (Development)
                  </summary>
                  <div className="bg-[#1a1a1a] p-4 rounded-lg text-xs text-gray-300 overflow-auto max-h-32">
                    <p className="font-semibold text-red-400 mb-2">Error:</p>
                    <p className="mb-2">{this.state.error.message}</p>
                    <p className="font-semibold text-red-400 mb-2">Stack:</p>
                    <pre className="whitespace-pre-wrap">{this.state.error.stack}</pre>
                  </div>
                </details>
              )}

              <div className="space-y-3">
                <Button
                  onClick={this.handleReload}
                  className="w-full bg-[#FC1924] hover:bg-[#e01620] text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  Reload Page
                </Button>
                
                <Button
                  onClick={this.handleGoHome}
                  className="w-full bg-transparent border border-gray-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-gray-800"
                >
                  Go to Home
                </Button>
              </div>

              <p className="text-gray-500 text-sm mt-6">
                If this problem persists, please contact support
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
} 