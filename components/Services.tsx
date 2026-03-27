
'use client';

import React from 'react';

const services = [
    {
        title: 'Architectural Excellence',
        description: 'Turning visionary concepts into structural masterpieces with precision and artistic flair.',
    },
    {
        title: 'Premium Construction',
        description: 'Elite building services for luxury villas and commercial plazas across the twin cities.',
    },
    {
        title: 'Real Estate Investment',
        description: 'Strategic portfolio management with high-yield opportunities in DHA and Bahria Town.',
    },
];

const Services = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em]">Our Expertise</h2>
                    <h3 className="text-4xl md:text-5xl font-black tracking-tight text-black pb-2">
                        Services Beyond Expectations
                    </h3>
                    <p className="text-zinc-500 max-w-2xl mx-auto font-medium">
                        SK Associates & Builders provides a comprehensive suite of elite real estate and construction solutions tailored for the sophisticated investor.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {services.map((service, i) => (
                        <div key={i} className="group p-10 rounded-[3rem] border border-zinc-100 bg-white transition-all duration-500 hover:border-black/30 hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] hover:-translate-y-2 relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="text-2xl font-bold text-black mb-4 tracking-tight group-hover:text-zinc-600 transition-colors duration-500">{service.title}</h4>
                                <p className="text-zinc-500 leading-relaxed font-medium group-hover:text-zinc-700 transition-colors duration-500">
                                    {service.description}
                                </p>
                            </div>
                            {/* Subtle Ambient Hover Glow */}
                            <div className="absolute -inset-4 bg-gradient-to-br from-zinc-500/0 via-zinc-500/0 to-zinc-500/5 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700 z-0"></div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-24 w-96 h-96 bg-zinc-50/50 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 -ml-24 w-80 h-80 bg-zinc-50/50 rounded-full blur-3xl -z-10"></div>
        </section>
    );
};

export default Services;
