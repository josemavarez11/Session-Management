import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config({path: 'credentials.env'});

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth:{
        user: process.env.MAIL, 
        pass: process.env.MAILPASS
    }
})

transporter.verify().then(() => console.log('ready for send email'))