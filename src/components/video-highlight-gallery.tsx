"use client";

import { motion, useAnimationControls } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import type { VideoHighlight } from '@/lib/types';
import { useEffect } from 'react';

const tickerVariants = {
  animate: (numItems: number) => ({
    x: [0, -((320 + 24) * numItems)], // card width 320px + space-x-6 24px
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: numItems * 5, // Adjust speed based on number of items
        ease: "linear",
      },
    },
  }),
};

interface VideoHighlightGalleryProps {
  highlights: VideoHighlight[];
}

const VideoCard = ({ video }: { video: VideoHighlight }) => (
  <div className="inline-block w-[320px] shrink-0">
    <Card className="overflow-hidden group h-full whitespace-normal">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-secondary">
          <iframe
            src={`https://www.youtube.com/embed/${video.videoId}?controls=1&autoplay=0`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          ></iframe>
        </div>
        <div className="p-4 text-left flex-grow flex flex-col">
          <h3 className="font-semibold text-lg truncate group-hover:text-primary">{video.title}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2 flex-grow">{video.description}</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

export function VideoHighlightGallery({ highlights }: VideoHighlightGalleryProps) {
  const controls = useAnimationControls();

  useEffect(() => {
      controls.start('animate');
  }, [controls]);

  if (highlights.length === 0) {
    return null;
  }

  // Duplicate highlights for a seamless loop, only if there are items.
  const duplicatedHighlights = [...highlights, ...highlights];

  return (
    <section className="my-16">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Video Highlights
      </h2>
      <div 
        className="w-full overflow-hidden"
        onMouseEnter={() => controls.stop()}
        onMouseLeave={() => controls.start('animate')}
      >
        <motion.div 
          className="flex space-x-6"
          variants={tickerVariants}
          custom={highlights.length}
          animate={controls}
        >
          {duplicatedHighlights.map((video, index) => (
            <VideoCard key={`${video.id}-${index}`} video={video} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
