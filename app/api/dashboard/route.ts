import { NextRequest, NextResponse } from "next/server";
import Task from "@/models/Task";
import ChatHistory from "@/models/ChatHistory";
import ActivityLog from "@/models/ActivityLog";
import QuizPerformance from "@/models/QuizPerformance";
import User from "@/models/User";
import connectDB from "@/config/db";
import { authenticate } from "@/middleware/auth";

export const GET = async (req: NextRequest) => {
  const auth = await authenticate(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    await connectDB();
    const userId = auth.userId;

    const [user, lastChat, recentActivities, tasks, quizPerformance] = await Promise.all([
      User.findById(userId),
      ChatHistory.findOne({ userId }).sort({ updatedAt: -1 }),
      ActivityLog.find({ userId }).sort({ timestamp: -1 }).limit(5),
      Task.find({ userId, completed: false }).sort({ dueDate: 1 }).limit(3),
      QuizPerformance.find({ userId }).sort({ attemptedAt: -1 }).limit(5)
    ]);

    // Calculate weak topics from quiz performance
    const weakTopics = Array.from(new Set(quizPerformance.flatMap(q => q.weakAreas))).slice(0, 5);

    return NextResponse.json({
      profile: {
        name: user?.name,
        streak: 5, // Mock streak for now, can be calculated from activity logs
        recommendedNextStep: tasks.length > 0 ? `Complete task: ${tasks[0].title}` : "Take a new quiz on a weak topic",
        weakTopics
      },
      lastChat: lastChat ? { id: lastChat._id, title: lastChat.title } : null,
      recentActivities,
      pendingTasks: tasks
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
