import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Sends an email using nodemailer
 * @param {*} to - email address of recipient
 * @param {*} subject - subject of email
 * @param {*} html - html content of email
 */
export const sendMail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
    const info = await transporter.sendMail({
      from: `"Z.com" <z@gmail.com>`,
      to,
      subject,
      text
    });
    console.log('Message sent: %s', info.messageId);
  } catch (err) {
    console.log(err);
    throw new Error('Error sending email')
  }
};
