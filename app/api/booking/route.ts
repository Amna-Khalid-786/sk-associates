
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import Property from '@/models/Property';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        const { name, email, phone, propertyId, propertyTitle, message } = body;

        if (!name || !email || !phone || !propertyId || !propertyTitle || !message) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        const property = await Property.findById(propertyId);
        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        if (property.availability === 'Sold' || property.availability === 'Reserved') {
            return NextResponse.json(
                {
                    error: `Sorry for the inconvenience, this property is already ${property.availability.toLowerCase()}.`,
                    status: property.availability
                },
                { status: 400 }
            );
        }

        const booking = await Booking.create({
            name,
            email,
            phone,
            propertyId,
            propertyTitle,
            message,
        });

        // Send Notifications
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: parseInt(process.env.EMAIL_PORT || '587'),
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const adminEmail = 'amnapersonal4@gmail.com';
            const adminWhatsApp = '923364695525';

            // Professional WhatsApp Template
            const whatsappMsg = `*NEW PROPERTY INQUIRY - SK ASSOCIATES*%0A%0A` +
                `*Property:* ${encodeURIComponent(propertyTitle)}%0A` +
                `*Client:* ${encodeURIComponent(name)}%0A` +
                `*Phone:* ${encodeURIComponent(phone)}%0A` +
                `*Email:* ${encodeURIComponent(email)}%0A%0A` +
                `*Client Message:*%0A_"${encodeURIComponent(message)}_"%0A%0A` +
                `*Action:* Please review this inquiry in the admin dashboard and follow up with the client.`;

            const whatsappLink = `https://wa.me/${adminWhatsApp}?text=${whatsappMsg}`;

            const mailOptions = {
                from: `"SK Associates Booking" <${process.env.EMAIL_USER}>`,
                to: adminEmail,
                subject: `New Booking Request: ${propertyTitle}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                        <h2 style="color: #4f46e5; text-align: center;">New Booking Alert</h2>
                        <div style="background-color: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                            <p><strong>Property:</strong> ${propertyTitle}</p>
                            <p><strong>Client Name:</strong> ${name}</p>
                            <p><strong>Client Email:</strong> ${email}</p>
                            <p><strong>Client Phone:</strong> ${phone}</p>
                            <p><strong>Message:</strong></p>
                            <p style="font-style: italic; color: #475569;">"${message}"</p>
                        </div>
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="${whatsappLink}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">
                                Follow up on WhatsApp
                            </a>
                        </div>
                        <p style="font-size: 14px; text-align: center; color: #64748b; margin-top: 20px;">
                            Admin Alert: Check your dashboard for more details.
                        </p>
                    </div>
                `,
            };

            await transporter.sendMail(mailOptions);
            console.log(`Booking email sent to admin: ${adminEmail}`);

            // Send Confirmation Email to Client
            const clientMailOptions = {
                from: `"SK Associates" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: `Booking Confirmation - ${propertyTitle}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                        <h2 style="color: #4f46e5; text-align: center;">Thank You for Choosing SK Associates</h2>
                        <p>Hello ${name},</p>
                        <p>We have received your booking request for <strong>${propertyTitle}</strong>. Our team will contact you shortly to discuss further details.</p>
                        <div style="background-color: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #e2e8f0;">
                            <h3 style="margin-top: 0; color: #1e293b;">Booking Details:</h3>
                            <p><strong>Property:</strong> ${propertyTitle}</p>
                            <p><strong>Your Message:</strong> ${message}</p>
                        </div>
                        <p>If you have any urgent queries, feel free to reply to this email.</p>
                        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                        <p style="font-size: 12px; color: #64748b; text-align: center;">
                            SK Associates & Builders | Pakistan's Premier Real Estate
                        </p>
                    </div>
                `,
            };

            await transporter.sendMail(clientMailOptions);
            console.log(`Confirmation email sent to client: ${email}`);

        } catch (mailError) {
            console.error('MAIL NOTIFICATION ERROR:', mailError);
            // We don't return error to user if only email fails after DB success
        }

        return NextResponse.json(
            { message: 'Booking submitted successfully', booking },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Booking Error:', error);
        return NextResponse.json(
            { error: error.message || 'Something went wrong while processing your booking' },
            { status: 500 }
        );
    }
}
