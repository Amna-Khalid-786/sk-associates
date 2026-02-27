import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';
import Booking from '@/models/Booking';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();

        const [totalProperties, pendingBookings, soldUnits, activeUsers] = await Promise.all([
            Property.countDocuments({}),
            Booking.countDocuments({ status: 'pending' }),
            Booking.countDocuments({ status: 'sold' }),
            User.countDocuments({}),
        ]);

        return NextResponse.json({
            totalProperties,
            pendingBookings,
            soldUnits,
            activeUsers
        });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching stats' }, { status: 500 });
    }
}
