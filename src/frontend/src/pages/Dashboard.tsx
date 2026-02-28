import { GradientProgress } from "@/components/GradientProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useInternshipApplications,
  useRoadmapProgress,
  useSkills,
  useUserProfile,
} from "@/hooks/useQueries";
import {
  ArrowRight,
  Bot,
  Brain,
  Briefcase,
  Code2,
  FileText,
  Flame,
  Map as MapIcon,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import type { Route } from "../App";

const ROADMAP_MONTHS = [
  "C Programming Basics",
  "C++ Fundamentals",
  "Python Basics",
  "HTML + CSS",
  "JavaScript Basics",
  "Data Structures",
  "Advanced DSA",
  "OOPS in Java",
  "Git & GitHub",
  "Oracle SQL",
  "Aptitude Prep",
  "Mini Project + Resume",
];

const quickLinks: {
  path: Route;
  label: string;
  icon: React.FC<{ className?: string }>;
  desc: string;
}[] = [
  {
    path: "/roadmap",
    label: "Skill Roadmap",
    icon: MapIcon,
    desc: "12-month learning plan",
  },
  {
    path: "/code-editor",
    label: "Code Practice",
    icon: Code2,
    desc: "Write & run code online",
  },
  {
    path: "/practice",
    label: "Daily Practice",
    icon: Code2,
    desc: "Solve coding problems",
  },
  {
    path: "/gap-analyzer",
    label: "Gap Analyzer",
    icon: Target,
    desc: "Find missing skills",
  },
  {
    path: "/resume",
    label: "Resume Builder",
    icon: FileText,
    desc: "Build ATS-friendly CV",
  },
  {
    path: "/internships",
    label: "Internship Tracker",
    icon: Briefcase,
    desc: "Track applications",
  },
  {
    path: "/ai-assistant",
    label: "AI Assistant",
    icon: Bot,
    desc: "Chat & get placement help",
  },
];

interface DashboardProps {
  navigate?: (route: Route) => void;
}

export function Dashboard({ navigate = () => {} }: DashboardProps) {
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: skills = [] } = useSkills();
  const { data: internships = [] } = useInternshipApplications();
  const currentMonth = new Date().getMonth();
  const { data: roadmapProgress } = useRoadmapProgress(
    Math.min(currentMonth, 11),
  );

  const streak = profile ? Number(profile.currentStreak) : 0;
  const totalSolved = profile ? Number(profile.totalSolvedQuestions) : 0;

  const skillsCompleted =
    skills.length > 0
      ? Math.round(
          skills.reduce((sum, s) => sum + Number(s.progressPercent), 0) /
            skills.length,
        )
      : 0;

  const internshipsApplied = internships.length;
  const currentRoadmapPercent = roadmapProgress
    ? Number(roadmapProgress.completionPercent)
    : 0;
  const currentMonthName = ROADMAP_MONTHS[Math.min(currentMonth, 11)];

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const userName = profile?.name || "Student";

  return (
    <div className="p-5 sm:p-6 space-y-6 max-w-7xl mx-auto stagger-children">
      {/* Header */}
      <div className="pt-1">
        <h1 className="text-2xl sm:text-3xl font-display font-bold gradient-brand-text">
          {greeting}, {profileLoading ? "..." : userName}! 👋
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Stats row — streak card promoted */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Streak — hero card */}
        <Card className="col-span-2 lg:col-span-1 overflow-hidden border-0 card-hover relative">
          {/* gradient top accent */}
          <div className="absolute top-0 left-0 right-0 h-0.5 gradient-brand" />
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-orange-500/10 shrink-0">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-medium">
                  Day Streak
                </p>
                {profileLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <div className="flex items-end gap-1.5 mt-0.5">
                    <span className="text-3xl font-display font-bold leading-none">
                      {streak}
                    </span>
                    <span className="text-xs text-muted-foreground pb-0.5">
                      days 🔥
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Secondary stats */}
        {[
          {
            icon: Code2,
            label: "Questions Solved",
            value: `${totalSolved}`,
            suffix: "total",
            color: "text-brand-blue",
            bg: "bg-brand-blue/10",
          },
          {
            icon: Brain,
            label: "Skill Progress",
            value: `${skillsCompleted}%`,
            suffix: "avg",
            color: "text-brand-purple",
            bg: "bg-brand-purple/10",
          },
          {
            icon: Briefcase,
            label: "Applications",
            value: `${internshipsApplied}`,
            suffix: "applied",
            color: "text-success",
            bg: "bg-success/10",
          },
        ].map((stat) => (
          <Card key={stat.label} className="card-hover border-border/70">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}
                >
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-muted-foreground text-xs font-medium leading-tight">
                    {stat.label}
                  </p>
                  {profileLoading ? (
                    <Skeleton className="h-6 w-14 mt-1" />
                  ) : (
                    <div className="flex items-end gap-1 mt-0.5">
                      <span className="text-xl font-display font-bold leading-none">
                        {stat.value}
                      </span>
                      <span className="text-[10px] text-muted-foreground pb-0.5">
                        {stat.suffix}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly Roadmap Progress */}
      <Card className="border-border/70 overflow-hidden card-elevated">
        <div className="gradient-brand-soft p-5 border-b border-border/40">
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center gradient-brand shadow-brand shrink-0">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="font-display font-bold text-base leading-tight truncate">
                  Monthly Roadmap Progress
                </h2>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Month {Math.min(currentMonth + 1, 12)}: {currentMonthName}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/roadmap")}
              className="text-xs font-semibold text-primary flex items-center gap-1 hover:gap-2 transition-all shrink-0 whitespace-nowrap"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-bold gradient-brand-text">
                {currentRoadmapPercent}%
              </span>
            </div>
            <GradientProgress value={currentRoadmapPercent} height={8} />
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-1.5">
            {ROADMAP_MONTHS.map((month, monthIdx) => (
              <span
                key={month}
                className={`text-[11px] px-2 py-1 rounded-full font-medium transition-all leading-tight ${
                  monthIdx < currentMonth
                    ? "gradient-brand text-white"
                    : monthIdx === currentMonth
                      ? "border border-primary/60 text-primary bg-primary/8 font-semibold"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {monthIdx + 1}. {month.split(" ").slice(0, 2).join(" ")}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Action Grid — gradient border hover */}
      <div>
        <h2 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-warning" />
          Quick Access
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickLinks.map(({ path, label, icon: Icon, desc }) => (
            <button
              type="button"
              key={path}
              onClick={() => navigate(path)}
              className="text-left rounded-xl card-gradient-hover group"
            >
              <div className="p-4 rounded-xl bg-card border border-border/70 h-full transition-colors duration-200 group-hover:border-transparent">
                <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-brand mb-3 group-hover:shadow-brand-lg transition-shadow">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-display font-bold text-xs sm:text-sm leading-tight">
                  {label}
                </h3>
                <p className="text-muted-foreground text-[11px] mt-1 leading-snug hidden sm:block">
                  {desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming Goals */}
      <Card className="border-border/70 card-elevated">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Upcoming Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5 space-y-3">
          {[
            {
              text: "Complete 5 coding problems this week",
              period: "This Week",
              done: false,
            },
            {
              text: `Finish Month ${Math.min(currentMonth + 1, 12)}: ${currentMonthName}`,
              period: "This Month",
              done: false,
            },
            {
              text: "Apply to 3 internship positions",
              period: "This Month",
              done: internshipsApplied >= 3,
            },
            {
              text: "Update your skills progress",
              period: "Ongoing",
              done: skillsCompleted > 50,
            },
          ].map((goal) => (
            <div key={goal.text} className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  goal.done
                    ? "border-success bg-success shadow-[0_0_0_3px_oklch(var(--success)/0.15)]"
                    : "border-border"
                }`}
              >
                {goal.done && (
                  <span className="text-white text-[10px] font-bold">✓</span>
                )}
              </div>
              <span
                className={`text-sm flex-1 leading-snug ${goal.done ? "line-through text-muted-foreground" : ""}`}
              >
                {goal.text}
              </span>
              <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0">
                {goal.period}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground py-4 border-t border-border/60">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
