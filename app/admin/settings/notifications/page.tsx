'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Bell, ArrowLeft, Save, Loader2, Mail, MessageSquare, Check, X } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function NotificationsSettings() {
    const { data: session } = useSession();
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState({
        emailEnabled: true,
        whatsappEnabled: true,
        alertRecipientEmail: 'amnapersonal4@gmail.com',
        alertRecipientWhatsApp: '923364695525',
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
                toast.success('Notification preferences updated!');
            } else {
                toast.error('Failed to update preferences');
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

    const Toggle = ({ active, onToggle, label, icon: Icon }: any) => (
        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-zinc-200 transition-all">
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${active ? 'bg-black text-white' : 'bg-slate-200 text-slate-500'}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-sm font-extrabold text-slate-900">{label}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{active ? 'Active' : 'Disabled'}</p>
                </div>
            </div>
            <button
                type="button"
                onClick={onToggle}
                className={`w-12 h-6 rounded-full relative transition-colors ${active ? 'bg-black' : 'bg-slate-300'}`}
            >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? 'right-1' : 'left-1'}`} />
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            <div className="max-w-3xl mx-auto space-y-10">
                <Link href="/admin/settings" className="inline-flex items-center gap-2 text-slate-400 hover:text-black transition-colors font-bold uppercase text-[10px] tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> Back to Settings
                </Link>

                <header>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-black rounded-2xl text-white">
                            <Bell className="w-6 h-6" />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Alert <span className="text-zinc-500">Center.</span></h1>
                    </div>
                    <p className="text-slate-500 font-medium">Configure how you receive booking and system notifications</p>
                </header>

                <form onSubmit={handleSave} className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-10">
                    <div className="space-y-4">
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Delivery Channels</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Toggle
                                active={config.emailEnabled}
                                onToggle={() => setConfig({ ...config, emailEnabled: !config.emailEnabled })}
                                label="Email Alerts"
                                icon={Mail}
                            />
                            <Toggle
                                active={config.whatsappEnabled}
                                onToggle={() => setConfig({ ...config, whatsappEnabled: !config.whatsappEnabled })}
                                label="WhatsApp Alerts"
                                icon={MessageSquare}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Destination Details</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Admin Notification Email</label>
                                <input
                                    type="email"
                                    value={config.alertRecipientEmail}
                                    onChange={(e) => setConfig({ ...config, alertRecipientEmail: e.target.value })}
                                    placeholder="email@example.com"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-black focus:bg-white transition-all font-bold text-slate-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Admin WhatsApp Number</label>
                                <input
                                    type="text"
                                    value={config.alertRecipientWhatsApp}
                                    onChange={(e) => setConfig({ ...config, alertRecipientWhatsApp: e.target.value })}
                                    placeholder="923364695525"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-black focus:bg-white transition-all font-bold text-slate-900"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-black/10"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Apply Notification Settings
                    </button>
                </form>
            </div>
        </div>
    );
}
