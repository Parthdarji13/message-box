import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth"; // Custom session user type

// POST: Update message acceptance status
export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({ success: false, message: "Not Authenticated" }, { status: 401 });
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        );

        if (!updatedUser) {
            return Response.json({ success: false, message: "Failed to update status" }, { status: 401 });
        }

        return Response.json({ 
            success: true, 
            message: "Message acceptance status updated successfully",
            updatedUser 
        }, { status: 200 });

    } catch (error) {
        console.log("Failed to update status", error);
        return Response.json({ success: false, message: "Error updating status" }, { status: 500 });
    }
}

// GET: Fetch current acceptance status
export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({ success: false, message: "Not Authenticated" }, { status: 401 });
    }

    try {
        const foundUser = await UserModel.findById(user._id);
        if (!foundUser) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return Response.json({ 
            success: true, 
            isAcceptingMessages: foundUser.isAcceptingMessage 
        }, { status: 200 });

    } catch (error) {
        return Response.json({ success: false, message: "Error fetching status" }, { status: 500 });
    }
}