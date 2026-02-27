
import React from 'react';
import MarketAnalysis from '@/components/MarketAnalysis';

export default function TrendsPage() {
    return (
        <div className="bg-white min-h-screen">
            <div className="bg-slate-900 py-24 text-white overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl">
                        <h2 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-4 reveal">Real Estate Intelligence</h2>
                        <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-8 reveal leading-[1.1]">
                            Market <span className="text-indigo-500">Analytics</span> & Investment Outlook.
                        </h1>
                        <p className="text-xl text-slate-400 font-medium reveal">
                            Proprietary data and in-depth analysis of the Pakistani real estate landscape, focusing on high-yield opportunities in the twin cities and Lahore.
                        </p>
                    </div>
                </div>
                {/* Abstract background */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px] -mr-96 -mt-96"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Main Analysis Chart */}
                    <div className="lg:col-span-8 reveal">
                        <MarketAnalysis />
                    </div>

                    {/* Regional Spotlight Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="reveal bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Regional Spotlight</h3>
                            <div className="space-y-6">
                                {[
                                    { city: 'Islamabad', area: 'DHA Phase 2', growth: '+22%', trend: 'Bullish' },
                                    { city: 'Lahore', area: 'DHA Phase 6', growth: '+18%', trend: 'Stable' },
                                    { city: 'Rawalpindi', area: 'Bahria Phase 8', growth: '+15%', trend: 'Rising' }
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{item.city}</p>
                                            <p className="font-bold text-slate-900">{item.area}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-emerald-600 font-black">{item.growth}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{item.trend}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="reveal bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-100">
                            <h3 className="text-xl font-bold mb-4">Investment Advisory</h3>
                            <p className="text-indigo-100 text-sm mb-8 leading-relaxed">
                                Get a personalized portfolio analysis from our senior consultants to maximize your capital appreciation.
                            </p>
                            <button className="w-full bg-white text-indigo-600 font-black py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                                Request Report
                            </button>
                        </div>
                    </div>
                </div>

                {/* Analysis Breakdown */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="reveal space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl">📉</div>
                        <h4 className="text-xl font-bold text-slate-900">Capital Appreciation</h4>
                        <p className="text-slate-500 leading-relaxed">
                            Consistent 15-20% annual growth in developed sectors, driven by infrastructure upgrades and high demand for luxury housing.
                        </p>
                    </div>
                    <div className="reveal space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl">🏢</div>
                        <h4 className="text-xl font-bold text-slate-900">Commercial Demand</h4>
                        <p className="text-slate-500 leading-relaxed">
                            Markaz areas in Islamabad and Main Boulevard projects in Lahore show record-breaking rental yields for 2026.
                        </p>
                    </div>
                    <div className="reveal space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl">🌱</div>
                        <h4 className="text-xl font-bold text-slate-900">Sustainability Trends</h4>
                        <p className="text-slate-500 leading-relaxed">
                            Growing buyer preference for solar-ready and eco-friendly smart villas in gated communities.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
