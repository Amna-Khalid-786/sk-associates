
'use client';

import React, { useState, useEffect } from 'react';

const images = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1580587767513-3f1f33f974cb?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1510798831907-f1c6670c53d1?auto=format&fit=crop&w=1920&q=80',
];

const HeroBackground = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 6000); // Change image every 6 seconds
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden bg-slate-900">
            {images.map((img, index) => (
                <div
                    key={img}
                    className={`absolute inset-0 transition-opacity duration-[3000ms] ease-in-out ${index === currentIndex ? 'opacity-80' : 'opacity-0'
                        }`}
                >
                    <img
                        src={img}
                        alt={`Hero Slide ${index + 1}`}
                        className={`w-full h-full object-cover transform transition-transform duration-[20000ms] ease-out ${index === currentIndex ? 'scale-110' : 'scale-100'
                            }`}
                    />
                </div>
            ))}
            {/* Elegant Overlay Layer */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/20 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        </div>
    );
};

export default HeroBackground;
