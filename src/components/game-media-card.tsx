
import type { Game } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GameMediaCardProps {
  game: Game;
}

export default function GameMediaCard({ game }: GameMediaCardProps) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Media</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {game.media.map((item, index) => (
          <div key={`${item.type === 'image' ? item.url : item.videoId}-${index}`} className="relative aspect-video w-full overflow-hidden rounded-lg bg-secondary">
            {item.type === 'image' ? (
              <Image
                src={item.url}
                alt={`${game.title} media ${index + 1}`}
                fill
                className="object-cover"
                data-ai-hint="gameplay screenshot"
              />
            ) : (
              <iframe
                src={`https://www.youtube.com/embed/${item.videoId}?controls=1&autoplay=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              ></iframe>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
