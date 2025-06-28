
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GameCard } from '@/components/game-card';
import { getUserActivity } from '@/lib/data';
import type { Game } from '@/lib/types';
import ProfileGenreChart from '@/components/profile-genre-chart';
import { Skeleton } from '@/components/ui/skeleton';
import { EditProfileDialog } from '@/components/edit-profile-dialog';
import { useNotification } from '@/hooks/use-notification';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { Link as LinkIcon, CheckCircle, XCircle } from 'lucide-react';
import { updateUserProfileData } from '@/lib/data';

const allGenres = ["RPG", "Action", "Strategy", "Puzzle", "Racing", "Adventure", "Sports", "Simulation"];

export default function ProfilePage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const { showNotification } = useNotification();

  const [activityGames, setActivityGames] = useState<Game[]>([]);
  const [genreData, setGenreData] = useState<{ genre: string; games: number }[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [joinDate, setJoinDate] = useState('');

  // Mock data - should be replaced with real user data
  const userStats = {
    hoursPlayed: 450,
  };
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/sign-in');
    }
  }, [user, authLoading, router]);
  
  useEffect(() => {
    if (user) {
      if (user.metadata.creationTime) {
        setJoinDate(new Date(user.metadata.creationTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }))
      }

      const fetchUserActivity = async () => {
        setActivityLoading(true);
        try {
          // This only fetches data for the activity feed and genre chart
          const { reviewedGames } = await getUserActivity(user.uid);

          setActivityGames(reviewedGames.slice(0, 4));

          // Calculate genre data from reviewed games
          const genreCounts = reviewedGames.reduce<Record<string, number>>((acc, game) => {
              (game.tags || []).forEach(tag => {
                  if (allGenres.includes(tag)) { // Optional: only count recognized genres
                    acc[tag] = (acc[tag] || 0) + 1;
                  }
              });
              return acc;
          }, {});

          const calculatedGenreData = Object.entries(genreCounts)
            .map(([genre, games]) => ({ genre, games }))
            .sort((a, b) => b.games - a.games); // Sort to show most popular genres first
          
          setGenreData(calculatedGenreData);

        } catch (error) {
          console.error("Failed to fetch user activity:", error);
          showNotification({
            message: "Error",
            description: "Could not load your profile activity.",
            icon: <XCircle className="h-7 w-7 text-white" />
          });
        } finally {
          setActivityLoading(false);
        }
      };
      fetchUserActivity();
    }
  }, [user, showNotification]);

  const handleGenreChange = async (newGenre: string) => {
    if (!user || !userProfile) return;
    try {
      await updateUserProfileData(user.uid, { favoriteGenre: newGenre });
      showNotification({
        message: "Favorite Genre Updated!",
        description: `Your favorite genre is now set to ${newGenre}.`,
        icon: <CheckCircle className="h-7 w-7 text-white" />
      })
    } catch (error) {
       showNotification({
         message: "Update Failed",
         description: "Could not update your favorite genre.",
         icon: <XCircle className="h-7 w-7 text-white" />
       })
    }
  };

  if (authLoading || !user) {
    return (
        <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl space-y-8">
                <Card>
                    <CardContent className="p-6 flex items-center gap-6">
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-5 w-64" />
                            <Skeleton className="h-4 w-40" />
                        </div>
                    </CardContent>
                </Card>
                <div className="grid gap-6 md:grid-cols-3">
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                </div>
                <Skeleton className="h-80 w-full" />
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden">
          <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-primary">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ""} data-ai-hint="person avatar" />
              <AvatarFallback>{(user.displayName || user.email || 'U').charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-primary">{user.displayName || 'Anonymous User'}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              
              {userProfile?.bio && (
                <p className="mt-2 text-foreground/80 max-w-prose">{userProfile.bio}</p>
              )}

              {userProfile?.socialLink && (
                <Link href={userProfile.socialLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-2 text-sm text-primary hover:underline">
                  <LinkIcon className="h-4 w-4" />
                  <span>{userProfile.socialLink.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                </Link>
              )}

              <p className="text-sm text-muted-foreground mt-2">
                Joined {joinDate}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <EditProfileDialog />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-4">
              <CardDescription>Reviews Written</CardDescription>
              {authLoading ? <Skeleton className="h-10 w-1/2 mt-1" /> : <CardTitle className="text-4xl">{userProfile?.reviewsCount ?? 0}</CardTitle>}
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Favorite Genre</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {authLoading ? (
                  <Skeleton className="h-10 w-full" />
              ) : (
                  <Select onValueChange={handleGenreChange} value={userProfile?.favoriteGenre}>
                      <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your favorite..." />
                      </SelectTrigger>
                      <SelectContent>
                          {allGenres.map((genre) => (
                              <SelectItem key={genre} value={genre}>
                                  {genre}
                              </SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-4">
              <CardDescription>Hours Played</CardDescription>
              <CardTitle className="text-4xl">{userStats.hoursPlayed}</CardTitle>
            </CardHeader>
          </Card>
        </div>
        
        <section className="mb-8">
          {activityLoading ? (
            <Skeleton className="h-80 w-full" />
          ) : genreData.length > 0 ? (
            <ProfileGenreChart data={genreData} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Genre Breakdown</CardTitle>
                <CardDescription>Number of games reviewed per genre</CardDescription>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground p-10">
                <p>Review some games to see your genre stats here!</p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          {activityLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-64 w-full rounded-lg" />
             </div>
          ) : activityGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {activityGames.map((game: Game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                <p>You haven't reviewed any games yet. Your recent activity will show up here once you do.</p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
