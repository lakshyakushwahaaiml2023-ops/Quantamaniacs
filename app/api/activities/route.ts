import { NextRequest, NextResponse } from "next/server";
import ActivityLog from "@/models/ActivityLog";
import connectDB from "@/config/db";
import { authenticate } from "@/middleware/auth";

export const GET = async (req: NextRequest) => {
  const auth = await authenticate(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    await connectDB();
    const logs = await ActivityLog.find({ userId: auth.userId })
      .sort({ timestamp: -1 })
      .limit(10);
    return NextResponse.json(logs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
