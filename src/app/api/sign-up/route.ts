import dbConnect from "@/src/lib/dbConnect";

import UserModel from "@/src/model/user";

import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/src/helper/sendVerificationEmail";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await req.json();

        const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });

        if (existingUser) {
            return Response.json(
                { success: false, message: "User already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        await UserModel.create({
            username,
            email,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: new Date(Date.now() + 10 * 60 * 1000),
            isVerified: false,
            isAcceptingMessage: true,
        });

        await sendVerificationEmail(email, username, verifyCode);

        return Response.json(
            { success: true, message: "User created successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error parsing request body:", error);
        return Response.json(
            { success: false, message: "Invalid request body" },
            { status: 400 }
        );
    }
}