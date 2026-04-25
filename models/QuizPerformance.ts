import mongoose, { Schema, Document } from 'mongoose';

export interface IQuizPerformance extends Document {
  userId: mongoose.Types.ObjectId;
  subject: string;
  topic: string;
  score: number;
  totalQuestions: number;
  weakAreas: string[];
  attemptedAt: Date;
}

const QuizPerformanceSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  weakAreas: [{ type: String }],
  attemptedAt: { type: Date, default: Date.now }
});

export default mongoose.models.QuizPerformance || mongoose.model<IQuizPerformance>('QuizPerformance', QuizPerformanceSchema);
