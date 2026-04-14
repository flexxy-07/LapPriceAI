import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log details for debugging without breaking the UI.
    console.error('UI crash:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--tertiary)' }}>The Oracle Glitched</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Something in the UI crashed. Check the browser console for details.
            </p>
            <pre style={{ whiteSpace: 'pre-wrap', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
              {this.state.message}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
