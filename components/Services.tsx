
'use client';

import React from 'react';

const services = [
    {
        title: 'Architectural Excellence',
        description: 'Turning visionary concepts into structural masterpieces with precision and artistic flair.',
        icon: '🏠',
        color: 'bg-indigo-50 text-indigo-600',
    },
    {
        title: 'Premium Construction',
        description: 'Elite building services for luxury villas and commercial plazas across the twin cities.',
        icon: '🏗️',
        color: 'bg-emerald-50 text-emerald-600',
    },
    {
        title: 'Real Estate Investment',
        description: 'Strategic portfolio management with high-yield opportunities in DHA and Bahria Town.',
        icon: '📈',
        color: 'bg-blue-50 text-blue-600',
    },
];

const Services = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em]">Our Expertise</h2>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Services Beyond Expectations</h3>
                    <p className="text-slate-500 max-w-2xl mx-auto font-medium">
                        SK Associates & Builders provides a comprehensive suite of elite real estate and construction solutions tailored for the sophisticated investor.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {services.map((service, i) => (
                        <div key={i} className="group p-10 rounded-[3rem] border border-slate-100 bg-white transition-all duration-700 hover:shadow-[0_50px_100px_rgba(79,70,229,0.1)] hover:-translate-y-4">
                            <div className={`w-20 h-20 rounded-3xl ${service.color} flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                                {service.icon}
                            </div>
                            <h4 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{service.title}</h4>
                            <p className="text-slate-500 leading-relaxed font-medium">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-24 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 -ml-24 w-80 h-80 bg-emerald-50/50 rounded-full blur-3xl -z-10"></div>
        </section>
    );
};

export default Services;
