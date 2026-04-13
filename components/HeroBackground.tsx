
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1580587767513-3f1f33f974cb?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1510798831907-f1c6670c53d1?auto=format&fit=crop&w=1920&q=80',
];

const HeroBackground = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(0);

    useEffect(() => {
        // Preload images to ensure "non-stop" visuals
        images.forEach((src) => {
            const img = new Image();
            img.src = src;
        });

        const timer = setInterval(() => {
            setPrevIndex(currentIndex);
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 6000); 

        return () => clearInterval(timer);
    }, [currentIndex]);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
            {/* Background Layer: Keep previous image visible during transition */}
            <div className="absolute inset-0 z-0">
                <img
                    src={images[prevIndex]}
                    alt="Previous Slide"
                    className="w-full h-full object-cover scale-110"
                />
            </div>

            {/* Foreground Layer: Fade in the new image */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 1 }} // Keep opaque while exiting to prevent background bleed
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                    className="absolute inset-0 z-10"
                >
                    <motion.img
                        src={images[currentIndex]}
                        alt={`Hero Slide ${currentIndex + 1}`}
                        initial={{ scale: 1.15 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 15, ease: "linear" }}
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default HeroBackground;
