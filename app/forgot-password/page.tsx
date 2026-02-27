'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Mail, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
            } else {
                setError(data.message || 'Something went wrong');
            }
        } catch (err) {
            setError('Failed to send request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
                    alt="Real Estate Background"
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/90 to-indigo-950/50"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md p-6 z-10"
            >
                <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl">
                    <Link href="/login" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 text-sm font-bold mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                    </Link>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black text-white mb-2">Forgot Password</h1>
                        <p className="text-slate-400 text-sm">Enter your email and we&apos;ll send you a reset link.</p>
                    </div>

                    {message && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 mb-6 rounded-2xl flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            <p className="text-emerald-400 text-sm font-medium">{message}</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-4 mb-6 rounded-2xl">
                            <p className="text-red-400 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {!message && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-indigo-500 text-white outline-none transition-all"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        Send Reset Link
                                    </>
                                )}
                            </motion.button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
