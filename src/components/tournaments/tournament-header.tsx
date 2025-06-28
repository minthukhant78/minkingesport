
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Calendar, Gamepad2 } from 'lucide-react';

interface TournamentHeaderProps {
    title: string;
    game: string;
    prizePool: string;
    dates: string;
    description: string;
    imageUrl: string;
}

export function TournamentHeader({ title, game, prizePool, dates, description, imageUrl }: TournamentHeaderProps) {
    return (
        <header>
            <Card className="overflow-hidden">
                <div className="relative h-48 md:h-64 w-full">
                    <Image src={imageUrl} alt={title} fill className="object-cover" data-ai-hint="esports tournament banner" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                         <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">{title}</h1>
                         <p className="text-lg text-white/80 mt-1">{description}</p>
                    </div>
                </div>
                <CardContent className="p-4 bg-muted/50 grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                        <Trophy className="h-6 w-6 text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">Prize Pool</p>
                            <p className="font-bold">{prizePool}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-6 w-6 text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">Dates</p>
                            <p className="font-bold">{dates}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Gamepad2 className="h-6 w-6 text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">Game</p>
                            <p className="font-bold">{game}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </header>
    )
}
