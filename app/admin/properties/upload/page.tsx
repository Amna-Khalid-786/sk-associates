'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Plus, Home, MapPin, DollarSign, Image as ImageIcon, Ruler, Bed, Bath, Hash, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminUploadPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        city: '',
        type: 'House',
        area: '',
        beds: '',
        baths: '',
        imageUrl: '',
        images: [] as string[],
        featured: false,
        features: '',
        discount: '0',
        availability: 'Available',
    });

    const handleFileUpload = async (file: File, isPrimary: boolean) => {
        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formDataUpload,
            });

            if (res.ok) {
                const data = await res.json();
                if (isPrimary) {
                    setFormData(prev => ({ ...prev, imageUrl: data.url }));
                } else {
                    setFormData(prev => ({ ...prev, images: [...prev.images, data.url] }));
                }
            } else {
                const data = await res.json();
                setError(data.message || 'Upload failed');
            }
        } catch (err) {
            setError('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!formData.imageUrl) {
            setError('Please upload a primary property image');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/properties', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: Number(formData.price),
                    beds: formData.beds ? Number(formData.beds) : undefined,
                    baths: formData.baths ? Number(formData.baths) : undefined,
                    features: formData.features.split(',').map(f => f.trim()).filter(f => f !== ''),
                    discount: Number(formData.discount),
                    availability: formData.availability,
                    images: formData.images,
                }),
            });

            if (res.ok) {
                setSuccess('Property uploaded successfully!');
                setFormData({
                    title: '',
                    description: '',
                    price: '',
                    location: '',
                    city: '',
                    type: 'House',
                    area: '',
                    beds: '',
                    baths: '',
                    imageUrl: '',
                    images: [],
                    featured: false,
                    features: '',
                    discount: '0',
                    availability: 'Available',
                });
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.message || 'Failed to upload property');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-bold uppercase text-[10px] tracking-[0.2em] group"
                    >
                        <div className="p-2 bg-white rounded-xl border border-slate-100 group-hover:border-indigo-100 group-hover:bg-indigo-50 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        Back to Dashboard
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100"
                >
                    <div className="bg-slate-900 px-8 md:px-12 py-16 text-white relative overflow-hidden">
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                                    Upload New <span className="text-indigo-400">Property.</span>
                                </h1>
                                <p className="text-slate-400 mt-4 font-medium uppercase text-xs tracking-[0.3em]">
                                    Add a premium listing to your global portfolio
                                </p>
                            </div>
                            <div className="hidden md:flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm font-black text-white">SK Associates</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Admin Dashboard</p>
                                </div>
                                <div className="w-12 h-12 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center">
                                    <Home className="w-6 h-6 text-indigo-400" />
                                </div>
                            </div>
                        </div>

                        {/* Mesh Gradients for Header */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-purple-500/10 rounded-full blur-[80px]"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-16">
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-[2.5rem] flex items-center gap-4 text-emerald-400 font-bold shadow-xl shadow-emerald-500/5"
                            >
                                <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-400/20">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-lg leading-none">Success!</p>
                                    <p className="text-sm text-emerald-500/70 font-medium mt-1">{success}</p>
                                </div>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-rose-500/5 border border-rose-500/20 p-6 rounded-[2.5rem] flex items-center gap-4 text-rose-400 font-bold shadow-xl shadow-rose-500/5"
                            >
                                <div className="w-12 h-12 bg-rose-500/20 rounded-2xl flex items-center justify-center text-rose-400 border border-rose-400/20">
                                    <Hash className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-lg leading-none">Error Encountered</p>
                                    <p className="text-sm text-rose-500/70 font-medium mt-1">{error}</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 1: Core Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="space-y-10"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-slate-900 rounded-[1.25rem] flex items-center justify-center text-indigo-400 shadow-xl shadow-slate-900/10">
                                    <Hash className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Core Information</h2>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Basic property identifiers</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Property Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-sm"
                                        placeholder="e.g. Modern Luxury Villa in DHA"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">City</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-sm"
                                        placeholder="Islamabad"
                                        value={formData.city}
                                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Property Type</label>
                                    <div className="relative">
                                        <select
                                            className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-800 appearance-none cursor-pointer shadow-sm"
                                            value={formData.type}
                                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            <option>House</option>
                                            <option>Plot</option>
                                            <option>Commercial</option>
                                            <option>Apartment</option>
                                        </select>
                                        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <Plus className="w-5 h-5 rotate-45" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Full Address / Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-sm"
                                            placeholder="DHA Phase 2, Sector A"
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Step 2: Property Details */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="space-y-10"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-slate-900 rounded-[1.25rem] flex items-center justify-center text-indigo-400 shadow-xl shadow-slate-900/10">
                                    <DollarSign className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Property Specifications</h2>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Detailed metrics and pricing</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Price (PKR)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500/40" />
                                        <input
                                            type="number"
                                            required
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-800 shadow-sm"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Area (Size)</label>
                                    <div className="relative">
                                        <Ruler className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500/40" />
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. 5 Marla"
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-800 shadow-sm"
                                            value={formData.area}
                                            onChange={e => setFormData({ ...formData, area: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Availability</label>
                                    <select
                                        className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-800 appearance-none cursor-pointer shadow-sm"
                                        value={formData.availability}
                                        onChange={e => setFormData({ ...formData, availability: e.target.value as any })}
                                    >
                                        <option>Available</option>
                                        <option>Sold</option>
                                        <option>Reserved</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Bedrooms</label>
                                    <div className="relative">
                                        <Bed className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500/40" />
                                        <input
                                            type="number"
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-800 shadow-sm"
                                            value={formData.beds}
                                            onChange={e => setFormData({ ...formData, beds: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Bathrooms</label>
                                    <div className="relative">
                                        <Bath className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500/40" />
                                        <input
                                            type="number"
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-800 shadow-sm"
                                            value={formData.baths}
                                            onChange={e => setFormData({ ...formData, baths: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Discount %</label>
                                    <input
                                        type="number"
                                        className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-800 shadow-sm"
                                        placeholder="0"
                                        value={formData.discount}
                                        onChange={e => setFormData({ ...formData, discount: e.target.value })}
                                    />
                                </div>

                                <div className="md:col-span-2 lg:col-span-3">
                                    <label className="flex items-center gap-4 cursor-pointer p-6 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200 hover:bg-indigo-50/30 hover:border-indigo-200 transition-all group">
                                        <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${formData.featured ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 group-hover:border-indigo-300'}`}>
                                            {formData.featured && <CheckCircle2 className="w-5 h-5 text-white" />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={formData.featured}
                                            onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                                        />
                                        <div>
                                            <span className="font-black text-sm uppercase tracking-widest text-slate-700">Mark Featured Property</span>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">Feature this listing on the homepage and trending section</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </motion.div>

                        {/* Step 3: Description & Features */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="space-y-10"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-slate-900 rounded-[1.25rem] flex items-center justify-center text-indigo-400 shadow-xl shadow-slate-900/10">
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Narrative & Amenities</h2>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Marketing description and features</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Detailed Description</label>
                                    <textarea
                                        required
                                        rows={6}
                                        className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-[2.5rem] focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-700 text-lg leading-relaxed shadow-sm scrollbar-thin"
                                        placeholder="Craft a compelling story about this property's unique selling points..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Key Features (Comma separated)</label>
                                    <input
                                        type="text"
                                        className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-800 shadow-sm"
                                        placeholder="e.g. Modern Kitchen, Solar Panels, Basement, High-speed Fiber"
                                        value={formData.features}
                                        onChange={e => setFormData({ ...formData, features: e.target.value })}
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Step 4: Media Gallery (UPDATED FOR MULTIPLE IMAGES) */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="space-y-10"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-slate-900 rounded-[1.25rem] flex items-center justify-center text-indigo-400 shadow-xl shadow-slate-900/10">
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Media Gallery</h2>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Property visuals and virtual tours</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {/* Primary Image Slot */}
                                    <div className="relative aspect-square">
                                        {!formData.imageUrl ? (
                                            <>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleFileUpload(file, true);
                                                    }}
                                                    className="hidden"
                                                    id="primary-image-upload"
                                                />
                                                <label
                                                    htmlFor="primary-image-upload"
                                                    className="flex flex-col items-center justify-center w-full h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl hover:border-indigo-500 hover:bg-indigo-50/30 transition-all cursor-pointer group"
                                                >
                                                    <Home className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 mb-2" />
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-2">Primary</span>
                                                </label>
                                            </>
                                        ) : (
                                            <div className="relative w-full h-full rounded-3xl overflow-hidden border-4 border-indigo-500 shadow-lg group">
                                                <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Main" />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                                    className="absolute top-2 right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                                                >
                                                    <Plus className="w-3 h-3 rotate-45" />
                                                </button>
                                                <div className="absolute inset-x-0 bottom-0 bg-indigo-500 text-white py-1 text-[8px] font-black uppercase tracking-widest text-center">
                                                    Primary
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Gallery Image Slots */}
                                    {formData.images.map((url, idx) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            key={idx}
                                            className="relative aspect-square rounded-3xl overflow-hidden border border-slate-100 group shadow-sm bg-slate-50"
                                        >
                                            <img src={url} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" alt="Gallery" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                                                className="absolute top-2 right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                                            >
                                                <Plus className="w-3 h-3 rotate-45" />
                                            </button>
                                            <div className="absolute bottom-2 left-2 right-2 bg-white/20 backdrop-blur-md py-1 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-[7px] font-black text-white uppercase tracking-widest text-center">Asset {idx + 1}</p>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* Add Gallery Images Slot */}
                                    <div className="relative aspect-square">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files || []);
                                                files.forEach(file => handleFileUpload(file, false));
                                            }}
                                            className="hidden"
                                            id="gallery-images-upload"
                                        />
                                        <label
                                            htmlFor="gallery-images-upload"
                                            className="flex flex-col items-center justify-center w-full h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl hover:border-indigo-500 hover:bg-indigo-50/30 transition-all cursor-pointer group"
                                        >
                                            <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-indigo-50 transition-colors">
                                                <Plus className="w-5 h-5 text-indigo-600 group-hover:rotate-90 transition-transform duration-500" />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Add</span>
                                        </label>
                                    </div>
                                </div>

                                {uploading && (
                                    <div className="mt-8 flex items-center justify-center gap-2 text-indigo-600 animate-pulse">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Optimizing Assets...</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Submit Section with Glowing Animated Border Button */}
                        <div className="pt-8">
                            <div className="relative group p-[2px] rounded-[2.5rem] overflow-hidden">
                                {/* Glowing Static Colors Border */}
                                <div
                                    className="absolute inset-[-100%] z-0"
                                    style={{
                                        background: "linear-gradient(90deg, #4f46e5, #9333ea, #ec4899, #f59e0b, #4f46e5)",
                                    }}
                                />

                                <motion.button
                                    whileHover={{ scale: 1.01, translateY: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={loading}
                                    className="relative w-full bg-slate-900 m-[2px] text-white py-8 rounded-[2.5rem] font-black text-2xl shadow-2xl transition-all flex items-center justify-center gap-4 disabled:opacity-50 overflow-hidden z-10"
                                >
                                    {/* Glowing Aura inside the button */}
                                    <div className="absolute inset-0 bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors" />

                                    {loading ? (
                                        <Loader2 className="w-10 h-10 animate-spin text-white" />
                                    ) : (
                                        <span className="relative z-10 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                            Publish Property
                                        </span>
                                    )}
                                </motion.button>
                            </div>
                            <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-8">
                                Clicking publish will make this premium listing live with all <span className="text-indigo-600 font-black">{formData.images.length + 1}</span> visual assets
                            </p>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
