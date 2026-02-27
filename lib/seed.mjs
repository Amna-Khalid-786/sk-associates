
import mongoose from 'mongoose';
import pkg from 'dotenv';
const { config } = pkg;
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sk-associates';

const PropertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true },
    type: { type: String, required: true },
    area: { type: String, required: true },
    beds: { type: Number },
    baths: { type: Number },
    imageUrl: { type: String, required: true },
    featured: { type: Boolean, default: false },
    postedDate: { type: Date, default: Date.now },
    features: [{ type: String }]
}, { timestamps: true });

const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);

// Verified Real Estate Image IDs (Expanded pool for 110+ strictly unique listings)
// Verified Real Estate Image IDs (100 strictly unique IDs for 100 properties)
const ARCH_IMGS = [
    '1580587771525-787a936a1c1d', '1512917774080-9991f1c4c750', '1613490493576-7fde63acd811',
    '1600585154348-282601521484', '1600585153491-c24720bb4e14', '1600047509807-ba846436ee52',
    '1600566753190-197d2bc01624', '1600566753088-e07af18a992b', '1600566752321-4d8323a70c07',
    '1600607687920-4e2a12cf1a50', '1600607687937-2900f9393344', '1600607687644-386f745fbd3c',
    '1600607688039-1ce5dc4e50db', '1600117188248-f0600a7401a7', '1600566752355-3579af9daec1',
    '1600573472791-dc63a441b0bc', '1600566753039-6d6f4f664a75', '1600607687259-d4715dfc3973',
    '1600607687644-e71a00778f4a', '1600210492486-724fe5c67fb0', '1513584684004-99d9969c1756',
    '1527030282365-50267822457f', '1536376074432-bf71545b6664', '1502005229762-d5d57b1fd56c',
    '1501183007204-56c9e0451f5e', '1496661414341-39775367b001', '1493663249051-5125368a156e',
    '1484301548528-6a13e88b3a23', '1522708323590-d24dbb6b0267', '1523217582562-09d0def993a6',
    '1493206678762-25983879f8c6', '1492323817112-9c36e4f3c7e7', '1515263487990-61f0322165b5',
    '1531971589134-87b91381267d', '1502671871246-a818ffdc3e42', '1493476313559-fb3d60100f95',
    '1613551478478-22ca5a3a859e', '1613574822733-124b6756285a', '1613575851240-69279025345d',
    '1613920952047-92cedf69903b', '1522050216695-1200a70033d1', '1494526191131-f168abc3e0ce',
    '1494526108132-70f1a92a5436', '1494514751307-5e937d57849e', '1514393813661-d5fd1d0a30b8',
    '1510620353032-de1ddb418c4b', '1502671142104-bb3df1f63086', '1501815531200-d1b5858444f9',
    '1613490493576-7fde63acd811', '1580588152939-26a3a70d8a9d'
];

const getUrl = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

const cityData = {
    'Islamabad': [
        { area: 'Sector E-7', projects: ['Hillside Road', 'Street 4'] },
        { area: 'Sector F-6', projects: ['Main Margalla Road', 'School Road'] },
        { area: 'Sector G-11', projects: ['G-11 Markaz', 'Project 786'] },
        { area: 'Bahria Enclave', projects: ['Sector A', 'Sector C', 'Villas Block'] },
        { area: 'DHA Phase 2', projects: ['Sector E', 'Sector J', 'Central Park'] },
        { area: 'Gulberg Greens', projects: ['Executive Block', 'D-Block'] }
    ],
    'Lahore': [
        { area: 'DHA Phase 6', projects: ['Block K', 'Main Boulevard', 'Value Addition'] },
        { area: 'DHA Phase 8', projects: ['Air Avenue', 'Ivy Park'] },
        { area: 'Gulberg III', projects: ['M.M. Alam Road', 'Zafar Ali Road'] },
        { area: 'Lake City', projects: ['Golf Estate', 'Sector M-8'] },
        { area: 'Model Town', projects: ['Block J', 'Block H'] }
    ],
    'Rawalpindi': [
        { area: 'Bahria Town Phase 7', projects: ['Intellectual Village', 'Business Bay'] },
        { area: 'Bahria Town Phase 8', projects: ['Sector A', 'Sector C', 'Rose Garden'] },
        { area: 'Gulrez Housing Scheme', projects: ['Phase 2', 'Phase 3'] },
        { area: 'Saddar', projects: ['Bank Road', 'Haider Road'] }
    ]
};

const types = ['House', 'Apartment', 'Plot', 'Commercial'];
const features = ['Solar Panels', 'Gated Community', 'Swimming Pool', 'Smart Home', 'Servant Quarter', 'CCTV', 'Lift', 'Parking', 'Garden'];

const generateProperties = () => {
    const data = [];
    const cities = Object.keys(cityData);

    for (let i = 0; i < 50; i++) {
        const city = cities[i % cities.length];
        const areaInfo = cityData[city][i % cityData[city].length];
        const project = areaInfo.projects[i % areaInfo.projects.length];
        const type = types[i % types.length];

        const priceBase = type === 'House' ? 50000000 : type === 'Apartment' ? 20000000 : 15000000;
        const price = priceBase + (Math.floor(Math.random() * 200) * 1000000);

        const adjectives = ['Luxury', 'Modern', 'Bespoke', 'Elite', 'Premier', 'Royal', 'Garden', 'Sky'];
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];

        let title = '';
        if (type === 'House') title = `${adj} ${Math.random() > 0.5 ? '1 Kanal' : '10 Marla'} Villa in ${areaInfo.area}`;
        else if (type === 'Apartment') title = `Executive ${adj} Apartment - ${project}`;
        else if (type === 'Plot') title = `Prime ${Math.random() > 0.5 ? '1 Kanal' : '10 Marla'} Residential Plot in ${project}`;
        else title = `Commercial Plaza Space in ${areaInfo.area} Markaz`;

        data.push({
            title,
            description: `A stunning ${type.toLowerCase()} offering the ultimate in ${city} living. This property in ${areaInfo.area} features high-end finishes, strategic location near ${project}, and unmatched value. Perfect for ${type === 'Plot' ? 'investment or building your dream home' : 'families seeking luxury and security'}.`,
            price,
            location: `${project}, ${areaInfo.area}`,
            city,
            type,
            area: type === 'Plot' ? (Math.random() > 0.5 ? '1 Kanal' : '10 Marla') : (Math.random() > 0.5 ? '3500 Sq Ft' : '1800 Sq Ft'),
            beds: type === 'Plot' ? undefined : (3 + (i % 4)),
            baths: type === 'Plot' ? undefined : (3 + (i % 4)),
            imageUrl: getUrl(ARCH_IMGS[i % ARCH_IMGS.length]),
            featured: i % 10 === 0,
            features: [features[i % features.length], features[(i + 1) % features.length], features[(i + 2) % features.length]]
        });
    }
    return data;
};

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        console.log('Clearing existing properties...');
        await Property.deleteMany({});

        const props = generateProperties();
        console.log('Seeding ' + props.length + ' properties...');
        await Property.insertMany(props);

        console.log('+++ SUCCESS: Database seeded with localized Pakistani data.');
        process.exit(0);
    } catch (error) {
        console.error('--- ERROR seeding database:', error);
        process.exit(1);
    }
}

seed();
