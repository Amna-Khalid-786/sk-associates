
import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
        type: String,
        required: [true, 'Please provide your phone number'],
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: [true, 'Property ID is required'],
    },
    propertyTitle: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: [true, 'Please provide a message'],
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'reserved', 'sold'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
