
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, type Timestamp, doc, updateDoc, deleteDoc, setDoc, runTransaction } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Send, Loader2, X, MoreVertical, Edit, Trash2, Pin, CheckCircle, XCircle, SmilePlus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNotification } from '@/hooks/use-notification';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { JumpingDotsLoader } from '@/components/jumping-dots-loader';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';


interface ChatMessage {
  id: string;
  text: string;
  author: string;
  authorId: string;
  photoURL?: string;
  createdAt: Timestamp;
  imageUrl?: string;
  isEdited?: boolean;
  reactions?: { [emoji: string]: string[] };
}

interface PinnedMessageDoc {
  message: ChatMessage;
  pinnedBy: string;
  pinnedAt: Timestamp;
}

export default function TeamChatPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { showNotification } = useNotification();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [editedText, setEditedText] = useState('');
  const [messageToDelete, setMessageToDelete] = useState<ChatMessage | null>(null);
  const [pinnedMessageDoc, setPinnedMessageDoc] = useState<PinnedMessageDoc | null>(null);
  

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/sign-in');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    // Listen for messages
    const q = query(collection(db, 'team-chat'), orderBy('createdAt', 'asc'));
    const unsubscribeMessages = onSnapshot(q, (querySnapshot) => {
      const msgs: ChatMessage[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.createdAt) {
          msgs.push({ id: doc.id, ...data } as ChatMessage);
        }
      });
      setMessages(msgs);
    });

    // Listen for pinned message
    const pinnedMessageRef = doc(db, 'team-chat-meta', 'pinned-message');
    const unsubscribePinned = onSnapshot(pinnedMessageRef, (doc) => {
      setPinnedMessageDoc(doc.exists() ? doc.data() as PinnedMessageDoc : null);
    });

    return () => {
      unsubscribeMessages();
      unsubscribePinned();
    };
  }, [user]);
  

  useEffect(() => {
    if (!editingMessage) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, editingMessage]);

  const filteredMessages = messages.filter(msg =>
    msg.text?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setSending(true);
    try {
      await addDoc(collection(db, 'team-chat'), {
        text: newMessage.trim(),
        author: user.displayName || 'Anonymous',
        authorId: user.uid,
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
      });
      
      setNewMessage('');
    } catch (error: any) {
      console.error("Error sending message:", error);
      showNotification({
        message: 'Error Sending Message',
        description: 'Failed to send the message. Please try again.',
        icon: <XCircle className="h-7 w-7 text-white" />
      });
    } finally {
      setSending(false);
    }
  };

  const startEditing = (msg: ChatMessage) => {
    setEditingMessage(msg);
    setEditedText(msg.text);
  };

  const handleSaveEdit = async () => {
    if (!editingMessage) return;
    setSending(true);
    try {
      const messageRef = doc(db, 'team-chat', editingMessage.id);
      await updateDoc(messageRef, { text: editedText, isEdited: true });

      if (pinnedMessageDoc?.message.id === editingMessage.id) {
          const pinnedMessageRef = doc(db, 'team-chat-meta', 'pinned-message');
          await updateDoc(pinnedMessageRef, { 'message.text': editedText, 'message.isEdited': true });
      }
      showNotification({
        message: 'Message Updated!',
        icon: <CheckCircle className="h-7 w-7 text-white" />
      });
    } catch (error) {
      showNotification({
        message: 'Update Failed',
        description: 'Could not update the message.',
        icon: <XCircle className="h-7 w-7 text-white" />
      });
    } finally {
      setEditingMessage(null);
      setSending(false);
    }
  };

  const handleDeleteMessage = async () => {
    if (!messageToDelete) return;
    try {
      await deleteDoc(doc(db, 'team-chat', messageToDelete.id));
      if (pinnedMessageDoc?.message.id === messageToDelete.id) {
        await deleteDoc(doc(db, 'team-chat-meta', 'pinned-message'));
      }
      showNotification({
        message: 'Message Deleted',
        icon: <CheckCircle className="h-7 w-7 text-white" />
      });
    } catch (error) {
      showNotification({
        message: 'Delete Failed',
        description: 'Could not delete the message.',
        icon: <XCircle className="h-7 w-7 text-white" />
      });
    } finally {
      setMessageToDelete(null);
    }
  };

  const handlePinMessage = async (msg: ChatMessage) => {
    if (!user) return;
    try {
      const pinnedMessageRef = doc(db, 'team-chat-meta', 'pinned-message');
      await setDoc(pinnedMessageRef, {
        message: msg,
        pinnedBy: user.displayName || 'Anonymous',
        pinnedAt: serverTimestamp(),
      });
      showNotification({
        message: 'Message Pinned!',
        icon: <CheckCircle className="h-7 w-7 text-white" />
      });
    } catch (error) {
      showNotification({
        message: 'Pin Failed',
        description: 'Could not pin the message.',
        icon: <XCircle className="h-7 w-7 text-white" />
      });
    }
  };

  const handleUnpinMessage = async () => {
    try {
      await deleteDoc(doc(db, 'team-chat-meta', 'pinned-message'));
      showNotification({
        message: 'Message Unpinned',
        icon: <CheckCircle className="h-7 w-7 text-white" />
      });
    } catch (error) {
      showNotification({
        message: 'Unpin Failed',
        description: 'Could not unpin the message.',
        icon: <XCircle className="h-7 w-7 text-white" />
      });
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    if (!user) return;
    const messageRef = doc(db, 'team-chat', messageId);
    try {
      await runTransaction(db, async (transaction) => {
        const messageDoc = await transaction.get(messageRef);
        if (!messageDoc.exists()) { throw "Document does not exist!"; }

        const currentReactions = messageDoc.data().reactions || {};
        const reactors: string[] = currentReactions[emoji] || [];
        const userIndex = reactors.indexOf(user.uid);

        if (userIndex > -1) {
            reactors.splice(userIndex, 1);
        } else {
            reactors.push(user.uid);
        }

        if (reactors.length === 0) {
            delete currentReactions[emoji];
        } else {
            currentReactions[emoji] = reactors;
        }
        transaction.update(messageRef, { reactions: currentReactions });
      });
    } catch (error) {
        console.error("Error updating reaction:", error);
        showNotification({
            message: 'Reaction Failed',
            description: 'Could not update reaction.',
            icon: <XCircle className="h-7 w-7 text-white" />
        });
    }
  };


  if (authLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <JumpingDotsLoader />
      </div>
    );
  }

  const renderMessageBubble = (msg: ChatMessage) => {
    if (editingMessage?.id === msg.id) {
      return (
        <div className="p-2 space-y-2 w-full">
          {msg.imageUrl && (
            <div className="relative aspect-square w-full min-w-48 rounded-md overflow-hidden bg-black/20">
              <Image src={msg.imageUrl} alt="Image to be edited" fill className="object-contain" />
            </div>
          )}
          <Textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="bg-background text-foreground"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSaveEdit();
              }
            }}
            rows={2}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setEditingMessage(null)}>Cancel</Button>
            <Button size="sm" onClick={handleSaveEdit} disabled={sending || !editedText.trim()}>
              {sending ? <Loader2 className="animate-spin" /> : 'Save'}
            </Button>
          </div>
        </div>
      );
    }
    return (
      <>
        {msg.imageUrl && (
          <Link href={msg.imageUrl} target="_blank" rel="noopener noreferrer" className="block bg-black/20">
            <div className="relative aspect-square w-full min-w-48">
              <Image src={msg.imageUrl} alt={msg.text || `Image from ${msg.author}`} fill className="object-contain" data-ai-hint="chat image" />
            </div>
          </Link>
        )}
        {msg.text && <p className="text-sm break-words px-3 py-2">{msg.text}</p>}
      </>
    );
  };

  return (
    <div className="container mx-auto px-2 py-4 md:px-4 md:py-6 h-[calc(100vh-5rem)] flex flex-col">
       <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="p-4 border-b">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-primary shrink-0">Team Chat Room</CardTitle>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-6 relative">
          {pinnedMessageDoc && (
            <div className="p-3 mb-6 rounded-lg bg-secondary border-l-4 border-primary sticky top-0 z-10 shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Pin className="h-4 w-4 text-primary" />
                  <p className="font-bold text-sm">Pinned Message</p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleUnpinMessage}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm mt-2 ml-6 text-muted-foreground break-words line-clamp-2">{pinnedMessageDoc.message.text || 'Image'}</div>
              <div className="text-xs text-muted-foreground mt-1 ml-6">Pinned by {pinnedMessageDoc.pinnedBy}</div>
            </div>
          )}

          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`group flex items-start gap-3 ${msg.authorId === user.uid ? 'justify-end' : 'justify-start'}`}
            >
              {msg.authorId !== user.uid && (
                <Avatar className="h-10 w-10 border shrink-0">
                  <AvatarImage src={msg.photoURL} alt={msg.author || 'User'} />
                  <AvatarFallback>{(msg.author || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              )}
               <div className="flex items-center gap-2">
                {msg.authorId === user.uid && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center self-start">
                        <EmojiReactionPicker onSelect={(emoji) => handleReaction(msg.id, emoji)} />
                        <MessageActions msg={msg} onEdit={startEditing} onDelete={setMessageToDelete} onPin={handlePinMessage} isOwnMessage={true} />
                    </div>
                )}
                <div
                  className={`flex flex-col gap-1 ${msg.authorId === user.uid ? 'items-end' : 'items-start'}`}
                >
                  <div className={`rounded-lg max-w-xs sm:max-w-sm md:max-w-md overflow-hidden ${msg.authorId === user.uid ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                    {renderMessageBubble(msg)}
                  </div>
                   {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className={cn("flex gap-1 mt-1 flex-wrap", msg.authorId === user.uid ? 'justify-end' : 'justify-start')}>
                      {Object.entries(msg.reactions).filter(([, reactors]) => reactors.length > 0).map(([emoji, reactors]) => (
                        <Button
                          key={emoji}
                          variant={reactors.includes(user.uid) ? 'default' : 'secondary'}
                          size="sm"
                          onClick={() => handleReaction(msg.id, emoji)}
                          className={cn("h-auto px-2 py-0.5 rounded-full")}
                        >
                          <span className="text-sm mr-1.5">{emoji}</span>
                          <span className="text-xs font-bold">{reactors.length}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground px-1">
                    <span>{msg.authorId === user.uid ? 'You' : (msg.author || 'User')}</span>
                    <span className="mx-1">&middot;</span>
                    <span>
                      {msg.createdAt?.toDate ? 
                        formatDistanceToNow(msg.createdAt.toDate(), { addSuffix: true }) : 
                        'sending...'}
                    </span>
                    {msg.isEdited && <span className="text-muted-foreground/70"> (edited)</span>}
                  </div>
                </div>
                 {msg.authorId !== user.uid && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center self-start">
                        <EmojiReactionPicker onSelect={(emoji) => handleReaction(msg.id, emoji)} />
                        <MessageActions msg={msg} onEdit={startEditing} onDelete={setMessageToDelete} onPin={handlePinMessage} isOwnMessage={false} />
                    </div>
                )}
               </div>
               {msg.authorId === user.uid && (
                <Avatar className="h-10 w-10 border shrink-0">
                  <AvatarImage src={msg.photoURL} alt={msg.author || 'You'} />
                  <AvatarFallback>{(user.displayName || 'Y').charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {filteredMessages.length === 0 && searchQuery && (
            <div className="text-center text-muted-foreground py-10">
                <p>No messages found for "{searchQuery}".</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <div className="p-4 border-t bg-background">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              autoComplete="off"
              disabled={sending}
            />
            <Button type="submit" size="icon" disabled={!newMessage.trim() || sending}>
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </Card>

      <AlertDialog open={!!messageToDelete} onOpenChange={(open) => !open && setMessageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this message?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMessage} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
function EmojiReactionPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <SmilePlus className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-1">
        <div className="flex gap-0.5">
          {EMOJIS.map(emoji => (
            <Button
              key={emoji}
              variant="ghost"
              size="icon"
              className="text-xl rounded-full"
              onClick={() => {
                onSelect(emoji);
                setIsOpen(false);
              }}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}


interface MessageActionsProps {
    msg: ChatMessage;
    onPin: (msg: ChatMessage) => void;
    onEdit: (msg: ChatMessage) => void;
    onDelete: (msg: ChatMessage) => void;
    isOwnMessage: boolean;
}

function MessageActions({ msg, onPin, onEdit, onDelete, isOwnMessage }: MessageActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onPin(msg)}>
                    <Pin className="mr-2 h-4 w-4" />
                    <span>Pin Message</span>
                </DropdownMenuItem>
                {isOwnMessage && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(msg)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(msg)} className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
