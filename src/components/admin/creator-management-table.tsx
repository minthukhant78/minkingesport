
"use client";

import { useState } from "react";
import type { Creator } from "@/lib/types";
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
import { deleteCreator } from "@/lib/data";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CreatorEditDialog } from "./creator-edit-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface CreatorManagementTableProps {
  initialCreators: Creator[];
}

export function CreatorManagementTable({ initialCreators }: CreatorManagementTableProps) {
    const [creators, setCreators] = useState<Creator[]>(initialCreators);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Creator | null>(null);
    const [editingItem, setEditingItem] = useState<Creator | null>(null);
    const { showNotification } = useNotification();

    const handleSaved = (savedItem: Creator) => {
        if (editingItem) {
            setCreators(creators.map(m => m.id === savedItem.id ? savedItem : m).sort((a,b) => a.order - b.order));
        } else {
            setCreators([...creators, savedItem].sort((a,b) => a.order - b.order));
        }
        setEditingItem(null);
    };
    
    const openCreateDialog = () => {
        setEditingItem(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (item: Creator) => {
        setEditingItem(item);
        setIsDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        try {
            await deleteCreator(itemToDelete.id);
            setCreators(creators.filter(m => m.id !== itemToDelete.id));
            showNotification({ message: "Creator Deleted", description: `"${itemToDelete.name}" has been removed.`, icon: <CheckCircle className="h-7 w-7 text-white" /> });
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
                    <CardTitle>Manage Creators</CardTitle> 
                    <Button onClick={openCreateDialog}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Creator
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">Order</TableHead>
                                <TableHead>Avatar</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {creators.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.order}</TableCell>
                                     <TableCell>
                                        <Avatar>
                                            <AvatarImage src={item.avatarUrl} alt={item.name} />
                                            <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                     </TableCell>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.title}</TableCell>
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
            <CreatorEditDialog 
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                creator={editingItem}
                onCreatorSaved={handleSaved}
            />
            <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the creator "{itemToDelete?.name}".
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
