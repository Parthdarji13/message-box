import resend from '@/src/lib/resend';

import VerificationEmail from '@/email/VerificationEmail';  

import { ApiResponse } from '@/src/types/ApiResponse';

export async function sendVerificationEmail(
    email: string,
    Username: string, 
    verifyCode: string
): Promise<ApiResponse> {
    try{
        await resend.emails.send({ 
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verify your email address',
            react: VerificationEmail({ username: Username, otp: verifyCode })
});

         return {
            success: true,
            message: "Verification email sent successfully."
        };
    } catch (emailError) {
        console.error("Error sending verification email:", emailError);
        return {
            success: false,
            message: "Failed to send verification email."
        };
    }
}