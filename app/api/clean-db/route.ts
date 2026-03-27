import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dbConnect from '../../../lib/db';

const propertySchema = new mongoose.Schema({
    title: String,
    imageUrl: String,
    images: [String]
}, { strict: false });

const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);

export async function GET() {
    try {
        await dbConnect();
        const props = await Property.find({}, 'title imageUrl images');
        
        let deletedCount = 0;
        const uploadDir = path.join(process.cwd(), 'public');

        for (const p of props) {
            if (p.imageUrl && p.imageUrl.startsWith('/uploads/')) {
                const localPath = path.join(uploadDir, p.imageUrl);
                if (!fs.existsSync(localPath)) {
                    await Property.findByIdAndDelete(p._id);
                    deletedCount++;
                }
            }
        }

        return NextResponse.json({ message: `Deleted ${deletedCount} properties with missing images.` });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
