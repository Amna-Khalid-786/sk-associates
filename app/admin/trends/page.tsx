
'use client';

import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowLeft, BarChart3, PieChart, Activity } from 'lucide-react';
import Link from 'next/link';

export default function AdminTrendsPage() {
    const { data: session } = useSession();

    if (!session || (session.user as any).role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-md border border-zinc-100">
                    <h2 className="text-2xl font-black text-black mb-4">Access Restricted</h2>
                    <Link href="/login" className="bg-black hover:bg-zinc-800 transition-all text-white px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest">Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 p-8 md:p-12">
            <div className="max-w-7xl mx-auto space-y-12">
                <Link href="/admin" className="inline-flex items-center gap-2 text-zinc-400 hover:text-black transition-colors font-bold uppercase text-[10px] tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>

                <header>
                    <h1 className="text-4xl font-black text-black tracking-tight">Market <span className="text-black underline underline-offset-8 decoration-4 decoration-zinc-200">Trends.</span></h1>
                    <p className="text-zinc-500 font-medium">Real-time real estate analytics and insights</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: 'Growth Index', value: '+12.5%', icon: BarChart3, color: 'text-black' },
                        { title: 'Demand Ratio', value: '4.2x', icon: PieChart, color: 'text-zinc-600' },
                        { title: 'Active Leads', value: '850+', icon: Activity, color: 'text-zinc-800' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all">
                            <stat.icon className={`w-8 h-8 ${stat.color} mb-4`} />
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">{stat.title}</p>
                            <p className="text-3xl font-black text-black">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white p-12 rounded-[3.5rem] border border-zinc-100 shadow-sm min-h-[400px] flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <TrendingUp className="w-20 h-20 text-zinc-100 mx-auto" />
                        <h3 className="text-2xl font-bold text-black">Advanced Analytics Loading...</h3>
                        <p className="text-zinc-500 max-w-sm mx-auto">We are aggregating real-time data from all sectors in Islamabad and Rawalpindi.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
