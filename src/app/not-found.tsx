import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center px-4 md:px-6">
      <div className="max-w-md">
        <SearchX className="mx-auto h-24 w-24 text-primary" />
        <h1 className="mt-8 text-5xl font-bold tracking-tight text-foreground font-headline">
          404 - Page Not Found
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Oops! It looks like the page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">
            Go Back to Homepage
          </Link>
        </Button>
      </div>
    </div>
  );
}
