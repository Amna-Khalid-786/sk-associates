import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import Property from '@/models/Property';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();

        // Get all bookings with their creation dates
        const bookings = await Booking.find({}).sort({ createdAt: 1 }).lean();

        // Get all properties with their posted dates and types
        const properties = await Property.find({}).lean();

        // --- 1. Monthly Booking Activity (last 6 months) ---
        const now = new Date();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyData = [];

        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

            const monthBookings = bookings.filter((b: any) => {
                const created = new Date(b.createdAt);
                return created >= monthStart && created <= monthEnd;
            });

            const pending = monthBookings.filter((b: any) => b.status === 'pending').length;
            const accepted = monthBookings.filter((b: any) => b.status === 'accepted').length;
            const rented = monthBookings.filter((b: any) => b.status === 'rented').length;
            const sold = monthBookings.filter((b: any) => b.status === 'sold').length;

            monthlyData.push({
                month: `${monthNames[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`,
                pending,
                accepted,
                rented,
                sold,
                total: pending + accepted + rented + sold,
            });
        }

        // --- 2. Property Type Distribution ---
        const typeDistribution = ['House', 'Plot', 'Commercial', 'Apartment'].map(type => ({
            type,
            count: properties.filter((p: any) => p.type === type).length,
        }));

        // --- 3. Booking Status Breakdown (overall) ---
        const statusBreakdown = [
            { status: 'Pending', count: bookings.filter((b: any) => b.status === 'pending').length, fill: '#a1a1aa' },
            { status: 'Accepted', count: bookings.filter((b: any) => b.status === 'accepted').length, fill: '#71717a' },
            { status: 'Rented', count: bookings.filter((b: any) => b.status === 'rented').length, fill: '#3f3f46' },
            { status: 'Sold', count: bookings.filter((b: any) => b.status === 'sold').length, fill: '#18181b' },
        ];

        // --- 4. City-wise Property Count ---
        const cityData = ['Islamabad', 'Rawalpindi', 'Lahore'].map(city => ({
            city,
            count: properties.filter((p: any) => p.city === city).length,
        }));

        return NextResponse.json({
            monthlyData,
            typeDistribution,
            statusBreakdown,
            cityData,
        });
    } catch (error: any) {
        console.error('Chart API error:', error);
        return NextResponse.json({ message: 'Error fetching chart data' }, { status: 500 });
    }
}
