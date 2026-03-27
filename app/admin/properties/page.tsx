'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Pencil,
    Trash2,
    Home,
    MapPin,
    DollarSign,
    Tag,
    Activity,
    Search,
    Plus,
    Loader2,
    CheckCircle2,
    X
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types';

export default function AdminPropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');

    // Edit Modal State
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState<Property | null>(null);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const res = await fetch('/api/properties');
            const data = await res.json();
            setProperties(data);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this property?')) return;

        try {
            const res = await fetch(`/api/properties?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProperties(properties.filter(p => p._id !== id));
                setMessage('Property deleted successfully');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const handleEditSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!editingProperty) return;
            const res = await fetch('/api/properties', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingProperty._id,
                    ...editingProperty,
                    price: Number(editingProperty.price),
                    discount: Number(editingProperty.discount || 0),
                }),
            });
            if (res.ok) {
                setEditModalOpen(false);
                fetchProperties();
                setMessage('Property updated successfully');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (err) {
            console.error('Edit error:', err);
        }
    };

    const filteredProperties = properties.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-zinc-50 p-4 md:p-8 lg:p-12">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Manage <span className="text-black underline underline-offset-8 decoration-4 decoration-zinc-200">Listings.</span></h1>
                        <p className="text-zinc-500 font-medium">Add, Edit or Remove properties from the platform</p>
                    </div>
                    <Link href="/admin/properties/upload" className="inline-flex items-center gap-3 bg-black hover:bg-zinc-800 text-white font-black px-6 py-3 rounded-2xl transition-all shadow-xl shadow-black/10">
                        <Plus className="w-5 h-5" />
                        New Property
                    </Link>
                </header>

                {message && (
                    <div className="bg-zinc-900 border border-white/10 p-4 rounded-2xl flex items-center gap-3 text-white font-bold animate-in fade-in slide-in-from-top-4">
                        <CheckCircle2 className="w-6 h-6" /> {message}
                    </div>
                )}

                {/* Toolbar */}
                <div className="flex bg-white p-4 rounded-[2rem] border border-zinc-100 shadow-sm items-center gap-4 focus-within:border-black transition-colors">
                    <Search className="w-5 h-5 text-zinc-400 ml-4" />
                    <input
                        type="text"
                        placeholder="Search by title or city..."
                        className="flex-grow bg-transparent border-none outline-none font-medium text-zinc-600"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex py-20 items-center justify-center">
                        <Loader2 className="w-12 h-12 animate-spin text-black" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProperties.map((p, i) => (
                            <motion.div
                                key={p._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group relative"
                            >
                                <div className="h-48 relative overflow-hidden">
                                    <Image 
                                        src={p.imageUrl} 
                                        alt={p.title} 
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700" 
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 border border-white/20">
                                        {p.type}
                                    </div>
                                    <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/20 ${p.availability === 'Sold' ? 'bg-zinc-400' : p.availability === 'Rented' ? 'bg-zinc-600' : 'bg-black'
                                        }`}>
                                        {p.availability}
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div>
                                        <h3 className="font-extrabold text-slate-900 truncate leading-tight">{p.title}</h3>
                                        <div className="flex items-center gap-2 text-slate-400 mt-1">
                                            <MapPin className="w-3 h-3" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">{p.city}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between bg-zinc-50 p-4 rounded-2xl">
                                        <div>
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Price</p>
                                            <p className="font-black text-black">PKR {p.price.toLocaleString()}</p>
                                        </div>
                                        {p.discount !== undefined && p.discount > 0 && (
                                            <div className="bg-zinc-900 text-white px-3 py-1 rounded-full text-[10px] font-black">
                                                -{p.discount}% OFF
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <button
                                            onClick={() => { setEditingProperty(p); setEditModalOpen(true); }}
                                            className="flex-grow flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all font-black uppercase tracking-widest"
                                        >
                                            <Pencil className="w-3.5 h-3.5" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p._id!)}
                                            className="p-3 bg-zinc-100 text-black rounded-xl hover:bg-black hover:text-white transition-all border border-zinc-200"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setEditModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-8 overflow-hidden overflow-y-auto max-h-[90vh]"
                        >
                            {editingProperty && (
                                <>
                                    <div className="flex items-center justify-between mb-8 border-b border-zinc-100 pb-4">
                                        <h2 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Edit <span className="text-black underline underline-offset-4 decoration-2 decoration-zinc-200">Property</span></h2>
                                        <button onClick={() => setEditModalOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleEditSave} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Title</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:border-black outline-none transition-all"
                                                    value={editingProperty.title}
                                                    onChange={e => setEditingProperty({ ...editingProperty, title: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">City</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:border-black outline-none transition-all"
                                                    value={editingProperty.city}
                                                    onChange={e => setEditingProperty({ ...editingProperty, city: e.target.value as any })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Price</label>
                                                <input
                                                    type="number"
                                                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:border-black outline-none transition-all"
                                                    value={editingProperty.price}
                                                    onChange={e => setEditingProperty({ ...editingProperty, price: Number(e.target.value) })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Discount %</label>
                                                <input
                                                    type="number"
                                                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:border-black outline-none transition-all"
                                                    value={editingProperty.discount || 0}
                                                    onChange={e => setEditingProperty({ ...editingProperty, discount: Number(e.target.value) })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Type</label>
                                                <select
                                                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:border-black outline-none transition-all appearance-none cursor-pointer"
                                                    value={editingProperty.type}
                                                    onChange={e => setEditingProperty({ ...editingProperty, type: e.target.value as any })}
                                                >
                                                    <option>House</option>
                                                    <option>Plot</option>
                                                    <option>Commercial</option>
                                                    <option>Apartment</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Status</label>
                                                <select
                                                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:border-black outline-none transition-all appearance-none cursor-pointer"
                                                    value={editingProperty.availability}
                                                    onChange={e => setEditingProperty({ ...editingProperty, availability: e.target.value as any })}
                                                >
                                                    <option>Available</option>
                                                    <option>Sold</option>
                                                    <option>Rented</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Description</label>
                                            <textarea
                                                rows={4}
                                                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:border-black outline-none transition-all"
                                                value={editingProperty.description}
                                                onChange={e => setEditingProperty({ ...editingProperty, description: e.target.value })}
                                            />
                                        </div>

                                        <button type="submit" className="w-full bg-black hover:bg-zinc-800 text-white font-black py-5 rounded-3xl transition-all shadow-xl shadow-black/10 mt-4 uppercase tracking-widest">
                                            Save Changes
                                        </button>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
