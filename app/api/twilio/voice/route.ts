import { NextResponse } from "next/server";
import twilio from "twilio";
import connectDB from "@/config/db";
import CallSession from "@/models/CallSession";

const VoiceResponse = twilio.twiml.VoiceResponse;

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const eventId = url.searchParams.get("eventId") || "unknown";
    const taskName = url.searchParams.get("taskName") || "your task";
    const reason = url.searchParams.get("reason") || "deadline";

    // Load latest context from MongoDB
    await connectDB();
    const session = await CallSession.findOne({ eventId }).sort({ createdAt: -1 });
    let isCompleted = false;
    let taskId = "";
    
    if (session) {
      taskId = session.taskId;
      // Check if this specific task is in the completed list for the specific event
      const event = session.profile.events.find((e: any) => e.id === session.eventId);
      if (event && event.completedTasks) {
        isCompleted = event.completedTasks.includes(taskId);
      }
    }

    const twiml = new VoiceResponse();
    twiml.pause({ length: 1 });

    const gather = twiml.gather({
      input: ["speech"],
      speechModel: "numbers_and_commands",
      speechTimeout: "auto",
      action: `/api/twilio/process?eventId=${encodeURIComponent(eventId)}`,
      method: "POST",
    });

    if (isCompleted) {
      gather.say(`Hi there! I see you've already completed your task: ${taskName}. That is fantastic progress. Since you're ahead of schedule, do you want to start your next task early, or take a well deserved break? Use your voice to tell me what to do.`);
    } else if (reason === "manual") {
      gather.say(`Hi study buddy! You've reached your agentic voice interface. I'm monitoring your progress on ${taskName}. You currently have this task pending. Would you like to mark it as done, or shift your schedule?`);
    } else {
      gather.say(`Hi. You are running slightly behind on your task: ${taskName}. Should I push your schedule back, or do you want to skip this task? Please say your command now.`);
    }

    // If they don't say anything
    twiml.say("I didn't hear a command. Please update your dashboard manually if needed. Goodbye.");

    return new NextResponse(twiml.toString(), {
      status: 200,
      headers: {
        "Content-Type": "text/xml",
      },
    });
  } catch (error: any) {
    console.error("Twilio Voice Webhook Error:", error);
    return new NextResponse("<Response><Say>An internal error occurred. Please check your dashboard.</Say></Response>", {
      status: 500,
      headers: { "Content-Type": "text/xml" },
    });
  }
}
