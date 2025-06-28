"use client";

import { motion } from 'framer-motion';
import type { Game } from '@/lib/types';
import { GameCard } from './game-card';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};


interface GameGridProps {
  games: Game[];
}

export function GameGrid({ games }: GameGridProps) {
  return (
    <motion.div
      className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {games.map((game) => (
        <motion.div 
          key={game.id} 
          variants={itemVariants}
          whileHover={{ 
            y: -10,
            scale: 1.03,
            zIndex: 10,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
            <GameCard game={game} />
        </motion.div>
      ))}
    </motion.div>
  );
}
