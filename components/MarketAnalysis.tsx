
'use client';

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { motion } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-white/60">
                <p className="text-zinc-900 font-black mb-3 border-b border-zinc-100 pb-2">{label}</p>
                <div className="space-y-2">
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between gap-8">
                            <span className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{entry.name}</span>
                            </span>
                            <span className="text-sm font-black text-zinc-900">{entry.value} listings</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

interface TrendsData {
    monthlyTrends: any[];
    citySummary: any[];
    typeBreakdown: any[];
    overview: {
        totalProperties: number;
        totalBookings: number;
        pendingBookings: number;
        completedDeals: number;
    };
}

const MarketAnalysis: React.FC = () => {
    const [isMounted, setIsMounted] = React.useState(false);
    const [trendsData, setTrendsData] = useState<TrendsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setIsMounted(true);
        fetchTrends();
    }, []);

    const fetchTrends = async () => {
        try {
            const res = await fetch('/api/trends');
            const data = await res.json();
            if (res.ok) {
                setTrendsData(data);
            }
        } catch (err) {
            console.error('Fetch trends error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isMounted || loading) {
        return (
            <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-zinc-200/50 border border-zinc-100 h-[600px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Loading market data...</p>
                </div>
            </div>
        );
    }

    const chartData = trendsData?.monthlyTrends || [];
    const citySummary = trendsData?.citySummary || [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 rounded-[3rem] shadow-xl shadow-zinc-200/50 border border-zinc-100 relative overflow-hidden min-w-0"
            id="trends"
        >
            {/* Subtle Texture Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            {/* Chart Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 relative z-10">
                <div>
                    <h3 className="text-2xl font-black text-zinc-900 mb-1">Property Activity by City</h3>
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">New listings & inquiries — Last 6 months</p>
                </div>
                {trendsData?.overview && (
                    <div className="flex items-center gap-4">
                        <div className="bg-zinc-50 px-4 py-2 rounded-2xl border border-zinc-100">
                            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Total Properties</p>
                            <p className="text-lg font-black text-zinc-900">{trendsData.overview.totalProperties}</p>
                        </div>
                        <div className="bg-zinc-50 px-4 py-2 rounded-2xl border border-zinc-100">
                            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Deals Closed</p>
                            <p className="text-lg font-black text-zinc-900">{trendsData.overview.completedDeals}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="h-[400px] w-full relative z-10 min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <AreaChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <filter id="shadow" height="200%">
                                <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                                <feOffset dx="0" dy="10" result="offsetblur" />
                                <feComponentTransfer>
                                    <feFuncA type="linear" slope="0.2" />
                                </feComponentTransfer>
                                <feMerge>
                                    <feMergeNode />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                            <linearGradient id="colorIsb" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#000000" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorLhr" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#27272a" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#27272a" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorRwp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#71717a" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#71717a" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f4f4f5" />
                        <XAxis
                            dataKey="month"
                            stroke="#d4d4d8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tick={{ dy: 10, fontWeight: 700 }}
                        />
                        <YAxis
                            stroke="#d4d4d8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                            tick={{ dx: -10, fontWeight: 700 }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f4f4f5', strokeWidth: 2, strokeDasharray: '5 5' }} />
                        <Legend verticalAlign="top" height={36} iconType="circle" />

                        <Area
                            type="monotone"
                            dataKey="islamabad"
                            name="Islamabad"
                            stroke="#000000"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorIsb)"
                            filter="url(#shadow)"
                            animationDuration={2000}
                        />
                        <Area
                            type="monotone"
                            dataKey="lahore"
                            name="Lahore"
                            stroke="#27272a"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorLhr)"
                            filter="url(#shadow)"
                            animationDuration={2500}
                        />
                        <Area
                            type="monotone"
                            dataKey="rawalpindi"
                            name="Rawalpindi"
                            stroke="#71717a"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorRwp)"
                            filter="url(#shadow)"
                            animationDuration={3000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Dynamic City Stats */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 relative z-10">
                {citySummary.map((city: any, i: number) => (
                    <div key={i} className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100 hover:border-black transition-all hover:bg-white group">
                        <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 ${
                            i === 0 ? 'bg-zinc-100 text-zinc-700' : i === 1 ? 'bg-zinc-200 text-zinc-800' : 'bg-zinc-300 text-zinc-900'
                        }`}>{city.city}</div>
                        <div className="text-3xl font-black text-zinc-900 mb-1">{city.growthRate}</div>
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-tight">
                            {city.totalProperties} properties · {city.trend}
                        </p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default MarketAnalysis;
