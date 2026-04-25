"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/UserContext";
import { 
  AcademicCapIcon, 
  BriefcaseIcon, 
  CpuChipIcon, 
  BeakerIcon, 
  RocketLaunchIcon, 
  ChatBubbleBottomCenterTextIcon,
  ClockIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";

type OnboardingData = {
  stream: string;
  branch: string;
  year: string;
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
};

export default function OnboardingPage() {
  const router = useRouter();
  const { updateProfile } = useUser();
  const [step, setStep] = useState(1);
  const totalSteps = 14; // 13 questions + 1 summary

  const [data, setData] = useState<OnboardingData>({
    stream: "",
    branch: "",
    year: "",
    careerGoal: "",
    targetSalary: "",
    skills: [],
    skillLevel: "",
    learningStyle: "",
    studyTime: "",
    language: "",
    access: "",
    interestedIn: [],
    biggestProblem: [],
  });

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleComplete = () => {
    // Generate a profile summary (placeholder logic)
    const summary = `${data.year} ${data.stream} student specializing in ${data.branch}. Goal: ${data.careerGoal}. Focus skills: ${data.skills.join(", ")}.`;
    
    // Update profile in context
    updateProfile({
      studyLevel: data.year,
      course: `${data.stream} - ${data.branch}`,
    });

    // In a real app, we'd save this 'data' to a database or extended profile
    router.push("/");
  };

  const toggleMultiSelect = (key: keyof OnboardingData, value: string) => {
    setData(prev => {
      const current = prev[key] as string[];
      if (current.includes(value)) {
        return { ...prev, [key]: current.filter(i => i !== value) };
      } else {
        return { ...prev, [key]: [...current, value] };
      }
    });
  };

  const isNextDisabled = () => {
    switch (step) {
      case 1: return !data.stream;
      case 2: return !data.branch;
      case 3: return !data.year;
      case 4: return !data.careerGoal;
      case 5: return !data.targetSalary;
      case 6: return data.skills.length === 0;
      case 7: return !data.skillLevel;
      case 8: return !data.learningStyle;
      case 9: return !data.studyTime;
      case 10: return !data.language;
      case 11: return !data.access;
      case 12: return data.interestedIn.length === 0;
      case 13: return data.biggestProblem.length === 0;
      default: return false;
    }
  };

  // UI Components for cards
  const OptionCard = ({ 
    label, 
    active, 
    onClick, 
    icon: Icon 
  }: { 
    label: string; 
    active: boolean; 
    onClick: () => void; 
    icon?: any 
  }) => (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 group ${
        active 
          ? "bg-cyan-500/20 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] animate-pulse-subtle" 
          : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
      }`}
    >
      {Icon && (
        <div className={`mb-3 p-3 rounded-xl transition-colors ${active ? "text-cyan-400 bg-cyan-500/10" : "text-slate-500 bg-slate-800"}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
      <span className={`text-sm font-bold tracking-tight ${active ? "text-cyan-400" : "text-slate-300"}`}>
        {label}
      </span>
      {active && (
        <div className="absolute top-2 right-2">
          <CheckCircleIcon className="w-5 h-5 text-cyan-400" />
        </div>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Progress Header */}
      <header className="sticky top-0 z-50 w-full p-4 lg:p-6 backdrop-blur-xl bg-black/20 border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-black tracking-tighter text-lg uppercase">Study Buddy <span className="text-cyan-500">AI</span></span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Onboarding Progress</span>
              <span className="text-xs font-bold text-cyan-400">Step {step} of {totalSteps}</span>
            </div>
            <div className="w-24 sm:w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500 ease-out"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-4xl">
          
          {/* Step Renderings */}
          <div className="animate-fadeInUp">
            {step === 1 && (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Choose your <span className="gradient-text">College Stream</span></h1>
                  <p className="text-slate-400 max-w-lg mx-auto">Help us understand your academic foundation so we can tailor resources for you.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {["B.Tech", "BCA", "BBA", "B.Com", "B.Sc", "Medical", "Law", "Arts", "Other"].map(item => (
                    <OptionCard 
                      key={item}
                      label={item}
                      icon={AcademicCapIcon}
                      active={data.stream === item}
                      onClick={() => setData({ ...data, stream: item })}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight">What's your <span className="gradient-text">Specialization</span>?</h1>
                  <p className="text-slate-400">Tell us your specific branch or major (e.g., Computer Science, Mechanical, Finance).</p>
                </div>
                <div className="max-w-md mx-auto">
                  <div className="relative group">
                    <input 
                      type="text"
                      placeholder="e.g. CSE, AI & ML, HR, Accounts..."
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-xl font-bold focus:border-cyan-500 outline-none transition-all focus:ring-4 focus:ring-cyan-500/10 placeholder:text-slate-600"
                      value={data.branch}
                      onChange={(e) => setData({ ...data, branch: e.target.value })}
                      autoFocus
                    />
                    <div className="mt-6 flex flex-wrap gap-2 justify-center">
                      {["CSE", "Mechanical", "Civil", "ECE", "Biotechnology", "IT"].map(suggestion => (
                        <button 
                          key={suggestion}
                          onClick={() => setData({ ...data, branch: suggestion })}
                          className="px-4 py-2 rounded-full bg-slate-800 text-xs font-bold hover:bg-slate-700 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Current <span className="gradient-text">Year</span></h1>
                  <p className="text-slate-400">Where are you in your college journey?</p>
                </div>
                <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
                  {["1st Year", "2nd Year", "3rd Year", "Final Year"].map(item => (
                    <OptionCard 
                      key={item}
                      label={item}
                      icon={ClockIcon}
                      active={data.year === item}
                      onClick={() => setData({ ...data, year: item })}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Your <span className="gradient-text">Career Goal</span></h1>
                  <p className="text-slate-400">What's the primary target after graduation?</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Placement", icon: BriefcaseIcon },
                    { label: "Higher Studies", icon: AcademicCapIcon },
                    { label: "Government Exam", icon: GlobeAltIcon },
                    { label: "Startup", icon: RocketLaunchIcon },
                    { label: "Freelancing", icon: DevicePhoneMobileIcon },
                    { label: "Research", icon: BeakerIcon },
                    { label: "MBA", icon: AcademicCapIcon },
                    { label: "Still Exploring", icon: SparklesIcon }
                  ].map(item => (
                    <OptionCard 
                      key={item.label}
                      label={item.label}
                      icon={item.icon}
                      active={data.careerGoal === item.label}
                      onClick={() => setData({ ...data, careerGoal: item.label })}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Target <span className="gradient-text">Salary Goal</span></h1>
                  <p className="text-slate-400">What's the annual package you're aiming for? (in LPA or currency of choice)</p>
                </div>
                <div className="max-w-md mx-auto">
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-cyan-500 font-bold text-2xl">₹</span>
                    <input 
                      type="text"
                      placeholder="e.g. 12 LPA, 50 LPA..."
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-6 pl-12 text-xl font-bold focus:border-cyan-500 outline-none transition-all focus:ring-4 focus:ring-cyan-500/10 placeholder:text-slate-600"
                      value={data.targetSalary}
                      onChange={(e) => setData({ ...data, targetSalary: e.target.value })}
                      autoFocus
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Skills You <span className="gradient-text">Want to Learn</span></h1>
                  <p className="text-slate-400">Select all that apply. We'll find resources based on these.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {["DSA", "Web Development", "Machine Learning", "Data Science", "Cloud", "Cybersecurity", "Aptitude", "Communication Skills", "Interview Preparation"].map(item => (
                    <OptionCard 
                      key={item}
                      label={item}
                      active={data.skills.includes(item)}
                      onClick={() => toggleMultiSelect("skills", item)}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Current <span className="gradient-text">Skill Level</span></h1>
                  <p className="text-slate-400">Be honest! We adjust the roadmap difficulty based on this.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  {[
                    { label: "Beginner", desc: "Just starting out" },
                    { label: "Intermediate", desc: "Know the basics well" },
                    { label: "Advanced", desc: "Ready for specialized topics" }
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={() => setData({ ...data, skillLevel: item.label })}
                      className={`p-8 rounded-3xl border transition-all duration-300 text-left ${
                        data.skillLevel === item.label 
                          ? "bg-cyan-500/20 border-cyan-500 shadow-glow" 
                          : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <h3 className={`text-xl font-black mb-2 ${data.skillLevel === item.label ? "text-cyan-400" : "text-white"}`}>{item.label}</h3>
                      <p className="text-slate-400 text-sm font-medium">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 8 && (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Preferred <span className="gradient-text">Learning Style</span></h1>
                  <p className="text-slate-400">How do you retain information best?</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {["Short Notes", "Video Learning", "Practice Questions", "Daily Tasks", "Roadmaps", "Mentor Guidance"].map(item => (
                    <OptionCard 
                      key={item}
                      label={item}
                      active={data.learningStyle === item}
                      onClick={() => setData({ ...data, learningStyle: item })}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 9 && (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight"><span className="gradient-text">Daily</span> Study Time</h1>
                  <p className="text-slate-400">Commitment matters. How much can you spare?</p>
                </div>
                <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
                  {["1 Hour", "2 Hours", "3+ Hours", "Weekend Only"].map(item => (
                    <OptionCard 
                      key={item}
                      label={item}
                      icon={ClockIcon}
                      active={data.studyTime === item}
                      onClick={() => setData({ ...data, studyTime: item })}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 10 && (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Language <span className="gradient-text">Preference</span></h1>
                  <p className="text-slate-400">We support multilingual neural processing.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
                  {["English", "Hindi", "Hinglish", "Regional Language Support"].map(item => (
                    <OptionCard 
                      key={item}
                      label={item}
                      icon={GlobeAltIcon}
                      active={data.language === item}
                      onClick={() => setData({ ...data, language: item })}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 11 && (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Internet & <span className="gradient-text">Device Access</span></h1>
                  <p className="text-slate-400">So we can optimize for offline or high-bandwidth learning.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
                  {["Only Mobile", "Laptop + Mobile", "Limited Internet", "Good Internet Access"].map(item => (
                    <OptionCard 
                      key={item}
                      label={item}
                      icon={DevicePhoneMobileIcon}
                      active={data.access === item}
                      onClick={() => setData({ ...data, access: item })}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 12 && (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight">What else are you <span className="gradient-text">Interested In</span>?</h1>
                  <p className="text-slate-400">Extracurriculars and growth opportunities.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["Scholarships", "Internships", "Hackathons", "Open Source", "Research Papers", "College Projects", "Resume Building", "LinkedIn Growth"].map(item => (
                    <OptionCard 
                      key={item}
                      label={item}
                      active={data.interestedIn.includes(item)}
                      onClick={() => toggleMultiSelect("interestedIn", item)}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 13 && (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Biggest <span className="gradient-text">Current Problem</span>?</h1>
                  <p className="text-slate-400">Common struggles. We are here to solve them.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["No roadmap", "No consistency", "Fear of placements", "Weak coding skills", "Lack of confidence", "Communication issues", "Time management", "Financial limitations"].map(item => (
                    <OptionCard 
                      key={item}
                      label={item}
                      icon={ExclamationTriangleIcon}
                      active={data.biggestProblem.includes(item)}
                      onClick={() => toggleMultiSelect("biggestProblem", item)}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 14 && (
              <div className="space-y-12 animate-fadeIn">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30 animate-successPulse">
                    <CheckCircleIcon className="w-12 h-12 text-green-400" />
                  </div>
                  <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                    Your AI assistant <br /><span className="gradient-text">is ready.</span>
                  </h1>
                  <p className="text-slate-400 text-lg max-w-xl mx-auto">
                    We've synthesized your goals and constraints into a custom neural blueprint.
                  </p>
                </div>

                <div className="glass rounded-[32px] p-8 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden group">
                   {/* Background Glow */}
                   <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/20 transition-all duration-700" />
                   
                   <div className="relative z-10 space-y-8">
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-8 border-b border-white/5">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center text-white font-black text-2xl shadow-glow">
                          {data.stream.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-2xl font-black text-white">Student Profile Summary</h3>
                            <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-[10px] font-black text-white uppercase tracking-widest">Synced</span>
                          </div>
                          <p className="text-slate-400 font-medium">Personalized for {data.year} {data.stream}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        <div className="space-y-2">
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Academic Specialization</span>
                           <span className="text-white font-bold block">{data.branch}</span>
                           <p className="text-xs text-slate-400 leading-relaxed">Focusing on {data.skills.slice(0, 3).join(", ")} roadmap.</p>
                        </div>
                        <div className="space-y-2">
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Target Trajectory</span>
                           <span className="text-white font-bold block">{data.careerGoal}</span>
                           <p className="text-xs text-slate-400 leading-relaxed">Aiming for {data.targetSalary} annually.</p>
                        </div>
                        <div className="space-y-2">
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Learning Architecture</span>
                           <span className="text-white font-bold block">{data.learningStyle}</span>
                           <p className="text-xs text-slate-400 leading-relaxed">Optimized for {data.language} in {data.studyTime} blocks.</p>
                        </div>
                        <div className="space-y-2">
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Environment Optimization</span>
                           <span className="text-white font-bold block">{data.access}</span>
                           <p className="text-xs text-slate-400 leading-relaxed">{data.interestedIn.length} extracurricular interest nodes mapped.</p>
                        </div>
                      </div>

                      <div className="pt-8 border-t border-white/5 space-y-4">
                        <div className="flex items-center gap-3 text-cyan-400">
                          <SparklesIcon className="w-5 h-5" />
                          <span className="text-sm font-bold uppercase tracking-widest">Motivational Directive</span>
                        </div>
                        <p className="text-slate-300 italic font-medium leading-relaxed">
                          "You've taken the first step toward masterly consistency. Remember, {data.name || "Scholar"}, your current struggle with {data.biggestProblem[0]} is just data for your eventual success. We've updated your neural link to prioritize roadmap clarity and consistency."
                        </p>
                      </div>
                   </div>
                </div>

                <div className="flex flex-col items-center gap-6">
                  <button 
                    onClick={handleComplete}
                    className="w-full sm:w-auto btn btn-primary px-12 py-6 text-xl font-black group shadow-glow rounded-3xl"
                  >
                    Enter My Command Center
                    <ArrowRightIcon className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <div className="flex items-center gap-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Link: Secure
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                      Persona: Synchronized
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Navigation Footer */}
      {step < totalSteps && (
        <footer className="p-6 sm:p-12 border-t border-slate-800/50 bg-black/20 backdrop-blur-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <button
              onClick={prevStep}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                step === 1 
                  ? "opacity-0 pointer-events-none" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={nextStep}
              disabled={isNextDisabled()}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all group ${
                isNextDisabled()
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-cyan-500 text-white hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              }`}
            >
              {step === totalSteps - 1 ? "Finish Survey" : "Next Step"}
              <ArrowRightIcon className={`w-4 h-4 transition-transform ${!isNextDisabled() && "group-hover:translate-x-1"}`} />
            </button>
          </div>
        </footer>
      )}

      {/* Decorative Grid */}
      <div className="fixed inset-0 z-[-1] opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </div>
  );
}
