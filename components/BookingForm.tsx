
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, Send, X, Phone, Mail, User, MessageSquare, Lock } from 'lucide-react';

interface BookingFormProps {
    propertyId: string;
    propertyTitle: string;
    onClose?: () => void;
}

export default function BookingForm({ propertyId, propertyTitle, onClose }: BookingFormProps) {
    const { data: session, status } = useSession();
    const [formData, setFormData] = useState({
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        phone: '',
        message: `I'm interested in "${propertyTitle}". Please provide more details.`
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    propertyId,
                    propertyTitle
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to submit booking');

            setSubmitted(true);
            setTimeout(() => {
                if (onClose) onClose();
            }, 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'unauthenticated') {
        return (
            <div className="bg-white p-10 rounded-3xl text-center relative overflow-hidden">
                {onClose && (
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                )}
                <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                    <Lock className="w-10 h-10 text-black" />
                    <div className="absolute inset-0 bg-black/5 rounded-full animate-ping"></div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Authentication Required</h3>
                <p className="text-slate-500 mb-8 font-medium">Please sign in to your account to send booking inquiries and view exclusive market deals.</p>
                <div className="flex flex-col gap-4">
                    <Link
                        href="/login"
                        className="w-full bg-black text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-black/10"
                    >
                        Sign in to Continue
                    </Link>
                    <Link
                        href="/signup"
                        className="text-black font-bold text-sm hover:underline"
                    >
                        Create an account
                    </Link>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 px-6 bg-white rounded-3xl"
            >
                <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Received!</h3>
                <p className="text-slate-500 mb-6">Our experts at SK Associates will contact you shortly.</p>
                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Premium Property Inquiry
                </div>
            </motion.div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-3xl relative">
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            )}

            <div className="mb-8">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Book a Consultation</h3>
                <p className="text-slate-500 text-sm font-medium">For: <span className="text-black font-bold">{propertyTitle}</span></p>
            </div>

            {error && (
                <div className="bg-zinc-100 border border-zinc-200 text-zinc-700 p-4 rounded-xl mb-6 text-sm font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            required
                            type="text"
                            placeholder="John Doe"
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-black transition-all font-medium text-slate-900"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                required
                                type="email"
                                placeholder="john@example.com"
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-black transition-all font-medium text-slate-900"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                required
                                type="tel"
                                placeholder="03XXXXXXXXX"
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-black transition-all font-medium text-slate-900"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Message</label>
                    <div className="relative">
                        <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                        <textarea
                            required
                            rows={4}
                            placeholder="Tell us more about your interest..."
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-black transition-all font-medium text-slate-900 resize-none"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={loading}
                    className="w-full bg-black text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/10 disabled:opacity-50 mt-4"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Submit Inquiry
                            <Send className="w-4 h-4" />
                        </>
                    )}
                </motion.button>
            </form>
        </div>
    );
}
