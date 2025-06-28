
"use client";

import { useState } from "react";
import type { Game } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { GameEditDialog } from "./game-edit-dialog";
import { useNotification } from "@/hooks/use-notification";
import { deleteGame } from "@/lib/data";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "../ui/badge";

interface GameManagementTableProps {
  initialGames: Game[];
}

export function GameManagementTable({ initialGames }: GameManagementTableProps) {
    const [games, setGames] = useState<Game[]>(initialGames);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [gameToDelete, setGameToDelete] = useState<Game | null>(null);
    const [editingGame, setEditingGame] = useState<Game | null>(null);
    const { showNotification } = useNotification();

    const handleGameSaved = (savedGame: Game) => {
        if (editingGame) {
            setGames(games.map(g => g.id === savedGame.id ? savedGame : g));
        } else {
            setGames([savedGame, ...games]);
        }
        setEditingGame(null);
    };
    
    const openCreateDialog = () => {
        setEditingGame(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (game: Game) => {
        setEditingGame(game);
        setIsDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!gameToDelete) return;
        try {
            await deleteGame(gameToDelete.id);
            setGames(games.filter(g => g.id !== gameToDelete.id));
            showNotification({ message: "Game Deleted", description: `"${gameToDelete.title}" has been removed.`, icon: <CheckCircle className="h-7 w-7 text-white" /> });
        } catch (error: any) {
            showNotification({ message: "Error", description: error.message, icon: <XCircle className="h-7 w-7 text-white" /> });
        } finally {
            setGameToDelete(null);
        }
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Manage Games</CardTitle>
                    <Button onClick={openCreateDialog}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Game
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Tags</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {games.map(game => (
                                <TableRow key={game.id}>
                                    <TableCell className="font-medium">{game.title}</TableCell>
                                    <TableCell>{game.category}</TableCell>
                                     <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {(game.tags || []).slice(0, 3).map(tag => (
                                                <Badge key={tag} variant="outline">{tag}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="icon" onClick={() => openEditDialog(game)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="destructive" size="icon" onClick={() => setGameToDelete(game)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <GameEditDialog 
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                game={editingGame}
                onGameSaved={handleGameSaved}
            />
            <AlertDialog open={!!gameToDelete} onOpenChange={(open) => !open && setGameToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete "{gameToDelete?.title}". This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
