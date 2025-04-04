
import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error to the console
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 border border-red-200">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <div className="bg-red-50 p-4 rounded mb-4">
              <p className="text-red-800 font-medium">
                {this.state.error?.message || 'An unknown error occurred'}
              </p>
            </div>
            <p className="text-gray-600 mb-6">
              Try refreshing the page. If the problem persists, please contact support.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2 px-4 bg-golf-green hover:bg-golf-green-dark text-white rounded-md shadow-sm transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
