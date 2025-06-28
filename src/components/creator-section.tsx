"use client";

import { motion, useAnimationControls } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Facebook } from 'lucide-react';
import { XIcon, TiktokIcon } from '@/components/icons';
import type { Creator } from '@/lib/types';
import { useEffect } from 'react';

// Using a fixed card width and gap for calculation
const CARD_WIDTH = 384; // w-96
const GAP = 24; // This is space-x-6 in tailwind

const tickerVariants = {
  animate: (numItems: number) => ({
    x: [0, -((CARD_WIDTH + GAP) * numItems)],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: numItems * 8, // Adjust speed
        ease: "linear",
      },
    },
  }),
};

const CreatorCard = ({ creator }: { creator: Creator }) => (
    <div className="inline-block w-[384px] shrink-0">
        <Card className="text-left h-full group overflow-hidden whitespace-normal">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6 h-full">
                <Avatar className="h-24 w-24 border shrink-0">
                    <AvatarImage src={creator.avatarUrl} alt={creator.name} data-ai-hint="creator portrait"/>
                    <AvatarFallback>{creator.name ? creator.name.charAt(0) : 'C'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-grow">
                    <h3 className="text-xl font-semibold text-primary">{creator.name}</h3>
                    <p className="text-sm text-muted-foreground">{creator.title}</p>
                    <blockquote className="mt-2 text-foreground/80 border-l-2 pl-4 italic flex-grow">
                        {`"${creator.quote}"`}
                    </blockquote>
                    <div className="mt-4 flex items-center gap-4">
                        {creator.facebookUrl && (
                            <Link href={creator.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                        )}
                        {creator.xUrl && (
                            <Link href={creator.xUrl} target="_blank" rel="noopener noreferrer" aria-label="X" className="text-muted-foreground hover:text-primary transition-colors">
                                <XIcon className="h-5 w-5" />
                            </Link>
                        )}
                        {creator.tiktokUrl && (
                            <Link href={creator.tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-muted-foreground hover:text-primary transition-colors">
                                <TiktokIcon className="h-5 w-5" />
                            </Link>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
);


export default function CreatorSection({ creators }: { creators: Creator[] }) {
    const controls = useAnimationControls();

    useEffect(() => {
        controls.start('animate');
    }, [controls]);

    if (!creators || creators.length === 0) {
        return null;
    }

    // Duplicate creators for a seamless loop
    const duplicatedCreators = [...creators, ...creators];

    return (
        <section className="my-16">
             <h2 className="text-3xl font-bold text-center mb-8">
                From Our Creators
            </h2>
            <div 
                className="w-full overflow-hidden"
                onMouseEnter={() => controls.stop()}
                onMouseLeave={() => controls.start('animate')}
            >
                <motion.div 
                    className="flex space-x-6"
                    variants={tickerVariants}
                    custom={creators.length}
                    animate={controls}
                >
                    {duplicatedCreators.map((creator, index) => (
                        <CreatorCard key={`${creator.id}-${index}`} creator={creator} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
