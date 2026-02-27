'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setMessage('');
        setError('');

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } else {
                setError(data.message || 'Something went wrong');
            }
        } catch (err) {
            setError('Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 text-center">
                <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/10 max-w-md">
                    <h1 className="text-2xl font-bold text-white mb-4">Invalid Link</h1>
                    <p className="text-slate-400 mb-6">This password reset link appears to be invalid or has expired.</p>
                    <button onClick={() => router.push('/forgot-password')} className="text-indigo-400 font-bold hover:underline">
                        Request a new link
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950">
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/90 to-indigo-950/50"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-6 z-10"
            >
                <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black text-white mb-2">New Password</h1>
                        <p className="text-slate-400 text-sm">Please enter your new password below.</p>
                    </div>

                    {message && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 mb-6 rounded-2xl flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            <p className="text-emerald-400 text-sm font-medium">{message} Redirecting to login...</p>
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
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-indigo-500 text-white outline-none transition-all"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-indigo-500 text-white outline-none transition-all"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                                        Reset Password
                                        <ArrowRight className="w-5 h-5" />
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

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
