const nodemailer = require("nodemailer");
require("dotenv").config();

const test = async () => {
  console.log("Using EMAIL_USER:", process.env.EMAIL_USER);
  console.log("Using EMAIL_PASS:", process.env.EMAIL_PASS ? "********" : "NOT SET");

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log("Transporter verification SUCCESSFUL!");

    const info = await transporter.sendMail({
      from: `"BookNest Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "BookNest Test Email",
      text: "This is a test email from BookNest. If you receive this, SMTP is working perfectly!",
    });

    console.log("Email sent successfully! MessageId:", info.messageId);
  } catch (error) {
    console.error("SMTP Error Details:", error);
  }
};

test();
