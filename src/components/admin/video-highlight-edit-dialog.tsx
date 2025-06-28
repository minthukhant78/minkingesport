
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { VideoHighlight } from "@/lib/types";
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
import { createVideoHighlight, updateVideoHighlight } from "@/lib/data";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const formSchema = z.object({
    title: z.string().min(1, "Title is required."),
    description: z.string().min(10, "Description is required."),
    videoId: z.string().min(1, "YouTube Video ID is required."),
    order: z.coerce.number().min(0, "Order must be a positive number."),
});

interface VideoHighlightEditDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  highlight: VideoHighlight | null;
  onHighlightSaved: (highlight: VideoHighlight) => void;
}

export function VideoHighlightEditDialog({ isOpen, setIsOpen, highlight, onHighlightSaved }: VideoHighlightEditDialogProps) {
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(false);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            videoId: '',
            order: 0,
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (highlight) {
                form.reset(highlight);
            } else {
                form.reset({
                    title: '',
                    description: '',
                    videoId: '',
                    order: 0,
                });
            }
        }
    }, [highlight, form, isOpen]);
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        try {
            if (highlight) {
                await updateVideoHighlight(highlight.id, values);
                const updatedHighlightData = { ...highlight, ...values };
                onHighlightSaved(updatedHighlightData);
                showNotification({ message: "Highlight Updated", description: `"${values.title}" has been saved.`, icon: <CheckCircle className="h-7 w-7 text-white" /> });
            } else {
                const newHighlight = await createVideoHighlight(values);
                onHighlightSaved(newHighlight);
                showNotification({ message: "Highlight Created", description: `"${values.title}" has been added.`, icon: <CheckCircle className="h-7 w-7 text-white" /> });
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
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{highlight ? 'Edit Highlight' : 'Add New Highlight'}</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the video highlight. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="videoId" render={({ field }) => (
                            <FormItem><FormLabel>YouTube Video ID</FormLabel><FormControl><Input placeholder="dQw4w9WgXcQ" {...field} /></FormControl><FormMessage /></FormItem>
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
