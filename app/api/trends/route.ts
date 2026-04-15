import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';
import Booking from '@/models/Booking';

export async function GET() {
    try {
        await dbConnect();

        const properties = await Property.find({}).lean();
        const bookings = await Booking.find({}).lean();

        const now = new Date();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const cities = ['Islamabad', 'Rawalpindi', 'Lahore'];

        // --- Monthly trends by city (last 6 months) ---
        const monthlyTrends = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

            const entry: any = {
                month: monthNames[date.getMonth()],
            };

            for (const city of cities) {
                // Count properties posted in this month for this city
                const propCount = properties.filter((p: any) => {
                    const posted = new Date(p.postedDate || p.createdAt);
                    return posted >= monthStart && posted <= monthEnd && p.city === city;
                }).length;

                // Count bookings in this month (from properties in this city)
                const cityPropertyIds = properties
                    .filter((p: any) => p.city === city)
                    .map((p: any) => p._id?.toString());

                const bookingCount = bookings.filter((b: any) => {
                    const created = new Date(b.createdAt);
                    return created >= monthStart && created <= monthEnd && cityPropertyIds.includes(b.propertyId?.toString());
                }).length;

                // Activity score = new listings + inquiries
                entry[city.toLowerCase()] = propCount + bookingCount;
            }

            monthlyTrends.push(entry);
        }

        // --- City summary stats ---
        const citySummary = cities.map(city => {
            const cityProps = properties.filter((p: any) => p.city === city);
            const totalProps = cityProps.length;
            const soldCount = cityProps.filter((p: any) => p.availability === 'Sold').length;
            const rentedCount = cityProps.filter((p: any) => p.availability === 'Rented').length;
            const availableCount = cityProps.filter((p: any) => p.availability === 'Available').length;
            const avgPrice = totalProps > 0
                ? Math.round(cityProps.reduce((sum: number, p: any) => sum + (p.price || 0), 0) / totalProps)
                : 0;

            // Calculate growth based on recent vs older listings
            const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
            const recentListings = cityProps.filter((p: any) => new Date(p.postedDate || p.createdAt) >= threeMonthsAgo).length;
            const olderListings = totalProps - recentListings;
            const growthRate = olderListings > 0
                ? ((recentListings / olderListings) * 100).toFixed(1)
                : recentListings > 0 ? '100.0' : '0.0';

            return {
                city,
                totalProperties: totalProps,
                sold: soldCount,
                rented: rentedCount,
                available: availableCount,
                avgPrice,
                growthRate: `+${growthRate}%`,
                trend: parseFloat(growthRate) > 50 ? 'Bullish' : parseFloat(growthRate) > 20 ? 'Rising' : 'Stable',
            };
        });

        // --- Property type breakdown ---
        const typeBreakdown = ['House', 'Plot', 'Commercial', 'Apartment'].map(type => ({
            type,
            count: properties.filter((p: any) => p.type === type).length,
        }));

        // --- Overall stats ---
        const totalBookings = bookings.length;
        const pendingBookings = bookings.filter((b: any) => b.status === 'pending').length;
        const completedDeals = bookings.filter((b: any) => b.status === 'sold' || b.status === 'rented').length;

        return NextResponse.json({
            monthlyTrends,
            citySummary,
            typeBreakdown,
            overview: {
                totalProperties: properties.length,
                totalBookings,
                pendingBookings,
                completedDeals,
            }
        });
    } catch (error: any) {
        console.error('Trends API error:', error);
        return NextResponse.json({ message: 'Error fetching trends' }, { status: 500 });
    }
}
