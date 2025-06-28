"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

type TeamMessage = {
  author: string;
  role: string;
  avatar: string;
  date: string;
  message: string;
  dataAiHint: string;
}

interface TeamMessagesListProps {
  messages: TeamMessage[];
}

export function TeamMessagesList({ messages }: TeamMessagesListProps) {
  return (
    <div className="space-y-8">
      {messages.map((item, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="p-6 bg-secondary/50">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border-2 border-primary">
                  <AvatarImage src={item.avatar} alt={item.author} data-ai-hint={item.dataAiHint} />
                  <AvatarFallback>{item.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold">{item.author}</h3>
                  <p className="text-sm text-muted-foreground">{item.role}</p>
                </div>
                <p className="text-sm text-muted-foreground ml-auto">{item.date}</p>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-foreground/90 whitespace-pre-line">{item.message}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
