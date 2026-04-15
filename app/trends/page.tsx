'use client';

import React, { useState, useEffect, useRef } from 'react';
import MarketAnalysis from '@/components/MarketAnalysis';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { TrendingUp, BarChart3, Activity, ArrowUpRight, Building2, MapPin } from 'lucide-react';


export default function TrendsPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [trendsOverview, setTrendsOverview] = useState<any>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0, width: 1, height: 1 };
        mouseX.set((clientX - left) / width);
        mouseY.set((clientY - top) / height);
    };

    const gridRotateX = useSpring(useTransform(mouseY, [0, 1], [25, 5]));
    const gridRotateY = useSpring(useTransform(mouseX, [0, 1], [-5, 5]));

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const res = await fetch('/api/trends');
                const data = await res.json();
                if (res.ok) setTrendsOverview(data);
            } catch (err) {
                console.error('Fetch trends overview:', err);
            }
        };
        fetchOverview();
    }, []);

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="bg-white min-h-screen font-sans selection:bg-zinc-100 selection:text-zinc-900 overflow-x-hidden"
        >
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
                                <a href="#trends" className="px-10 py-5 bg-black text-white rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10 uppercase tracking-widest text-xs">
                                    View Analytics
                                </a>
                                <a href="#hotspots" className="px-10 py-5 bg-white text-zinc-700 border border-zinc-200 rounded-2xl font-black hover:bg-zinc-50 transition-all shadow-sm uppercase tracking-widest text-xs">
                                    Hotspots
                                </a>
                            </motion.div>
                        </div>

                        {/* Live Stats Panel  */}
                        <div className="lg:w-1/2 w-full flex justify-center items-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, delay: 0.3 }}
                                className="w-full max-w-[480px] space-y-5"
                            >
                                {/* Live Stats Cards */}
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        {
                                            label: 'Total Properties',
                                            value: trendsOverview?.overview?.totalProperties ?? '—',
                                            icon: Building2,
                                            delay: 0.4,
                                        },
                                        {
                                            label: 'Total Inquiries',
                                            value: trendsOverview?.overview?.totalBookings ?? '—',
                                            icon: Activity,
                                            delay: 0.5,
                                        },
                                        {
                                            label: 'Deals Closed',
                                            value: trendsOverview?.overview?.completedDeals ?? '—',
                                            icon: TrendingUp,
                                            delay: 0.6,
                                        },
                                        {
                                            label: 'Pending',
                                            value: trendsOverview?.overview?.pendingBookings ?? '—',
                                            icon: BarChart3,
                                            delay: 0.7,
                                        },
                                    ].map((stat, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: stat.delay }}
                                            className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-xl hover:border-black transition-all group"
                                        >
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="p-2 bg-zinc-50 rounded-xl group-hover:bg-black group-hover:text-white transition-colors">
                                                    <stat.icon className="w-4 h-4" />
                                                </div>
                                            </div>
                                            <p className="text-3xl font-black text-zinc-900 mb-1">{stat.value}</p>
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{stat.label}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Mini Animated Ticker */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.8 }}
                                    className="bg-black rounded-3xl p-6 text-white overflow-hidden relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
                                    <div className="relative z-10 flex items-center justify-between">
                                        <div>
                                            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Live Market Status</p>
                                            <p className="text-lg font-black flex items-center gap-2">
                                                Active
                                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {trendsOverview?.citySummary?.slice(0, 3).map((city: any, i: number) => (
                                                <div key={i} className="text-right">
                                                    <p className="text-[9px] font-bold text-zinc-500 uppercase">{city.city?.slice(0, 3)}</p>
                                                    <p className="text-sm font-black text-white">{city.growthRate}</p>
                                                </div>
                                            )) ?? (
                                                <p className="text-xs text-zinc-500">Loading...</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="relative z-20 bg-white rounded-t-[5rem] -mt-10 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                        {/* Main Analysis Chart */}
                        <div className="lg:col-span-8">
                            <MarketAnalysis />
                        </div>

                        {/* Regional Spotlight Sidebar */}
                        <div className="space-y-8 lg:col-span-4" id="hotspots">
                            <div className="bg-zinc-50 p-10 rounded-[3rem] border border-zinc-100 shadow-sm">
                                <h3 className="text-2xl font-black text-zinc-900 mb-8 flex items-center gap-4">
                                    Hotspots
                                    <span className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-sm">🔥</span>
                                </h3>
                                <div className="space-y-4">
                                    {(trendsOverview?.citySummary || [
                                        { city: 'Islamabad', growthRate: '—', trend: '—', totalProperties: 0 },
                                        { city: 'Lahore', growthRate: '—', trend: '—', totalProperties: 0 },
                                        { city: 'Rawalpindi', growthRate: '—', trend: '—', totalProperties: 0 },
                                    ]).map((item: any, i: number) => (
                                        <motion.div
                                            key={i}
                                            whileHover={{ scale: 1.02 }}
                                            className="group flex justify-between items-center p-6 rounded-3xl bg-white border border-zinc-100 hover:border-black hover:shadow-xl hover:shadow-black/5 transition-all cursor-pointer"
                                        >
                                            <div>
                                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1.5">{item.city}</p>
                                                <p className="font-black text-zinc-900 text-lg flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-zinc-400" />
                                                    {item.totalProperties} Properties
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-black text-black flex items-center gap-1">
                                                    {item.growthRate}
                                                    <ArrowUpRight className="w-4 h-4" />
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
                                <h3 className="text-2xl font-black mb-6 relative z-10">Investment Insights</h3>
                                <p className="text-zinc-400 font-medium mb-10 leading-relaxed text-sm relative z-10">
                                    Get data-driven investment strategies based on real-time market analysis across Pakistan.
                                </p>
                                <a href="#trends" className="block w-full bg-white text-black font-black py-5 rounded-2xl text-xs uppercase tracking-widest hover:bg-zinc-50 transition-all relative z-10 shadow-xl text-center">
                                    Explore Data
                                </a>
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
            `}
            </style>
        </div>
    );
}
