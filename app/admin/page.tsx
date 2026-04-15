'use client';

import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Home,
    PlusCircle,
    Users,
    TrendingUp,
    Calendar,
    ArrowRight,
    Settings,
    LogOut,
    CheckCircle2,
    Clock,
    User,
    Building2,
    MessageSquare,
    Phone,
    BarChart3,
    Activity
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    BarChart,
    Bar,
} from 'recharts';

export default function AdminDashboard() {
    const { data: session } = useSession();
    const router = useRouter();
    const [bookings, setBookings] = useState<any[]>([]);
    const [summaryStats, setSummaryStats] = useState({
        totalProperties: 0,
        pendingBookings: 0,
        soldUnits: 0,
        activeUsers: 0
    });
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [chartData, setChartData] = useState<any>(null);
    const [loadingChart, setLoadingChart] = useState(true);
    const [activeChart, setActiveChart] = useState<'area' | 'bar' | 'pie'>('area');

    const stats = [
        { label: 'Total Properties', value: summaryStats.totalProperties.toString(), icon: Home, color: 'bg-zinc-800', href: '/admin/properties' },
        { label: 'Pending Bookings', value: summaryStats.pendingBookings.toString(), icon: Calendar, color: 'bg-zinc-600', href: '/admin/stats/bookings/pending' },
        { label: 'Sold Units', value: summaryStats.soldUnits.toString(), icon: TrendingUp, color: 'bg-black', href: '/admin/stats/units/sold' },
        { label: 'Active Users', value: summaryStats.activeUsers.toString(), icon: Users, color: 'bg-zinc-700', href: '/admin/stats/users' },
    ];

    const quickActions = [
        { title: 'Add Property', href: '/admin/properties/upload', icon: PlusCircle, description: 'Post new listing' },
        { title: 'Manage Listings', href: '/admin/properties', icon: LayoutDashboard, description: 'Edit or remove items' },
        { title: 'View Trends', href: '/admin/trends', icon: TrendingUp, description: 'Market analytics' },
        { title: 'Settings', href: '/admin/settings', icon: Settings, description: 'Admin preferences' },
    ];

    useEffect(() => {
        if (session && (session.user as any).role === 'admin') {
            fetchBookings();
            fetchSummaryStats();
            fetchChartData();
        }
    }, [session]);

    const fetchChartData = async () => {
        setLoadingChart(true);
        try {
            const res = await fetch('/api/admin/chart');
            const data = await res.json();
            if (res.ok) {
                setChartData(data);
            }
        } catch (err) {
            console.error('Fetch chart error:', err);
        } finally {
            setLoadingChart(false);
        }
    };

    const fetchSummaryStats = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            const data = await res.json();
            if (res.ok) {
                setSummaryStats(data);
            }
        } catch (err) {
            console.error('Fetch stats error:', err);
        }
    };

    const fetchBookings = async () => {
        try {
            const res = await fetch('/api/booking/admin');
            const data = await res.json();
            if (Array.isArray(data)) {
                setBookings(data);
            }
        } catch (err) {
            console.error('Fetch bookings error:', err);
        } finally {
            setLoadingBookings(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        const loadingToast = toast.loading(`Updating status to ${status}...`);
        try {
            const res = await fetch('/api/booking/admin', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            });
            const data = await res.json();

            if (res.ok) {
                toast.success('Status updated successfully', { id: loadingToast });
                fetchBookings();

                // Note: Background emails are automatically fired from the server.
                if (status === 'rented' || status === 'sold') {
                    toast('Client has been notified via Email', { icon: '📧' });
                }
            } else {
                toast.error(data.message || 'Update failed', { id: loadingToast });
            }
        } catch (err) {
            console.error('Update status error:', err);
            toast.error('Something went wrong', { id: loadingToast });
        }
    };

    if (!session || (session.user as any).role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-slate-100 max-w-md">
                    <h2 className="text-2xl font-black text-slate-900 mb-4">Access Restricted</h2>
                    <p className="text-slate-500 mb-8">Please login with admin credentials to continue.</p>
                    <Link href="/login" className="inline-block bg-black text-white font-bold px-8 py-3 rounded-xl hover:bg-zinc-800 transition-all">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 lg:p-12">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Admin <span className="text-black underline underline-offset-8 decoration-4 decoration-zinc-200">Dashboard.</span></h1>
                        <p className="text-zinc-500 font-medium mt-1 uppercase text-xs tracking-[0.2em]">SK Associates Management Portal</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/" className="px-6 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-600 hover:bg-zinc-50 transition-all">
                            View Website
                        </Link>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <Link href={stat.href} key={i}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="bg-white p-8 rounded-[2.5rem] border-2 border-zinc-100 shadow-sm hover:shadow-xl hover:border-black transition-all group cursor-pointer h-full"
                            >
                                <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-zinc-100`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className="text-3xl font-black text-zinc-900 group-hover:text-black transition-colors">{stat.value}</p>
                                <div className="mt-4 flex items-center gap-2 text-black opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] font-black uppercase tracking-widest">View Details</span>
                                    <ArrowRight className="w-3 h-3" />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Actions */}
                    <div className="lg:col-span-2 space-y-8">
                        <h2 className="text-2xl font-black text-slate-900">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {quickActions.map((action, i) => (
                                <Link key={i} href={action.href}>
                                    <motion.div
                                        whileHover={{ y: -4 }}
                                        className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm flex items-center gap-6 group hover:border-black hover:bg-zinc-50 transition-all"
                                    >
                                        <div className="bg-zinc-50 p-4 rounded-2xl group-hover:bg-white transition-colors">
                                            <action.icon className="w-6 h-6 text-black" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-black">{action.title}</h3>
                                            <p className="text-xs text-zinc-500">{action.description}</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-zinc-300 ml-auto group-hover:text-black group-hover:translate-x-1 transition-all" />
                                    </motion.div>
                                </Link>
                            ))}
                        </div>

                        {/* Dynamic Market Analytics Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-black rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-black/20"
                        >
                            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
                            <div className="relative z-10">
                                {/* Chart Header */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-white/10 rounded-xl">
                                                <Activity className="w-5 h-5 text-white" />
                                            </div>
                                            <h2 className="text-2xl md:text-3xl font-black">Market Analytics</h2>
                                        </div>
                                        <p className="text-zinc-400 text-sm max-w-md">Real-time booking activity and property distribution across your portfolio.</p>
                                    </div>
                                    {/* Chart Type Switcher */}
                                    <div className="flex items-center gap-1 bg-white/10 rounded-2xl p-1">
                                        {(['area', 'bar', 'pie'] as const).map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setActiveChart(type)}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                    activeChart === type
                                                        ? 'bg-white text-black shadow-lg'
                                                        : 'text-zinc-400 hover:text-white'
                                                }`}
                                            >
                                                {type === 'area' ? 'Trend' : type === 'bar' ? 'Compare' : 'Distribution'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Chart Content */}
                                {loadingChart ? (
                                    <div className="flex justify-center items-center h-[300px]">
                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-8 h-8 border-4 border-white border-t-transparent rounded-full" />
                                    </div>
                                ) : chartData ? (
                                    <div className="h-[300px] w-full">
                                        <AnimatePresence mode="wait">
                                            {activeChart === 'area' && (
                                                <motion.div
                                                    key="area"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    className="h-full w-full"
                                                >
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <AreaChart data={chartData.monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                            <defs>
                                                                <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                                                                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3} />
                                                                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                                                                </linearGradient>
                                                                <linearGradient id="gradSold" x1="0" y1="0" x2="0" y2="1">
                                                                    <stop offset="5%" stopColor="#a1a1aa" stopOpacity={0.4} />
                                                                    <stop offset="95%" stopColor="#a1a1aa" stopOpacity={0} />
                                                                </linearGradient>
                                                            </defs>
                                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                                            <XAxis dataKey="month" stroke="#71717a" tick={{ fontSize: 11, fontWeight: 700 }} />
                                                            <YAxis stroke="#71717a" tick={{ fontSize: 11, fontWeight: 700 }} allowDecimals={false} />
                                                            <Tooltip
                                                                contentStyle={{
                                                                    backgroundColor: '#18181b',
                                                                    border: '1px solid #3f3f46',
                                                                    borderRadius: '16px',
                                                                    padding: '12px 16px',
                                                                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                                                                }}
                                                                labelStyle={{ color: '#fff', fontWeight: 900, fontSize: 13, marginBottom: 8 }}
                                                                itemStyle={{ color: '#a1a1aa', fontSize: 12, fontWeight: 600 }}
                                                            />
                                                            <Area type="monotone" dataKey="total" stroke="#ffffff" strokeWidth={3} fill="url(#gradTotal)" name="Total Inquiries" dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#fff' }} />
                                                            <Area type="monotone" dataKey="sold" stroke="#a1a1aa" strokeWidth={2} fill="url(#gradSold)" name="Sold" dot={{ r: 3, fill: '#a1a1aa' }} />
                                                            <Area type="monotone" dataKey="rented" stroke="#52525b" strokeWidth={2} fill="none" name="Rented" strokeDasharray="5 5" />
                                                        </AreaChart>
                                                    </ResponsiveContainer>
                                                </motion.div>
                                            )}

                                            {activeChart === 'bar' && (
                                                <motion.div
                                                    key="bar"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    className="h-full w-full"
                                                >
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={chartData.monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                                            <XAxis dataKey="month" stroke="#71717a" tick={{ fontSize: 11, fontWeight: 700 }} />
                                                            <YAxis stroke="#71717a" tick={{ fontSize: 11, fontWeight: 700 }} allowDecimals={false} />
                                                            <Tooltip
                                                                contentStyle={{
                                                                    backgroundColor: '#18181b',
                                                                    border: '1px solid #3f3f46',
                                                                    borderRadius: '16px',
                                                                    padding: '12px 16px',
                                                                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                                                                }}
                                                                labelStyle={{ color: '#fff', fontWeight: 900, fontSize: 13, marginBottom: 8 }}
                                                                itemStyle={{ color: '#a1a1aa', fontSize: 12, fontWeight: 600 }}
                                                            />
                                                            <Bar dataKey="pending" fill="#a1a1aa" name="Pending" radius={[4, 4, 0, 0]} />
                                                            <Bar dataKey="accepted" fill="#71717a" name="Accepted" radius={[4, 4, 0, 0]} />
                                                            <Bar dataKey="rented" fill="#52525b" name="Rented" radius={[4, 4, 0, 0]} />
                                                            <Bar dataKey="sold" fill="#ffffff" name="Sold" radius={[4, 4, 0, 0]} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </motion.div>
                                            )}

                                            {activeChart === 'pie' && (
                                                <motion.div
                                                    key="pie"
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    className="h-full w-full flex flex-col md:flex-row items-center justify-center gap-8"
                                                >
                                                    {/* Property Type Pie */}
                                                    <div className="flex-1 h-full">
                                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center mb-2">Property Types</p>
                                                        <ResponsiveContainer width="100%" height="85%">
                                                            <PieChart>
                                                                <Pie
                                                                    data={chartData.typeDistribution}
                                                                    cx="50%"
                                                                    cy="50%"
                                                                    innerRadius={50}
                                                                    outerRadius={80}
                                                                    paddingAngle={4}
                                                                    dataKey="count"
                                                                    nameKey="type"
                                                                    stroke="none"
                                                                >
                                                                    {chartData.typeDistribution.map((_: any, index: number) => (
                                                                        <Cell key={index} fill={['#ffffff', '#a1a1aa', '#71717a', '#3f3f46'][index % 4]} />
                                                                    ))}
                                                                </Pie>
                                                                <Tooltip
                                                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px', padding: '8px 12px' }}
                                                                    itemStyle={{ color: '#fff', fontSize: 12, fontWeight: 700 }}
                                                                />
                                                                <Legend wrapperStyle={{ fontSize: 11, fontWeight: 700, color: '#a1a1aa' }} />
                                                            </PieChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                    {/* City Distribution Pie */}
                                                    <div className="flex-1 h-full">
                                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center mb-2">City Distribution</p>
                                                        <ResponsiveContainer width="100%" height="85%">
                                                            <PieChart>
                                                                <Pie
                                                                    data={chartData.cityData}
                                                                    cx="50%"
                                                                    cy="50%"
                                                                    innerRadius={50}
                                                                    outerRadius={80}
                                                                    paddingAngle={4}
                                                                    dataKey="count"
                                                                    nameKey="city"
                                                                    stroke="none"
                                                                >
                                                                    {chartData.cityData.map((_: any, index: number) => (
                                                                        <Cell key={index} fill={['#ffffff', '#71717a', '#3f3f46'][index % 3]} />
                                                                    ))}
                                                                </Pie>
                                                                <Tooltip
                                                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px', padding: '8px 12px' }}
                                                                    itemStyle={{ color: '#fff', fontSize: 12, fontWeight: 700 }}
                                                                />
                                                                <Legend wrapperStyle={{ fontSize: 11, fontWeight: 700, color: '#a1a1aa' }} />
                                                            </PieChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-[300px] gap-4">
                                        <BarChart3 className="w-12 h-12 text-zinc-600" />
                                        <p className="text-zinc-500 text-sm font-bold">No chart data available</p>
                                    </div>
                                )}

                                {/* Chart Legend / Info */}
                                {chartData && activeChart !== 'pie' && (
                                    <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-white/10 pt-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-white"></div>
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                                {activeChart === 'area' ? 'Total Inquiries' : 'Sold'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-zinc-400"></div>
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                                {activeChart === 'area' ? 'Sold' : 'Pending'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-zinc-600 border border-dashed border-zinc-400"></div>
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Rented</span>
                                        </div>
                                        <div className="ml-auto">
                                            <Link href="/admin/trends" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all">
                                                Full Report <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar / Bookings */}
                    <div className="space-y-8">
                        <h2 className="text-2xl font-black text-zinc-900 flex items-center gap-3">
                            Recent Bookings
                            <span className="bg-zinc-100 text-black text-xs px-3 py-1 rounded-full">
                                {bookings.filter((b: any) => b.status === 'pending').length} New
                            </span>
                        </h2>
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm overflow-hidden flex flex-col max-h-[700px]">
                            <div className="overflow-y-auto pr-2 custom-scrollbar space-y-6">
                                {loadingBookings ? (
                                    <div className="flex justify-center p-12">
                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-8 h-8 border-4 border-black border-t-transparent rounded-full" />
                                    </div>
                                ) : bookings.filter((b: any) => b.status === 'pending').length > 0 ? (
                                    <div className="space-y-6">
                                        {bookings.filter((b: any) => b.status === 'pending').map((booking: any) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                key={booking._id}
                                                className="p-6 bg-zinc-50 rounded-[2.5rem] border border-zinc-100 hover:border-black hover:bg-white transition-all shadow-sm hover:shadow-xl space-y-6 group/card"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-2 max-w-[200px]">
                                                        <div className="flex items-center gap-2">
                                                            <div className="p-2 bg-zinc-100 rounded-xl group-hover/card:bg-black group-hover/card:text-white transition-colors">
                                                                <Building2 className="w-4 h-4" />
                                                            </div>
                                                            <p className="text-sm font-black text-zinc-900 truncate tracking-tight">{booking.propertyTitle}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="p-2 bg-white rounded-xl group-hover/card:bg-zinc-100 transition-colors border border-zinc-100">
                                                                <User className="w-4 h-4 text-zinc-500" />
                                                            </div>
                                                            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest truncate">{booking.name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm bg-zinc-900 text-white animate-pulse">
                                                        <Clock className="w-3 h-3" />
                                                        {booking.status}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-3">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Update Status</p>
                                                    <div className="relative">
                                                        <select
                                                            value={booking.status}
                                                            onChange={(e) => handleUpdateStatus(booking._id, e.target.value)}
                                                            className="w-full bg-white border-2 border-zinc-100 rounded-2xl px-6 py-3.5 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-black/5 focus:border-black appearance-none text-center cursor-pointer hover:bg-zinc-50 transition-all shadow-sm"
                                                        >
                                                            <option value="pending" disabled>Pending Inquiry</option>
                                                            <option value="accepted">Accept Inquiry</option>
                                                            <option value="rented">Rent Property</option>
                                                            <option value="sold">Mark as Sold Out</option>
                                                        </select>
                                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                            <ArrowRight className="w-4 h-4 rotate-90" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-20 text-center space-y-4">
                                        <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto">
                                            <CheckCircle2 className="w-8 h-8 text-zinc-200" />
                                        </div>
                                        <div>
                                            <p className="text-zinc-500 text-sm font-black">All Caught Up!</p>
                                            <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest mt-1">No pending property inquiries</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
