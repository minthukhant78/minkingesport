
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { CreatorInfo } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useNotification } from "@/hooks/use-notification";
import { updateCreatorInfo } from "@/lib/data";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(1, "Name is required."),
    title: z.string().min(1, "Title is required."),
    quote: z.string().min(10, "Quote is required."),
    avatarUrl: z.string().url("Must be a valid URL."),
    facebookUrl: z.string().url("Must be a valid URL.").optional().or(z.literal('')),
    xUrl: z.string().url("Must be a valid URL.").optional().or(z.literal('')),
    tiktokUrl: z.string().url("Must be a valid URL.").optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

interface CreatorInfoFormProps {
  initialInfo: CreatorInfo | null;
}

export function CreatorInfoForm({ initialInfo }: CreatorInfoFormProps) {
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
        },
    });

    useEffect(() => {
        if (initialInfo) {
            form.reset(initialInfo);
        }
    }, [initialInfo, form]);

    const onSubmit = async (values: FormValues) => {
        setLoading(true);
        try {
            await updateCreatorInfo(values);
            showNotification({ message: "Creator Info Updated", description: "The 'From the Creator' section has been saved.", icon: <CheckCircle className="h-7 w-7 text-white" /> });
        } catch (error: any) {
            showNotification({ message: "Error", description: error.message, icon: <XCircle className="h-7 w-7 text-white" /> });
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage "From the Creator" Section</CardTitle>
                <CardDescription>
                    Update the information displayed in the creator section on the homepage.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        
                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
