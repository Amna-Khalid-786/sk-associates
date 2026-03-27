
'use client';

import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, ArrowLeft, Shield, Bell, Database, Globe, History } from 'lucide-react';
import Link from 'next/link';

export default function AdminSettingsPage() {
    const { data: session } = useSession();

    if (!session || (session.user as any).role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-md">
                    <h2 className="text-2xl font-black text-slate-900 mb-4">Access Restricted</h2>
                    <Link href="/login" className="bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 transition-all text-white px-8 py-3 rounded-xl font-bold">Login</Link>
                </div>
            </div>
        );
    }

    const sections = [
        { title: 'General', desc: 'System-wide preferences and identity', icon: Globe, href: '/admin/settings/general', color: 'hover:border-blue-400 hover:bg-blue-50/30 text-blue-600' },
        { title: 'Booking History', desc: 'View all confirmed property inquiries', icon: History, href: '/admin/settings/history', color: 'hover:border-emerald-400 hover:bg-emerald-50/30 text-emerald-600' },
        { title: 'Security', desc: 'Manage access keys and admin roles', icon: Shield, href: '/admin/settings/security', color: 'hover:border-rose-400 hover:bg-rose-50/30 text-rose-600' },
        { title: 'Notifications', desc: 'Email and WhatsApp alert triggers', icon: Bell, href: '/admin/settings/notifications', color: 'hover:border-amber-400 hover:bg-amber-50/30 text-amber-600' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-8 md:p-12">
            <div className="max-w-4xl mx-auto space-y-12">
                <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-bold uppercase text-[10px] tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>

                <header>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admin <span className="text-indigo-600">Settings.</span></h1>
                    <p className="text-slate-500 font-medium">Configure the SK Associates management engine</p>
                </header>

                <div className="flex flex-col gap-8">
                    {sections.map((section, i) => (
                        <Link href={section.href} key={i}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-sm transition-all group flex items-center gap-10 cursor-pointer ${section.color}`}
                            >
                                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center group-hover:bg-white transition-colors shadow-inner">
                                    <section.icon className="w-10 h-10 transition-colors" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-inherit transition-colors">{section.title}</h3>
                                    <p className="text-sm text-slate-500 font-medium">{section.desc}</p>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
