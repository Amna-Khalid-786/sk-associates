import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const city = searchParams.get('city');
        const type = searchParams.get('type');
        const featured = searchParams.get('featured');

        const query: any = {};
        if (city && city !== 'All') query.city = city;
        if (type && type !== 'All') query.type = type;
        if (featured === 'true') query.featured = true;

        const properties = await Property.find(query).sort({ createdAt: -1 });

        return NextResponse.json(properties);
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching properties' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();
        const body = await req.json();

        const property = await Property.create(body);

        return NextResponse.json({ message: 'Property created successfully', property }, { status: 201 });
    } catch (error: any) {
        console.error('CREATE PROPERTY ERROR:', error);
        return NextResponse.json({ message: error.message || 'Error creating property' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();
        const body = await req.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json({ message: 'Property ID is required' }, { status: 400 });
        }

        const property = await Property.findByIdAndUpdate(id, updateData, { new: true });

        if (!property) {
            return NextResponse.json({ message: 'Property not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Property updated successfully', property });
    } catch (error: any) {
        console.error('UPDATE PROPERTY ERROR:', error);
        return NextResponse.json({ message: error.message || 'Error updating property' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'Property ID is required' }, { status: 400 });
        }

        const property = await Property.findByIdAndDelete(id);

        if (!property) {
            return NextResponse.json({ message: 'Property not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Property deleted successfully' });
    } catch (error: any) {
        console.error('DELETE PROPERTY ERROR:', error);
        return NextResponse.json({ message: error.message || 'Error deleting property' }, { status: 500 });
    }
}
