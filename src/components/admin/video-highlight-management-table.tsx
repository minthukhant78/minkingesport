
"use client";

import { useState } from "react";
import type { VideoHighlight } from "@/lib/types";
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
import { deleteVideoHighlight } from "@/lib/data";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { VideoHighlightEditDialog } from "./video-highlight-edit-dialog";

interface VideoHighlightManagementTableProps {
  initialHighlights: VideoHighlight[];
}

export function VideoHighlightManagementTable({ initialHighlights }: VideoHighlightManagementTableProps) {
    const [highlights, setHighlights] = useState<VideoHighlight[]>(initialHighlights);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [highlightToDelete, setHighlightToDelete] = useState<VideoHighlight | null>(null);
    const [editingHighlight, setEditingHighlight] = useState<VideoHighlight | null>(null);
    const { showNotification } = useNotification();

    const handleHighlightSaved = (savedHighlight: VideoHighlight) => {
        if (editingHighlight) {
            setHighlights(highlights.map(h => h.id === savedHighlight.id ? savedHighlight : h).sort((a,b) => a.order - b.order));
        } else {
            setHighlights([...highlights, savedHighlight].sort((a,b) => a.order - b.order));
        }
        setEditingHighlight(null);
    };
    
    const openCreateDialog = () => {
        setEditingHighlight(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (highlight: VideoHighlight) => {
        setEditingHighlight(highlight);
        setIsDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!highlightToDelete) return;
        try {
            await deleteVideoHighlight(highlightToDelete.id);
            setHighlights(highlights.filter(h => h.id !== highlightToDelete.id));
            showNotification({ message: "Highlight Deleted", description: `"${highlightToDelete.title}" has been removed.`, icon: <CheckCircle className="h-7 w-7 text-white" /> });
        } catch (error: any) {
            showNotification({ message: "Error", description: error.message, icon: <XCircle className="h-7 w-7 text-white" /> });
        } finally {
            setHighlightToDelete(null);
        }
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Manage Video Highlights</CardTitle>
                    <Button onClick={openCreateDialog}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Highlight
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">Order</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Video ID</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {highlights.map(highlight => (
                                <TableRow key={highlight.id}>
                                    <TableCell>{highlight.order}</TableCell>
                                    <TableCell className="font-medium">{highlight.title}</TableCell>
                                    <TableCell className="font-mono text-xs">{highlight.videoId}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="icon" onClick={() => openEditDialog(highlight)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="destructive" size="icon" onClick={() => setHighlightToDelete(highlight)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <VideoHighlightEditDialog 
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                highlight={editingHighlight}
                onHighlightSaved={handleHighlightSaved}
            />
            <AlertDialog open={!!highlightToDelete} onOpenChange={(open) => !open && setHighlightToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the highlight "{highlightToDelete?.title}".
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
