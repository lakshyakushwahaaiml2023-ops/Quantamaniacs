import { NextRequest, NextResponse } from "next/server";
import ChatHistory from "@/models/ChatHistory";
import connectDB from "@/config/db";
import { authenticate } from "@/middleware/auth";

export const getConversations = async (req: NextRequest) => {
  const auth = await authenticate(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    await connectDB();
    const conversations = await ChatHistory.find({ userId: auth.userId })
      .select("title updatedAt")
      .sort({ updatedAt: -1 });
    return NextResponse.json(conversations);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const getConversationById = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const auth = await authenticate(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    await connectDB();
    const conversation = await ChatHistory.findOne({ _id: params.id, userId: auth.userId });
    if (!conversation) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    return NextResponse.json(conversation);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const saveMessage = async (req: NextRequest) => {
  const auth = await authenticate(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    await connectDB();
    const { conversationId, title, role, content } = await req.json();

    let conversation;
    if (conversationId) {
      conversation = await ChatHistory.findOne({ _id: conversationId, userId: auth.userId });
    }

    if (!conversation) {
      conversation = await ChatHistory.create({
        userId: auth.userId,
        title: title || content.substring(0, 30) + "...",
        messages: [{ role, content }]
      });
    } else {
      conversation.messages.push({ role, content });
      await conversation.save();
    }

    return NextResponse.json(conversation);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
