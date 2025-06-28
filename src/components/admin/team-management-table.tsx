
"use client";

import { useState } from "react";
import type { TeamMember } from "@/lib/types";
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
import { deleteTeamMember } from "@/lib/data";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { TeamMemberEditDialog } from "./team-member-edit-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface TeamManagementTableProps {
  initialMembers: TeamMember[];
}

export function TeamManagementTable({ initialMembers }: TeamManagementTableProps) {
    const [members, setMembers] = useState<TeamMember[]>(initialMembers);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const { showNotification } = useNotification();

    const handleMemberSaved = (savedMember: TeamMember) => {
        if (editingMember) {
            setMembers(members.map(m => m.id === savedMember.id ? savedMember : m).sort((a,b) => a.order - b.order));
        } else {
            setMembers([...members, savedMember].sort((a,b) => a.order - b.order));
        }
        setEditingMember(null);
    };
    
    const openCreateDialog = () => {
        setEditingMember(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (member: TeamMember) => {
        setEditingMember(member);
        setIsDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!memberToDelete) return;
        try {
            await deleteTeamMember(memberToDelete.id);
            setMembers(members.filter(m => m.id !== memberToDelete.id));
            showNotification({ message: "Team Member Deleted", description: `"${memberToDelete.name}" has been removed.`, icon: <CheckCircle className="h-7 w-7 text-white" /> });
        } catch (error: any) {
            showNotification({ message: "Error", description: error.message, icon: <XCircle className="h-7 w-7 text-white" /> });
        } finally {
            setMemberToDelete(null);
        }
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Manage Team Members</CardTitle>
                    <Button onClick={openCreateDialog}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Member
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">Order</TableHead>
                                <TableHead>Avatar</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.map(member => (
                                <TableRow key={member.id}>
                                    <TableCell>{member.order}</TableCell>
                                     <TableCell>
                                        <Avatar>
                                            <AvatarImage src={member.avatarUrl} alt={member.name} />
                                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                     </TableCell>
                                    <TableCell className="font-medium">{member.name}</TableCell>
                                    <TableCell>{member.role}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="icon" onClick={() => openEditDialog(member)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="destructive" size="icon" onClick={() => setMemberToDelete(member)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <TeamMemberEditDialog 
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                member={editingMember}
                onMemberSaved={handleMemberSaved}
            />
            <AlertDialog open={!!memberToDelete} onOpenChange={(open) => !open && setMemberToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the team member "{memberToDelete?.name}".
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
