import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        await dbConnect();

        const normalizedEmail = email.toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            console.log('RESET LINK REQUEST FAIL: User not found', { email: normalizedEmail });
            // We return 200 even if user not found for security reasons
            return NextResponse.json({ message: 'If an account exists with this email, a reset link has been sent.' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set token and expiry (1 hour)
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpires = Date.now() + 3600000;

        await user.save();

        // Send email
        const host = req.headers.get('host');
        // Prioritize current host header to handle IP-based access (like testing on mobile)
        const protocol = host?.includes('localhost') || host?.match(/^\d+\.\d+\.\d+\.\d+/) ? 'http' : 'https';
        const baseUrl = host ? `${protocol}://${host}` : (process.env.NEXTAUTH_URL ? process.env.NEXTAUTH_URL.replace(/\/api\/auth$/, '') : '');
        const resetUrl = `${baseUrl.replace(/\/$/, '')}/reset-password?token=${resetToken}`;

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587'),
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"SK Associates" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 10px;">
                    <h2 style="color: #4f46e5; text-align: center;">SK Associates & Builders</h2>
                    <p>Hello ${user.name},</p>
                    <p>You requested a password reset. Please click the button below to reset your password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                    </div>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you did not request this, please ignore this email.</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                    <p style="font-size: 12px; color: #64748b; text-align: center;">SK Associates & Builders | Islamabad, Pakistan</p>
                </div>
            `,
        };

        // Always log the reset link for development debugging
        console.log('RESET LINK GENERATED:', resetUrl);
        if (resetUrl.includes('localhost')) {
            console.log('HINT: Testing on mobile? Access the site via your IP (192.168.111.72) instead of localhost.');
        }

        if (!process.env.EMAIL_USER) {
            console.log('EMAIL_USER not set, skipping email send');
        } else {
            await transporter.sendMail(mailOptions);
        }

        return NextResponse.json({ message: 'If an account exists with this email, a reset link has been sent.' });
    } catch (error: any) {
        console.error('FORGOT PASSWORD ERROR:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
