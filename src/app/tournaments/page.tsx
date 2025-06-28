
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tournaments | MinKing Esport',
  description: 'The tournaments page is currently under construction.',
};

export default function TournamentsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8 text-center min-h-[calc(100vh-14rem)] flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Coming Soon!</h1>
      <p className="text-muted-foreground mt-4 max-w-md">
        The tournaments feature is currently under construction. We're working hard to bring you exciting competitive action. Please check back later!
      </p>
    </div>
  );
}
