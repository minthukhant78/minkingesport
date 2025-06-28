

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getAllGames, getAllVideoHighlights, getAllCreators, getAllUserProfiles } from '@/lib/data';
import type { Game, VideoHighlight } from '@/lib/types';
import { GameGrid } from '@/components/game-grid';
import { HeroShowcase } from '@/components/hero-showcase';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import WelcomeMessage from '@/components/welcome-message';
import GameFilters from '@/components/game-filters';
import CreatorSection from '@/components/creator-section';
import { EngagementStats } from '@/components/engagement-stats';

export const revalidate = 0; // Disable caching for this page

function VideoHighlightGallerySkeleton() {
  return (
    <section className="my-16 text-center">
      <Skeleton className="h-8 w-48 mx-auto mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <Skeleton className="aspect-video w-full" />
              <div className="p-4 text-left space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

const VideoHighlightGallery = dynamic(() => import('@/components/video-highlight-gallery').then(mod => mod.VideoHighlightGallery), {
    loading: () => <VideoHighlightGallerySkeleton />,
});

export default async function Home({ searchParams }: { searchParams: { q?: string; category?: string } }) {
  const [allGames, highlights, creators, allUsers] = await Promise.all([
      getAllGames(),
      getAllVideoHighlights(),
      getAllCreators(),
      getAllUserProfiles(),
  ]);

  const searchQuery = searchParams.q?.toLowerCase() || '';
  const category = searchParams.category?.toLowerCase() || 'all';

  const filteredGames = allGames
    .filter((game) => !!game.slug)
    .filter(
      (game) =>
        (game.title?.toLowerCase() ?? '').includes(searchQuery) ||
        (game.description?.toLowerCase() ?? '').includes(searchQuery) ||
        (game.tags || []).some((tag) => tag.toLowerCase().includes(searchQuery))
    )
    .filter((game) => category === 'all' || (game.category?.toLowerCase() ?? '') === category);

  const totalReviews = allGames.reduce((acc, game) => acc + (game.reviewsCount || 0), 0);
  const totalGames = allGames.length;
  const totalUsers = allUsers.length;

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <HeroShowcase />
      <WelcomeMessage />
      
      <EngagementStats 
        totalGames={totalGames}
        totalUsers={totalUsers}
        totalReviews={totalReviews}
      />
      
      {creators && creators.length > 0 && <CreatorSection creators={creators} />}

      <VideoHighlightGallery highlights={highlights} />

      <section className="mt-16 text-center">
        <h2 className="text-3xl font-bold">Explore Our Games</h2>
        <p className="mt-2 text-muted-foreground">Filter by category or use the search bar in the header.</p>
        <GameFilters />
      </section>
      
      {filteredGames.length > 0 ? (
          <GameGrid games={filteredGames} />
      ) : (
        <div className="text-center py-16">
            <h2 className="text-2xl font-semibold">No Games Found</h2>
            <p className="text-muted-foreground mt-2">
            Try adjusting your search or filter.
            </p>
        </div>
      )}
    </div>
  );
}
