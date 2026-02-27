'use client';

import React, { useState, useEffect, useRef } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
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
    ...props
}) => {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const imgRef = useRef<HTMLImageElement>(null);

    // Get a semi-random fallback based on alt text if not provided
    const getFallback = () => {
        if (fallbackSrc) return fallbackSrc;
        const index = alt ? alt.length % FALLBACK_IMAGES.length : 0;
        return FALLBACK_IMAGES[index];
    };

    // Reset state when src changes
    useEffect(() => {
        setHasError(false);
        setIsLoading(true);

        // Check if image is already cached
        if (imgRef.current?.complete) {
            if (imgRef.current.naturalWidth > 0) {
                setIsLoading(false);
            } else {
                setHasError(true);
                setIsLoading(false);
            }
        }
    }, [src]);

    return (
        <div className={`relative w-full h-full overflow-hidden ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center z-10">
                    <div className="w-8 h-8 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
                </div>
            )}
            <img
                {...props}
                ref={imgRef}
                src={hasError ? getFallback() : src}
                alt={alt}
                className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
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
