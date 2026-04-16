import nodemailer from 'nodemailer';

interface MailOptions {
    to: string;
    subject: string;
    html: string;
    from?: string;
}

export const sendEmail = async ({ to, subject, html, from }: MailOptions) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('❌ EMAIL ERROR: Missing EMAIL_USER or EMAIL_PASS in environment variables.');
        return { success: false, error: 'Missing email credentials' };
    }

    try {
        const user = process.env.EMAIL_USER.replace(/['"]/g, '').trim();
        const pass = process.env.EMAIL_PASS.replace(/\s/g, '').replace(/['"]/g, '').trim();
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: user,
                pass: pass,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: from || user,
            to: to.trim(),
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Mail sent successfully to ${to}: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error(`❌ MAIL SENDING FAILED for ${to}:`, error.message);
        if (error.code === 'EAUTH') {
            console.error('💡 TIP: This looks like an authentication error. Please check if your Google App Password is correct and active.');
        }
        return { success: false, error: error.message };
    }
};
