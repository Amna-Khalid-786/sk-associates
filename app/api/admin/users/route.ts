import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
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
        const users = await User.find({}).sort({ createdAt: -1 }).select('-password').lean();

        return NextResponse.json(users);
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
    }
}
