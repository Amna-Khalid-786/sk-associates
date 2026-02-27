
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Contact from '@/models/Contact';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { name, email, phone, subject, message } = body;

        if (!name || !email || !phone || !subject || !message) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const contact = await Contact.create({
            name,
            email,
            phone,
            subject,
            message
        });

        // Notify Admin of new contact inquiry
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
            const mailOptions = {
                from: `"SK Associates Contact" <${process.env.EMAIL_USER}>`,
                to: adminEmail,
                subject: `New Contact Inquiry: ${subject}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                        <h2 style="color: #4f46e5; text-align: center;">New Contact Inquiry</h2>
                        <div style="background-color: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                            <p><strong>Subject:</strong> ${subject}</p>
                            <p><strong>Name:</strong> ${name}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Phone:</strong> ${phone}</p>
                            <p><strong>Message:</strong></p>
                            <p style="font-style: italic; color: #475569;">"${message}"</p>
                        </div>
                    </div>
                `,
            };

            await transporter.sendMail(mailOptions);
        } catch (mailError) {
            console.error('CONTACT MAIL NOTIFICATION ERROR:', mailError);
        }

        return NextResponse.json({ message: 'Your message has been sent successfully.', contact }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Error processing your request' }, { status: 500 });
    }
}
