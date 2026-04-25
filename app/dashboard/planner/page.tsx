"use client";

import React from "react";
import StudyPlanner from "@/components/StudyPlanner";

export default function PlannerPage() {
  return (
    <div className="animate-fadeIn">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-tight">
          Smart <span className="gradient-text">Study Planner</span>
        </h1>
        <p className="text-slate-400 mt-2 font-medium">
          Manage your operational targets and neural roadmaps here.
        </p>
      </div>

      <StudyPlanner />
    </div>
  );
}
