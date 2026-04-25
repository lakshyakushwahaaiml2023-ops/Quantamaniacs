import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    if (!data.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Upsert the user based on name for this demo (ideally use a unique ID like email or Clerk ID)
    const user = await User.findOneAndUpdate(
      { name: data.name },
      { 
        $set: {
          ...data,
          updatedAt: new Date()
        }
      },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("Sync Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
    try {
      await connectDB();
      const { searchParams } = new URL(req.url);
      const name = searchParams.get("name");
  
      if (!name) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
      }
  
      const user = await User.findOne({ name });
      
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
  
      return NextResponse.json({ success: true, user });
    } catch (error: any) {
      console.error("Fetch Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
