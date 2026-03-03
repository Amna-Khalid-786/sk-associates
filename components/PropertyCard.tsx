'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ArrowLeft, ChevronRight } from 'lucide-react';
import SafeImage from './SafeImage';
import { Property } from '@/types';
import BookingForm from './BookingForm';

interface PropertyCardProps {
    property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const allImages = [property.imageUrl, ...(property.images || [])];

    return (
        <div className="perspective-1000 group">
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
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative z-10 w-full max-w-xl"
                        >
                            <BookingForm
                                propertyId={(property._id || property.id || '')}
                                propertyTitle={property.title}
                                onClose={() => setIsBookingOpen(false)}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_40px_80px_rgba(79,70,229,0.15)] transition-all duration-700 border border-slate-100 flex flex-col h-full transform-style-3d group-hover:rotate-x-2 group-hover:rotate-y-[-2deg] group-hover:translate-z-10 group-hover:-translate-y-4">
                <div className="relative h-72 overflow-hidden cursor-pointer transform-style-3d group/slider">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentImageIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                            className="w-full h-full relative backface-hidden"
                        >
                            <SafeImage
                                src={allImages[currentImageIndex]}
                                alt={property.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Slider Controls */}
                    {allImages.length > 1 && (
                        <>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 opacity-0 group-hover/slider:opacity-100 transition-opacity z-20">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
                                    }}
                                    className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all border border-white/30 shadow-lg"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 opacity-0 group-hover/slider:opacity-100 transition-opacity z-20">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
                                    }}
                                    className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all border border-white/30 shadow-lg"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Indicators */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                                {allImages.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-6 bg-white shadow-[0_0_10px_white]' : 'w-2 bg-white/40'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                        <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 border border-white/20">
                            {property.type}
                        </div>
                        {!!property.discount && property.discount > 0 && (
                            <div className="bg-amber-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-400">
                                {property.discount}% OFF
                            </div>
                        )}
                    </div>
                    <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/20 z-20 ${property.availability === 'Sold' ? 'bg-rose-600' : property.availability === 'Reserved' ? 'bg-amber-500' : 'bg-emerald-600'
                        }`}>
                        {property.availability || 'Available'}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <Link href={`/properties/${property._id || property.id}`} className="w-full bg-white text-slate-900 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 block text-center">
                            View Details
                        </Link>
                    </div>
                </div>

                <div className="p-8">
                    <div className="flex justify-between items-start mb-4 h-16">
                        <div className="flex-1 mr-4">
                            <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                {property.title}
                            </h3>
                            <div className="flex items-center text-slate-400 gap-1.5">
                                <MapPin className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{property.city}</span>
                            </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <p className="text-lg font-black text-indigo-600">
                                PKR {property.price.toLocaleString()}
                            </p>
                            {!!property.discount && property.discount > 0 && (
                                <p className="text-[9px] text-slate-400 line-through font-bold">
                                    PKR {(property.price / (1 - property.discount / 100)).toLocaleString()}
                                </p>
                            )}
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-8 leading-relaxed translate-z-10 h-10 overflow-hidden">
                        {property.description}
                    </p>
                    <div className="flex items-center gap-4 text-slate-600 text-xs border-t border-slate-100 pt-8 translate-z-10 h-16">
                        {!!property.beds && (
                            <div className="flex items-center bg-slate-50/80 px-4 py-2 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all duration-500">
                                <span className="font-black text-indigo-600 mr-2 text-sm">{property.beds}</span>
                                <span className="font-bold text-slate-400 uppercase tracking-tighter">Beds</span>
                            </div>
                        )}
                        {!!property.baths && (
                            <div className="flex items-center bg-slate-50/80 px-4 py-2 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all duration-500">
                                <span className="font-black text-indigo-600 mr-2 text-sm">{property.baths}</span>
                                <span className="font-bold text-slate-400 uppercase tracking-tighter">Baths</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-10 pb-10 mt-auto translate-z-30 flex gap-3">
                    <Link
                        href={`/properties/${property._id || property.id}`}
                        className="flex-1 text-center bg-slate-50 text-slate-900 py-5 rounded-[1.25rem] text-[10px] font-black hover:bg-slate-100 transition-all duration-500 active:scale-[0.98] tracking-[0.15em] uppercase border border-slate-100"
                    >
                        Explore
                    </Link>
                    <button
                        onClick={() => setIsBookingOpen(true)}
                        className="flex-1 flex items-center justify-center gap-2 bg-slate-950 text-white py-5 rounded-[1.25rem] text-[10px] font-black hover:bg-indigo-600 hover:shadow-[0_20px_40px_rgba(79,70,229,0.3)] transition-all duration-500 active:scale-[0.98] tracking-[0.15em] uppercase"
                    >
                        <Calendar className="w-4 h-4" />
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;
