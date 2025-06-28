"use client";

import { useState } from 'react';
import { suggestSimilarGames } from '@/ai/flows/suggest-similar-games';
import type { Game } from '@/lib/types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { JumpingDotsLoader } from './jumping-dots-loader';

interface SimilarGamesProps {
  game: Game;
}

export default function SimilarGames({ game }: SimilarGamesProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ suggestedGames: string[]; rationale: string } | null>(null);
  const { toast } = useToast();

  const handleSuggestion = async () => {
    setLoading(true);
    setResult(null);
    try {
      const suggestions = await suggestSimilarGames({
        gameTitle: game.title,
        gameDescription: game.description,
        gameTags: game.tags || [],
      });
      setResult(suggestions);
    } catch (error) {
      console.error('Error fetching game suggestions:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate game suggestions. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Similar Game Suggestions</CardTitle>
        <Button onClick={handleSuggestion} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Generate with AI
        </Button>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex flex-col justify-center items-center py-10 space-y-4">
            <JumpingDotsLoader />
            <p className="text-muted-foreground">AI is thinking...</p>
          </div>
        )}
        {result ? (
          <Alert className="bg-background">
            <Wand2 className="h-4 w-4" />
            <AlertTitle className="font-semibold text-primary">AI-Generated Rationale</AlertTitle>
            <AlertDescription className="mt-2 text-foreground/80">
              {result.rationale}
            </AlertDescription>
            <div className="mt-4">
                <h4 className="font-semibold mb-2">Suggested Games:</h4>
                <ul className="list-disc list-inside space-y-1">
                    {result.suggestedGames.map((title, index) => (
                        <li key={index}>{title}</li>
                    ))}
                </ul>
            </div>
          </Alert>
        ) : (
            !loading && <p className="text-center text-muted-foreground py-6">Click the button to get AI-powered game suggestions.</p>
        )}
      </CardContent>
    </Card>
  );
}
