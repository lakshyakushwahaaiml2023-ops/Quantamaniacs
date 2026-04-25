import mongoose, { Schema, Document } from 'mongoose';

export interface ITwilioUpdate extends Document {
  eventId: string;
  newTasks: any[];
  voiceCommand: string;
  processed: boolean;
  createdAt: Date;
}

const TwilioUpdateSchema: Schema = new Schema({
  eventId: { type: String, required: true, index: true },
  newTasks: { type: Array, required: true },
  voiceCommand: { type: String },
  processed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 1800 } // Auto-delete after 30 mins
});

export default mongoose.models.TwilioUpdate || mongoose.model<ITwilioUpdate>('TwilioUpdate', TwilioUpdateSchema);
