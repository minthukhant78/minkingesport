import Link from 'next/link';
import Image from 'next/image';
import type { Game } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/games/${game.slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-shadow duration-300 group-hover:shadow-xl">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full overflow-hidden">
            <motion.div 
              className="h-full w-full"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <Image
                src={game.imageUrl}
                alt={game.title}
                fill
                className="object-cover"
                data-ai-hint="video game cover"
              />
            </motion.div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg font-bold leading-tight mb-1 truncate group-hover:text-primary">
            {game.title}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-sm">
            {game.description}
          </CardDescription>
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <Badge variant={game.category === 'PC' ? 'default' : 'secondary'}>
              {game.category}
            </Badge>
            {(game.tags || []).slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm text-muted-foreground">
            <div>
                <span className="font-semibold text-amber-500 flex items-center gap-1">
                    <Star className="w-4 h-4" fill="currentColor"/> {game.rating.toFixed(1)}
                </span>
            </div>
            <span>{game.reviewsCount} reviews</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
