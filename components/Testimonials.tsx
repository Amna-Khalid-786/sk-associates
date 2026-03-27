'use client';

import React, { useRef, useEffect } from 'react';

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
        role: 'Property Investor',
        content: 'The most reliable partner for real estate investment. Their market insights helped me secure prime commercial plots with exceptional ROI.',
        avatar: 'https://i.pravatar.cc/150?u=iftikhar',
    },
    {
        name: 'Nadia Farooq',
        role: 'Interior Designer',
        content: 'Working with SK Associates was a dream. Their construction quality gave me the perfect canvas to bring my design vision to life.',
        avatar: 'https://i.pravatar.cc/150?u=nadia',
    },
    {
        name: 'Imran Siddiqui',
        role: 'Businessman, Lahore',
        content: 'I have invested in three properties through SK Associates. Every single project has exceeded my expectations in quality and returns.',
        avatar: 'https://i.pravatar.cc/150?u=imran',
    },
    {
        name: 'Dr. Hina Baig',
        role: 'Homeowner, Bahria Town',
        content: 'Professional, transparent, and incredibly detail-oriented. SK Associates made the daunting process of buying a home completely stress-free.',
        avatar: 'https://i.pravatar.cc/150?u=hina',
    },
    {
        name: 'Zubair Khalid',
        role: 'Commercial Developer',
        content: 'Their expertise in commercial real estate is second to none. The office complex they built for us became a landmark in the area.',
        avatar: 'https://i.pravatar.cc/150?u=zubair',
    },
    {
        name: 'Ayesha Raza',
        role: 'First-Time Buyer',
        content: 'As a first-time buyer I was nervous, but SK Associates guided me through every step with patience and expertise. Highly recommended!',
        avatar: 'https://i.pravatar.cc/150?u=ayesha',
    },
];

// ─── Single Card ──────────────────────────────────────────────────────────────
function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
    return (
        <div className="flex-shrink-0 w-[360px] bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm mx-4 group hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
            <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full p-[2px] bg-black flex-shrink-0">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white">
                        <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-black text-sm">{t.name}</h4>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">{t.role}</p>
                </div>
            </div>
            <div className="text-black mb-4 flex space-x-0.5 text-sm">
                {[...Array(5)].map((_, s) => <span key={s}>★</span>)}
            </div>
            <p className="text-zinc-600 leading-relaxed font-medium italic text-sm">
                &quot;{t.content}&quot;
            </p>
        </div>
    );
}

// ─── Marquee Row ──────────────────────────────────────────────────────────────
function MarqueeRow({ items, reverse = false }: { items: typeof testimonials; reverse?: boolean }) {
    // Duplicate the list so the scroll is truly seamless
    const doubled = [...items, ...items];

    return (
        <div className="overflow-hidden w-full">
            <div
                className={`flex w-max ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'} hover:[animation-play-state:paused]`}
            >
                {doubled.map((t, i) => (
                    <TestimonialCard key={i} t={t} />
                ))}
            </div>
        </div>
    );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
const Testimonials = () => {
    // Split testimonials into two rows
    const row1 = testimonials.slice(0, 4);
    const row2 = testimonials.slice(4);

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em]">Client Voices</h2>
                    <h3 className="text-4xl font-black tracking-tight text-black pb-2">Trusted by Industry Leaders</h3>
                    <p className="text-zinc-500 font-medium max-w-xl mx-auto">
                        Hear from the families, investors, and businesses who chose SK Associates.
                    </p>
                </div>
            </div>

            {/* Edge fades */}
            <div className="relative">
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-white to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-white to-transparent" />

                {/* Row 1 — scrolls left */}
                <MarqueeRow items={row1} />

                {/* Spacer */}
                <div className="h-6" />

                {/* Row 2 — scrolls right */}
                <MarqueeRow items={row2} reverse />
            </div>

            {/* Background blob */}
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-zinc-100 rounded-full blur-3xl -ml-32 pointer-events-none" />

            {/* Keyframes injected as a style tag */}
            <style>{`
                @keyframes marquee {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes marquee-reverse {
                    0%   { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                .animate-marquee-reverse {
                    animation: marquee-reverse 30s linear infinite;
                }
            `}</style>
        </section>
    );
};

export default Testimonials;
