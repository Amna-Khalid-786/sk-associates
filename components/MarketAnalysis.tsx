
'use client';

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { motion } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-zinc-900 backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-zinc-700/50">
                <p className="text-white font-black mb-3 border-b border-zinc-700 pb-2">{label}</p>
                <div className="space-y-2">
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between gap-8">
                            <span className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{entry.name}</span>
                            </span>
                            <span className="text-sm font-black text-white">{entry.value} listings</span>
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
            className="bg-black p-8 md:p-10 rounded-[3rem] shadow-2xl shadow-black/20 relative overflow-hidden min-w-0"
            id="trends"
        >
            {/* Subtle glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>

            {/* Chart Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 relative z-10">
                <div>
                    <h3 className="text-2xl font-black text-white mb-1">Property Activity by City</h3>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">New listings & inquiries — Last 6 months</p>
                </div>
                {trendsData?.overview && (
                    <div className="flex items-center gap-4">
                        <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/10">
                            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Total Properties</p>
                            <p className="text-lg font-black text-white">{trendsData.overview.totalProperties}</p>
                        </div>
                        <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/10">
                            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Deals Closed</p>
                            <p className="text-lg font-black text-white">{trendsData.overview.completedDeals}</p>
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
                                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorLhr" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a1a1aa" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#a1a1aa" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorRwp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#52525b" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#52525b" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                        <XAxis
                            dataKey="month"
                            stroke="#71717a"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            tick={{ dy: 10, fontWeight: 700, fill: '#71717a' }}
                        />
                        <YAxis
                            stroke="#71717a"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                            tick={{ dx: -10, fontWeight: 700, fill: '#71717a' }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2, strokeDasharray: '5 5' }} />
                        <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 700, color: '#a1a1aa' }} />

                        <Area
                            type="monotone"
                            dataKey="islamabad"
                            name="Islamabad"
                            stroke="#ffffff"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorIsb)"
                            animationDuration={2000}
                            dot={{ r: 4, fill: '#fff', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: '#fff' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="lahore"
                            name="Lahore"
                            stroke="#a1a1aa"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorLhr)"
                            animationDuration={2500}
                            dot={{ r: 3, fill: '#a1a1aa' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="rawalpindi"
                            name="Rawalpindi"
                            stroke="#52525b"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorRwp)"
                            animationDuration={3000}
                            strokeDasharray="5 5"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Dynamic City Stats */}
            <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-white/10 pt-6 relative z-10">
                {citySummary.map((city: any, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                            i === 0 ? 'bg-white' : i === 1 ? 'bg-zinc-400' : 'bg-zinc-600 border border-dashed border-zinc-400'
                        }`}></div>
                        <div>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{city.city}</span>
                            <span className="text-[10px] font-black text-white ml-2">{city.growthRate}</span>
                            <span className="text-[10px] font-bold text-zinc-600 ml-1">· {city.totalProperties} props</span>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default MarketAnalysis;
