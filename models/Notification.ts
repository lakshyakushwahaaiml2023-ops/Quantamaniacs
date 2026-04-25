import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  readStatus: boolean;
  type: 'reminder' | 'deadline' | 'suggestion' | 'alert';
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  readStatus: { type: Boolean, default: false },
  type: { 
    type: String, 
    enum: ['reminder', 'deadline', 'suggestion', 'alert'],
    default: 'alert'
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
