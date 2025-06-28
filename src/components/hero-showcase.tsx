"use client";

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useTransform, useScroll } from 'framer-motion';

function use3DTilt(ref: React.RefObject<HTMLDivElement>) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-100, 100], [-8, 8]);
    const rotateY = useTransform(x, [-100, 100], [8, -8]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const mouseX = clientX - left;
        const mouseY = clientY - top;
        const xPct = (mouseX / width - 0.5) * 2;
        const yPct = (mouseY / height - 0.5) * 2;
        
        x.set(xPct * 100);
        y.set(yPct * 100);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return { rotateX, rotateY, handleMouseMove, handleMouseLeave };
}


export function HeroShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = use3DTilt(containerRef);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  
  return (
    <motion.div 
        ref={containerRef}
        className="relative w-full aspect-[16/9] md:aspect-[2/1] rounded-2xl overflow-hidden shadow-2xl group mb-8" 
        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.5 }}
    >
      {/* Splash Art */}
      <motion.div 
          className="w-full h-full" 
          style={{ transformStyle: 'preserve-3d', rotateX, rotateY }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          whileHover={{ scale: 1.05 }}
      >
          <motion.div
            className="relative w-full h-full"
            style={{ y: parallaxY, height: '130%' }}
          >
              <Image
                  src="https://images.pexels.com/photos/7915406/pexels-photo-7915406.jpeg"
                  alt="Hero Showcase"
                  fill
                  priority
                  className="object-cover"
                  data-ai-hint="gaming setup"
              />
          </motion.div>
      </motion.div>
      
      {/* Light Flare */}
      <motion.div 
          className="absolute -inset-1/4 bg-gradient-to-tr from-primary via-transparent to-accent blur-3xl mix-blend-soft-light pointer-events-none" 
          style={{ transform: 'translateZ(50px)' }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
              scale: [0.8, 1, 0.8],
              opacity: [0.05, 0.1, 0.05],
              rotate: [0, 180, 360]
          }}
          transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear"
          }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-background/10 to-transparent pointer-events-none"></div>
    </motion.div>
  );
}
