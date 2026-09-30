import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent-strong">
        <Compass className="h-6 w-6" aria-hidden />
      </span>
      <p className="text-sm font-medium text-ink-3">404</p>
      <h1 className="page-title mt-1">Page not found</h1>
      <p className="mt-3 max-w-sm text-[15px] leading-6 text-ink-2">
        The page you’re looking for doesn’t exist or may have moved.
      </p>
      <Button as={Link} to="/" variant="primary" className="mt-6">
        Back to dashboard
      </Button>
    </div>
  );
}
