'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Globe, ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function GeneralSettings() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState({
        siteName: 'SK Associates & Builders',
        contactEmail: 'amnapersonal4@gmail.com',
        supportWhatsApp: '923364695525',
        officeAddress: 'Islamabad, Pakistan',
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
            if (res.ok) {
                setConfig(prev => ({ ...prev, ...data }));
            }
        } catch (err) {
            console.error('Fetch config error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/admin/config', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            });
            if (res.ok) {
                toast.success('General settings updated!');
            } else {
                toast.error('Failed to update settings');
            }
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    if (!session || (session.user as any).role !== 'admin') {
        return <div className="p-12 text-center font-bold">Unauthorized</div>;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            <div className="max-w-3xl mx-auto space-y-10">
                <Link href="/admin/settings" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-bold uppercase text-[10px] tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> Back to Settings
                </Link>

                <header>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-2xl text-white">
                            <Globe className="w-6 h-6" />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">General <span className="text-indigo-600">Settings.</span></h1>
                    </div>
                    <p className="text-slate-500 font-medium">Manage your site identity and contact preferences</p>
                </header>

                <form onSubmit={handleSave} className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Site Display Name</label>
                            <input
                                type="text"
                                value={config.siteName}
                                onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all font-bold text-slate-900"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Admin/Contact Email</label>
                            <input
                                type="email"
                                value={config.contactEmail}
                                onChange={(e) => setConfig({ ...config, contactEmail: e.target.value })}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all font-bold text-slate-900"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Support WhatsApp Number</label>
                            <input
                                type="text"
                                value={config.supportWhatsApp}
                                onChange={(e) => setConfig({ ...config, supportWhatsApp: e.target.value })}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all font-bold text-slate-900"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Office Address</label>
                            <textarea
                                rows={3}
                                value={config.officeAddress}
                                onChange={(e) => setConfig({ ...config, officeAddress: e.target.value })}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all font-bold text-slate-900 resize-none"
                            ></textarea>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:text-cyan-400 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-cyan-500/20"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}
