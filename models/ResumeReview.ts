import mongoose, { Schema, Document } from 'mongoose';

export interface IResumeReview extends Document {
  userId: mongoose.Types.ObjectId;
  resumeUrl: string;
  atsScore: number;
  suggestions: string[];
  uploadedAt: Date;
}

const ResumeReviewSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  resumeUrl: { type: String, required: true },
  atsScore: { type: Number, required: true },
  suggestions: [{ type: String }],
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.models.ResumeReview || mongoose.model<IResumeReview>('ResumeReview', ResumeReviewSchema);
