
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { TeamMember } from "@/lib/types";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useNotification } from "@/hooks/use-notification";
import { createTeamMember, updateTeamMember } from "@/lib/data";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(1, "Name is required."),
    role: z.string().min(1, "Role is required."),
    avatarUrl: z.string().url("Must be a valid URL."),
    order: z.coerce.number().min(0, "Order must be a positive number."),
});

interface TeamMemberEditDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  member: TeamMember | null;
  onMemberSaved: (member: TeamMember) => void;
}

export function TeamMemberEditDialog({ isOpen, setIsOpen, member, onMemberSaved }: TeamMemberEditDialogProps) {
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(false);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            role: '',
            avatarUrl: 'https://placehold.co/100x100.png',
            order: 0,
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (member) {
                form.reset(member);
            } else {
                form.reset({
                    name: '',
                    role: '',
                    avatarUrl: 'https://placehold.co/100x100.png',
                    order: 0,
                });
            }
        }
    }, [member, form, isOpen]);
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        try {
            if (member) {
                await updateTeamMember(member.id, values);
                const updatedMemberData = { ...member, ...values };
                onMemberSaved(updatedMemberData);
                showNotification({ message: "Team Member Updated", description: `"${values.name}" has been saved.`, icon: <CheckCircle className="h-7 w-7 text-white" /> });
            } else {
                const newMember = await createTeamMember(values);
                onMemberSaved(newMember);
                showNotification({ message: "Team Member Created", description: `"${values.name}" has been added.`, icon: <CheckCircle className="h-7 w-7 text-white" /> });
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
                    <DialogTitle>{member ? 'Edit Member' : 'Add New Member'}</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the team member. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="role" render={({ field }) => (
                            <FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="avatarUrl" render={({ field }) => (
                            <FormItem><FormLabel>Avatar URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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
