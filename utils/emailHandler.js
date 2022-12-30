import nodemailer from 'nodemailer'
import logger from './loggerController.js'
const email = 'paredcecilio@outlook.com'

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async (subject, html) => {
  const opts = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: html,
  };

  try {
    await transporter.sendMail(opts);
  } catch (error) {
    logger.error("error", error);
  }
};
export default sendMail;
