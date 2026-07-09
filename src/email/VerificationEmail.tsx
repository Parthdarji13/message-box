import * as React from "react";

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
    return (
        <div style={{
            fontFamily: "Arial, sans-serif",
            maxWidth: "600px",
            margin: "0 auto",
            padding: "20px",
            backgroundColor: "#f9f9f9",
        }}>
            {/* Header */}
            <div style={{
                backgroundColor: "#1E3A8A",
                padding: "20px",
                borderRadius: "8px 8px 0 0",
                textAlign: "center",
            }}>
                <h1 style={{ color: "white", margin: 0 }}>MsgBox</h1>
            </div>

            {/* Body */}
            <div style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "0 0 8px 8px",
            }}>
                <h2 style={{ color: "#111827" }}>Hello, {username}! 👋</h2>

                <p style={{ color: "#6B7280", fontSize: "16px" }}>
                    Thank you for signing up! Please use the verification code below to verify your account.
                </p>

                {/* OTP Box */}
                <div style={{
                    backgroundColor: "#F3F4F6",
                    padding: "20px",
                    borderRadius: "8px",
                    textAlign: "center",
                    margin: "24px 0",
                }}>
                    <p style={{ color: "#6B7280", margin: "0 0 8px 0" }}>
                        Your verification code:
                    </p>
                    <h1 style={{
                        color: "#1E3A8A",
                        fontSize: "48px",
                        letterSpacing: "8px",
                        margin: 0,
                    }}>
                        {otp}
                    </h1>
                </div>

                <p style={{ color: "#6B7280", fontSize: "14px" }}>
                    ⚠️ This code will expire in <strong>10 minutes.</strong>
                </p>

                <p style={{ color: "#6B7280", fontSize: "14px" }}>
                    If you did not sign up for MsgBox, please ignore this email.
                </p>
            </div>

            {/* Footer */}
            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <p style={{ color: "#9CA3AF", fontSize: "12px" }}>
                    &copy; 2025 MsgBox. All rights reserved.
                </p>
            </div>
        </div>
    );
}