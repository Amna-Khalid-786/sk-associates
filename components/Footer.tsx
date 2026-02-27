
'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-sm">SK</span>
                        </div>
                        <h2 className="text-lg font-bold text-white">SK Associates</h2>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Your premier partner for luxury real estate and quality construction services in the twin cities and Lahore. Delivering excellence for over 25 years.
                    </p>
                </div>
                <div>
                    <h3 className="text-white font-semibold mb-6">Explore</h3>
                    <ul className="space-y-3 text-sm">
                        <li><Link href="/properties" className="hover:text-white transition-colors">Residential Houses</Link></li>
                        <li><Link href="/properties" className="hover:text-white transition-colors">Commercial Shops</Link></li>
                        <li><Link href="/properties" className="hover:text-white transition-colors">Investment Plots</Link></li>
                        <li><Link href="/trends" className="hover:text-white transition-colors">Market Analysis</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-white font-semibold mb-6">Contact Us</h3>
                    <ul className="space-y-4 text-sm text-slate-400">
                        <li className="flex items-start">
                            <span className="mr-3 mt-1">📍</span>
                            <span>Office 12, Blue Area, Islamabad</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-3 mt-1">📞</span>
                            <span>+92 51 1234567</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-3 mt-1">✉️</span>
                            <span>info@skassociates.pk</span>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-white font-semibold mb-6">Stay Updated</h3>
                    <p className="text-xs text-slate-400 mb-4">Get the latest investment opportunities.</p>
                    <div className="flex bg-slate-800 p-1 rounded-lg">
                        <input
                            type="email"
                            placeholder="Email address"
                            className="bg-transparent border-none px-3 py-2 text-sm w-full focus:outline-none text-white"
                        />
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-xs transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                <p>© {new Date().getFullYear()} SK Associates & Builders. Registered Real Estate Agency.</p>
                <div className="flex space-x-6">
                    <Link href="#" className="hover:text-slate-300">Privacy Policy</Link>
                    <Link href="#" className="hover:text-slate-300">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
