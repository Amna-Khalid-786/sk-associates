'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, Send, Phone, Mail, MapPin } from 'lucide-react';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: 'Property Inquiry',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const offices = [
        { city: 'Islamabad', address: 'Building 14, Blue Area, Jinnah Avenue', phone: '+92 51 987 6543' },
        { city: 'Rawalpindi', address: 'Phase 7 Commercial, Bahria Town', phone: '+92 51 543 2109' },
        { city: 'Lahore', address: 'Plaza 15, Sector J, DHA Phase 6', phone: '+92 42 111 222 333' }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Something went wrong');

            setSubmitted(true);
            setFormData({ name: '', email: '', phone: '', subject: 'Property Inquiry', message: '' });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center bg-white p-12 rounded-[3rem] shadow-2xl shadow-zinc-100 border border-zinc-100"
                >
                    <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="w-12 h-12 text-black" />
                    </div>
                    <h2 className="text-3xl font-black text-black mb-4 tracking-tight">Message Sent!</h2>
                    <p className="text-zinc-500 mb-8 font-medium">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                    <button
                        onClick={() => setSubmitted(false)}
                        className="w-full bg-black text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl"
                    >
                        Send Another Message
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-black via-zinc-600 to-zinc-400 pb-2 mb-4">Get in Touch</h1>
                <p className="text-lg text-zinc-500 font-medium leading-relaxed">Whether you&apos;re looking to buy, sell, or build, our experts are here to guide you through every step of the process.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                {/* Left Column: Form & About */}
                <div className="space-y-12 h-full flex flex-col">
                    <div className="bg-white/70 backdrop-blur-2xl p-8 md:p-12 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-white/40 ring-1 ring-black/5 flex-grow relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none"></div>
                        <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
                                <Mail className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-black text-black tracking-tight">Send us a Message</h2>
                        </div>
                        
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-zinc-50 border border-zinc-200 text-black p-4 rounded-xl mb-6 text-sm font-bold uppercase tracking-widest"
                            >
                                {error}
                            </motion.div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-zinc-50/50 border border-zinc-100 rounded-2xl px-5 py-4 focus:ring-1 focus:ring-black focus:border-black transition-all outline-none font-medium text-black placeholder:text-zinc-300"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <input
                                        required
                                        type="tel"
                                        className="w-full bg-zinc-50/50 border border-zinc-100 rounded-2xl px-5 py-4 focus:ring-1 focus:ring-black focus:border-black transition-all outline-none font-medium text-black placeholder:text-zinc-300"
                                        placeholder="+92 300 1234567"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full bg-zinc-50/50 border border-zinc-100 rounded-2xl px-5 py-4 focus:ring-1 focus:ring-black focus:border-black transition-all outline-none font-medium text-black placeholder:text-zinc-300"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Subject</label>
                                <select
                                    className="w-full bg-zinc-50/50 border border-zinc-100 rounded-2xl px-5 py-4 focus:ring-1 focus:ring-black focus:border-black transition-all outline-none cursor-pointer font-medium text-black"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                >
                                    <option>Property Inquiry</option>
                                    <option>Construction Estimate</option>
                                    <option>Investment Consultation</option>
                                    <option>General Support</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Message</label>
                                <textarea
                                    required
                                    rows={5}
                                    className="w-full bg-zinc-50/50 border border-zinc-100 rounded-2xl px-5 py-4 focus:ring-1 focus:ring-black focus:border-black transition-all outline-none resize-none font-medium text-black placeholder:text-zinc-300"
                                    placeholder="How can we help you?"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>
                            <button
                                disabled={loading}
                                type="submit"
                                className="bg-black text-white font-black px-10 py-5 rounded-2xl shadow-xl hover:bg-zinc-800 transition-all w-full flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 text-[10px] uppercase tracking-[0.2em]"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Message <Send className="w-4 h-4" /></>}
                            </button>
                        </form>
                    </div>
                </div>

                    <div className="bg-zinc-50/50 border border-zinc-100 p-10 rounded-[3rem] relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black text-black mb-4 tracking-tight">Global Reach, Local Expertise</h3>
                            <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-sm">
                                Our network spans across Pakistan&apos;s most prestigious locations, ensuring you receive world-class real estate services right at your doorstep.
                            </p>
                        </div>
                        <div className="absolute top-1/2 -right-12 -translate-y-1/2 w-48 h-48 bg-black/5 rounded-full blur-3xl group-hover:bg-black/10 transition-colors"></div>
                    </div>
                </div>

                {/* Right Column: Offices & Consultation */}
                <div className="space-y-12">
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-white border border-zinc-100 rounded-2xl flex items-center justify-center shadow-sm">
                                <MapPin className="w-6 h-6 text-black" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Our Regional Hubs</h2>
                        </div>
                        
                        <div className="space-y-6">
                            {offices.map((office) => (
                                <motion.div 
                                    key={office.city} 
                                    whileHover={{ y: -5 }}
                                    className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] hover:border-black transition-all group cursor-default"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-black text-black tracking-tight">{office.city} Office</h3>
                                        <div className="p-3 bg-zinc-50 rounded-xl group-hover:bg-black group-hover:text-white transition-all">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <p className="text-zinc-500 text-sm mb-6 font-medium leading-relaxed">{office.address}</p>
                                    <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-3 text-black font-black text-xs uppercase tracking-widest hover:gap-4 transition-all">
                                        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-200 transition-colors">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <span>{office.phone}</span>
                                    </a>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-black text-white p-10 rounded-[3.5rem] relative overflow-hidden shadow-2xl shadow-black/10 group"
                    >
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black mb-4 tracking-tight">Urgent Consultation?</h3>
                            <p className="text-zinc-400 text-sm mb-10 font-medium leading-relaxed">Call our central helpline available 24/7 for premium clients and emergency support.</p>
                            <div className="flex items-center space-x-6">
                                <div className="w-16 h-16 bg-white text-black rounded-[1.5rem] flex items-center justify-center text-xl shadow-xl group-hover:rotate-12 transition-transform duration-500">
                                    <Phone className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1.5">24/7 Hotline</p>
                                    <p className="text-2xl font-black text-white hover:text-zinc-300 transition-colors cursor-pointer">+92 51 000 0000</p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/10 transition-colors"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 blur-3xl"></div>
                    </motion.div>
                </div>
            </div>

        </div>
    );
};

export default ContactPage;
