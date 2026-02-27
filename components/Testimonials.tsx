
'use client';

import React from 'react';

const testimonials = [
    {
        name: 'Arslan Ahmed',
        role: 'CEO, TechVentures',
        content: 'SK Associates transformed our vision into a stunning corporate reality. Their attention to structural integrity and aesthetic detail is unmatched in Pakistan.',
        avatar: 'https://i.pravatar.cc/150?u=arslan',
    },
    {
        name: 'Sarah Malik',
        role: 'Homeowner, DHA Phase 6',
        content: 'From the first blueprint to the final brick, the process was seamless. They truly build homes that feel like a sanctuary.',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
    },
    {
        name: 'Col. (R) Iftikhar',
        role: 'Investor',
        content: 'The most reliable partner for real estate investment. Their market insights helped me secure prime commercial plots with exceptional ROI.',
        avatar: 'https://i.pravatar.cc/150?u=iftikhar',
    },
];

const Testimonials = () => {
    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em]">Client Voices</h2>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tight">Trusted by Industry Leaders</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
                            <div className="flex items-center space-x-4 mb-8">
                                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-50 group-hover:border-indigo-100 transition-colors">
                                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{t.name}</h4>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t.role}</p>
                                </div>
                            </div>
                            <div className="text-amber-400 mb-6 flex space-x-1">
                                {[...Array(5)].map((_, star) => (
                                    <span key={star}>★</span>
                                ))}
                            </div>
                            <p className="text-slate-600 leading-relaxed font-medium italic">
                                &quot;{t.content}&quot;
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            {/* Background elements */}
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -ml-32"></div>
        </section>
    );
};

export default Testimonials;
