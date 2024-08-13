const nodemailer = require("nodemailer");

async function sendEmail(options) {
    const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        message: options.message
    }

    await transport.sendMail(mailOptions);
}

module.exports = {sendEmail};