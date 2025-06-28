"use client";

import { motion, useScroll, useTransform } from 'framer-motion';

export function ScrollingRainbow() {
    const { scrollYProgress } = useScroll();
    
    // Rotate the gradient as the user scrolls
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 360], { clamp: false });

    return (
        <div className="fixed inset-0 -z-10">
            <motion.div
                className="absolute inset-[-100%] w-[300%] h-[300%] bg-[conic-gradient(from_90deg_at_50%_50%,#ff0000_0%,#ff0080_10%,#ff00ff_20%,#8000ff_30%,#0000ff_40%,#0080ff_50%,#00ffff_60%,#00ff80_70%,#00ff00_80%,#80ff00_90%,#ffff00_100%)] opacity-10 dark:opacity-20 blur-3xl"
                style={{
                    rotate
                }}
            />
        </div>
    );
}
