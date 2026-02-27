
import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: 'pending' | 'responded' | 'closed';
    createdAt: Date;
}

const ContactSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'responded', 'closed'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);
