
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { FAQ } from "@/lib/types";
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
import { createFAQ, updateFAQ } from "@/lib/data";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const formSchema = z.object({
    question: z.string().min(1, "Question is required."),
    answer: z.string().min(1, "Answer is required."),
    order: z.coerce.number().min(0, "Order must be a positive number."),
});

type FormValues = z.infer<typeof formSchema>;

interface FaqEditDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  faq: FAQ | null;
  onFaqSaved: (faq: FAQ) => void;
}

export function FaqEditDialog({ isOpen, setIsOpen, faq, onFaqSaved }: FaqEditDialogProps) {
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(false);
    
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            question: '',
            answer: '',
            order: 0,
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (faq) {
                form.reset(faq);
            } else {
                form.reset({
                    question: '',
                    answer: '',
                    order: 0,
                });
            }
        }
    }, [faq, form, isOpen]);
    
    const onSubmit = async (values: FormValues) => {
        setLoading(true);
        try {
            if (faq) {
                await updateFAQ(faq.id, values);
                const updatedFaqData = { ...faq, ...values };
                onFaqSaved(updatedFaqData);
                showNotification({ message: "FAQ Updated", description: `The question has been saved.`, icon: <CheckCircle className="h-7 w-7 text-white" /> });
            } else {
                const newFaq = await createFAQ(values);
                onFaqSaved(newFaq);
                showNotification({ message: "FAQ Created", description: `The new question has been added.`, icon: <CheckCircle className="h-7 w-7 text-white" /> });
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
                    <DialogTitle>{faq ? 'Edit FAQ' : 'Add New FAQ'}</DialogTitle>
                    <DialogDescription>
                        Fill in the question and answer. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField control={form.control} name="question" render={({ field }) => (
                            <FormItem><FormLabel>Question</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="answer" render={({ field }) => (
                            <FormItem><FormLabel>Answer</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>
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
