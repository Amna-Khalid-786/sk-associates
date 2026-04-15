'use client';

import React from 'react';
import { motion } from 'framer-motion';

const steps = [
    {
        num: '01',
        title: 'Initial Concept',
        description: 'Discovery & Vision planning focusing on your unique lifestyle.',
        color: 'bg-black',
        textColor: 'text-white',
        position: 'top-0 left-0 rounded-tl-full',
        hover: 'hover:translate-x-2 hover:translate-y-2'
    },
    {
        num: '02',
        title: 'Bespoke Design',
        description: 'World-class architectural drafting with sustainable 3D modeling.',
        color: 'bg-zinc-100',
        textColor: 'text-black',
        position: 'top-0 right-0 rounded-tr-full',
        hover: 'hover:translate-x-2 hover:-translate-y-2'
    },
    {
        num: '03',
        title: 'Elite Construction',
        description: 'Precision engineering ensuring structural integrity and longevity.',
        color: 'bg-black',
        textColor: 'text-white',
        position: 'bottom-0 right-0 rounded-br-full border border-zinc-100',
        hover: 'hover:translate-x-2 hover:translate-y-2'
    },
    {
        num: '04',
        title: 'Handover',
        description: 'A seamless transition with white-glove support and services.',
        color: 'bg-zinc-100',
        textColor: 'text-black',
        position: 'bottom-0 left-0 rounded-bl-full',
        hover: 'hover:-translate-x-2 hover:translate-y-2'
    },
];

const Process = () => {
    return (
        <section className="py-24 md:py-40 bg-[#fafafa] overflow-hidden relative selection:bg-black/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-20 md:mb-32">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] mb-4"
                    >
                        Our Methodology
                    </motion.h2>
                    <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black tracking-tight text-black"
                    >
                        Crafting Dreams <span className="text-zinc-400">Step by Step.</span>
                    </motion.h3>
                </div>

                {/* Infographic Container */}
                <div className="relative max-w-[800px] mx-auto hidden md:block">
                    {/* The Circle */}
                    <div className="aspect-square w-full relative p-4">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                                className={`absolute w-1/2 h-1/2 flex flex-col transition-all duration-700 ${step.color} ${step.textColor} ${step.position} ${step.hover} group shadow-2xl
                                    ${i === 0 ? 'justify-end items-end p-20' : ''}
                                    ${i === 1 ? 'justify-end items-start p-20' : ''}
                                    ${i === 2 ? 'justify-start items-start p-20' : ''}
                                    ${i === 3 ? 'justify-start items-end p-20' : ''}
                                `}
                            >
                                <div className={`max-w-[200px] ${i === 0 || i === 3 ? 'text-right' : 'text-left'}`}>
                                    <span className={`text-4xl font-black mb-2 block ${i === 0 || i === 2 ? 'text-white/30' : 'text-black/20'}`}>{step.num}</span>
                                    <h4 className="text-lg font-black mb-2 tracking-tight uppercase tracking-widest leading-tight">{step.title}</h4>
                                    <p className={`text-[11px] font-bold leading-relaxed ${i >= 2 ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                        {step.description}
                                    </p>
                                </div>

                                {/* Interlock circles (Puzzle look) */}
                                {i === 0 && <div className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-1/2 w-8 h-8 rounded-full bg-black z-20 shadow-lg"></div>}
                                {i === 1 && <div className="absolute left-1/3 bottom-0 -translate-x-1/2 translate-y-1/2 w-8 h-8 rounded-full bg-zinc-900 z-20 shadow-lg"></div>}
                                {i === 2 && <div className="absolute left-0 top-2/3 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white z-20 border border-zinc-100 shadow-md"></div>}
                                {i === 3 && <div className="absolute right-2/3 top-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-zinc-100 z-20 shadow-md"></div>}
                            </motion.div>
                        ))}

                        {/* Central Anchor */}
                        <div className="absolute inset-0 m-auto w-44 h-44 rounded-full bg-[#fafafa] z-30 flex items-center justify-center p-4 border-[12px] border-white shadow-2xl">
                            <div className="text-center">
                                <span className="text-[18px] font-black text-black uppercase tracking-widest block leading-tight">SK</span>
                                <span className="text-[18px] font-black text-black uppercase tracking-widest block leading-tight">ASSOCIATES</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Fallback - Vertical List */}
                <div className="flex flex-col gap-6 md:hidden">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-10 rounded-3xl ${step.color} ${step.textColor} ${i === 2 ? 'border border-zinc-100' : ''}`}
                        >
                            <span className="text-sm font-black uppercase tracking-widest opacity-50 mb-4 block">Phase {step.num}</span>
                            <h4 className="text-2xl font-bold mb-3 tracking-tight">{step.title}</h4>
                            <p className={`text-sm font-medium leading-relaxed ${i >= 2 ? 'text-zinc-600' : 'text-zinc-400'}`}>
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Process;




