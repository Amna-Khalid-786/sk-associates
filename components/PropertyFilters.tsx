
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const PropertyFilters = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'All');
    const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All');

    // Sync state from URL parameters (e.g. initial load, back/forward button)
    useEffect(() => {
        const newSearch = searchParams.get('search') || '';
        const newCity = searchParams.get('city') || 'All';
        const newType = searchParams.get('type') || 'All';

        // Only update local state if it differs from the URL and we are not currently debouncing a change
        // We use functional updates to avoid dependency on the states themselves
        setSearchQuery(prev => prev !== newSearch ? newSearch : prev);
        setSelectedCity(prev => prev !== newCity ? newCity : prev);
        setSelectedType(prev => prev !== newType ? newType : prev);
    }, [searchParams]);

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== 'All') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`/properties?${params.toString()}`);
    }

    // Debounce search input
    useEffect(() => {
        // Skip if the search query already matches the URL (prevents duplicate pushes)
        if (searchQuery === (searchParams.get('search') || '')) return;

        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (searchQuery) {
                params.set('search', searchQuery);
            } else {
                params.delete('search');
            }
            router.push(`/properties?${params.toString()}`);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, searchParams, router]);

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
                        setSelectedCity(e.target.value);
                        handleFilterChange('city', e.target.value);
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
                                handleFilterChange('type', type);
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

export default PropertyFilters;
