
"use client";

import { useState } from "react";
import type { FAQ } from "@/lib/types";
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
import { deleteFAQ } from "@/lib/data";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { FaqEditDialog } from "./faq-edit-dialog";

interface FaqManagementTableProps {
  initialFaqs: FAQ[];
}

export function FaqManagementTable({ initialFaqs }: FaqManagementTableProps) {
    const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<FAQ | null>(null);
    const [editingItem, setEditingItem] = useState<FAQ | null>(null);
    const { showNotification } = useNotification();

    const handleSaved = (savedItem: FAQ) => {
        if (editingItem) {
            setFaqs(faqs.map(f => f.id === savedItem.id ? savedItem : f).sort((a,b) => a.order - b.order));
        } else {
            setFaqs([...faqs, savedItem].sort((a,b) => a.order - b.order));
        }
        setEditingItem(null);
    };
    
    const openCreateDialog = () => {
        setEditingItem(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (item: FAQ) => {
        setEditingItem(item);
        setIsDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        try {
            await deleteFAQ(itemToDelete.id);
            setFaqs(faqs.filter(f => f.id !== itemToDelete.id));
            showNotification({ message: "FAQ Deleted", description: `The question has been removed.`, icon: <CheckCircle className="h-7 w-7 text-white" /> });
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
                    <CardTitle>Manage FAQs</CardTitle> 
                    <Button onClick={openCreateDialog}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New FAQ
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">Order</TableHead>
                                <TableHead>Question</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {faqs.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.order}</TableCell>
                                    <TableCell className="font-medium">{item.question}</TableCell>
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
            <FaqEditDialog 
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                faq={editingItem}
                onFaqSaved={handleSaved}
            />
            <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the question "{itemToDelete?.question}".
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
