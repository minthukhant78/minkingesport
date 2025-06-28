
"use client";

import { useState } from "react";
import type { UserData } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotification } from "@/hooks/use-notification";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { updateUserRole } from "@/lib/data";
import { Badge } from "../ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface UserManagementTableProps {
  initialUsers: UserData[];
}

export function UserManagementTable({ initialUsers }: UserManagementTableProps) {
    const [users, setUsers] = useState<UserData[]>(initialUsers);
    const { showNotification } = useNotification();

    const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
        try {
            await updateUserRole(userId, newRole);
            setUsers(users.map(u => u.uid === userId ? { ...u, role: newRole } : u));
            showNotification({ message: "User Role Updated", description: `User role has been changed to ${newRole}.`, icon: <CheckCircle className="h-7 w-7 text-white" /> });
        } catch (error: any) {
            showNotification({ message: "Error", description: error.message, icon: <XCircle className="h-7 w-7 text-white" /> });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Users</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right w-[150px]">Change Role</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.uid}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Select
                                        value={user.role}
                                        onValueChange={(value: 'admin' | 'user') => handleRoleChange(user.uid, value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="user">User</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
