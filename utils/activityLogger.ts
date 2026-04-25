import ActivityLog from "@/models/ActivityLog";
import connectDB from "@/config/db";

export const logActivity = async (userId: string, activityType: string, description: string) => {
  try {
    await connectDB();
    await ActivityLog.create({
      userId,
      activityType,
      description,
      timestamp: new Date()
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};
