import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async (to, subject, html) => {
  try {
    const user = process.env.SMTP_EMAIL;
    // Gmail App Password is often copied with spaces: "abcd efgh ijkl mnop".
    // Nodemailer expects the raw password, so remove whitespace.
    const pass = (process.env.SMTP_PASSWORD || "").replace(/\s+/g, "");

    if (!user || !pass) {
      console.log(
        "Email error: Missing SMTP_EMAIL/SMTP_PASSWORD in .env (use a Gmail App Password)"
      );
      return false;
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"Lab Platform" <${user}>`,
      to,
      subject,
      html,
    });

    console.log(`Email sent to ${to}`);
    return true;
  } catch (error) {
    console.log("Email error:", error);
    return false;
  }
};