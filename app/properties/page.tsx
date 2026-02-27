
import React from 'react';
import Link from 'next/link';
import dbConnect from '@/lib/db';
import Property, { IProperty } from '@/models/Property';
import PropertyCard from '@/components/PropertyCard';
import PropertyFilters from '@/components/PropertyFilters';
import { Property as PropertyType } from '@/types';

// Helper to serialize Mongoose doc
const serializeProperty = (doc: any): PropertyType => ({
    id: doc._id?.toString() || '',
    _id: doc._id?.toString() || '',
    title: doc.title || 'Untitled Property',
    description: doc.description || 'No description provided.',
    price: doc.price || 0,
    location: doc.location || 'Location not specified',
    city: doc.city || 'Islamabad',
    type: doc.type || 'House',
    area: doc.area || 'N/A',
    beds: doc.beds,
    baths: doc.baths,
    imageUrl: doc.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    featured: doc.featured || false,
    postedDate: doc.postedDate ? new Date(doc.postedDate).toISOString() : new Date().toISOString(),
    features: doc.features || [],
    discount: doc.discount || 0,
    availability: doc.availability || 'Available',
});

export const dynamic = 'force-dynamic'; // Since we use searchParams

export default async function PropertiesPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    await dbConnect();
    const searchParams = await props.searchParams;

    const city = typeof searchParams.city === 'string' ? searchParams.city : 'All';
    const type = typeof searchParams.type === 'string' ? searchParams.type : 'All';
    const search = typeof searchParams.search === 'string' ? searchParams.search : '';

    const query: any = {};

    if (city !== 'All') {
        query.city = city;
    }

    if (type !== 'All') {
        query.type = type;
    }

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } },
        ];
    }

    const propertyDocs = await Property.find(query).sort({ createdAt: -1 }).lean();
    const properties = propertyDocs.map((doc: any) => serializeProperty(doc));

    return (
        <div className="bg-white min-h-screen">
            {/* Header / Breadcrumb */}
            <div className="bg-slate-50 border-b border-slate-100 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <nav className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                                <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
                                <span>/</span>
                                <span className="text-slate-900">Properties</span>
                            </nav>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                                Premium <span className="text-indigo-600">Inventory.</span>
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sticky Sidebar */}
                    <aside className="lg:w-80 flex-shrink-0">
                        <div className="sticky top-24">
                            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 mb-8">
                                <h2 className="text-xl font-black text-slate-900 mb-8">Filter Search</h2>
                                <PropertyFilters />
                            </div>

                            {/* Promotional card in sidebar */}
                            <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-200">
                                <h3 className="text-xl font-bold mb-4">Need Help?</h3>
                                <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                                    Our expert advisors are ready to help you find the perfect property in the twin cities.
                                </p>
                                <Link href="/contact" className="inline-block bg-white text-indigo-600 font-bold px-6 py-3 rounded-xl text-sm hover:bg-slate-50 transition-colors w-full text-center">
                                    Contact Advisor
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Main Listings Grid */}
                    <div className="flex-grow">
                        {properties.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {properties.map((p, i) => (
                                    <div key={p.id} className="reveal transform h-full" style={{ transitionDelay: `${(i % 4) * 100}ms` }}>
                                        <PropertyCard property={p} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                                <div className="text-5xl mb-6">🔍</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No Properties Found</h3>
                                <p className="text-slate-500 max-w-xs mx-auto mb-8">
                                    We couldn&apos;t find any listings matching your current filters. Try adjusting your search.
                                </p>
                                <Link href="/properties" className="text-indigo-600 font-bold text-sm hover:underline">
                                    Reset all filters
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
