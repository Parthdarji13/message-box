import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
) {
  try {
    const info = await transporter.sendMail({
      from: `"Msg Box" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Msg Box — Verify Your Account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto; background:#060a0d; color:#fff; padding:2rem; border-radius:8px; border:1px solid rgba(0,255,200,.2);">

          <h1 style="color:#00ffc8; margin-bottom:0;">
            MSG<span style="color:#fff;">BOX</span>
          </h1>

          <p style="color:rgba(0,255,200,.5); font-size:12px; letter-spacing:2px;">
            Anonymous Messaging Platform
          </p>

          <hr style="border:none; border-top:1px solid rgba(0,255,200,.15); margin:24px 0;">

          <h2>Hello, ${username}! 👋</h2>

          <p style="color:#d1d5db; line-height:1.7;">
            Thank you for signing up to <strong>Msg Box</strong>.
            Please use the verification code below to verify your account.
          </p>

          <div style="background:#0b1b18; border:1px solid rgba(0,255,200,.25); border-radius:8px; padding:30px; text-align:center; margin:30px 0;">

            <p style="margin-bottom:10px; color:#00ffc8; letter-spacing:2px; font-size:12px;">
              VERIFICATION CODE
            </p>

            <h1 style="font-size:48px; letter-spacing:10px; color:#00ffc8; margin:0; font-family:monospace;">
              ${verifyCode}
            </h1>

          </div>

          <p style="color:#9ca3af;">
            This code will expire in <strong>1 hour</strong>.
          </p>

          <p style="color:#6b7280; font-size:13px;">
            If you didn't create this account, you can safely ignore this email.
          </p>

          <hr style="border:none; border-top:1px solid rgba(255,255,255,.08); margin:24px 0;">

          <p style="text-align:center; color:#6b7280; font-size:12px;">
            © 2026 Msg Box. All rights reserved.
          </p>

        </div>
      `,
    });

    console.log("\n========================================");
    console.log("✅ EMAIL SENT SUCCESSFULLY");
    console.log("Accepted :", info.accepted);
    console.log("Rejected :", info.rejected);
    console.log("Response :", info.response);
    console.log("MessageID:", info.messageId);
    console.log("========================================\n");

    return {
      success: true,
      message: "Verification email sent successfully!",
    };
  } catch (error) {
    console.error("\n========================================");
    console.error("❌ GMAIL EMAIL ERROR");
    console.error(error);
    console.error("========================================\n");

    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}