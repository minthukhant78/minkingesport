import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8 text-center min-h-[calc(100vh-14rem)] flex flex-col items-center justify-center">
      <FileQuestion className="h-24 w-24 text-primary" />
      <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl">404 - Page Not Found</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Go back to Homepage</Link>
      </Button>
    </div>
  );
}
