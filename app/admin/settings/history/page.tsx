'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
    History,
    ArrowLeft,
    Calendar,
    User,
    Building2,
    CheckCircle2,
    Search,
    Filter
} from 'lucide-react';
import Link from 'next/link';

export default function AdminHistoryPage() {
    const { data: session } = useSession();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (session && (session.user as any).role === 'admin') {
            fetchHistory();
        }
    }, [session]);

    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/booking/admin');
            const data = await res.json();
            if (Array.isArray(data)) {
                // Filter for confirmed bookings (non-pending)
                setBookings(data.filter(b => b.status !== 'pending'));
            }
        } catch (err) {
            console.error('Fetch history error:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredBookings = bookings.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!session || (session.user as any).role !== 'admin') {
        return <div className="p-12 text-center font-bold">Unauthorized</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-10">
                <Link href="/admin/settings" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-bold uppercase text-[10px] tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> Back to Settings
                </Link>

                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Booking <span className="text-indigo-600">History.</span></h1>
                        <p className="text-slate-500 font-medium">Record of all confirmed property inquiries</p>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or property..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:border-indigo-600 shadow-sm w-full md:w-80 text-sm font-medium"
                        />
                    </div>
                </header>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Client</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Property</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center">
                                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto" />
                                        </td>
                                    </tr>
                                ) : filteredBookings.length > 0 ? (
                                    filteredBookings.map((booking) => (
                                        <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                        <Calendar className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900">{new Date(booking.createdAt).toLocaleDateString()}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-slate-200 transition-colors">
                                                        <User className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900">{booking.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{booking.phone}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-slate-200 transition-colors">
                                                        <Building2 className="w-5 h-5" />
                                                    </div>
                                                    <p className="text-sm font-black text-slate-900">{booking.propertyTitle}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${booking.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                        booking.status === 'sold' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                                            'bg-amber-50 text-amber-700 border-amber-100'
                                                    }`}>
                                                    {booking.status === 'sold' ? 'Sold Out' : booking.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center">
                                            <div className="space-y-4">
                                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                                    <History className="w-8 h-8 text-slate-200" />
                                                </div>
                                                <div>
                                                    <p className="text-slate-500 text-sm font-black">No Confirmation Records</p>
                                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">Confirmed bookings will appear here</p>
                                                </div>
                                            </div>
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
