
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import Property from '@/models/Property';
import { sendEmail } from '@/lib/mail';
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

        if (property.availability === 'Sold' || property.availability === 'Rented') {
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

            // 1. Notify Admin of new booking
            await sendEmail({
                to: adminEmail,
                subject: `🔔 New Booking Request: ${propertyTitle} from ${name}`,
                html: `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
                        <div style="text-align: center; margin-bottom: 25px;">
                            <h1 style="color: #4f46e5; margin: 0; font-size: 24px;">New Discovery Alert</h1>
                            <p style="color: #64748b; font-size: 14px;">A new property inquiry has been received through the website.</p>
                        </div>
                        
                        <div style="background-color: #f8fafc; padding: 25px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #f1f5f9;">
                            <h3 style="margin-top: 0; color: #334155; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 15px;">Inquiry Details</h3>
                            <p style="margin: 8px 0;"><strong>Property:</strong> <span style="color: #4f46e5;">${propertyTitle}</span></p>
                            <p style="margin: 8px 0;"><strong>Client Name:</strong> ${name}</p>
                            <p style="margin: 8px 0;"><strong>Client Email:</strong> <a href="mailto:${email}" style="color: #4f46e5; text-decoration: none;">${email}</a></p>
                            <p style="margin: 8px 0;"><strong>Client Phone:</strong> <a href="tel:${phone}" style="color: #4f46e5; text-decoration: none;">${phone}</a></p>
                            <div style="margin-top: 20px;">
                                <p style="margin-bottom: 8px;"><strong>Message:</strong></p>
                                <div style="font-style: italic; color: #475569; padding: 12px; background-color: #ffffff; border-left: 4px solid #4f46e5; border-radius: 4px;">
                                    "${message}"
                                </div>
                            </div>
                        </div>

                        <div style="text-align: center; margin-top: 30px; gap: 15px;">
                            <a href="${whatsappLink}" style="display: inline-block; background-color: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; margin-bottom: 15px;">
                                Quick Response via WhatsApp
                            </a>
                            <p style="font-size: 13px; color: #94a3b8; margin-top: 20px;">
                                This is an automated notification from SK Associates Admin System.
                            </p>
                        </div>
                    </div>
                `
            });

            // 2. Send Confirmation Email to Client (Auto-response)
            await sendEmail({
                to: email,
                subject: `Booking Confirmed: We've received your request for ${propertyTitle}`,
                html: `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
                        <div style="text-align: center; margin-bottom: 25px;">
                            <h1 style="color: #4f46e5; margin: 0; font-size: 24px;">Thank You for Choosing SK Associates</h1>
                            <p style="color: #64748b; font-size: 14px;">We have received your booking request and our team is already reviewing it.</p>
                        </div>

                        <p>Hello <strong>${name}</strong>,</p>
                        <p>Your inquiry for <strong>${propertyTitle}</strong> has been successfully submitted. We understand that finding the right property is important, and we'll get back to you as soon as possible (usually within a few hours).</p>
                        
                        <div style="background-color: #f8fafc; padding: 25px; border-radius: 10px; margin: 25px 0; border: 1px solid #f1f5f9;">
                            <h3 style="margin-top: 0; color: #334155; font-size: 16px;">Booking Summary:</h3>
                            <p style="margin: 8px 0;"><strong>Property:</strong> ${propertyTitle}</p>
                            <p style="margin: 8px 0;"><strong>Inquiry Date:</strong> ${new Date().toLocaleDateString()}</p>
                        </div>

                        <p style="margin-bottom: 25px;">While you wait, feel free to browse more exclusive properties on our website.</p>

                        <div style="border-top: 1px solid #e2e8f0; padding-top: 25px; text-align: center;">
                            <p style="font-weight: bold; margin: 0; color: #4f46e5;">SK Associates & Builders</p>
                            <p style="font-size: 12px; color: #94a3b8; margin-top: 5px;">Pakistan's Premier Real Estate & Construction Solutions</p>
                        </div>
                    </div>
                `
            });

        } catch (mailError) {
            console.error('MAIL NOTIFICATION ERROR:', mailError);
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
