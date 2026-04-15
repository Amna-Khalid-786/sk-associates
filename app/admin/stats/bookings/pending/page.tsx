'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Clock, ArrowLeft, Search, User, Building2, Calendar, Phone } from 'lucide-react';
import Link from 'next/link';

export default function PendingBookingsPage() {
    const { data: session } = useSession();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (session && (session.user as any).role === 'admin') {
            fetchPending();
        }
    }, [session]);

    const fetchPending = async () => {
        try {
            const res = await fetch('/api/booking/admin');
            const data = await res.json();
            if (Array.isArray(data)) {
                setBookings(data.filter(b => b.status === 'pending'));
            }
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = bookings.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!session || (session.user as any).role !== 'admin') {
        return <div className="p-12 text-center font-bold">Unauthorized</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-10">
                <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-black transition-colors font-bold uppercase text-[10px] tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>

                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Pending <span className="text-zinc-500">Bookings.</span></h1>
                        <p className="text-slate-500 font-medium">Inquiries awaiting administrative response</p>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or property..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:border-black shadow-sm w-full md:w-80 text-sm font-medium"
                        />
                    </div>
                </header>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Received</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Client</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Property</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center">
                                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-8 h-8 border-4 border-black border-t-transparent rounded-full mx-auto" />
                                        </td>
                                    </tr>
                                ) : filtered.length > 0 ? (
                                    filtered.map((booking) => (
                                        <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-600">
                                                        <Clock className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-extrabold text-slate-900">{new Date(booking.createdAt).toLocaleDateString()}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-white transition-colors">
                                                        <User className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-extrabold text-slate-900">{booking.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{booking.phone}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-white transition-colors">
                                                        <Building2 className="w-5 h-5" />
                                                    </div>
                                                    <p className="text-sm font-extrabold text-slate-900">{booking.propertyTitle}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <Link href="/admin" className="text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-6 py-2 rounded-xl border border-slate-900 hover:bg-white hover:text-slate-900 transition-all">
                                                    Resolve
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center text-slate-400 text-sm font-medium">
                                            No pending inquiries found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
