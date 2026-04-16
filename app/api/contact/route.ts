
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Contact from '@/models/Contact';
import { sendEmail } from '@/lib/mail';

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
            const adminEmail = 'amnapersonal4@gmail.com';
            
            // 1. Notify Admin
            await sendEmail({
                to: adminEmail,
                subject: `📩 New Contact Inquiry: ${subject}`,
                html: `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
                        <div style="text-align: center; margin-bottom: 25px;">
                            <h1 style="color: #4f46e5; margin: 0; font-size: 24px;">New Contact Message</h1>
                            <p style="color: #64748b; font-size: 14px;">A visitor has sent a message through the contact form.</p>
                        </div>
                        
                        <div style="background-color: #f8fafc; padding: 25px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #f1f5f9;">
                            <h3 style="margin-top: 0; color: #334155; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 15px;">Inquiry Details</h3>
                            <p style="margin: 8px 0;"><strong>Subject:</strong> ${subject}</p>
                            <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
                            <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #4f46e5; text-decoration: none;">${email}</a></p>
                            <p style="margin: 8px 0;"><strong>Phone:</strong> <a href="tel:${phone}" style="color: #4f46e5; text-decoration: none;">${phone}</a></p>
                            <div style="margin-top: 20px;">
                                <p style="margin-bottom: 8px;"><strong>Message:</strong></p>
                                <div style="font-style: italic; color: #475569; padding: 12px; background-color: #ffffff; border-left: 4px solid #4f46e5; border-radius: 4px;">
                                    "${message}"
                                </div>
                            </div>
                        </div>

                        <div style="text-align: center; margin-top: 30px;">
                            <p style="font-size: 13px; color: #94a3b8;">
                                This is an automated notification from SK Associates Admin System.
                            </p>
                        </div>
                    </div>
                `
            });

            // 2. Send Auto-response to User
            await sendEmail({
                to: email,
                subject: `We've received your message - SK Associates`,
                html: `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
                        <div style="text-align: center; margin-bottom: 25px;">
                            <h1 style="color: #4f46e5; margin: 0; font-size: 24px;">Message Received</h1>
                            <p style="color: #64748b; font-size: 14px;">Thank you for reaching out to SK Associates & Builders.</p>
                        </div>

                        <p>Hello <strong>${name}</strong>,</p>
                        <p>We've successfully received your message regarding <strong>"${subject}"</strong>. Our team is dedicated to providing prompt and professional service, and we will get back to you shortly.</p>
                        
                        <p>In the meantime, if you have any urgent real estate needs, you can contact us directly via our hotline or visit our office.</p>

                        <div style="border-top: 1px solid #e2e8f0; padding-top: 25px; margin-top: 30px; text-align: center;">
                            <p style="font-weight: bold; margin: 0; color: #4f46e5;">SK Associates & Builders</p>
                            <p style="font-size: 12px; color: #94a3b8; margin-top: 5px;">Pakistan's Premier Real Estate & Construction Solutions</p>
                        </div>
                    </div>
                `
            });

        } catch (mailError) {
            console.error('CONTACT MAIL NOTIFICATION ERROR:', mailError);
        }

        return NextResponse.json({ message: 'Your message has been sent successfully.', contact }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Error processing your request' }, { status: 500 });
    }
}
