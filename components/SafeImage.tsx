'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface SafeImageProps {
    src?: string;
    alt?: string;
    className?: string;
    fallbackSrc?: string;
}

const FALLBACK_IMAGES = [
    'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&w=1200&q=80'
];

const SafeImage: React.FC<SafeImageProps> = ({
    src,
    alt,
    fallbackSrc,
    className,
}) => {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const getFallback = () => {
        if (fallbackSrc) return fallbackSrc;
        const index = alt ? alt.length % FALLBACK_IMAGES.length : 0;
        return FALLBACK_IMAGES[index];
    };

    const imgSrc = src && src !== '' ? src : getFallback();

    return (
        <div className={`relative w-full h-full overflow-hidden ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 bg-slate-100 flex items-center justify-center z-10 transition-opacity duration-300">
                    <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                </div>
            )}
            <Image
                src={hasError ? getFallback() : imgSrc}
                alt={alt || 'Image'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={`object-cover transition-all duration-700 ease-in-out ${isLoading ? 'scale-105 blur-sm opacity-0' : 'scale-100 blur-0 opacity-100'}`}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setHasError(true);
                    setIsLoading(false);
                }}
            />
        </div>
    );
};

export default SafeImage;
