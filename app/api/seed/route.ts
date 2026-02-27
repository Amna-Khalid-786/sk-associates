
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';

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

const cityData: any = {
    'Islamabad': [{ area: 'Sector E-7', projects: ['Hillside Road'] }, { area: 'Bahria Enclave', projects: ['Sector A'] }],
    'Lahore': [{ area: 'DHA Phase 6', projects: ['Block K'] }, { area: 'Lake City', projects: ['Golf Estate'] }],
    'Rawalpindi': [{ area: 'Bahria Town Phase 8', projects: ['Sector A'] }]
};

const generateProperties = () => {
    const data = [];
    const cities = Object.keys(cityData);
    const types = ['House', 'Apartment', 'Plot', 'Commercial'];
    const features = ['Solar Panels', 'Swimming Pool', 'Smart Home', 'Garden'];

    for (let i = 0; i < 50; i++) {
        const city = cities[i % cities.length];
        const areaInfo = cityData[city][i % cityData[city].length];
        const project = areaInfo.projects[i % areaInfo.projects.length];
        const type = types[i % types.length];
        const imgId = ARCH_IMGS[i];

        data.push({
            title: `${type} in ${areaInfo.area}`,
            description: `Exquisite ${type.toLowerCase()} in the heart of ${city}.`,
            price: 25000000 + (i * 1000000),
            location: `${project}, ${areaInfo.area}`,
            city,
            type,
            area: '1 Kanal',
            beds: type === 'Plot' ? undefined : 4,
            baths: type === 'Plot' ? undefined : 4,
            imageUrl: `https://images.unsplash.com/photo-${imgId}?auto=format&fit=crop&w=1200&q=80`,
            featured: i % 5 === 0,
            features: [features[i % features.length]]
        });
    }
    return data;
};

import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    await dbConnect();
    try {
        await Property.deleteMany({});
        const props = generateProperties();
        await Property.insertMany(props);
        return NextResponse.json({ success: true, message: `Database seeded with ${props.length} unique properties` });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}
