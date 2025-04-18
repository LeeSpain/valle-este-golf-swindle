
import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    console.error('ErrorBoundary caught an error:', error);
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error to the console with more details
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Component stack:', errorInfo.componentStack);
    
    // Update state with error info for display
    this.setState({ errorInfo });
    
    // Attempt to log to any analytics service if available
    if (window.onerror) {
      window.onerror(
        error.message,
        undefined,
        undefined,
        undefined,
        error
      );
    }
  }

  // Method to let users try recovery
  handleReset = () => {
    console.log('Attempting to reset error boundary state');
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

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
              {this.state.error?.stack && (
                <details className="mt-2">
                  <summary className="text-sm text-red-600 cursor-pointer">Show error details</summary>
                  <pre className="mt-2 p-2 bg-red-50 text-red-900 rounded text-xs overflow-auto max-h-[200px]">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
              {this.state.errorInfo && (
                <details className="mt-2">
                  <summary className="text-sm text-red-600 cursor-pointer">Show component stack</summary>
                  <pre className="mt-2 p-2 bg-red-50 text-red-900 rounded text-xs overflow-auto max-h-[200px]">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
            <p className="text-gray-600 mb-6">
              You can try to recover by clicking the button below or refresh the page.
              If the problem persists, please contact support.
            </p>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="py-2 px-4 bg-golf-green hover:bg-golf-green-dark text-white rounded-md shadow-sm transition-colors"
              >
                Refresh Page
              </button>
              <button
                onClick={this.handleReset}
                className="py-2 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md shadow-sm transition-colors"
              >
                Try to Recover
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
