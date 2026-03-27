'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, LogIn, Mail, Lock, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

function LoginContent() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get('registered')) {
            setSuccess('Account created successfully! Please login.');
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });

            if (res?.error) {
                throw new Error(res.error);
            }

            if (formData.email === 'amnapersonal4@gmail.com') {
                router.push('/admin');
            } else {
                router.push('/');
            }
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
                    alt="Real Estate Background"
                    fill
                    className="object-cover opacity-30 scale-105 animate-pulse-slow"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-zinc-900/50"></div>
            </div>

            {/* Floating Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{ y: [0, -30, 0], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[10%] left-[5%] w-96 h-96 bg-zinc-700 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ y: [0, 30, 0], opacity: [0.05, 0.15, 0.05] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-zinc-800 rounded-full blur-[150px]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-xl p-1 z-10 mx-4"
            >
                <div className="glass-dark p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                    {/* Top Branding */}
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-extrabold text-white tracking-tight mb-3">Welcome Back</h2>
                        <p className="text-zinc-400 font-medium">Continue your journey with SK Associates</p>
                    </div>

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-emerald-500/10 border border-emerald-500/20 p-4 mb-8 rounded-2xl flex items-center gap-3"
                        >
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            <p className="text-emerald-400 text-sm font-semibold">{success}</p>
                        </motion.div>
                    )}

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-red-500/10 border border-red-500/20 p-4 mb-8 rounded-2xl"
                        >
                            <p className="text-red-400 text-sm font-medium">{error}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-zinc-300 ml-1 tracking-wide uppercase">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-white/30 focus:bg-white/10 text-white outline-none transition-all placeholder:text-zinc-600"
                                    placeholder="name@company.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-bold text-zinc-300 tracking-wide uppercase">Password</label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-zinc-400 hover:text-white font-bold"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-white/30 focus:bg-white/10 text-white outline-none transition-all placeholder:text-zinc-600 [appearance:textfield] [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-password-reveal]:hidden"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01, translateY: -2 }}
                            whileTap={{ scale: 0.99 }}
                            disabled={loading}
                            className="w-full bg-white text-black hover:bg-zinc-100 py-4 rounded-2xl font-black text-lg shadow-xl shadow-white/5 transition-all flex items-center justify-center gap-3 mt-6 disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    Login to Dashboard
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-zinc-400 font-medium">
                            First time here?{' '}
                            <Link href="/signup" className="text-white font-bold hover:text-zinc-300 transition-colors underline decoration-white/30 underline-offset-4">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="w-12 h-12 animate-spin text-white" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
