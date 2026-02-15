import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, body }) => {
  // Create transporter INSIDE function (required for Vercel)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const response = await transporter.sendMail({
    from: `"Ankit Kumar" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html: body,
  });

  return response;
};

export default sendEmail;
