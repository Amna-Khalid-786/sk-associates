
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import nodemailer from 'nodemailer';
import Property from '@/models/Property';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();
        const bookings = await Booking.find({}).sort({ createdAt: -1 }).lean();

        return NextResponse.json(bookings);
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching bookings' }, { status: 500 });
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
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ message: 'Booking ID and status are required' }, { status: 400 });
        }

        const validStatuses = ['pending', 'accepted', 'rented', 'sold'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
        }

        const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });

        if (!booking) {
            return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
        }

        // Notify Client of Status Change
        if (['pending', 'accepted', 'rented', 'sold'].includes(status)) {
            try {
                const transporter = nodemailer.createTransport({
                    host: process.env.EMAIL_HOST,
                    port: parseInt(process.env.EMAIL_PORT || '587'),
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });

                const statusLabels: Record<string, string> = {
                    pending: 'Pending Review',
                    accepted: 'Accepted',
                    rented: 'Rented',
                    sold: 'Sold Out'
                };

                const statusMessages: Record<string, string> = {
                    pending: 'Your inquiry is currently under review. Our team will get back to you shortly.',
                    accepted: 'We have reviewed your inquiry and it has been accepted. Our team will contact you shortly to discuss the next steps.',
                    rented: 'This property has been secured for you. Please complete the remaining formalities to finalize your renting process.',
                    sold: 'Congratulations! This property is now officially marked as Sold Out under your name.'
                };

                const mailOptions = {
                    from: `"SK Associates" <${process.env.EMAIL_USER}>`,
                    to: booking.email,
                    subject: `Booking Update: ${statusLabels[status]} - ${booking.propertyTitle}`,
                    html: `
                        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 30px; color: #1e293b; background-color: #ffffff;">
                            <div style="text-align: center; margin-bottom: 40px;">
                                <div style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 12px 24px; border-radius: 15px; font-weight: 900; letter-spacing: 1px; font-size: 18px; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);">SK ASSOCIATES</div>
                            </div>
                            <h2 style="color: #4f46e5; text-align: center; margin-bottom: 30px; font-size: 24px; font-weight: 800;">Status Update: ${statusLabels[status]}</h2>
                            <p style="font-size: 16px; line-height: 1.6;">Dear <strong>${booking.name}</strong>,</p>
                            <p style="font-size: 16px; line-height: 1.6; color: #475569;">${statusMessages[status]}</p>
                            <div style="background-color: #f8fafc; padding: 30px; border-radius: 20px; margin: 30px 0; border: 1px solid #e2e8f0;">
                                <h3 style="margin-top: 0; color: #1e293b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Inquiry Details:</h3>
                                <p style="margin: 10px 0; font-size: 15px;"><strong>Property:</strong> ${booking.propertyTitle}</p>
                                <p style="margin: 10px 0; font-size: 15px;"><strong>Status:</strong> <span style="color: #4f46e5; font-weight: 800; text-transform: uppercase; background: #eef2ff; padding: 4px 12px; border-radius: 100px;">${statusLabels[status]}</span></p>
                            </div>
                            <p style="font-size: 14px; text-align: center; color: #64748b; margin-top: 40px;">If you have any questions, please reply to this email or contact our support team.</p>
                            <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #f1f5f9; text-align: center; font-size: 12px; color: #94a3b8;">
                                <p style="font-weight: 700; color: #64748b; margin-bottom: 5px;">SK Associates & Builders</p>
                                <p>Pakistan's Premier Real Estate Excellence</p>
                                <p style="margin-top: 15px;">© 2026 SK Associates. All rights reserved.</p>
                            </div>
                        </div>
                    `,
                };

                await transporter.sendMail(mailOptions);
                console.log(`Status update notification sent to ${booking.email} for status: ${status}`);
            } catch (mailError) {
                console.error('STATUS CHANGE NOTIFICATION ERROR:', mailError);
            }
        }

        // Update Property availability if status is 'sold' or 'rented'
        if (['rented', 'sold'].includes(status)) {
            try {
                const propertyAvailability = status === 'sold' ? 'Sold' : 'Rented';
                await Property.findByIdAndUpdate(booking.propertyId, { availability: propertyAvailability });
                console.log(`Property ${booking.propertyId} availability updated to ${propertyAvailability}`);
            } catch (propError) {
                console.error('PROPERTY AVAILABILITY UPDATE ERROR:', propError);
            }
        }

        return NextResponse.json({
            message: 'Booking status updated successfully',
            booking
        });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Error updating booking' }, { status: 500 });
    }
}
