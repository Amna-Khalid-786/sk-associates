import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Config from '@/models/Config';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();
        const configs = await Config.find({});
        const configMap = configs.reduce((acc: any, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        return NextResponse.json(configMap);
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching config' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();
        const body = await req.json();

        for (const [key, value] of Object.entries(body)) {
            await Config.findOneAndUpdate(
                { key },
                { value },
                { upsert: true, new: true }
            );
        }

        return NextResponse.json({ message: 'Configuration updated successfully' });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error updating config' }, { status: 500 });
    }
}
