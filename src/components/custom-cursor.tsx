"use client";

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

export function CustomCursor() {
    const isMobile = useIsMobile();

    const cursorX = useMotionValue(-200);
    const cursorY = useMotionValue(-200);

    // Spring for the small dot
    const springDot = { damping: 25, stiffness: 500, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springDot);
    const cursorYSpring = useSpring(cursorY, springDot);

    // Spring for the larger light effect to make it lag
    const springLight = { damping: 40, stiffness: 150, mass: 1.5 };
    const lightXSpring = useSpring(cursorX, springLight);
    const lightYSpring = useSpring(cursorY, springLight);

    useEffect(() => {
        if (isMobile) return;

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        window.addEventListener('mousemove', moveCursor);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
        };
    }, [isMobile, cursorX, cursorY]);

    if (isMobile) {
        return null;
    }

    return (
        <>
            {/* The larger, blurred light effect that lags behind */}
            <motion.div
                className="pointer-events-none fixed -z-10 h-96 w-96 rounded-full bg-primary/10 opacity-50 blur-3xl"
                style={{
                    translateX: lightXSpring,
                    translateY: lightYSpring,
                    x: '-50%',
                    y: '-50%',
                }}
            />
            {/* The small dot cursor */}
            <motion.div
                className="pointer-events-none fixed left-0 top-0 z-[9999] h-3 w-3 rounded-full bg-primary"
                style={{
                    translateX: cursorXSpring,
                    translateY: cursorYSpring,
                    x: '-50%',
                    y: '-50%',
                }}
            />
        </>
    );
}
