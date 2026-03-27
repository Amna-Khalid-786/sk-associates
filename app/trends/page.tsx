'use client';

import React, { useState, useEffect, useRef } from 'react';
import MarketAnalysis from '@/components/MarketAnalysis';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import Image from 'next/image';


export default function TrendsPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0, width: 1, height: 1 };
        mouseX.set((clientX - left) / width);
        mouseY.set((clientY - top) / height);
    };

    const gridRotateX = useSpring(useTransform(mouseY, [0, 1], [25, 5]));
    const gridRotateY = useSpring(useTransform(mouseX, [0, 1], [-5, 5]));

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="bg-white min-h-screen font-sans selection:bg-zinc-100 selection:text-zinc-900 overflow-x-hidden"
        >
            {/* Navbar removed as it is handled by the root layout */}

            {/* Elegant Light Hero Section */}
            <div className="relative min-h-[85vh] flex items-center pt-4 overflow-hidden bg-slate-50/30">
                {/* Soft Perspective Grid */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden [perspective:1000px]">
                    <motion.div
                        style={{
                            rotateX: gridRotateX,
                            rotateY: gridRotateY,
                        }}
                        className="absolute inset-0 opacity-40"
                    >
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f1f1_1px,transparent_1px),linear-gradient(to_bottom,#f1f1f1_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                    </motion.div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
                        <div className="max-w-3xl lg:w-1/2 text-center lg:text-left">
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[0.9]"
                            >
                                <span className="block mb-3">MARKET</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-zinc-600 to-zinc-400">OUTLOOK.</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-xl text-zinc-500 font-medium leading-relaxed mb-12 max-w-xl mx-auto lg:mx-0"
                            >
                                Proprietary data and in-depth analysis of the Pakistani real estate landscape. Delivering institutional-grade intelligence for strategic investments.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="flex flex-wrap gap-6 justify-center lg:justify-start"
                            >
                                <button className="px-10 py-5 bg-black text-white rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10 uppercase tracking-widest text-xs">
                                    Access Terminal
                                </button>
                                <button className="px-10 py-5 bg-white text-zinc-700 border border-zinc-200 rounded-2xl font-black hover:bg-zinc-50 transition-all shadow-sm uppercase tracking-widest text-xs">
                                    View Reel
                                </button>
                            </motion.div>
                        </div>

                        {/* Large Refined Animated World Globe */}
                        <div className="lg:w-1/2 w-full flex justify-center items-center relative min-h-[550px]">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.5 }}
                                className="relative w-full aspect-square max-w-[500px]"
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {/* Continuous Rotating Rings */}
                                    {[0, 1].map((i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ rotate: 360 * (i === 0 ? 1 : -1) }}
                                            transition={{ duration: 25 + i * 15, repeat: Infinity, ease: "linear" }}
                                            className="absolute rounded-full border border-zinc-200/40"
                                            style={{
                                                width: `${450 + i * 100}px`,
                                                height: `${450 + i * 100}px`,
                                                borderStyle: i === 1 ? 'dashed' : 'solid',
                                                borderWidth: '1px'
                                            }}
                                        />
                                    ))}

                                    {/* Large Central 3D Model */}
                                    <motion.div
                                        animate={{
                                            y: [0, -20, 0],
                                            rotateY: [0, 10, 0]
                                        }}
                                        transition={{
                                            duration: 6,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className="w-[500px] h-[500px] flex items-center justify-center relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
                                    >
                                        <Image
                                            src="/3d-property-model.png"
                                            alt="Premium 3D Property Model"
                                            width={500}
                                            height={500}
                                            className="w-full h-full object-contain pointer-events-none"
                                            priority
                                        />
                                        <div className="absolute inset-x-0 -bottom-10 h-10 bg-black/5 blur-2xl rounded-[100%] scale-x-75"></div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section - High Contrast White Layer */}
            <div className="relative z-20 bg-white rounded-t-[5rem] -mt-10 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                        {/* Main Analysis Chart */}
                        <div className="lg:col-span-8">
                            <MarketAnalysis />
                        </div>

                        {/* Regional Spotlight Sidebar */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-zinc-50 p-10 rounded-[3rem] border border-zinc-100 shadow-sm">
                                <h3 className="text-2xl font-black text-zinc-900 mb-8 flex items-center gap-4">
                                    Hotspots
                                    <span className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-sm">🔥</span>
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { city: 'Islamabad', area: 'DHA Phase 2', growth: '+22%', trend: 'Bullish', color: 'zinc' },
                                        { city: 'Lahore', area: 'DHA Phase 6', growth: '+18%', trend: 'Stable', color: 'zinc' },
                                        { city: 'Rawalpindi', area: 'Bahria Phase 8', growth: '+15%', trend: 'Rising', color: 'zinc' }
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            whileHover={{ scale: 1.02 }}
                                            className="group flex justify-between items-center p-6 rounded-3xl bg-white border border-zinc-100 hover:border-black hover:shadow-xl hover:shadow-black/5 transition-all cursor-pointer"
                                        >
                                            <div>
                                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1.5">{item.city}</p>
                                                <p className="font-black text-zinc-900 text-lg">{item.area}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-xl font-black text-black`}>
                                                    {item.growth}
                                                </p>
                                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{item.trend}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-black p-12 rounded-[3.5rem] text-white shadow-2xl shadow-black/10 relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                                <h3 className="text-2xl font-black mb-6 relative z-10">Consult AI terminal</h3>
                                <p className="text-zinc-400 font-medium mb-10 leading-relaxed text-sm relative z-10">
                                    Get an AI-augmented investment strategy based on real-time spatial analysis.
                                </p>
                                <button className="w-full bg-white text-black font-black py-5 rounded-2xl text-xs uppercase tracking-widest hover:bg-zinc-50 transition-all relative z-10 shadow-xl">
                                    Launch Analysis
                                </button>
                                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: '📊',
                                title: 'Spatial Data',
                                desc: 'Ultra-high resolution mapping of development progress and occupancy rates across key sectors.',
                                color: 'zinc'
                            },
                            {
                                icon: '⚡',
                                title: 'Real-time Trends',
                                desc: 'Aggregated pricing data from 500+ sources updated daily to capture market shifts instantly.',
                                color: 'zinc'
                            },
                            {
                                icon: '🛡️',
                                title: 'Risk Grading',
                                desc: 'Comprehensive risk assessment framework for every major housing society in the country.',
                                color: 'zinc'
                            }
                        ].map((item, i) => (
                            <div key={i} className="group p-2 rounded-[4rem] bg-zinc-50 border border-zinc-100 hover:border-black transition-all">
                                <div className="bg-white p-12 rounded-[3.8rem] h-full shadow-sm group-hover:shadow-xl transition-all">
                                    <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-4xl mb-10 group-hover:scale-110 transition-transform">{item.icon}</div>
                                    <h4 className="text-2xl font-black text-slate-900 mb-5">{item.title}</h4>
                                    <p className="text-slate-500 leading-relaxed font-medium">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    background-size: 200% auto;
                    animation: gradient 5s ease infinite;
                }
            `}</style>
        </div>
    );
}
