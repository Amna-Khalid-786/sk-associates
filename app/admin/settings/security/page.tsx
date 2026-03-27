'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Shield, ArrowLeft, Save, Loader2, Key, Lock } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function SecuritySettings() {
    const { data: session } = useSession();
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState({
        adminAccessCode: 'SK_ADMIN_2026',
        passwordChange: {
            current: '',
            new: '',
            confirm: ''
        }
    });

    useEffect(() => {
        if (session && (session.user as any).role === 'admin') {
            fetchConfig();
        }
    }, [session]);

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/admin/config');
            const data = await res.json();
            if (res.ok && data.adminAccessCode) {
                setConfig(prev => ({ ...prev, adminAccessCode: data.adminAccessCode }));
            }
        } catch (err) {
            console.error('Fetch config error:', err);
        }
    };

    const handleSaveAccessCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/admin/config', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminAccessCode: config.adminAccessCode }),
            });
            if (res.ok) {
                toast.success('Admin access code updated!');
            } else {
                toast.error('Failed to update access code');
            }
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (config.passwordChange.new !== config.passwordChange.confirm) {
            return toast.error('New passwords do not match');
        }
        toast.error('Password change is disabled for hardcoded root admin');
    };

    if (!session || (session.user as any).role !== 'admin') {
        return <div className="p-12 text-center font-bold">Unauthorized</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            <div className="max-w-3xl mx-auto space-y-10">
                <Link href="/admin/settings" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-bold uppercase text-[10px] tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> Back to Settings
                </Link>

                <header>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-rose-600 rounded-2xl text-white">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Security <span className="text-rose-600">Vault.</span></h1>
                    </div>
                    <p className="text-slate-500 font-medium">Manage access controls and administrative credentials</p>
                </header>

                <div className="grid grid-cols-1 gap-8">
                    {/* Access Code Settings */}
                    <form onSubmit={handleSaveAccessCode} className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                        <div className="flex items-center gap-3 mb-2">
                            <Key className="w-5 h-5 text-indigo-600" />
                            <h2 className="text-xl font-extrabold text-slate-900">Admin Access Code</h2>
                        </div>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">
                            This code is required for new users to register as administrators. Keep this code secure.
                        </p>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Access Code</label>
                            <input
                                type="text"
                                value={config.adminAccessCode}
                                onChange={(e) => setConfig({ ...config, adminAccessCode: e.target.value })}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all font-bold text-slate-900 tracking-widest"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:text-cyan-400 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-cyan-500/20"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Update Access Code
                        </button>
                    </form>

                    {/* Password Change */}
                    <form onSubmit={handlePasswordChange} className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                        <div className="flex items-center gap-3 mb-2">
                            <Lock className="w-5 h-5 text-rose-600" />
                            <h2 className="text-xl font-extrabold text-slate-900">Change Password</h2>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    disabled
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none transition-all font-bold text-slate-900 opacity-50 cursor-not-allowed"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        disabled
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none transition-all font-bold text-slate-900 opacity-50 cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        disabled
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none transition-all font-bold text-slate-900 opacity-50 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl">
                            <p className="text-[10px] text-rose-600 font-bold text-center">Password changes are currently managed via authentication provider.</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
