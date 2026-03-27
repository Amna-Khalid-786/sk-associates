'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-black text-white py-16 relative overflow-hidden">
            {/* Subtle glow effects to give it depth */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-zinc-900/40 rounded-full blur-2xl -ml-24 -mb-24 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner">
                            <span className="text-white font-black text-sm">SK</span>
                        </div>
                        <h2 className="text-xl font-black text-white tracking-tight">SK Associates</h2>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                        Your premier partner for luxury real estate and quality construction services in the twin cities and Lahore. Delivering excellence for over 25 years.
                    </p>
                </div>
                <div>
                    <h3 className="text-white font-bold mb-6 tracking-wide">Explore</h3>
                    <ul className="space-y-3 text-sm font-medium">
                        <li><Link href="/properties" className="text-zinc-400 hover:text-white transition-colors">Residential Houses</Link></li>
                        <li><Link href="/properties" className="text-zinc-400 hover:text-white transition-colors">Commercial Shops</Link></li>
                        <li><Link href="/properties" className="text-zinc-400 hover:text-white transition-colors">Investment Plots</Link></li>
                        <li><Link href="/trends" className="text-zinc-400 hover:text-white transition-colors">Market Analysis</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-white font-bold mb-6 tracking-wide">Contact Us</h3>
                    <ul className="space-y-4 text-sm text-zinc-400 font-medium">
                        <li className="flex items-start">
                            <span className="mr-3 mt-0.5 text-white/70">📍</span>
                            <span>Office 12, Blue Area, Islamabad</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-3 mt-0.5 text-white/70">📞</span>
                            <span>+92 51 1234567</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-3 mt-0.5 text-white/70">✉️</span>
                            <span>info@skassociates.pk</span>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-white font-bold mb-6 tracking-wide">Stay Updated</h3>
                    <p className="text-xs text-zinc-500 mb-4 font-medium">Get the latest investment opportunities.</p>
                    <div className="flex bg-white/5 p-1.5 rounded-xl backdrop-blur-sm border border-white/10 shadow-inner">
                        <input
                            type="email"
                            placeholder="Email address"
                            className="bg-transparent border-none px-3 py-2 text-sm w-full focus:outline-none text-white placeholder:text-zinc-600 font-medium"
                        />
                        <button className="bg-white text-black hover:bg-zinc-100 font-black px-5 py-2.5 rounded-lg text-xs transition-colors shadow-sm tracking-wide">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-zinc-500 relative z-10">
                <p>© {new Date().getFullYear()} SK Associates & Builders. Registered Real Estate Agency.</p>
                <div className="flex space-x-6">
                    <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
