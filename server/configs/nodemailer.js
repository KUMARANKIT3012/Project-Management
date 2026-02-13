import nodemailer from 'nodemailer';

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER, // generated ethereal user
        pass: process.env.SMTP_PASS, // generated ethereal password
    },
});

const sendEmail = async ({to, subject, body}) => {
    const response = await transporter.sendMail({
    from: process.env.SENDER_EMAIL, // sender address
    to,
    subject,
    html: body, 
    });
    return response;
}


export default sendEmail;


