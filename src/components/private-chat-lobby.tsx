
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { getAllUserProfiles } from '@/lib/data';
import type { UserData } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function PrivateChatLobby() {
    const { user, loading: authLoading } = useAuth();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
            if (user) {
                try {
                    const allUsers = await getAllUserProfiles();
                    // Filter out the current user
                    setUsers(allUsers.filter(u => u.uid !== user.uid));
                } catch (error) {
                    console.error("Failed to fetch users", error);
                } finally {
                    setLoading(false);
                }
            } else if (!authLoading) {
                setLoading(false);
            }
        }
        fetchUsers();
    }, [user, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-72 mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                             <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-4 w-48" />
                                    </div>
                                </div>
                                <Skeleton className="h-10 w-28" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
            <Card>
                <CardHeader>
                    <CardTitle>Start a Private Conversation</CardTitle>
                    <CardDescription>Select a user to start a direct message with them.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        {users.map(otherUser => (
                            <div key={otherUser.uid} className="flex items-center justify-between p-3 rounded-lg border hover:bg-secondary transition-colors">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={otherUser.photoURL} alt={otherUser.name || 'User'} data-ai-hint="person avatar" />
                                        <AvatarFallback>{(otherUser.name || 'U').charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{otherUser.name || 'Anonymous User'}</p>

                                        <p className="text-sm text-muted-foreground">{otherUser.email}</p>
                                    </div>
                                </div>
                                <Button asChild>
                                    <Link href={`/team/dm/${otherUser.uid}`}>
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        Message
                                    </Link>
                                </Button>
                            </div>
                        ))}
                         {users.length === 0 && (
                            <div className="text-center text-muted-foreground py-10">
                                <p>No other users found to message.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
