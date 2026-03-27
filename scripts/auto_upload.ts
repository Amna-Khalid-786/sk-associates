import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

// Define the properties to create
const propertiesData = [
    {
        title: "Modern Minimalist Villa",
        city: "Islamabad",
        location: "DHA Phase 2, Sector A",
        type: "House",
        price: 85000000,
        area: "1 Kanal",
        beds: 5,
        baths: 6,
        discount: 0,
        availability: "Available",
        description: "An incredibly designed minimalist villa offering expansive spaces, smart home integration, and premium finishes. Perfect for modern families seeking a luxurious lifestyle.",
        features: ["Smart Home", "Pool", "Basement", "Servant Quarter"],
        imageName: "pexels-binyaminmellish-106399.jpg"
    },
    {
        title: "Sunset Boulevard Mansion",
        city: "Lahore",
        location: "Bahria Town, Sector C",
        type: "House",
        price: 120000000,
        area: "2 Kanal",
        beds: 6,
        baths: 7,
        discount: 5,
        availability: "Available",
        description: "A breathtaking mansion with panoramic views. Features a grand entrance, sweeping staircase, state-of-the-art kitchen, and extensive outdoor entertaining areas.",
        features: ["Home Theater", "Wine Cellar", "Infinity Pool", "Gated Community"],
        imageName: "pexels-introspectivedsgn-4897065.jpg"
    },
    {
        title: "Urban Chic Apartment",
        city: "Karachi",
        location: "Clifton, Block 4",
        type: "Apartment",
        price: 45000000,
        area: "200 Sq Yd",
        beds: 3,
        baths: 3,
        discount: 0,
        availability: "Available",
        description: "Sophisticated and chic apartment in the heart of the city. Floor-to-ceiling windows, high-end appliances, and stunning city views make this a must-see.",
        features: ["Gym Access", "24/7 Security", "Balcony", "Covered Parking"],
        imageName: "pexels-michaelgaultphotos-7710011.jpg"
    },
    {
        title: "Serene Lakeview Plot",
        city: "Islamabad",
        location: "Bahria Enclave",
        type: "Plot",
        price: 18000000,
        area: "10 Marla",
        beds: 0,
        baths: 0,
        discount: 0,
        availability: "Available",
        description: "A prime piece of land ready for development, offering beautiful lake views in a secure and peaceful environment.",
        features: ["Lake View", "Park Facing", "All Dues Cleared"],
        imageName: "pexels-nj-socialmedia-911286395-20445164.jpg"
    },
    {
        title: "Downtown Commercial Space",
        city: "Lahore",
        location: "Gulberg III",
        type: "Commercial",
        price: 250000000,
        area: "4 Kanal",
        beds: 0,
        baths: 0,
        discount: 0,
        availability: "Rented",
        description: "Premium commercial space located in the busiest business district. Ideal for a corporate headquarters, high-end retail, or flagship store.",
        features: ["Main Boulevard", "Dedicated Parking", "High Footfall", "Glass Facade"],
        imageName: "pexels-robertkso-14672017.jpg"
    },
    {
        title: "Elegant Family Home",
        city: "Rawalpindi",
        location: "Bahria Town Phase 8",
        type: "House",
        price: 42000000,
        area: "10 Marla",
        beds: 4,
        baths: 4,
        discount: 0,
        availability: "Available",
        description: "A beautifully built family home offering warmth and comfort. Features a spacious lounge, modern kitchen, and a beautiful green lawn.",
        features: ["Lawn", "Spacious Lounge", "Nearby Mosque", "Terrace"],
        imageName: "pexels-vladimirsrajber-28575436.jpg"
    },
    {
        title: "Luxury Penthouse Suite",
        city: "Islamabad",
        location: "F-11 Markaz",
        type: "Apartment",
        price: 110000000,
        area: "4000 Sq Ft",
        beds: 4,
        baths: 5,
        discount: 0,
        availability: "Available",
        description: "The crown jewel of the city skyline. This penthouse offers unparalleled luxury, complete with a private rooftop garden, jacuzzi, and 360-degree views.",
        features: ["Private Elevator", "Rooftop Garden", "Jacuzzi", "Maid's Room"],
        imageName: "splash_bg.jpeg"
    }
];

// Reusing the model schema structure without needing to import Next.js specific stuff if it fails
const propertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true },
    type: {
        type: String,
        enum: ['House', 'Plot', 'Commercial', 'Apartment'],
        required: true
    },
    area: { type: String, required: true },
    beds: { type: Number },
    baths: { type: Number },
    imageUrl: { type: String, required: true },
    images: [{ type: String }],
    featured: { type: Boolean, default: false },
    features: [{ type: String }],
    postedDate: { type: Date, default: Date.now },
    discount: { type: Number, default: 0 },
    availability: {
        type: String,
        enum: ['Available', 'Sold', 'Rented'],
        default: 'Available'
    },
    marketAnalysis: {
        rentalYield: { type: String, default: '5.2%' },
        sectorDemand: { type: String, default: 'High' },
        growthPrediction: { type: String, default: '+12% Expected' }
    }
});

const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);

async function run() {
    try {
        console.log('Connecting to MongoDB...');
        // The MONGODB_URI needs to be provided through environment variables.
        // We'll run this via tsx/ts-node while passing the env file.
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected!');

        const sourceDir = 'C:\\Users\\cuteb\\OneDrive\\Pictures';
        // Need to use absolute path for the sk-associates project 'public/uploads'
        const targetDir = path.join(__dirname, '..', 'public', 'uploads');

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        for (const data of propertiesData) {
            const sourcePath = path.join(sourceDir, data.imageName);
            let publicUrl = '';

            // Copy image if it exists
            if (fs.existsSync(sourcePath)) {
                // Prepend timestamp to ensure unique and force next/image bust cache if needed
                const newImageName = `${Date.now()}-${data.imageName}`;
                const targetPath = path.join(targetDir, newImageName);
                fs.copyFileSync(sourcePath, targetPath);
                publicUrl = `/uploads/${newImageName}`;
                console.log(`Copied image: ${data.imageName} -> ${newImageName}`);
            } else {
                console.log(`WARNING: Image not found at ${sourcePath}`);
                // fallback 
                publicUrl = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80';
            }

            // Create Property
            const propertyToSave = {
                ...data,
                imageUrl: publicUrl,
                images: []
            };

            await Property.create(propertyToSave);
            console.log(`Created property: ${data.title}`);
        }

        console.log('All 7 properties successfully created!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding properties:', err);
        process.exit(1);
    }
}

run();
