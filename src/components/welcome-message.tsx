"use client";

import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';

const containerVariants = {
  hidden: { opacity: 1 }, // Start with opacity 1 to avoid flickering
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

const nameContainerVariants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.07,
            delayChildren: 0.2
        },
    }
}

const charVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
        duration: 0.01 // Appear instantly
    }
  },
};

export default function WelcomeMessage() {
  const { user, loading: authLoading } = useAuth();
  const welcomeName = user?.displayName || 'Gamer'; // Use full display name

  if (authLoading) {
    return (
        <div className="text-center h-[9rem] md:h-[10rem]">
             {/* Placeholder to prevent layout shift */}
        </div>
    );
  }

  return (
    <motion.div 
        className="text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
    >
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
        <motion.span className="inline-block" variants={itemVariants}>Welcome, </motion.span>
        
        <motion.span 
            className="text-primary inline-block"
            variants={nameContainerVariants}
            aria-label={welcomeName}
        >
            {welcomeName.split('').map((char, index) => (
                <motion.span
                    key={`${char}-${index}`}
                    className="inline-block"
                    variants={charVariants}
                    aria-hidden="true"
                >
                    {char === ' ' ? '\u00A0' : char}
                </motion.span>
            ))}
        </motion.span>
      </h1>
      <motion.p 
        className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground"
        variants={itemVariants}
      >
        Discover, search, and get recommendations for your next favorite game.
      </motion.p>
    </motion.div>
  );
}
