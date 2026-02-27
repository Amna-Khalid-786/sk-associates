
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const HeroSearch = () => {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = () => {
        router.push(`/properties?search=${encodeURIComponent(query)}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="bg-white/10 backdrop-blur-2xl p-2 rounded-[2rem] border border-white/10 shadow-3xl max-w-xl">
            <div className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Where do you want to live?"
                    className="flex-grow bg-white/5 border-none rounded-2xl px-6 py-5 text-white placeholder-slate-400 focus:ring-0 outline-none font-medium"
                />
                <button
                    onClick={handleSearch}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-10 py-5 rounded-2xl transition-all shadow-xl hover:shadow-indigo-500/40 active:scale-95"
                >
                    Explore
                </button>
            </div>
        </div>
    );
};

export default HeroSearch;
