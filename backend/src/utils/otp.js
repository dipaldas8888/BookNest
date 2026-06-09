const nodemailer = require("nodemailer");

// Generate a random 6-digit numeric OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via Email
const sendOTPEmail = async (recipientEmail, otp, subjectType = "verification") => {
  const isReset = subjectType === "reset";
  const subject = isReset
    ? "Reset Your BookNest Password"
    : "Your BookNest Verification Code";

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${subject}</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f9fafb;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);border:1px solid #e5e7eb;">
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#6366f1 0%,#4f46e5 100%);padding:32px 40px;text-align:center;">
                  <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">BookNest</h1>
                  <p style="margin:6px 0 0;color:#c7d2fe;font-size:13px;">Your trusted digital bookstore</p>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:40px 40px 32px;">
                  <h2 style="margin:0 0 16px;color:#111827;font-size:20px;font-weight:700;">
                    ${isReset ? "Password Reset Request" : "Confirm Your Email Address"}
                  </h2>
                  <p style="margin:0 0 8px;color:#6b7280;font-size:14px;line-height:1.7;">
                    Hi there,
                  </p>
                  <p style="margin:0 0 28px;color:#6b7280;font-size:14px;line-height:1.7;">
                    ${isReset
                      ? "We received a request to reset your BookNest password. Use the code below to continue. This code is valid for <strong>10 minutes</strong>."
                      : "Thanks for signing up! Use the verification code below to activate your BookNest account. This code is valid for <strong>10 minutes</strong>."
                    }
                  </p>

                  <!-- OTP Box -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding:0 0 28px;">
                        <div style="display:inline-block;background:#f3f4f6;border:2px dashed #6366f1;border-radius:14px;padding:24px 40px;text-align:center;">
                          <p style="margin:0 0 10px;color:#6b7280;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">Your Verification Code</p>
                          <p style="margin:0;color:#111827;font-size:42px;font-weight:900;letter-spacing:14px;font-family:'Courier New',Courier,monospace;">${otp}</p>
                        </div>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:0 0 8px;color:#ef4444;font-size:12px;font-weight:600;">
                    ⚠ Never share this code with anyone — BookNest staff will never ask for it.
                  </p>
                  <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;">
                    If you did not ${isReset ? "request a password reset" : "create a BookNest account"}, you can safely ignore this email.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background:#f9fafb;border-top:1px solid #f3f4f6;padding:20px 40px;text-align:center;">
                  <p style="margin:0;color:#9ca3af;font-size:11px;">
                    © ${new Date().getFullYear()} BookNest · This is an automated message, please do not reply.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("[OTP] EMAIL_USER or EMAIL_PASS not set in .env");
    throw new Error("Email service not configured.");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: {
      name: "BookNest",
      address: process.env.EMAIL_USER,
    },
    to: recipientEmail,
    subject,
    html: htmlContent,
    // Extra headers to improve deliverability and bypass self-send spam filters
    headers: {
      "X-Priority": "1",
      "X-Mailer": "BookNest Mailer",
      "X-Category": "transactional",
    },
    priority: "high",
  };

  const info = await transporter.sendMail(mailOptions);

  console.log(`[OTP] Email sent → To: ${recipientEmail} | MsgId: ${info.messageId} | Accepted: ${info.accepted}`);
};

module.exports = { generateOTP, sendOTPEmail };
