import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const propertySchema = new mongoose.Schema({
    title: String,
    imageUrl: String,
    images: [String]
}, { strict: false });

const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);

async function check() {
    await mongoose.connect(process.env.MONGODB_URI as string);
    const props = await Property.find({}, 'title imageUrl images');
    console.log(JSON.stringify(props, null, 2));
    process.exit(0);
}
check();
