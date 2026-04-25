import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  stream?: string;
  year?: string;
  semester?: string;
  currentSubjects?: string[];
  weakSubjects?: string[];
  strongSubjects?: string[];
  preferredLearningStyle?: 'Visual' | 'Notes' | 'MCQ' | 'Videos' | 'Examples';
  dailyStudyTime?: string;
  placementGoal?: string;
  careerPath?: 'higher studies' | 'job' | 'startup' | 'govt exam';
  dreamCompany?: string;
  targetPackage?: string;
  languagePreference?: string;
  deviceType?: 'mobile' | 'laptop' | 'low-end device';
  internetAvailability?: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  stream: { type: String },
  year: { type: String },
  semester: { type: String },
  currentSubjects: [{ type: String }],
  weakSubjects: [{ type: String }],
  strongSubjects: [{ type: String }],
  preferredLearningStyle: { 
    type: String, 
    enum: ['Visual', 'Notes', 'MCQ', 'Videos', 'Examples'],
    default: 'Notes'
  },
  dailyStudyTime: { type: String },
  placementGoal: { type: String },
  careerPath: { 
    type: String, 
    enum: ['higher studies', 'job', 'startup', 'govt exam'] 
  },
  dreamCompany: { type: String },
  targetPackage: { type: String },
  languagePreference: { type: String, default: 'English' },
  deviceType: { 
    type: String, 
    enum: ['mobile', 'laptop', 'low-end device'],
    default: 'laptop'
  },
  internetAvailability: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
