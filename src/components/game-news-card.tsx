
import type { Game } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import Link from 'next/link';
import { Newspaper, Calendar } from 'lucide-react';

interface GameNewsCardProps {
  game: Game;
}

export default function GameNewsCard({ game }: GameNewsCardProps) {
  if (!game.news || game.news.length === 0) {
    return null; // Don't render the card if there's no news
  }

  // Sort news by date, most recent first
  const sortedNews = [...game.news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Newspaper />
            News & Updates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {sortedNews.map((item) => (
          <div key={item.id} className="relative pl-6 border-l-2 border-border">
             <span className="absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                <Calendar className="h-2.5 w-2.5 text-primary-foreground" />
             </span>
            <p className="text-sm text-muted-foreground mb-1">
              {new Date(item.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="mt-2 text-foreground/80">{item.content}</p>
            {item.url && (
              <Button asChild variant="link" className="px-0 h-auto mt-2">
                <Link href={item.url} target="_blank" rel="noopener noreferrer">
                  Read More
                </Link>
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
