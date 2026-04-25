import mongoose, { Schema, Document } from 'mongoose';

export interface ICareerRoadmap extends Document {
  userId: mongoose.Types.ObjectId;
  targetRole: string;
  targetPackage?: string;
  completedSkills: string[];
  pendingSkills: string[];
  roadmapProgress: number; // percentage
  updatedAt: Date;
}

const CareerRoadmapSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  targetRole: { type: String, required: true },
  targetPackage: { type: String },
  completedSkills: [{ type: String }],
  pendingSkills: [{ type: String }],
  roadmapProgress: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.CareerRoadmap || mongoose.model<ICareerRoadmap>('CareerRoadmap', CareerRoadmapSchema);
