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
        featured: false,
        features: '',
        discount: '0',
        availability: 'Available',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

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
                <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-bold uppercase text-[10px] tracking-[0.2em] group"
                >
                    <div className="p-2 bg-white rounded-xl border border-slate-100 group-hover:border-indigo-100 group-hover:bg-indigo-50 transition-all">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    Back to Dashboard
                </Link>

                <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
                    <div className="bg-slate-900 px-12 py-12 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h1 className="text-4xl font-black tracking-tight">Upload New <span className="text-indigo-400">Property.</span></h1>
                            <p className="text-slate-400 mt-2 font-medium uppercase text-xs tracking-[0.2em]">Add a premium listing to your portfolio</p>
                        </div>
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
                        <Home className="absolute right-12 bottom-0 -mb-8 w-32 h-32 text-white/5" />
                    </div>

                    <form onSubmit={handleSubmit} className="p-12 space-y-12">
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-emerald-50 border-2 border-emerald-100 p-6 rounded-[2rem] flex items-center gap-4 text-emerald-700 font-black text-sm shadow-sm"
                            >
                                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                {success}
                            </motion.div>
                        )}

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-rose-50 border-2 border-rose-100 p-6 rounded-[2rem] text-rose-600 font-black text-sm shadow-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Basic Details */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                        <Hash className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Core Information</h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Property Title</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-6 py-4.5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-slate-400 font-bold"
                                            placeholder="e.g. Modern Luxury Villa in DHA"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-6 py-4.5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold"
                                                placeholder="Islamabad"
                                                value={formData.city}
                                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Property Type</label>
                                            <select
                                                className="w-full px-6 py-4.5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold appearance-none cursor-pointer"
                                                value={formData.type}
                                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                            >
                                                <option>House</option>
                                                <option>Plot</option>
                                                <option>Commercial</option>
                                                <option>Apartment</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Address / Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                            <input
                                                type="text"
                                                required
                                                className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold"
                                                placeholder="DHA Phase 2, Sector A"
                                                value={formData.location}
                                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Price (PKR)</label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                                <input
                                                    type="number"
                                                    required
                                                    className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold"
                                                    value={formData.price}
                                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Availability</label>
                                            <select
                                                className="w-full px-6 py-4.5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold appearance-none cursor-pointer"
                                                value={formData.availability}
                                                onChange={e => setFormData({ ...formData, availability: e.target.value as any })}
                                            >
                                                <option>Available</option>
                                                <option>Sold</option>
                                                <option>Reserved</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Features & Media */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                        <ImageIcon className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Features & Media</h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Main Image URL</label>
                                        <input
                                            type="url"
                                            required
                                            className="w-full px-6 py-4.5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold"
                                            placeholder="https://images.unsplash.com/..."
                                            value={formData.imageUrl}
                                            onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Area</label>
                                            <div className="relative">
                                                <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="5 Marla"
                                                    className="w-full pl-10 pr-4 py-4.5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold"
                                                    value={formData.area}
                                                    onChange={e => setFormData({ ...formData, area: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Bedrooms</label>
                                            <div className="relative">
                                                <Bed className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                <input
                                                    type="number"
                                                    className="w-full pl-10 pr-4 py-4.5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold"
                                                    value={formData.beds}
                                                    onChange={e => setFormData({ ...formData, beds: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Bathrooms</label>
                                            <div className="relative">
                                                <Bath className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                <input
                                                    type="number"
                                                    className="w-full pl-10 pr-4 py-4.5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold"
                                                    value={formData.baths}
                                                    onChange={e => setFormData({ ...formData, baths: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Key Features (Comma separated)</label>
                                        <textarea
                                            rows={2}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold"
                                            placeholder="Modern Kitchen, Solar Panels, Basement"
                                            value={formData.features}
                                            onChange={e => setFormData({ ...formData, features: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 items-center">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Discount %</label>
                                            <input
                                                type="number"
                                                className="w-full px-6 py-4.5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold"
                                                placeholder="0"
                                                value={formData.discount}
                                                onChange={e => setFormData({ ...formData, discount: e.target.value })}
                                            />
                                        </div>
                                        <label className="flex items-center gap-3 cursor-pointer mt-6 p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 hover:bg-indigo-50 hover:border-indigo-100 transition-all">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 accent-indigo-600 rounded-lg"
                                                checked={formData.featured}
                                                onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                                            />
                                            <span className="font-black text-xs uppercase tracking-widest text-slate-700">Mark Featured</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Description</label>
                            <textarea
                                required
                                rows={5}
                                className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-[2rem] focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-700 text-lg leading-relaxed shadow-inner"
                                placeholder="Describe the property's unique selling points..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02, translateY: -4 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-slate-900 text-white py-6 rounded-[2rem] font-black text-2xl shadow-2xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="w-10 h-10 animate-spin" />
                            ) : (
                                <>
                                    Publish Property
                                    <Plus className="w-8 h-8" />
                                </>
                            )}
                        </motion.button>
                    </form>
                </div>
            </div>
        </div>
    );
}
