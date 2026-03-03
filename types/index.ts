
export type City = 'Islamabad' | 'Rawalpindi' | 'Lahore' | 'All';
export type PropertyType = 'House' | 'Plot' | 'Commercial' | 'Apartment';
export type View = 'home' | 'properties' | 'details' | 'trends' | 'advisor' | 'contact';

export interface Property {
    id?: string;
    _id?: string;
    title: string;
    description: string;
    price: number;
    location: string;
    city: City;
    type: PropertyType;
    area: string;
    beds?: number;
    baths?: number;
    imageUrl: string;
    images?: string[];
    featured: boolean;
    postedDate: string;
    features: string[];
    discount?: number;
    availability?: 'Available' | 'Sold' | 'Reserved';
    marketAnalysis?: {
        rentalYield: string;
        sectorDemand: string;
        riskProfile: string;
    };
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface MarketData {
    month: string;
    islamabad: number;
    rawalpindi: number;
    lahore: number;
}
