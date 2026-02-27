
'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MarketData } from '@/types';

// Hardcoding for now as in original, or could be fetched
const MARKET_TRENDS: MarketData[] = [
    { month: 'Oct', islamabad: 12, rawalpindi: 8, lahore: 10 },
    { month: 'Nov', islamabad: 15, rawalpindi: 9, lahore: 12 },
    { month: 'Dec', islamabad: 14, rawalpindi: 11, lahore: 13 },
    { month: 'Jan', islamabad: 18, rawalpindi: 12, lahore: 15 },
    { month: 'Feb', islamabad: 20, rawalpindi: 14, lahore: 17 },
    { month: 'Mar', islamabad: 22, rawalpindi: 15, lahore: 19 },
];

const MarketAnalysis: React.FC = () => {
    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100" id="trends">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Price Appreciation Trends</h2>
                    <p className="text-slate-500 text-sm">Percentage growth across major hubs in the last 6 months.</p>
                </div>
                <div className="flex space-x-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        High Growth Region: Islamabad
                    </span>
                </div>
            </div>

            <div className="h-[350px] w-full min-h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MARKET_TRENDS} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorIsb" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorLhr" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorRwp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend verticalAlign="top" height={36} iconType="circle" />
                        <Area
                            type="monotone"
                            dataKey="islamabad"
                            name="Islamabad"
                            stroke="#4f46e5"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorIsb)"
                        />
                        <Area
                            type="monotone"
                            dataKey="lahore"
                            name="Lahore"
                            stroke="#10b981"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorLhr)"
                        />
                        <Area
                            type="monotone"
                            dataKey="rawalpindi"
                            name="Rawalpindi"
                            stroke="#f59e0b"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorRwp)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-4 bg-indigo-50 rounded-2xl">
                    <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1">Islamabad</p>
                    <p className="text-2xl font-bold text-indigo-900">+22.4%</p>
                    <p className="text-xs text-indigo-700">Year-on-year growth in DHA</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl">
                    <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Lahore</p>
                    <p className="text-2xl font-bold text-emerald-900">+19.1%</p>
                    <p className="text-xs text-emerald-700">Year-on-year growth in Gulberg</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl">
                    <p className="text-xs text-amber-600 font-bold uppercase tracking-wider mb-1">Rawalpindi</p>
                    <p className="text-2xl font-bold text-amber-900">+15.8%</p>
                    <p className="text-xs text-amber-700">Year-on-year growth in Bahria</p>
                </div>
            </div>
        </div>
    );
};

export default MarketAnalysis;
