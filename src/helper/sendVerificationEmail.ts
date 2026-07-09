import resend from "@/lib/resend";
import VerificationEmail from "@/email/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    console.log("========== EMAIL DEBUG ==========");
    console.log("To:", email);
    console.log("OTP:", verifyCode);

    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify your email address",
      react: VerificationEmail({
        username,
        otp: verifyCode,
      }),
    });

    console.log("RESEND RESULT:", JSON.stringify(result, null, 2));

    return {
      success: true,
      message: "Verification email sent successfully.",
    };
  } catch (error) {
    console.error("RESEND ERROR:", error);

    return {
      success: false,
      message: "Failed to send verification email.",
    };
  }
}