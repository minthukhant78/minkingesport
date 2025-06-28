
import { getGameBySlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import GameProfileHeader from '@/components/game-profile-header';
import GameDetailsCard from '@/components/game-details-card';
import GameMediaCard from '@/components/game-media-card';
import GameNewsCard from '@/components/game-news-card';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  params: { slug: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const game = await getGameBySlug(params.slug);

  if (!game) {
    return {
      title: 'Game Not Found'
    }
  }

  return {
    title: game.title,
    description: game.description,
    openGraph: {
      title: game.title,
      description: game.description,
      images: [
        {
          url: game.imageUrl,
          width: 800,
          height: 600,
          alt: game.title,
        },
      ],
    },
     twitter: {
      card: 'summary_large_image',
      title: game.title,
      description: game.description,
      images: [game.imageUrl],
    },
  }
}

const LoadingCard = () => (
  <Card className="mt-8">
    <CardHeader>
      <Skeleton className="h-7 w-1/3" />
    </CardHeader>
    <CardContent className="space-y-4 pt-6">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </CardContent>
  </Card>
);

const SimilarGames = dynamic(() => import('@/components/similar-games'), {
  loading: () => <LoadingCard />,
});
const GameReviewsCard = dynamic(() => import('@/components/game-reviews-card'), {
  loading: () => <LoadingCard />,
});


export default async function GameProfilePage({ params }: { params: { slug: string } }) {
  const game = await getGameBySlug(params.slug);

  if (!game) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Column */}
        <div className="md:col-span-1">
          <GameProfileHeader game={game} />
        </div>

        {/* Right Column */}
        <div className="md:col-span-2">
          <GameDetailsCard game={game} />
          <GameMediaCard game={game} />
          <GameNewsCard game={game} />
          <SimilarGames game={game} />
          <GameReviewsCard game={game} />
        </div>
      </div>
    </div>
  );
}
