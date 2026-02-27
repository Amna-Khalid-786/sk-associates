'use client';

import React from 'react';

interface BookingTriggerProps {
    children: React.ReactNode;
    className?: string;
}

const BookingTrigger: React.FC<BookingTriggerProps> = ({ children, className }) => {
    const handleTrigger = () => {
        if (typeof window !== 'undefined' && (window as any).triggerBooking) {
            (window as any).triggerBooking();
        }
    };

    return (
        <button onClick={handleTrigger} className={className}>
            {children}
        </button>
    );
};

export default BookingTrigger;
