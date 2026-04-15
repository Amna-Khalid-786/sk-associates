
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import BookingForm from './BookingForm';
import { Property } from '@/types';

interface PropertyBookingClientProps {
    property: Property;
}

export default function PropertyBookingClient({ property }: PropertyBookingClientProps) {
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const triggerBooking = () => setIsBookingOpen(true);

    // Expose trigger globally for the "Book Now" button
    useEffect(() => {
        (window as any).triggerBooking = triggerBooking;
        return () => { delete (window as any).triggerBooking; };
    }, []);

    return (
        <>
            {/* Booking Modal */}
            <AnimatePresence>
                {isBookingOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                            onClick={() => setIsBookingOpen(false)}
                        ></motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative z-10 w-full max-w-xl"
                        >
                            <BookingForm
                                propertyId={property._id || property.id || ''}
                                propertyTitle={property.title}
                                onClose={() => setIsBookingOpen(false)}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Sticky Sub-Header */}
            <div className={`bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-16 z-40 hidden md:block transition-all duration-300 ${scrolled ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs font-bold text-slate-400">
                        <Link href="/properties" className="hover:text-black">Listings</Link>
                        <span>/</span>
                        <span className="text-slate-900 truncate max-w-[200px]">{property.title}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        {/* Book Viewing button removed from above as requested */}
                    </div>
                </div>
            </div>

            {/* Floating Action Button for Mobile */}
            <div className="fixed bottom-8 right-8 z-50 md:hidden">
                <button
                    onClick={triggerBooking}
                    className="w-16 h-16 bg-black text-white rounded-full shadow-2xl flex items-center justify-center animate-bounce hover:bg-zinc-800 transition-colors"
                >
                    <span className="text-lg">🏡</span>
                </button>
            </div>
        </>
    );
}
