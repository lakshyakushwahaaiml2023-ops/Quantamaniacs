import { NextRequest, NextResponse } from "next/server";
import Task from "@/models/Task";
import connectDB from "@/config/db";
import { authenticate } from "@/middleware/auth";

export const getTasks = async (req: NextRequest) => {
  const auth = await authenticate(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    await connectDB();
    const tasks = await Task.find({ userId: auth.userId }).sort({ dueDate: 1 });
    return NextResponse.json(tasks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const createTask = async (req: NextRequest) => {
  const auth = await authenticate(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    await connectDB();
    const data = await req.json();
    const task = await Task.create({ ...data, userId: auth.userId });
    return NextResponse.json(task);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const updateTask = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const auth = await authenticate(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    await connectDB();
    const data = await req.json();
    const task = await Task.findOneAndUpdate(
      { _id: params.id, userId: auth.userId },
      data,
      { new: true }
    );
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
    return NextResponse.json(task);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const deleteTask = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const auth = await authenticate(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    await connectDB();
    const task = await Task.findOneAndDelete({ _id: params.id, userId: auth.userId });
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
    return NextResponse.json({ message: "Task deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
