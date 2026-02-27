import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const { name, email, password, adminCode } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        await dbConnect();

        let userRole = 'user'; // Default role

        const normalizedEmail = email.toLowerCase();

        // Check for admin email
        if (normalizedEmail === 'amnapersonal4@gmail.com') {
            userRole = 'admin';
        }

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role: userRole,
        });

        return NextResponse.json(
            { message: 'User registered successfully', user: { id: newUser._id, email: newUser.email, name: newUser.name, role: newUser.role } },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Something went wrong' },
            { status: 500 }
        );
    }
}
