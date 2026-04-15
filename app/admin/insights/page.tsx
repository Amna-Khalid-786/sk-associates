
'use client';

import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Lightbulb, ArrowLeft, Target, Zap, Rocket, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AdminInsightsPage() {
    const { data: session } = useSession();

    if (!session || (session.user as any).role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-md">
                    <h2 className="text-2xl font-black text-slate-900 mb-4">Access Restricted</h2>
                    <Link href="/login" className="bg-black hover:bg-zinc-800 transition-all text-white px-8 py-3 rounded-xl font-bold">Login</Link>
                </div>
            </div>
        );
    }

    const cards = [
        { title: 'Best Performing Sector', value: 'DHA Phase 5', icon: Target, color: 'text-black' },
        { title: 'Highest Query Type', value: '3-Bed Villas', icon: Zap, color: 'text-amber-500' },
        { title: 'ROI Forecast', value: '18% Annual', icon: Rocket, color: 'text-emerald-500' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-8 md:p-12">
            <div className="max-w-6xl mx-auto space-y-12">
                <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-black transition-colors font-bold uppercase text-[10px] tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>

                <header>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">AI <span className="text-zinc-500">Insights.</span></h1>
                    <p className="text-slate-500 font-medium">Predictive modeling and growth strategies</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {cards.map((card, i) => (
                        <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm border-b-4 border-b-black/10">
                            <card.icon className={`w-10 h-10 ${card.color} mb-6`} />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{card.title}</p>
                            <p className="text-2xl font-black text-slate-900">{card.value}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-slate-900 p-16 rounded-[4rem] text-white relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                        <div className="max-w-md">
                            <div className="bg-white/10 w-16 h-16 rounded-3xl flex items-center justify-center mb-8">
                                <Lightbulb className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-3xl font-black mb-6">Strategy Recommendation</h2>
                            <p className="text-slate-400 leading-relaxed mb-8 font-medium">Based on current booking velocity, we recommend increasing inventory in Sector G-13 and focusing on commercial units for the next quarter.</p>
                            <button className="bg-white text-black font-black px-10 py-4 rounded-2xl hover:bg-zinc-200 transition-all shadow-xl shadow-black/20 active:scale-95">
                                Download Report
                            </button>
                        </div>
                        <div className="flex-grow flex justify-center opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000">
                            <TrendingUp className="w-64 h-64 text-zinc-400" />
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 p-8">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">Proprietary AI Engine v2.0</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
