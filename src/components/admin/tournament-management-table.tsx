
"use client";

import { useState } from "react";
import type { Tournament } from "@/lib/types";
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
import { useNotification } from "@/hooks/use-notification";
import { deleteTournament } from "@/lib/data";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { TournamentEditDialog } from "./tournament-edit-dialog";

interface TournamentManagementTableProps {
  initialTournaments: Tournament[];
}

export function TournamentManagementTable({ initialTournaments }: TournamentManagementTableProps) {
    const [tournaments, setTournaments] = useState<Tournament[]>(initialTournaments);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Tournament | null>(null);
    const [editingItem, setEditingItem] = useState<Tournament | null>(null);
    const { showNotification } = useNotification();

    const handleSaved = (savedItem: Tournament) => {
        if (editingItem) {
            setTournaments(tournaments.map(t => t.id === savedItem.id ? savedItem : t));
        } else {
            setTournaments([savedItem, ...tournaments]);
        }
        setEditingItem(null);
    };
    
    const openCreateDialog = () => {
        setEditingItem(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (item: Tournament) => {
        setEditingItem(item);
        setIsDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        try {
            await deleteTournament(itemToDelete.id);
            setTournaments(tournaments.filter(t => t.id !== itemToDelete.id));
            showNotification({ message: "Tournament Deleted", description: `"${itemToDelete.title}" has been removed.`, icon: <CheckCircle className="h-7 w-7 text-white" /> });
        } catch (error: any) {
            showNotification({ message: "Error", description: error.message, icon: <XCircle className="h-7 w-7 text-white" /> });
        } finally {
            setItemToDelete(null);
        }
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Manage Tournaments</CardTitle> 
                    <Button onClick={openCreateDialog}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Tournament
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Game</TableHead>
                                <TableHead>Prize Pool</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tournaments.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.title}</TableCell>
                                    <TableCell>{item.game}</TableCell>
                                    <TableCell>{item.prizePool}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="icon" onClick={() => openEditDialog(item)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="destructive" size="icon" onClick={() => setItemToDelete(item)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <TournamentEditDialog 
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                tournament={editingItem}
                onTournamentSaved={handleSaved}
            />
            <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the tournament "{itemToDelete?.title}".
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
