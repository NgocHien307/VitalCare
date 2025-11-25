import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Button from './Button';
import Card from './Card';

/**
 * ErrorBoundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * Logs errors and displays a fallback UI instead of crashing the whole app
 * 
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(_error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  handleReset = () => {
    // Reset error state and try to recover
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    // Navigate to home page
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full p-8">
            <div className="flex flex-col items-center text-center">
              {/* Error Icon */}
              <div className="w-20 h-20 bg-error-100 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="text-error-600" size={48} />
              </div>

              {/* Error Message */}
              <h1 className="text-3xl font-bold text-gray-800 mb-3">
                Oops! Có lỗi xảy ra
              </h1>
              <p className="text-gray-600 mb-6 max-w-md">
                Ứng dụng gặp sự cố không mong muốn. Chúng tôi đã ghi nhận lỗi và sẽ
                khắc phục trong thời gian sớm nhất.
              </p>

              {/* Error Details (Development Mode) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="w-full mb-6 text-left">
                  <summary className="cursor-pointer font-semibold text-error-600 mb-2">
                    Thông tin lỗi chi tiết (Development Only)
                  </summary>
                  <div className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-64">
                    <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                      <strong>Error:</strong> {this.state.error.toString()}
                      {'\n\n'}
                      <strong>Component Stack:</strong>
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 flex-wrap justify-center">
                <Button
                  onClick={this.handleReset}
                  variant="primary"
                  className="flex items-center gap-2"
                >
                  <RefreshCw size={18} />
                  Thử lại
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <Home size={18} />
                  Về trang chủ
                </Button>
              </div>

              {/* Help Text */}
              <p className="text-sm text-gray-500 mt-6">
                Nếu lỗi vẫn tiếp diễn, vui lòng{' '}
                <a
                  href="mailto:support@healthtracker.com"
                  className="text-primary-600 hover:underline"
                >
                  liên hệ hỗ trợ
                </a>
              </p>
            </div>
          </Card>
        </div>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

/**
 * Higher-order component to wrap any component with ErrorBoundary
 * 
 * Usage:
 * const SafeComponent = withErrorBoundary(MyComponent);
 */
export const withErrorBoundary = (Component) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  );
  WrappedComponent.displayName = `WithErrorBoundary(${Component.displayName || Component.name || 'Component'})`;
  return WrappedComponent;
};

export default ErrorBoundary;
