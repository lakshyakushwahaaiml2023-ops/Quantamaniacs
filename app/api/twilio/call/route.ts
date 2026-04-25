import { NextResponse } from "next/server";
import twilio from "twilio";
import connectDB from "@/config/db";
import CallSession from "@/models/CallSession";

export async function POST(req: Request) {
  try {
    const { phoneNumber, taskId, eventId, taskName, profile, reason = "deadline" } = await req.json();

    if (!phoneNumber || !eventId || !profile) {
      return NextResponse.json({ error: "Missing required call data." }, { status: 400 });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !twilioNumber) {
      return NextResponse.json({ error: "Twilio credentials missing" }, { status: 500 });
    }

    // Save context for the webhook to use in MongoDB
    await connectDB();
    const session = await CallSession.create({
      profile,
      eventId,
      taskId,
      taskName,
      reason
    });

    const client = twilio(accountSid, authToken);

    // Twilio needs a public URL to talk to our backend
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      console.error("Missing NEXT_PUBLIC_BASE_URL for Twilio Webhooks!");
      return NextResponse.json({ error: "Missing NEXT_PUBLIC_BASE_URL" }, { status: 500 });
    }

    const webhookUrl = `${baseUrl}/api/twilio/voice?eventId=${encodeURIComponent(eventId)}&taskName=${encodeURIComponent(taskName)}&reason=${encodeURIComponent(reason)}`;

    const call = await client.calls.create({
      url: webhookUrl,
      to: phoneNumber,
      from: twilioNumber,
    });

    return NextResponse.json({ success: true, callSid: call.sid });
  } catch (error: any) {
    console.error("Twilio Call Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
