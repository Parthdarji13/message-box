import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        { status: 401 }
      );
    }

    const user = session.user as User;

    const userId = new mongoose.Types.ObjectId(user._id);

    const userWithMessages = await UserModel.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $unwind: {
          path: "$messages",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
      {
        $group: {
          _id: "$_id",
          messages: {
            $push: "$messages",
          },
        },
      },
    ]);

    // User exists but has no messages
    if (!userWithMessages.length) {
      return Response.json(
        {
          success: true,
          messages: [],
        },
        { status: 200 }
      );
    }

    // Remove null values if there are no messages
    const messages = userWithMessages[0].messages.filter(
      (message: any) => message !== null
    );

    return Response.json(
      {
        success: true,
        messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET MESSAGES ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Error fetching messages",
      },
      { status: 500 }
    );
  }
}