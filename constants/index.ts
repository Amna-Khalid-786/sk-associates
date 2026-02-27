
import { Property } from '@/types';

export const PROPERTIES: any[] = [
    {
        title: 'The Platinum Villa | Sector E-7',
        description: 'An architectural masterpiece offering unparalleled luxury. This smart home features a rooftop infinity pool and a private cinema.',
        price: 550000000,
        location: 'Sector E-7, Hillside Road',
        city: 'Islamabad',
        type: 'House',
        area: '2000 Sq Yd',
        beds: 6,
        baths: 8,
        imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
        featured: true,
        postedDate: '2024-03-15',
        features: ['Rooftop Pool', 'Smart Automation', 'Private Gym', 'Elevator']
    },
    {
        title: 'Sky Garden Penthouse',
        description: 'Elite living above the clouds. A triple-story penthouse in Goldcrest Views with 360-degree views of Lahore.',
        price: 185000000,
        location: 'DHA Phase 4',
        city: 'Lahore',
        type: 'Apartment',
        area: '5200 Sq Ft',
        beds: 4,
        baths: 5,
        imageUrl: 'https://images.unsplash.com/photo-1540518614846-7e44396f272c?auto=format&fit=crop&w=1200&q=80',
        featured: true,
        postedDate: '2024-03-12',
        features: ['Sky Lounge', 'Wine Cellar', '24/7 Security']
    },
    {
        title: 'Lake City Mansions',
        description: 'Exclusive 2-Kanal mansion with direct access to the golf course and private lake views. A statement of success.',
        price: 350000000,
        location: 'Lake City',
        city: 'Lahore',
        type: 'House',
        area: '2 Kanal',
        beds: 6,
        baths: 7,
        imageUrl: 'https://images.unsplash.com/photo-1600566752355-3579af9daec1?auto=format&fit=crop&w=1200&q=80',
        featured: true,
        postedDate: '2024-03-10',
        features: ['Golf Course View', 'Private Cinema', 'Basement Bar']
    },
    {
        title: 'Bahria Springs Villa',
        description: 'Luxurious designer villa with a private garden and outdoor BBQ area. Tranquility meets modern comfort.',
        price: 125000000,
        location: 'Bahria Enclave',
        city: 'Islamabad',
        type: 'House',
        area: '10 Marla',
        beds: 4,
        baths: 4,
        imageUrl: 'https://images.unsplash.com/photo-1600573472791-dc63a441b0bc?auto=format&fit=crop&w=1200&q=80',
        featured: true,
        postedDate: '2024-03-18',
        features: ['BBQ Area', 'Landscaped Garden', 'Double Glazed Windows']
    }
];

export const MARKET_TRENDS = [
    { month: 'Oct', islamabad: 12, rawalpindi: 8, lahore: 10 },
    { month: 'Nov', islamabad: 15, rawalpindi: 9, lahore: 12 },
    { month: 'Dec', islamabad: 14, rawalpindi: 11, lahore: 13 },
    { month: 'Jan', islamabad: 18, rawalpindi: 12, lahore: 15 },
    { month: 'Feb', islamabad: 20, rawalpindi: 14, lahore: 17 },
    { month: 'Mar', islamabad: 22, rawalpindi: 15, lahore: 19 },
];
