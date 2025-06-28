
"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Gamepad2, MessageSquare } from 'lucide-react';

interface EngagementStatsProps {
  totalGames: number;
  totalUsers: number;
  totalReviews: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
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

export function EngagementStats({ totalGames, totalUsers, totalReviews }: EngagementStatsProps) {
  const stats = [
    {
      icon: <Gamepad2 className="h-8 w-8 text-primary" />,
      value: totalGames,
      label: 'Games Cataloged',
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      value: totalUsers,
      label: 'Community Members',
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      value: totalReviews,
      label: 'Reviews Written',
    },
  ];

  return (
    <motion.section 
      className="my-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="text-center">
              <CardHeader className="pb-2">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4">
                  {stat.icon}
                </div>
                <CardTitle className="text-4xl font-extrabold">
                  {stat.value.toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
