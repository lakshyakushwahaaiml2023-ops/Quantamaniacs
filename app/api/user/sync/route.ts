import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const rawData = await req.json();

    if (!rawData.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Split data into User-related and Profile-related
    // For this demo, we use the name as the unique identifier
    
    const userUpdate = {
      name: rawData.name,
      email: rawData.email,
      avatarUrl: rawData.avatarUrl,
      clerkId: rawData.clerkId,
    };

    const profileUpdate = {
      studyLevel: rawData.studyLevel,
      school: rawData.school,
      course: rawData.course,
      stream: rawData.stream,
      branch: rawData.branch,
      year: rawData.year,
      semester: rawData.semester,
      careerGoal: rawData.careerGoal,
      targetSalary: rawData.targetSalary,
      learningStyle: rawData.learningStyle,
      language: rawData.language || "English",
      access: rawData.access,
      streak: rawData.streak || 0,
      xpPoints: rawData.xpPoints || 0,
      level: rawData.level || 1,
      // SQLite: Join arrays to strings
      interestedIn: Array.isArray(rawData.interestedIn) ? rawData.interestedIn.join(",") : "",
      biggestProblem: Array.isArray(rawData.biggestProblem) ? rawData.biggestProblem.join(",") : "",
      careerRoadmapJson: rawData.careerRoadmap ? JSON.stringify(rawData.careerRoadmap) : null,
    };

    // Use a transaction to update User, Profile, Skills, and Events
    const updatedUser = await prisma.$transaction(async (tx) => {
      // 1. Upsert User and Profile
      const u = await tx.user.upsert({
        where: { name: rawData.name },
        update: {
          ...userUpdate,
          profile: {
            upsert: {
              create: profileUpdate,
              update: profileUpdate,
            }
          }
        },
        create: {
          ...userUpdate,
          profile: {
            create: profileUpdate
          }
        }
      });

      // 2. Sync Skills (Replace all to match frontend)
      if (Array.isArray(rawData.skills)) {
        await tx.skill.deleteMany({ where: { userId: u.id } });
        // Frontend skills might be objects or just names depending on where they come from
        // Let's handle both
        const skillsToCreate = rawData.skills.map((s: any) => {
          if (typeof s === 'string') return { userId: u.id, skillName: s, proficiencyPct: 50 };
          return {
            userId: u.id,
            skillName: s.skillName || s.name || "Skill",
            proficiencyPct: s.proficiencyPct || 0,
            source: s.source || "manual"
          };
        });
        if (skillsToCreate.length > 0) {
          await tx.skill.createMany({ data: skillsToCreate });
        }
      }

      // 3. Sync Events (Replace all to match frontend)
      if (Array.isArray(rawData.events)) {
        await tx.event.deleteMany({ where: { userId: u.id } });
        const eventsToCreate = rawData.events.map((e: any) => ({
          userId: u.id,
          name: e.name,
          subject: e.subject || e.name,
          examDate: new Date(e.date || e.examDate || new Date()),
          dailyHours: e.dailyHours || 2.0,
          syllabus: e.syllabus || "",
          plan: typeof e.plan === 'object' ? JSON.stringify(e.plan) : e.plan
        }));
        if (eventsToCreate.length > 0) {
          await tx.event.createMany({ data: eventsToCreate });
        }
      }

      return await tx.user.findUnique({
        where: { id: u.id },
        include: {
          profile: true,
          skills: true,
          achievements: true,
          events: true,
        }
      });
    });

    if (!updatedUser) throw new Error("Sync failed to return user");

    // Flatten for the frontend UserContext which expects a merged object
    // Also split strings back to arrays and parse plans
    const mergedUser = {
      ...updatedUser,
      ...(updatedUser.profile || {}),
      interestedIn: updatedUser.profile?.interestedIn ? updatedUser.profile.interestedIn.split(",") : [],
      biggestProblem: updatedUser.profile?.biggestProblem ? updatedUser.profile.biggestProblem.split(",") : [],
      careerRoadmap: updatedUser.profile?.careerRoadmapJson ? JSON.parse(updatedUser.profile.careerRoadmapJson) : null,
      events: updatedUser.events?.map(ev => ({
        ...ev,
        plan: typeof ev.plan === 'string' ? JSON.parse(ev.plan) : ev.plan,
        date: ev.examDate // Frontend often uses .date for Event type
      })) || [],
      skills: updatedUser.skills || []
    };

    return NextResponse.json({ success: true, user: mergedUser });
  } catch (error: any) {
    console.error("Sync Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const name = searchParams.get("name");
  
      if (!name) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
      }
  
      const user = await prisma.user.findUnique({
        where: { name },
        include: {
          profile: true,
          skills: true,
          achievements: true,
          events: true,
          weakAreas: true,
        }
      });
      
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Flatten for the frontend
      const mergedUser = {
        ...user,
        ...(user.profile || {}),
        interestedIn: user.profile?.interestedIn ? user.profile.interestedIn.split(",") : [],
        biggestProblem: user.profile?.biggestProblem ? user.profile.biggestProblem.split(",") : [],
        careerRoadmap: user.profile?.careerRoadmapJson ? JSON.parse(user.profile.careerRoadmapJson) : null,
        events: user.events?.map(ev => ({
          ...ev,
          plan: typeof ev.plan === 'string' ? JSON.parse(ev.plan) : ev.plan,
          date: ev.examDate
        })) || [],
        skills: user.skills || []
      };
  
      return NextResponse.json({ success: true, user: mergedUser });
    } catch (error: any) {
      console.error("Fetch Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
