"use client";

import { motion } from 'framer-motion';

const containerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const dotVariants = {
  initial: { y: 0 },
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const Dot = () => (
    <motion.div
        className="w-2.5 h-2.5 bg-primary rounded-full"
        variants={dotVariants}
    />
);

interface JumpingDotsLoaderProps {
    className?: string;
}

export function JumpingDotsLoader({ className }: JumpingDotsLoaderProps) {
  return (
    <motion.div
      className={`flex items-end justify-center gap-2 ${className || ''}`}
      style={{ height: '1rem' }} // To prevent layout shift as dots jump
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <Dot />
      <Dot />
      <Dot />
    </motion.div>
  );
}
