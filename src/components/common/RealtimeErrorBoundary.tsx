/**
 * Realtime Error Boundary
 *
 * CRITICAL: Isolates realtime crashes and keeps app functional.
 *
 * Catches errors from:
 * - Live polling components
 * - API failures
 * - Data transformation errors
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/atoms/button';
import './RealtimeErrorBoundary.scss';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class RealtimeErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('RealtimeErrorBoundary caught error:', error, errorInfo);
    this.props.onError?.(error);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="realtime-error-boundary">
          <div className="realtime-error-boundary__icon">⚠️</div>
          <h3 className="realtime-error-boundary__title">Live Data Unavailable</h3>
          <p className="realtime-error-boundary__message">
            Unable to load live timing data. Please try again.
          </p>
          {this.state.error && (
            <pre className="realtime-error-boundary__error">{this.state.error.message}</pre>
          )}
          <Button onClick={this.handleRetry} variant="primary">
            Retry
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
