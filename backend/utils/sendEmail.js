const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text, html) => {
    console.log(`[Email] Attempting to send email to: ${to}`);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('[Email] Error: EMAIL_USER or EMAIL_PASS environment variables are missing.');
        return false;
    }

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[Email] Success! Message ID: ${info.messageId}`);
        console.log(`[Email] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        return true;
    } catch (error) {
        console.error('[Email] Failed to send email.');
        console.error(error);
        return false;
    }
};

module.exports = sendEmail;
