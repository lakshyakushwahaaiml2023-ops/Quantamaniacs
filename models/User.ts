import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  id: string;
  name: string;
  date: string;
  syllabus: string;
  phoneNumber?: string;
  plan?: any;
  completedTasks?: string[];
  chatHistory?: any[];
}

export interface IUser extends Document {
  clerkId?: string; // For future auth integration
  email?: string;
  name: string;
  studyLevel: string;
  school: string;
  course: string;
  stream: string;
  branch: string;
  year: string;
  semester: string;
  streak: number;
  weakTopics: string[];
  recommendedNextStep: string;
  careerGoal: string;
  targetSalary: string;
  skills: string[];
  skillLevel: string;
  learningStyle: string;
  studyTime: string;
  language: string;
  access: string;
  interestedIn: string[];
  biggestProblem: string[];
  events: any[]; // Changed to any[] for flexibility during hackathon
  activityLogs: any[];
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, sparse: true },
  studyLevel: { type: String },
  school: { type: String },
  course: { type: String },
  stream: { type: String },
  branch: { type: String },
  year: { type: String },
  semester: { type: String },
  streak: { type: Number, default: 0 },
  weakTopics: [{ type: String }],
  recommendedNextStep: { type: String, default: "Complete your onboarding" },
  careerGoal: { type: String },
  targetSalary: { type: String },
  skills: [{ type: String }],
  skillLevel: { type: String },
  learningStyle: { type: String },
  studyTime: { type: String },
  language: { type: String },
  access: { type: String },
  interestedIn: [{ type: String }],
  biggestProblem: [{ type: String }],
  events: { type: Array, default: [] },
  activityLogs: { type: Array, default: [] },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
