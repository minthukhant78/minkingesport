

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { Standing } from "@/lib/types";

interface StandingsTableProps {
    standings: Standing[];
}

export function StandingsTable({ standings }: StandingsTableProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Group Stage Standings</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">Rank</TableHead>
                            <TableHead>Team</TableHead>
                            <TableHead className="text-center">Wins</TableHead>
                            <TableHead className="text-center">Losses</TableHead>
                            <TableHead className="text-right">Points</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {standings.map((s) => (
                            <TableRow key={s.rank}>
                                <TableCell className="font-bold">{s.rank}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={s.team.logoUrl} alt={s.team.name} data-ai-hint="esports logo"/>
                                            <AvatarFallback>{s.team.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{s.team.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center text-green-500 font-medium">{s.wins}</TableCell>
                                <TableCell className="text-center text-red-500 font-medium">{s.losses}</TableCell>
                                <TableCell className="text-right font-bold">{s.points}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
