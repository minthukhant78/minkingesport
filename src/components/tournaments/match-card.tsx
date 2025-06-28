

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import type { Match } from '@/lib/types';

interface MatchCardProps {
    match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
    const { teamA, teamB, scoreA, scoreB, time, status, stage } = match;

    const teamAwon = scoreA > scoreB;
    const teamBwon = scoreB > scoreA;

    return (
        <Card className="transition-all hover:shadow-lg">
            <CardContent className="p-4 flex items-center justify-between">
                {/* Team A */}
                <div className="flex items-center gap-4 justify-end flex-1">
                     <span className={cn(
                        "font-bold text-lg text-right w-32 truncate",
                        status === 'finished' && (teamAwon ? 'text-primary' : 'text-muted-foreground')
                    )}>{teamA.name}</span>
                    <Avatar>
                        <AvatarImage src={teamA.logoUrl} alt={teamA.name} data-ai-hint="esports logo" />
                        <AvatarFallback>{teamA.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>
                
                {/* Score / Time */}
                <div className="text-center mx-4 w-32 shrink-0">
                    {status === 'live' && (
                        <>
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-2xl font-bold">{scoreA}</span>
                                <span className="text-muted-foreground">-</span>
                                <span className="text-2xl font-bold">{scoreB}</span>
                            </div>
                            <Badge variant="destructive" className="mt-1 animate-pulse">LIVE</Badge>
                        </>
                    )}
                     {status === 'finished' && (
                        <div className="flex items-center justify-center gap-3">
                            <span className={cn("text-2xl font-bold", teamAwon ? 'text-primary' : 'text-muted-foreground')}>{scoreA}</span>
                            <span className="text-muted-foreground">-</span>
                            <span className={cn("text-2xl font-bold", teamBwon ? 'text-primary' : 'text-muted-foreground')}>{scoreB}</span>
                        </div>
                    )}
                    {status === 'upcoming' && (
                        <>
                            <div className="text-xl font-bold">{time.split(', ')[1]}</div>
                             <div className="text-xs text-muted-foreground">{time.split(', ')[0]}</div>
                        </>
                    )}
                     <p className="text-xs text-muted-foreground mt-1 truncate">{stage}</p>
                </div>

                {/* Team B */}
                <div className="flex items-center gap-4 justify-start flex-1">
                    <Avatar>
                        <AvatarImage src={teamB.logoUrl} alt={teamB.name} data-ai-hint="esports logo" />
                        <AvatarFallback>{teamB.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className={cn(
                        "font-bold text-lg w-32 truncate",
                        status === 'finished' && (teamBwon ? 'text-primary' : 'text-muted-foreground')
                    )}>{teamB.name}</span>
                </div>
            </CardContent>
        </Card>
    );
}
