"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, Lock, Share2, Copy } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import type { TeamMember } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useNotification } from '@/hooks/use-notification';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const MemberCard = ({ member }: { member: TeamMember }) => (
    <motion.div variants={itemVariants}>
        <Card className="transition-shadow hover:shadow-lg">
            <CardContent className="p-4 flex items-center gap-4">
                <Avatar className="h-16 w-16 border">
                    <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="professional headshot" />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="text-lg font-bold text-primary">{member.name}</h3>
                    <p className="text-muted-foreground">{member.role}</p>
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

export function TeamPageContent() {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();
    const [inviteLink, setInviteLink] = useState('');

    useEffect(() => {
        // This ensures window is defined, preventing SSR errors.
        setInviteLink(window.location.origin + '/sign-up');
    }, []);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(inviteLink);
        showNotification({
            message: "Link Copied!",
            description: "You can now share the invite link.",
            icon: <Copy className="h-7 w-7 text-white" />
        });
    };

    useEffect(() => {
        setLoading(true);
        const membersCol = collection(db, 'team_members');
        const q = query(membersCol, orderBy('order', 'asc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const members: TeamMember[] = [];
            querySnapshot.forEach((doc) => {
                members.push({ ...doc.data(), id: doc.id } as TeamMember);
            });
            setTeam(members);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching team members: ", error);
            showNotification({
                message: "Error",
                description: "Could not fetch team members.",
            });
            setLoading(false);
        });

        return () => unsubscribe();
    }, [showNotification]);

    return (
        <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                <section className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">Team Hub</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Connect with the team, start private chats, and invite new members.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2"><Users /> Public Chat</CardTitle>
                           <CardDescription>An open forum for all team members to collaborate and chat.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <Button asChild className="w-full">
                               <Link href="/team/chat">Enter Public Chat</Link>
                           </Button>
                        </CardContent>
                    </Card>
                     <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2"><Lock /> Direct Messages</CardTitle>
                           <CardDescription>Start a private 1-on-1 conversation with any member.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <Button asChild className="w-full" variant="secondary">
                               <Link href="/team/private-chat">Find a Member to Message</Link>
                           </Button>
                        </CardContent>
                    </Card>
                </div>
                
                <div className="mb-16">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Share2 /> Invite a Friend</CardTitle>
                            <CardDescription>Share this link to invite friends to join the community.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <Input value={inviteLink} readOnly className="flex-1" />
                                <Button onClick={handleCopyLink} variant="outline" className="shrink-0">
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy Link
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                <section>
                    <h2 className="text-3xl font-bold text-center mb-8">Our Members</h2>
                    {loading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                               <Card key={i}>
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <Skeleton className="h-16 w-16 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-6 w-40" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : team.length > 0 ? (
                        <motion.div 
                            className="space-y-4"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {team.map((member) => (
                                <MemberCard key={member.id} member={member} />
                            ))}
                        </motion.div>
                    ) : (
                        <Card>
                            <CardContent className="p-10 text-center text-muted-foreground">
                                <p>No team members have been added yet.</p>
                                <p className="text-sm">Admins can add members from the Admin Dashboard.</p>
                            </CardContent>
                        </Card>
                    )}
                </section>
            </div>
        </div>
    );
}
