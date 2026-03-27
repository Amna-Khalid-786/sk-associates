
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import Property, { IProperty } from '@/models/Property';
import PropertyCard from '@/components/PropertyCard';
import SafeImage from '@/components/SafeImage';
import { Property as PropertyType } from '@/types';
import PropertyBookingClient from '@/components/PropertyBookingClient';
import BookingTrigger from '@/components/BookingTrigger';

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
    marketAnalysis: {
        rentalYield: doc.marketAnalysis?.rentalYield || '6.5% Annually',
        sectorDemand: doc.marketAnalysis?.sectorDemand || 'High Demand',
        riskProfile: doc.marketAnalysis?.riskProfile || 'Low Volatility'
    }
});

export default async function PropertyDetailsPage(props: { params: Promise<{ id: string }> }) {
    await dbConnect();
    const params = await props.params;

    let propertyDoc;
    try {
        propertyDoc = await Property.findById(params.id).lean();
    } catch (error) {
        return notFound();
    }

    if (!propertyDoc) {
        return notFound();
    }

    const property = serializeProperty(propertyDoc as any);

    // Fetch related properties (same city or type)
    const relatedDocs = await Property.find({
        _id: { $ne: params.id },
        $or: [{ city: property.city }, { type: property.type }]
    }).limit(3).lean();
    const relatedProperties = relatedDocs.map((doc: any) => serializeProperty(doc));

    return (
        <div className="bg-white min-h-screen">
            <PropertyBookingClient property={property} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* LEFT CONTENT */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Immersive Gallery Placeholder/Main View */}
                        <div className="reveal aspect-[16/9] w-full rounded-[3rem] overflow-hidden bg-slate-100 relative group shadow-2xl shadow-slate-100">
                            <SafeImage
                                src={property.imageUrl}
                                alt={property.title}
                                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                                fallbackSrc="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"
                            />
                            <div className="absolute top-8 left-8 flex space-x-3">
                                {property.featured && <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">Featured</span>}
                                <span className="bg-white text-indigo-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">{property.type}</span>
                            </div>
                        </div>

                        {/* Property Specs Grid */}
                        <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { l: 'Status', v: 'For Sale', i: '🏷️' },
                                { l: 'Area', v: property.area, i: '📐' },
                                { l: 'Bedrooms', v: property.beds || 'N/A', i: '🛏️' },
                                { l: 'Bathrooms', v: property.baths || 'N/A', i: '🚿' }
                            ].map((spec, i) => (
                                <div key={i} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                    <div className="text-2xl mb-2">{spec.i}</div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{spec.l}</p>
                                    <p className="font-extrabold text-slate-900">{spec.v}</p>
                                </div>
                            ))}
                        </div>

                        {/* Title & Description */}
                        <div className="reveal space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                                    {property.title}
                                </h1>
                                <p className="text-xl text-slate-500 font-medium flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    {property.location}, {property.city}
                                </p>
                            </div>

                            <div className="prose prose-slate max-w-none">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Property Overview</h2>
                                <p className="text-slate-600 text-lg leading-relaxed font-medium">
                                    {property.description}
                                </p>
                            </div>

                            {/* Book Now Button Area - After Property Overview as requested */}
                            <div className="reveal bg-slate-950 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-100 relative overflow-hidden">
                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div>
                                        <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Investment Ask</p>
                                        <h4 className="text-4xl font-black tracking-tighter">
                                            PKR {(property.price / 10000000).toFixed(1)} <span className="text-xl font-medium text-slate-400 italic">Crore</span>
                                        </h4>
                                    </div>
                                    <BookingTrigger
                                        className="w-full md:w-auto px-12 bg-white text-slate-900 font-black py-5 rounded-2xl transition-all hover:bg-slate-50 shadow-xl active:scale-[0.98]"
                                    >
                                        Book Now
                                    </BookingTrigger>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/20 to-indigo-500/20 rounded-full blur-3xl"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8">
                                {property.features?.map(feature => (
                                    <div key={feature} className="flex items-center text-slate-900 font-bold bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-indigo-100 hover:shadow-indigo-50">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mr-4">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR (Sticky) */}
                    <div className="lg:col-span-4 lg:pl-4">
                        <div className="sticky top-40 space-y-8">
                            {/* Contact Card */}
                            <div className="reveal bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                                <h3 className="text-xl font-bold text-slate-900 mb-8">Authorised Advisor</h3>
                                <div className="flex items-center space-x-4 mb-10">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden ring-4 ring-slate-50">
                                        <SafeImage
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
                                            alt="Khalid Mehmood"
                                            className="w-full h-full object-cover"
                                            fallbackSrc="https://ui-avatars.com/api/?name=Khalid+Mehmood&background=indigo&color=fff"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 text-lg leading-tight tracking-tight">Khalid Mehmood</p>
                                        <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest mt-1">Senior Dealer</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <a
                                        href="https://wa.me/923364695525"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center space-x-3 py-4 rounded-2xl bg-emerald-500 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-50"
                                    >
                                        <span>Direct WhatsApp</span>
                                    </a>
                                    <a
                                        href="mailto:amnapersonal4@gmail.com"
                                        className="w-full flex items-center justify-center py-4 rounded-2xl border border-slate-100 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                                    >
                                        Email Verification
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Properties */}
                <div className="mt-40">
                    <div className="reveal mb-12 flex justify-between items-end">
                        <div className="space-y-4">
                            <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em]">Similar Deals</h2>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tight">You Might Also <span className="text-indigo-600">Consider.</span></h3>
                        </div>
                        <Link href="/properties" className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors hidden md:block uppercase tracking-widest">
                            Browse All Inventory
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {relatedProperties.map((p, i) => (
                            <div key={p.id} className="reveal h-full" style={{ transitionDelay: `${i * 150}ms` }}>
                                <PropertyCard property={p} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Market Intelligence / Investment Highlights Section */}
                <div className="mt-40 reveal bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-3xl shadow-slate-200">
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em] mb-6">Market Intelligence</h2>
                            <h3 className="text-4xl md:text-5xl font-black mb-8 tracking-tight leading-[1.1]">
                                Why This Invesment <br /><span className="text-indigo-400">Makes Sense Today.</span>
                            </h3>
                            <p className="text-slate-400 text-lg mb-10 font-medium leading-relaxed">
                                Our data analytics team identifies this property as a high-yield asset with a projected 15% capital appreciation over the next 18 months due to upcoming infrastructure developments in the sector.
                            </p>
                            <div className="space-y-6">
                                {[
                                    { t: 'Rental Yield', v: property.marketAnalysis?.rentalYield, i: '📈' },
                                    { t: 'Sector Demand', v: property.marketAnalysis?.sectorDemand, i: '💎' },
                                    { t: 'Risk Profile', v: property.marketAnalysis?.riskProfile, i: '🛡️' }
                                ].map((insight, i) => (
                                    <div key={i} className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10">
                                        <span className="text-3xl">{insight.i}</span>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{insight.t}</p>
                                            <p className="font-bold text-white text-lg">{insight.v}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-[2.5rem] p-10 md:p-14 text-center shadow-2xl shadow-cyan-500/20">
                            <h4 className="text-2xl font-black mb-6">Connect with a Specialist</h4>
                            <p className="text-indigo-100 mb-10 font-medium">Get a personalized investment roadmap and ROI projection for this specific unit.</p>
                            <BookingTrigger
                                className="w-full bg-white text-indigo-600 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl active:scale-95"
                            >
                                Get Market Analysis
                            </BookingTrigger>
                        </div>
                    </div>
                    {/* Decorative abstract elements */}
                    <div className="absolute -top-24 -left-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
}
