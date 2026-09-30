import { Component } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/** Catches render errors in a page so one broken page never blanks the whole app. */
export class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled UI error:', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="page-title">Something went wrong</h1>
        <p className="mt-3 max-w-sm text-[15px] leading-6 text-ink-2">
          This page hit an unexpected error. Reloading usually fixes it.
        </p>
        <Button
          variant="primary"
          icon={RefreshCw}
          className="mt-6"
          onClick={() => window.location.reload()}
        >
          Reload
        </Button>
      </div>
    );
  }
}
