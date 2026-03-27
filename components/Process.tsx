'use client';

import React from 'react';
import { motion } from 'framer-motion';

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
        <section className="py-24 md:py-32 bg-white overflow-hidden relative selection:bg-black/30">
            {/* Elegant Background Elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-zinc-100/40 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-zinc-100/40 rounded-full blur-[100px] -ml-64 -mb-64 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20 md:mb-32">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[10px] sm:text-xs font-black text-zinc-400 uppercase tracking-[0.3em] mb-4"
                    >
                        Our Methodology
                    </motion.h2>
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black text-black tracking-tighter mb-6"
                    >
                        Crafting Dreams <br className="hidden sm:block" />
                        <span className="text-black">
                            Step by Step.
                        </span>
                    </motion.h3>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-600 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto"
                    >
                        We follow a rigorous, transparent process to ensure every project exceeds international standards.
                    </motion.p>
                </div>

                {/* Vertical Timeline Design */}
                <div className="relative max-w-4xl mx-auto">
                    {/* Connecting Line */}
                    <div className="absolute left-[28px] md:left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-black/10 via-zinc-400/10 to-transparent md:-translate-x-1/2"></div>

                    <div className="flex flex-col gap-12 md:gap-24 relative">
                        {steps.map((step, i) => {
                            const isEven = i % 2 === 0;

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.7, delay: i * 0.1 }}
                                    className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 group ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                                        }`}
                                >
                                    {/* Timeline Node */}
                                    <div className="absolute left-0 md:left-1/2 w-14 h-14 rounded-full bg-white border-4 border-zinc-50 shadow-[0_0_0_2px_rgba(0,0,0,0.05)] flex items-center justify-center -translate-x-0 md:-translate-x-1/2 group-hover:border-black group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] transition-all duration-500 z-10">
                                        <div className="w-4 h-4 rounded-full bg-zinc-200 group-hover:bg-black transition-colors duration-500"></div>
                                    </div>

                                    {/* Card Content - Left Side */}
                                    <div className={`w-full md:w-1/2 pl-24 md:pl-0 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                                        <div className="bg-white p-8 md:p-10 rounded-3xl border border-zinc-100 shadow-[0_20px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">

                                            {/* Decorative Number Badge */}
                                            <div className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-6 bg-zinc-50 text-black border border-zinc-100 group-hover:bg-black group-hover:text-white transition-colors duration-500`}>
                                                Phase {step.num}
                                            </div>

                                            <h4 className="text-2xl md:text-3xl font-bold text-black mb-4 tracking-tight group-hover:text-zinc-600 transition-colors duration-500">
                                                {step.title}
                                            </h4>

                                            <p className="text-zinc-600 text-base leading-relaxed group-hover:text-zinc-700 transition-colors duration-500">
                                                {step.description}
                                            </p>

                                            {/* Interactive Hover Gradient */}
                                            <div className={`absolute -inset-1 bg-gradient-to-r from-black/0 via-black/5 to-zinc-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700 ${isEven ? 'right-0 origin-right' : 'left-0 origin-left'}`}></div>
                                        </div>
                                    </div>

                                    {/* Empty space for alternating layout on desktop */}
                                    <div className="hidden md:block md:w-1/2"></div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Process;
