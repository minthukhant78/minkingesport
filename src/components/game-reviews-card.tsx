
"use client";

import type { Game, Review } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useState } from 'react';
import AddReviewForm from './add-review-form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { addReviewToGame } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

interface GameReviewsCardProps {
  game: Game;
}

export default function GameReviewsCard({ game }: GameReviewsCardProps) {
  const [reviews, setReviews] = useState<Review[]>(() =>
    (game.reviews || []).map((review, index) => ({
      ...review,
      id: review.id || `initial-review-${index}`,
    }))
  );
  const { toast } = useToast();

  const handleAddReview = async (newReviewData: Omit<Review, 'id'>) => {
    const optimisticReview: Review = {
      ...newReviewData,
      id: `review-${Date.now()}`
    };
    setReviews(prevReviews => [optimisticReview, ...prevReviews]);

    try {
      await addReviewToGame(game.id, newReviewData);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'Your review could not be saved. Please try again.',
      });
      setReviews(prevReviews => prevReviews.filter(r => r.id !== optimisticReview.id));
      throw error; // Re-throw to inform the form component
    }
  };

  return (
    <>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="flex items-start space-x-4">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={review.avatarUrl} alt={`${review.author || 'Anonymous'}'s avatar`} data-ai-hint="person avatar" />
                  <AvatarFallback>{(review.author || 'A').charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{review.author || 'Anonymous'}</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? 'text-amber-500' : 'text-muted-foreground/30'}`}
                          fill={i < review.rating ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground pt-1">{review.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">No reviews yet for this game.</p>
          )}
        </CardContent>
      </Card>
      <AddReviewForm onReviewSubmit={handleAddReview} />
    </>
  );
}
