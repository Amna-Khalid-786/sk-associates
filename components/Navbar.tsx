'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const pathname = usePathname();
    const { data: session } = useSession();

    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'Properties', href: '/properties' },
        { label: 'Market Trends', href: '/trends' },
        { label: 'Contact', href: '/contact' },
    ];

    const isActive = (href: string) => {
        if (href === '/' && pathname === '/') return true;
        if (href !== '/' && pathname.startsWith(href)) return true;
        return false;
    };

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' });
    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3">
            <nav className="max-w-7xl mx-auto flex justify-between items-center h-12">
                <Link href="/" className="flex items-center space-x-3 cursor-pointer group">
                    <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center transition-transform hover:scale-105 duration-300">
                        <span className="text-white font-bold text-lg">SK</span>
                    </div>
                    <div className="hidden sm:block">
                        <h1 className="text-lg font-bold text-slate-900 leading-none tracking-tight">SK Associates</h1>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.1em]">Property Excellence</p>
                    </div>
                </Link>

                <div className="hidden md:flex space-x-8 text-xs font-bold uppercase tracking-wider">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`transition-all duration-300 hover:text-indigo-600 ${isActive(item.href)
                                ? 'text-indigo-600'
                                : 'text-slate-500'
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center space-x-4">
                    {session ? (
                        <div className="flex items-center space-x-3">
                            <div className="hidden sm:flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                {session?.user && (session.user as any).role === 'admin' && (
                                    <Link
                                        href="/admin"
                                        className="text-indigo-600 font-black text-[9px] uppercase tracking-widest hover:text-indigo-700 transition-colors mr-2 border-r border-slate-200 pr-2"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <UserIcon className="w-3.5 h-3.5 text-indigo-600" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-600 truncate max-w-[100px]">
                                    {session.user?.name}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-all group"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Link
                                href="/login"
                                className="text-slate-600 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all"
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-sm active:scale-95"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
