
"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Game } from "@/lib/types";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNotification } from "@/hooks/use-notification";
import { createGame, updateGame } from "@/lib/data";
import { Loader2, Trash, CheckCircle, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
    title: z.string().min(1, "Title is required."),
    slug: z.string().min(1, "Slug is required.").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
    description: z.string().min(10, "Description is required."),
    category: z.enum(["PC", "Mobile"]),
    developer: z.string().min(1, "Developer is required."),
    releaseDate: z.string().min(1, "Release date is required."),
    imageUrl: z.string().url("Must be a valid URL."),
    tags: z.string().min(1, "At least one tag is required."),
    websiteUrl: z.string().url().optional().or(z.literal('')),
    playStoreUrl: z.string().url().optional().or(z.literal('')),
    appStoreUrl: z.string().url().optional().or(z.literal('')),
    media: z.array(z.object({
        type: z.enum(['image', 'youtube']),
        url: z.string().optional(),
        videoId: z.string().optional(),
    })).optional(),
    news: z.array(z.object({
        id: z.string(),
        title: z.string().min(1, "Title is required."),
        date: z.string().min(1, "Date is required."),
        content: z.string().min(1, "Content is required."),
        url: z.string().url().optional().or(z.literal('')),
    })).optional(),
});

interface GameEditDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  game: Game | null;
  onGameSaved: (game: Game) => void;
}

export function GameEditDialog({ isOpen, setIsOpen, game, onGameSaved }: GameEditDialogProps) {
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(false);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            slug: '',
            description: '',
            category: 'PC',
            developer: '',
            releaseDate: '',
            imageUrl: 'https://placehold.co/800x600.png',
            tags: '',
            websiteUrl: '',
            playStoreUrl: '',
            appStoreUrl: '',
            media: [],
            news: [],
        },
    });
    
    const { fields: mediaFields, append: appendMedia, remove: removeMedia } = useFieldArray({
      control: form.control,
      name: "media",
    });

    const { fields: newsFields, append: appendNews, remove: removeNews } = useFieldArray({
      control: form.control,
      name: "news",
    });

    useEffect(() => {
        if (isOpen) {
            if (game) {
                form.reset({
                    ...game,
                    tags: game.tags?.join(', ') || '',
                    media: game.media || [],
                    news: game.news || [],
                });
            } else {
                form.reset({
                    title: '',
                    slug: '',
                    description: '',
                    category: 'PC',
                    developer: '',
                    releaseDate: new Date().toISOString().split('T')[0],
                    imageUrl: 'https://placehold.co/800x600.png',
                    tags: '',
                    websiteUrl: '',
                    playStoreUrl: '',
                    appStoreUrl: '',
                    media: [],
                    news: [],
                });
            }
        }
    }, [game, form, isOpen]);

    const generateSlug = () => {
        const title = form.getValues("title");
        const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        form.setValue("slug", slug, { shouldValidate: true });
    };
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        try {
            const cleanedMedia = values.media?.map(({ type, url, videoId }) => {
                if (type === 'image') return { type, url: url || '' };
                return { type, videoId: videoId || '' };
            }).filter(item => (item.type === 'image' ? item.url : item.videoId));

            const gameDataToSave = {
                ...values,
                tags: values.tags.split(',').map(tag => tag.trim()).filter(Boolean),
                media: cleanedMedia || [],
                news: values.news || [],
                websiteUrl: values.websiteUrl || '',
                playStoreUrl: values.playStoreUrl || '',
                appStoreUrl: values.appStoreUrl || '',
            };
            
            if (game) {
                await updateGame(game.id, gameDataToSave);
                const updatedGameData = { ...game, ...gameDataToSave };
                onGameSaved(updatedGameData);
                showNotification({ message: "Game Updated", description: `"${values.title}" has been saved.`, icon: <CheckCircle className="h-7 w-7 text-white" /> });
            } else {
                const newGame = await createGame(gameDataToSave);
                onGameSaved(newGame);
                showNotification({ message: "Game Created", description: `"${values.title}" has been added.`, icon: <CheckCircle className="h-7 w-7 text-white" /> });
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
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{game ? 'Edit Game' : 'Add New Game'}</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the game. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} onBlur={generateSlug} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="slug" render={({ field }) => (
                            <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="category" render={({ field }) => (
                            <FormItem><FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="PC">PC</SelectItem>
                                        <SelectItem value="Mobile">Mobile</SelectItem>
                                    </SelectContent>
                                </Select><FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="developer" render={({ field }) => (
                            <FormItem><FormLabel>Developer</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="releaseDate" render={({ field }) => (
                            <FormItem><FormLabel>Release Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="imageUrl" render={({ field }) => (
                            <FormItem><FormLabel>Cover Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="tags" render={({ field }) => (
                            <FormItem><FormLabel>Tags (comma separated)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="websiteUrl" render={({ field }) => (
                            <FormItem><FormLabel>Website URL (optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="playStoreUrl" render={({ field }) => (
                            <FormItem><FormLabel>Play Store URL (optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="appStoreUrl" render={({ field }) => (
                            <FormItem><FormLabel>App Store URL (optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        
                        <Separator className="my-4" />
                        <div>
                          <h3 className="text-lg font-medium mb-4">Manage Media</h3>
                          <div className="space-y-4">
                            {mediaFields.map((field, index) => {
                              const mediaType = form.watch(`media.${index}.type`);
                              return (
                                <div key={field.id} className="p-4 border rounded-md space-y-2 relative">
                                  <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeMedia(index)}>
                                    <Trash className="h-4 w-4 text-destructive" />
                                  </Button>
                                  <FormField control={form.control} name={`media.${index}.type`} render={({ field }) => (
                                    <FormItem><FormLabel>Type</FormLabel>
                                      <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                          <SelectItem value="image">Image</SelectItem>
                                          <SelectItem value="youtube">YouTube</SelectItem>
                                        </SelectContent>
                                      </Select><FormMessage />
                                    </FormItem>
                                  )} />
                                  {mediaType === 'image' && (
                                    <FormField control={form.control} name={`media.${index}.url`} render={({ field }) => (
                                      <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://example.com/image.png" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                  )}
                                  {mediaType === 'youtube' && (
                                    <FormField control={form.control} name={`media.${index}.videoId`} render={({ field }) => (
                                      <FormItem><FormLabel>YouTube Video ID</FormLabel><FormControl><Input placeholder="dQw4w9WgXcQ" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => appendMedia({ type: 'image', url: 'https://placehold.co/1280x720.png', videoId: '' })}>
                            Add Media Item
                          </Button>
                        </div>

                        <Separator className="my-4" />
                        <div>
                          <h3 className="text-lg font-medium mb-4">Manage News</h3>
                          <div className="space-y-4">
                            {newsFields.map((field, index) => (
                              <div key={field.id} className="p-4 border rounded-md space-y-2 relative">
                                <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeNews(index)}>
                                  <Trash className="h-4 w-4 text-destructive" />
                                </Button>
                                <FormField control={form.control} name={`news.${index}.title`} render={({ field }) => (
                                  <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name={`news.${index}.date`} render={({ field }) => (
                                  <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name={`news.${index}.content`} render={({ field }) => (
                                  <FormItem><FormLabel>Content</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name={`news.${index}.url`} render={({ field }) => (
                                  <FormItem><FormLabel>URL (optional)</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                                )} />
                              </div>
                            ))}
                          </div>
                          <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => appendNews({ id: `news-${Date.now()}`, title: '', content: '', date: new Date().toISOString().split('T')[0], url: '' })}>
                            Add News Update
                          </Button>
                        </div>


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
