
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2, CheckCircle } from 'lucide-react';
import type { Review } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useNotification } from '@/hooks/use-notification';

const reviewSchema = z.object({
  author: z.string().min(2, { message: "Name must be at least 2 characters." }),
  rating: z.number().min(1, { message: "Please select a rating." }).max(5),
  comment: z.string().min(10, { message: "Comment must be at least 10 characters." }),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface AddReviewFormProps {
  onReviewSubmit: (review: Omit<Review, 'id'>) => Promise<void>;
}

const StarRating = ({ field }: { field: any }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = hoverRating >= star || field.value >= star;
        return (
          <Star
            key={star}
            className={cn(
              "h-6 w-6 cursor-pointer transition-colors",
              isFilled ? "text-amber-500" : "text-muted-foreground/30"
            )}
            fill={isFilled ? "currentColor" : "none"}
            onClick={() => field.onChange(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          />
        );
      })}
    </div>
  );
};

export default function AddReviewForm({ onReviewSubmit }: AddReviewFormProps) {
  const { showNotification } = useNotification();
  const { user } = useAuth();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      author: "",
      rating: 0,
      comment: "",
    },
  });

  useEffect(() => {
    if (user?.displayName) {
      form.setValue('author', user.displayName);
    }
  }, [user, form]);

  const onSubmit = async (data: ReviewFormValues) => {
    if (!user) return;
    try {
      const reviewData: Omit<Review, 'id'> = {
        ...data,
        authorId: user.uid,
      };

      if (user?.photoURL) {
        reviewData.avatarUrl = user.photoURL;
      }
      
      await onReviewSubmit(reviewData);

      showNotification({
        message: "Review Submitted!",
        description: "Thanks for your feedback.",
        icon: <CheckCircle className="h-7 w-7 text-white" />
      });

      form.reset({
          author: user?.displayName || "",
          rating: 0,
          comment: "",
      });
    } catch (error) {
      // Error is handled by the parent component (GameReviewsCard) which shows a toast
    }
  };

  if (!user) {
    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Write a Review</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    You must be <Link href="/sign-in" className="underline text-primary">signed in</Link> to write a review.
                </p>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
        <CardDescription>Share your thoughts as {user.displayName}.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Alex Gamer" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <StarRating field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us what you loved or hated about this game..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 animate-spin" />}
                Submit Review
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
