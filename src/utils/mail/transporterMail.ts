import nodemailer from 'nodemailer';
import dotenv from 'dotenv' 
dotenv.config();

const transporter = nodemailer.createTransport({
    url: `smtps://${process.env.EMAIL_SENDER}:${process.env.EMAIL_SENDER_PASSWORD}@${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT}`,
    secure: true,
    tls: {
        rejectUnauthorized: false, // Pode ser necessário em alguns casos
    }
});

export default transporter;