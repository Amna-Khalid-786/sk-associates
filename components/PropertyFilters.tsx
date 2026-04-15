
'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const PropertyFiltersInner = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'All');
    const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All');

    // Build URL and navigate
    const applyFilters = useCallback((overrides: Record<string, string> = {}) => {
        const params = new URLSearchParams(searchParams.toString());
        
        Object.entries(overrides).forEach(([key, value]) => {
            if (value && value !== 'All' && value !== '') {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        router.replace(`/properties?${params.toString()}`);
    }, [searchParams, router]);

    // Debounce search input
    useEffect(() => {
        const currentSearch = searchParams.get('search') || '';
        if (searchQuery === currentSearch) return;

        const timer = setTimeout(() => {
            applyFilters({ search: searchQuery });
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="flex flex-col gap-8">
            <div className="w-full">
                <label className="block text-[11px] font-black text-zinc-400 uppercase mb-3 px-1 tracking-wider">Search Keywords</label>
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="e.g. DHA, Villa, 1 Kanal..."
                        className="w-full bg-white border border-zinc-200 rounded-2xl px-5 py-4 text-sm focus:ring-1 focus:ring-black transition-all outline-none shadow-sm"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <label className="block text-[11px] font-black text-zinc-400 uppercase mb-3 px-1 tracking-wider">Target City</label>
                <select
                    value={selectedCity}
                    onChange={(e) => {
                        const val = e.target.value;
                        setSelectedCity(val);
                        applyFilters({ city: val });
                    }}
                    className="w-full bg-white border border-zinc-200 rounded-2xl px-5 py-4 text-sm focus:ring-1 focus:ring-black outline-none cursor-pointer shadow-sm appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0\' stroke=\'%23a1a1aa\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em' }}
                >
                    <option value="All">Across All Cities</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Lahore">Lahore</option>
                </select>
            </div>

            <div className="w-full">
                <label className="block text-[11px] font-black text-zinc-400 uppercase mb-3 px-1 tracking-wider">Property Type</label>
                <div className="grid grid-cols-1 gap-2">
                    {['All', 'House', 'Plot', 'Commercial', 'Apartment'].map((type) => (
                        <button
                            key={type}
                            onClick={() => {
                                setSelectedType(type);
                                applyFilters({ type });
                            }}
                            className={`text-left px-5 py-3 rounded-xl text-sm font-bold transition-all border ${selectedType === type
                                ? 'bg-black border-black text-white shadow-lg shadow-black/10'
                                : 'bg-white border-zinc-100 text-zinc-600 hover:border-black hover:bg-zinc-50'
                                }`}
                        >
                            {type === 'All' ? 'All Categories' : type}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const PropertyFilters = () => {
    return (
        <Suspense fallback={<div className="animate-pulse space-y-6"><div className="h-12 bg-zinc-100 rounded-2xl"></div><div className="h-12 bg-zinc-100 rounded-2xl"></div><div className="h-40 bg-zinc-100 rounded-2xl"></div></div>}>
            <PropertyFiltersInner />
        </Suspense>
    );
};

export default PropertyFilters;
