'use client';

import React, { useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CartoonMascot = () => {
    const [isHovered, setIsHovered] = useState(false);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 20, stiffness: 150 };
    const eyeX = useSpring(mouseX, springConfig);
    const eyeY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            // Normalize to -5 to 5 for subtle eye movement
            const x = (e.clientX / innerWidth - 0.5) * 10;
            const y = (e.clientY / innerHeight - 0.5) * 10;
            mouseX.set(x);
            mouseY.set(y);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <motion.div
            initial={{ bottom: -100, opacity: 0 }}
            animate={{ bottom: 24, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 1 }}
            className="fixed right-8 z-[100] cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                animate={isHovered ? { scale: 1.1, rotate: [0, -5, 5, 0] } : { scale: 1 }}
                className="relative group"
            >
                {/* Speech Bubble */}
                {isHovered && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        className="absolute -top-16 right-0 bg-black text-white text-[10px] font-black px-4 py-2 rounded-2xl rounded-br-none whitespace-nowrap shadow-2xl border border-white/10"
                    >
                        Need a home? I&apos;m here!
                    </motion.div>
                )}

                {/* Character Body (SVG) */}
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="mascotGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#18181b" />
                            <stop offset="100%" stopColor="#3f3f46" />
                        </linearGradient>
                    </defs>

                    {/* Shadow */}
                    <ellipse cx="40" cy="75" rx="20" ry="4" fill="black" fillOpacity="0.1" />

                    {/* Body */}
                    <motion.rect
                        x="15" y="20" width="50" height="50" rx="20"
                        fill="url(#mascotGradient)"
                        animate={{
                            height: isHovered ? [50, 45, 50] : 50,
                            y: isHovered ? [20, 25, 20] : 20
                        }}
                        transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
                    />

                    {/* Left Wing/Arm */}
                    <motion.path
                        d="M15 45C5 45 5 35 15 35"
                        stroke="#18181b" strokeWidth="4" strokeLinecap="round"
                        animate={{ rotate: isHovered ? [0, -20, 0] : 0 }}
                        transition={{ duration: 0.3, repeat: Infinity }}
                    />

                    {/* Right Wing/Arm */}
                    <motion.path
                        d="M65 45C75 45 75 35 65 35"
                        stroke="#18181b" strokeWidth="4" strokeLinecap="round"
                        animate={{ rotate: isHovered ? [0, 20, 0] : 0 }}
                        transition={{ duration: 0.3, repeat: Infinity }}
                    />

                    {/* Eyes - Left */}
                    <circle cx="30" cy="40" r="10" fill="white" />
                    <motion.circle cx={30} style={{ x: eyeX, y: eyeY }} cy="40" r="4" fill="#1E293B" />

                    {/* Eyes - Right */}
                    <circle cx="50" cy="40" r="10" fill="white" />
                    <motion.circle cx={50} style={{ x: eyeX, y: eyeY }} cy="40" r="4" fill="#1E293B" />

                    {/* Mouth */}
                    <motion.path
                        d={isHovered ? "M30 55 Q40 65 50 55" : "M35 55 Q40 58 45 55"}
                        stroke="#18181b" strokeWidth="3" strokeLinecap="round" fill="none"
                    />
                </svg>

                {/* Blush */}
                <div className="absolute top-[48px] left-[22px] w-2 h-1 bg-red-400/20 rounded-full blur-[1px]" />
                <div className="absolute top-[48px] right-[22px] w-2 h-1 bg-red-400/20 rounded-full blur-[1px]" />
            </motion.div>
        </motion.div>
    );
};

export default CartoonMascot;
