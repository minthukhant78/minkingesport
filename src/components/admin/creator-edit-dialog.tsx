
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Creator } from "@/lib/types";
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
import { createCreator, updateCreator } from "@/lib/data";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(1, "Name is required."),
    title: z.string().min(1, "Title is required."),
    quote: z.string().min(10, "Quote is required."),
    avatarUrl: z.string().url("Must be a valid URL."),
    facebookUrl: z.string().url("Must be a valid URL.").optional().or(z.literal('')),
    xUrl: z.string().url("Must be a valid URL.").optional().or(z.literal('')),
    tiktokUrl: z.string().url("Must be a valid URL.").optional().or(z.literal('')),
    order: z.coerce.number().min(0, "Order must be a positive number."),
});

type FormValues = z.infer<typeof formSchema>;

interface CreatorEditDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  creator: Creator | null;
  onCreatorSaved: (creator: Creator) => void;
}

export function CreatorEditDialog({ isOpen, setIsOpen, creator, onCreatorSaved }: CreatorEditDialogProps) {
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(false);
    
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            title: '',
            quote: '',
            avatarUrl: 'https://placehold.co/100x100.png',
            facebookUrl: '',
            xUrl: '',
            tiktokUrl: '',
            order: 0,
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (creator) {
                form.reset(creator);
            } else {
                form.reset({
                    name: '',
                    title: '',
                    quote: '',
                    avatarUrl: 'https://placehold.co/100x100.png',
                    facebookUrl: '',
                    xUrl: '',
                    tiktokUrl: '',
                    order: 0,
                });
            }
        }
    }, [creator, form, isOpen]);
    
    const onSubmit = async (values: FormValues) => {
        setLoading(true);
        try {
            const dataToSave = {
                ...values,
                facebookUrl: values.facebookUrl || '',
                xUrl: values.xUrl || '',
                tiktokUrl: values.tiktokUrl || '',
            };

            if (creator) {
                await updateCreator(creator.id, dataToSave);
                const updatedCreatorData = { ...creator, ...dataToSave };
                onCreatorSaved(updatedCreatorData);
                showNotification({ message: "Creator Updated", description: `"${values.name}" has been saved.`, icon: <CheckCircle className="h-7 w-7 text-white" /> });
            } else {
                const newCreator = await createCreator(dataToSave);
                onCreatorSaved(newCreator);
                showNotification({ message: "Creator Created", description: `"${values.name}" has been added.`, icon: <CheckCircle className="h-7 w-7 text-white" /> });
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
                    <DialogTitle>{creator ? 'Edit Creator' : 'Add New Creator'}</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the creator. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="avatarUrl" render={({ field }) => (
                            <FormItem><FormLabel>Avatar URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="quote" render={({ field }) => (
                            <FormItem><FormLabel>Quote</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="facebookUrl" render={({ field }) => (
                            <FormItem><FormLabel>Facebook URL (optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="xUrl" render={({ field }) => (
                            <FormItem><FormLabel>X/Twitter URL (optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="tiktokUrl" render={({ field }) => (
                            <FormItem><FormLabel>TikTok URL (optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="order" render={({ field }) => (
                            <FormItem><FormLabel>Display Order</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
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
