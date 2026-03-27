import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const propertySchema = new mongoose.Schema({
    title: String,
    imageUrl: String,
    images: [String]
}, { strict: false });

const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);

async function clean() {
    await mongoose.connect(process.env.MONGODB_URI as string);
    const props = await Property.find({}, 'title imageUrl images');
    
    let deletedCount = 0;
    const uploadDir = path.join(process.cwd(), 'public');

    for (const p of props) {
        if (p.imageUrl && p.imageUrl.startsWith('/uploads/')) {
            const localPath = path.join(uploadDir, p.imageUrl);
            if (!fs.existsSync(localPath)) {
                console.log(`Deleting property "${p.title}" because image ${p.imageUrl} is missing on disk.`);
                await Property.findByIdAndDelete(p._id);
                deletedCount++;
            }
        }
    }

    console.log(`Deleted ${deletedCount} properties with missing images.`);
    process.exit(0);
}
clean();
