import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/user";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, content } = await request.json();

    if (!username || !content) {
      return Response.json(
        {
          success: false,
          message: "Username and content are required.",
        },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    // Make sure this matches your schema
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages.",
        },
        { status: 403 }
      );
    }

    const newMessage: Message = {
      content,
      createdAt: new Date(),
    } as Message;

    user.messages.push(newMessage);

    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}