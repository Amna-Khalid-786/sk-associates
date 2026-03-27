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

        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-zinc-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            {/* Animated Gradient Accent at the very top */}
            <div className="h-1 w-full bg-gradient-to-r from-black via-zinc-500 to-black bg-[size:200%_auto] animate-gradient"></div>

            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                <Link href="/" className="flex items-center space-x-3 cursor-pointer group">
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-lg shadow-black/10">
                        <span className="text-white font-black text-sm tracking-tighter">SK</span>
                    </div>
                    <div className="hidden sm:block">
                        <h1 className="text-xl font-black text-zinc-900 leading-none tracking-tight">
                            SK <span className="text-black">ASSOCIATES</span>
                        </h1>
                        <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em] mt-1">Property Excellence</p>
                    </div>
                </Link>

                <div className="hidden md:flex items-center space-x-10 text-[11px] font-black uppercase tracking-[0.15em]">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative py-2 transition-all duration-300 hover:text-black ${isActive(item.href)
                                ? 'text-black after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black after:rounded-full'
                                : 'text-zinc-500 hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-zinc-200 hover:after:rounded-full'
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center space-x-5">
                    {session ? (
                        <div className="flex items-center space-x-4">
                            <div className="hidden sm:flex items-center space-x-3 bg-zinc-50 px-4 py-2 rounded-2xl border border-zinc-100 group transition-all hover:bg-white hover:shadow-md hover:border-zinc-200">
                                {session?.user && (session.user as any).role === 'admin' && (
                                    <Link
                                        href="/admin"
                                        className="text-black font-black text-[10px] uppercase tracking-widest hover:text-zinc-700 transition-colors mr-3 border-r border-zinc-200 pr-3"
                                    >
                                        Admin
                                    </Link>
                                )}
                                <div className="w-7 h-7 bg-zinc-100 rounded-full flex items-center justify-center group-hover:bg-black transition-colors">
                                    <UserIcon className="w-4 h-4 text-black group-hover:text-white transition-colors" />
                                </div>
                                <span className="text-xs font-bold text-zinc-700 truncate max-w-[120px]">
                                    {session.user?.name?.split(' ')[0]}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-3 bg-zinc-900 text-white rounded-2xl hover:bg-black transition-all shadow-lg shadow-zinc-200 active:scale-95 group"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Link
                                href="/login"
                                className="text-zinc-600 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-all border border-transparent hover:border-zinc-100"
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="bg-black text-white px-7 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 active:scale-95"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
            <style jsx>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    background-size: 200% auto;
                    animation: gradient 4s linear infinite;
                }
            `}</style>
        </header>
    );
};

export default Navbar;
