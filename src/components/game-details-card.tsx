import type { Game } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GameDetailsCardProps {
  game: Game;
}

export default function GameDetailsCard({ game }: GameDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About This Game</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/80 whitespace-pre-line">{game.description}</p>
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {(game.tags || []).map((tag) => (
              <Badge key={tag} variant="default" className="bg-accent text-accent-foreground hover:bg-accent/80">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
