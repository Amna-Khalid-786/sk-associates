
import mongoose, { Schema, Document } from 'mongoose';

export interface IProperty extends Document {
    title: string;
    description: string;
    price: number;
    location: string;
    city: 'Islamabad' | 'Rawalpindi' | 'Lahore';
    type: 'House' | 'Plot' | 'Commercial' | 'Apartment';
    area: string;
    beds?: number;
    baths?: number;
    imageUrl: string;
    featured: boolean;
    postedDate: Date;
    features?: string[];
    discount?: number;
    availability: 'Available' | 'Sold' | 'Reserved';
    marketAnalysis?: {
        rentalYield: string;
        sectorDemand: string;
        riskProfile: string;
    };
}

const PropertySchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    city: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    area: { type: String, required: true },
    beds: { type: Number },
    baths: { type: Number },
    imageUrl: { type: String, required: true },
    featured: { type: Boolean, default: false },
    postedDate: { type: Date, default: Date.now },
    features: [{ type: String }],
    discount: { type: Number, default: 0 },
    availability: {
        type: String,
        enum: ['Available', 'Sold', 'Reserved'],
        default: 'Available'
    },
    marketAnalysis: {
        rentalYield: { type: String, default: '6.5%' },
        sectorDemand: { type: String, default: 'High' },
        riskProfile: { type: String, default: 'Low' }
    }
}, {
    timestamps: true
});

// Check if model is already compiled to prevent overwrite error in dev hot reload
export default mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);
