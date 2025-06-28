
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Tournament } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useNotification } from "@/hooks/use-notification";
import { createTournament, updateTournament } from "@/lib/data";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const formSchema = z.object({
    title: z.string().min(1, "Title is required."),
    game: z.string().min(1, "Game is required."),
    prizePool: z.string().min(1, "Prize pool is required."),
    dates: z.string().min(1, "Dates are required."),
    description: z.string().min(10, "Description is required."),
    imageUrl: z.string().url("Must be a valid URL."),
});

type FormValues = z.infer<typeof formSchema>;

interface TournamentEditDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  tournament: Tournament | null;
  onTournamentSaved: (tournament: Tournament) => void;
}

export function TournamentEditDialog({ isOpen, setIsOpen, tournament, onTournamentSaved }: TournamentEditDialogProps) {
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(false);
    
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            game: '',
            prizePool: '',
            dates: '',
            description: '',
            imageUrl: 'https://placehold.co/1200x400.png',
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (tournament) {
                form.reset(tournament);
            } else {
                form.reset({
                    title: '',
                    game: '',
                    prizePool: '',
                    dates: '',
                    description: '',
                    imageUrl: 'https://placehold.co/1200x400.png',
                });
            }
        }
    }, [tournament, form, isOpen]);
    
    const onSubmit = async (values: FormValues) => {
        setLoading(true);
        try {
            if (tournament) {
                await updateTournament(tournament.id, values);
                const updatedTournamentData = { ...tournament, ...values };
                onTournamentSaved(updatedTournamentData);
                showNotification({ message: "Tournament Updated", description: `"${values.title}" has been saved.`, icon: <CheckCircle className="h-7 w-7 text-white" /> });
            } else {
                const newTournament = await createTournament(values);
                onTournamentSaved(newTournament);
                showNotification({ message: "Tournament Created", description: `"${values.title}" has been added.`, icon: <CheckCircle className="h-7 w-7 text-white" /> });
            }
            setIsOpen(false);
        } catch (error: any) {
            showNotification({ message: "Error", description: error.message, icon: <XCircle className="h-7 w-7 text-white" /> });
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{tournament ? 'Edit Tournament' : 'Add New Tournament'}</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the tournament. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="game" render={({ field }) => (
                            <FormItem><FormLabel>Game</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="prizePool" render={({ field }) => (
                            <FormItem><FormLabel>Prize Pool</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="dates" render={({ field }) => (
                            <FormItem><FormLabel>Dates</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="imageUrl" render={({ field }) => (
                            <FormItem><FormLabel>Banner Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        
                        <DialogFooter className="mt-4">
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 animate-spin" />}
                                Save changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
