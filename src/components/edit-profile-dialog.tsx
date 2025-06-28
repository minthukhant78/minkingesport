"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { auth, storage } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNotification } from "@/hooks/use-notification";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Camera, CheckCircle, XCircle } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { updateUserProfileData } from "@/lib/data";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  bio: z.string().max(160, "Bio cannot exceed 160 characters.").optional(),
  socialLink: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
});

export function EditProfileDialog() {
  const { user, userProfile, refreshUser } = useAuth();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bio: "",
      socialLink: "",
    },
  });

  useEffect(() => {
    if (user && isOpen) {
      form.reset({ 
        name: user.displayName || "",
        bio: userProfile?.bio || "",
        socialLink: userProfile?.socialLink || "",
      });
      setPhotoPreview(user.photoURL);
      setPhotoFile(null);
    }
  }, [user, userProfile, form, isOpen]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setLoading(true);
    try {
      let photoURL = currentUser.photoURL;

      if (photoFile) {
        const storageRef = ref(storage, `profile-pictures/${currentUser.uid}`);
        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
      }
      
      await updateProfile(currentUser, { 
        displayName: values.name,
        photoURL: photoURL,
      });

      await updateUserProfileData(currentUser.uid, {
        bio: values.bio || '',
        socialLink: values.socialLink || '',
        photoURL: photoURL || '',
      });

      await refreshUser();

      showNotification({
        message: "Profile Updated",
        description: "Your profile has been changed successfully.",
        icon: <CheckCircle className="h-7 w-7 text-white" />
      });
      setIsOpen(false);
    } catch (error: any) {
      showNotification({
        message: "Update Failed",
        description: error.message || "Could not update your profile.",
        icon: <XCircle className="h-7 w-7 text-white" />
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="flex justify-center">
                <div className="relative group">
                    <Avatar className="h-24 w-24 border-4 border-primary">
                        <AvatarImage src={photoPreview || undefined} alt={user?.displayName || "User"} />
                        <AvatarFallback>{(user?.displayName || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        aria-label="Change profile photo"
                    >
                        <Camera className="h-8 w-8 text-white" />
                    </button>
                    <Input 
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                    />
                </div>
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="name">Display Name</Label>
                  <FormControl>
                    <Input id="name" placeholder="Your display name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="bio">Bio</Label>
                  <FormControl>
                    <Textarea id="bio" placeholder="Tell us a little about yourself" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="socialLink"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="socialLink">Social Link</Label>
                  <FormControl>
                    <Input id="socialLink" placeholder="https://your-link.com" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
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
