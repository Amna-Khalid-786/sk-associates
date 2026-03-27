
import React from 'react';
import Link from 'next/link';
import dbConnect from '@/lib/db';
import Property, { IProperty } from '@/models/Property';
import PropertyCard from '@/components/PropertyCard';
import HeroSearch from '@/components/HeroSearch';
import HeroBackground from '@/components/HeroBackground';
import Services from '@/components/Services';
import Process from '@/components/Process';
import Testimonials from '@/components/Testimonials';
import { Property as PropertyType } from '@/types';

// Helper to serialize Mongoose doc to plain object for Client Component
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

export default async function Home() {
  await dbConnect();
  // Fetch featured properties
  const featuredDocs = await Property.find({ featured: true }).limit(3).lean();
  const featuredProperties = featuredDocs.map((doc: any) => serializeProperty(doc));

  // Dynamic Category Counts
  const houseCount = await Property.countDocuments({ type: 'House' });
  const apartmentCount = await Property.countDocuments({ type: 'Apartment' });
  const plotCount = await Property.countDocuments({ type: 'Plot' });
  const commercialCount = await Property.countDocuments({ type: 'Commercial' });

  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[700px] flex items-center overflow-hidden bg-black perspective-1000">
        {/* Animated Background Slideshow */}
        <HeroBackground />

        {/* Floating 3D Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[15%] left-[10%] w-72 h-72 bg-white/5 rounded-full blur-[100px] animate-float"></div>
          <div className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] bg-white/5 rounded-full blur-[130px] animate-float-delayed"></div>

          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full transform-style-3d text-center md:text-left">
          <div className="max-w-4xl mx-auto md:mx-0">

            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tight animate-in slide-up duration-1000">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 via-white to-zinc-600">Modern Lifestyle.</span>
            </h1>

            <div className="mb-12 animate-in zoom-in duration-1000 delay-300">
              <HeroSearch />
            </div>

            <p className="text-lg md:text-2xl text-zinc-400 mb-12 max-w-2xl leading-relaxed font-medium animate-in slide-up duration-1000 delay-200">
              SK Associates & Builders crafts architectural masterpieces that redefine elite living. Your vision, our precision.
            </p>
          </div>
        </div>
      </section>

      {/* Category Shortcuts */}
      <section className="py-12 bg-white -mt-20 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Luxury Houses', count: houseCount, color: 'text-zinc-600', hover: 'hover:bg-zinc-50' },
              { title: 'Apartments', count: apartmentCount, color: 'text-zinc-600', hover: 'hover:bg-zinc-50' },
              { title: 'Prime Plots', count: plotCount, color: 'text-zinc-600', hover: 'hover:bg-zinc-50' },
              { title: 'Commercial', count: commercialCount, color: 'text-zinc-600', hover: 'hover:bg-zinc-50' }
            ].map((item, i) => (
              <Link key={i} href="/properties" className={`premium-card p-8 transition-all duration-500 group ${item.hover} reveal-zoom-in`} style={{ transitionDelay: `${i * 100}ms` }}>
                <h3 className="text-xl font-extrabold text-black mb-2">{item.title}</h3>
                <p className={`text-[11px] font-black uppercase tracking-[0.1em] ${item.color}`}>{item.count}+ Real Listings</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <div className="reveal-slide-up">
        <Services />
      </div>

      {/* Process Section */}
      <div className="reveal-fade-in">
        <Process />
      </div>

      {/* Featured Grid */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal-slide-up">
            <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black pb-2">Top Recommendations</h2>
              <Link
                href="/properties"
                className="group flex items-center text-sm font-bold text-white hover:bg-zinc-800 transition-all px-6 py-2 rounded-xl bg-black border border-black"
              >
                View all
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredProperties.map((p, i) => (
              <div key={p.id} className="reveal-slide-up h-full" style={{ transitionDelay: `${i * 100}ms` }}>
                <PropertyCard property={p} />
              </div>
            ))}
            {featuredProperties.length === 0 && (
              <div className="col-span-3 text-center py-20 text-zinc-400">
                Setting up the skyline... (If empty, seeding might be in progress)
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <div className="reveal-fade-in">
        <Testimonials />
      </div>

      {/* Stats */}
      <section className="bg-white py-32 border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { n: '100%', l: 'Project Success Rate' },
              { n: '50+', l: 'Exclusive Developments' },
              { n: '24/7', l: 'Premium Concierge' },
              { n: '5K+', l: 'Global Investors' }
            ].map((stat, i) => (
              <div key={i} className="space-y-4 reveal-slide-up" style={{ transitionDelay: `${i * 100}ms` }}>
                <p className="text-5xl md:text-6xl font-black text-black pb-2">{stat.n}</p>
                <p className="text-[10px] sm:text-xs font-bold text-zinc-600 uppercase tracking-[0.2em]">{stat.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
