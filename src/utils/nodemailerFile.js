import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();
// Function to send the reset email
export const sendResetEmail = async (email, token) => {
  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // generated ethereal user
      pass: process.env.SMTP_PASS, // generated ethereal password
    },
  });

  // Compose the email
  const mailOptions = {
    from: '"SecureLink 360" <noreply@SecureLink 360.com>',
    to: email,
    subject: "Password Reset Request",
    text: `You requested for a password reset. Please use the following token to reset your password: ${token}`,
    html: `<p>You requested for a password reset. Please use the following token to reset your password:</p>
           <p><b>${token}</b></p>
           <p>This token is valid for 1 hour.</p>`,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};
