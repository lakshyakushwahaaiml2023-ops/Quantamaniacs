import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import TwilioUpdate from "@/models/TwilioUpdate";

export async function GET() {
  try {
    await connectDB();
    
    // Find the latest unprocessed update
    const update = await TwilioUpdate.findOne({ processed: false }).sort({ createdAt: -1 });
    
    if (update) {
      // Mark as processed so it's only consumed once
      update.processed = true;
      await update.save();
      
      return NextResponse.json({ 
        updateAvailable: true, 
        eventId: update.eventId, 
        newTasks: update.newTasks, 
        voiceCommand: update.voiceCommand 
      });
    }

    return NextResponse.json({ updateAvailable: false });
  } catch (error) {
    console.error("Poller Error:", error);
    return NextResponse.json({ updateAvailable: false }, { status: 500 });
  }
}
