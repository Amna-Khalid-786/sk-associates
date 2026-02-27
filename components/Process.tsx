
'use client';

import React from 'react';

const steps = [
    {
        num: '01',
        title: 'Initial Concept',
        description: 'Deep-dive consultation to understand your lifestyle and aesthetic requirements.',
    },
    {
        num: '02',
        title: 'Bespoke Design',
        description: 'Our world-class architects draft your future home using 3D modeling and sustainable principles.',
    },
    {
        num: '03',
        title: 'Elite Construction',
        description: 'Precision engineering and premium materials ensure your legacy stands the test of time.',
    },
    {
        num: '04',
        title: 'Handover',
        description: 'A seamless transition into your new life, with white-glove service at every stage.',
    },
];

const Process = () => {
    return (
        <section className="py-24 bg-slate-950 text-white overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="max-w-xl">
                        <h2 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Our Methodology</h2>
                        <h3 className="text-4xl md:text-6xl font-black tracking-tighter">Crafting Dreams <br /><span className="text-indigo-500">Step by Step.</span></h3>
                    </div>
                    <p className="text-slate-400 max-w-sm mb-2 font-medium">
                        We follow a rigorous, transparent process to ensure every project exceeds international standards.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {steps.map((step, i) => (
                        <div key={i} className="relative p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all duration-500">
                            <div className="text-4xl font-black text-white/10 mb-6 group-hover:text-indigo-500/20 transition-colors duration-500">
                                {step.num}
                            </div>
                            <h4 className="text-xl font-bold mb-4 tracking-tight">{step.title}</h4>
                            <p className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-800/20 rounded-full blur-[150px] -ml-64 -mb-64"></div>
        </section>
    );
};

export default Process;
