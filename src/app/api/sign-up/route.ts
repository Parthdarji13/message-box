import dbConnect from "@/lib/dbConnect";

import UserModel from "@/model/user";

import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await req.json();

    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return Response.json(
        { success: false, message: "User already exists" },
        { status: 409 },
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
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Signup error:", error);
    const message = error instanceof Error ? error.message : "Invalid request body";
    return Response.json(
      { success: false, message },
      { status: 400 },
    );
  }
}
