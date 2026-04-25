import mongoose, { Schema, Document } from 'mongoose';

export interface ICallSession extends Document {
  callSid?: string;
  profile: any;
  eventId: string;
  taskId: string;
  taskName: string;
  reason: string;
  createdAt: Date;
}

const CallSessionSchema: Schema = new Schema({
  callSid: { type: String, index: true },
  profile: { type: Object, required: true },
  eventId: { type: String, required: true },
  taskId: { type: String },
  taskName: { type: String, required: true },
  reason: { type: String, default: "deadline" },
  createdAt: { type: Date, default: Date.now, expires: 3600 } // Auto-delete after 1 hour
});

export default mongoose.models.CallSession || mongoose.model<ICallSession>('CallSession', CallSessionSchema);
