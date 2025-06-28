
import type { Game } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare, Link as LinkIcon } from 'lucide-react';
import { AppleIcon, PlayStoreIcon } from './icons';

interface GameProfileHeaderProps {
  game: Game;
}

export default function GameProfileHeader({ game }: GameProfileHeaderProps) {
  return (
    <Card className="sticky top-20">
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={game.imageUrl}
            alt={game.title}
            fill
            className="object-cover rounded-t-lg"
            data-ai-hint="video game art"
          />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <h1 className="text-3xl font-bold text-primary">{game.title}</h1>
        <p className="mt-2 text-muted-foreground">by {game.developer}</p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 text-amber-500" fill="currentColor" />
            <span className="font-bold text-lg">{game.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MessageSquare className="h-5 w-5" />
            <span>{game.reviewsCount} Reviews</span>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Released: {new Date(game.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          {game.websiteUrl && (
            <Button asChild className="w-full">
              <Link href={game.websiteUrl} target="_blank" rel="noopener noreferrer">
                <LinkIcon />
                Visit Website
              </Link>
            </Button>
          )}
          {game.playStoreUrl && (
            <Button asChild variant="secondary" className="w-full">
              <Link href={game.playStoreUrl} target="_blank" rel="noopener noreferrer">
                <PlayStoreIcon />
                Play Store
              </Link>
            </Button>
          )}
          {game.appStoreUrl && (
            <Button asChild variant="secondary" className="w-full">
              <Link href={game.appStoreUrl} target="_blank" rel="noopener noreferrer">
                <AppleIcon />
                App Store
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
