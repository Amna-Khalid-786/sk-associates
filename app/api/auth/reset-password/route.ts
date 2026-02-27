import { NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ message: 'Token and password are required' }, { status: 400 });
        }

        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        await dbConnect();

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: new Date() },
        });

        if (!user) {
            console.log('RESET PASSWORD FAIL: Invaid or expired token', { resetPasswordToken });
            return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
        }

        // Set new password
        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return NextResponse.json({ message: 'Password reset successful. You can now login.' });
    } catch (error: any) {
        console.error('RESET PASSWORD ERROR:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
