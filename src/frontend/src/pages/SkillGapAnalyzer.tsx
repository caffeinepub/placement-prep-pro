import { GradientProgress } from "@/components/GradientProgress";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSkills } from "@/hooks/useQueries";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Target,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

type Role =
  | "Software Developer"
  | "AIML Engineer"
  | "Web Developer"
  | "Prompt Engineer"
  | "Full Stack Developer"
  | "AI Engineer"
  | "Data Scientist";

interface RequiredSkill {
  name: string;
  level: number; // 0=Beginner, 1=Intermediate, 2=Advanced
}

const ROLE_REQUIREMENTS: Record<Role, RequiredSkill[]> = {
  "Software Developer": [
    { name: "C++", level: 2 },
    { name: "Java", level: 2 },
    { name: "DSA", level: 2 },
    { name: "Oracle SQL", level: 1 },
    { name: "Git & GitHub", level: 1 },
    { name: "Aptitude", level: 2 },
  ],
  "AIML Engineer": [
    { name: "Python", level: 2 },
    { name: "DSA", level: 1 },
    { name: "Oracle SQL", level: 0 },
    { name: "Git & GitHub", level: 1 },
  ],
  "Web Developer": [
    { name: "HTML/CSS", level: 2 },
    { name: "JavaScript", level: 2 },
    { name: "Git & GitHub", level: 1 },
    { name: "Oracle SQL", level: 0 },
    { name: "DSA", level: 1 },
  ],
  "Prompt Engineer": [
    { name: "Python", level: 1 },
    { name: "NLP Basics", level: 1 },
    { name: "LLM Concepts", level: 2 },
    { name: "Prompt Design", level: 2 },
    { name: "Git & GitHub", level: 0 },
    { name: "API Integration", level: 1 },
  ],
  "Full Stack Developer": [
    { name: "HTML/CSS", level: 2 },
    { name: "JavaScript", level: 2 },
    { name: "React", level: 2 },
    { name: "Node.js", level: 1 },
    { name: "Oracle SQL", level: 1 },
    { name: "Git & GitHub", level: 1 },
    { name: "DSA", level: 1 },
  ],
  "AI Engineer": [
    { name: "Python", level: 2 },
    { name: "Machine Learning", level: 2 },
    { name: "Deep Learning", level: 1 },
    { name: "DSA", level: 1 },
    { name: "Oracle SQL", level: 1 },
    { name: "Git & GitHub", level: 1 },
    { name: "Math & Statistics", level: 2 },
  ],
  "Data Scientist": [
    { name: "Python", level: 2 },
    { name: "Math & Statistics", level: 2 },
    { name: "Machine Learning", level: 2 },
    { name: "Oracle SQL", level: 2 },
    { name: "Data Visualization", level: 1 },
    { name: "Git & GitHub", level: 1 },
  ],
};

const ROLE_RESOURCES: Record<Role, Array<{ label: string; url: string }>> = {
  "Software Developer": [
    { label: "LeetCode DSA", url: "https://leetcode.com" },
    { label: "GeeksForGeeks", url: "https://geeksforgeeks.org" },
    { label: "JavaPoint OOP", url: "https://javatpoint.com" },
    { label: "HackerRank SQL", url: "https://hackerrank.com/domains/sql" },
  ],
  "AIML Engineer": [
    { label: "Kaggle Python", url: "https://kaggle.com/learn/python" },
    { label: "fast.ai", url: "https://fast.ai" },
    { label: "Coursera ML", url: "https://coursera.org" },
    {
      label: "HackerRank Python",
      url: "https://hackerrank.com/domains/python",
    },
  ],
  "Web Developer": [
    { label: "MDN Web Docs", url: "https://developer.mozilla.org" },
    { label: "W3Schools", url: "https://w3schools.com" },
    { label: "JavaScript.info", url: "https://javascript.info" },
    { label: "FreeCodeCamp", url: "https://freecodecamp.org" },
  ],
  "Prompt Engineer": [
    { label: "OpenAI Docs", url: "https://platform.openai.com/docs" },
    { label: "Learn Prompting", url: "https://learnprompting.org" },
    { label: "Hugging Face", url: "https://huggingface.co" },
    { label: "Kaggle NLP", url: "https://kaggle.com/learn/nlp" },
  ],
  "Full Stack Developer": [
    { label: "Fullstack Open", url: "https://fullstackopen.com" },
    { label: "React Docs", url: "https://react.dev" },
    { label: "Node.js Docs", url: "https://nodejs.org/docs" },
    { label: "FreeCodeCamp", url: "https://freecodecamp.org" },
  ],
  "AI Engineer": [
    { label: "fast.ai", url: "https://fast.ai" },
    { label: "Coursera Deep Learning", url: "https://coursera.org" },
    { label: "Papers with Code", url: "https://paperswithcode.com" },
    { label: "Kaggle", url: "https://kaggle.com" },
  ],
  "Data Scientist": [
    { label: "Kaggle", url: "https://kaggle.com" },
    { label: "Towards Data Science", url: "https://towardsdatascience.com" },
    { label: "StatQuest", url: "https://youtube.com/statquest" },
    { label: "SQL Practice", url: "https://hackerrank.com/domains/sql" },
  ],
};

const LEVEL_LABELS = ["Beginner", "Intermediate", "Advanced"];
const ROLE_EMOJIS: Record<Role, string> = {
  "Software Developer": "💻",
  "AIML Engineer": "🤖",
  "Web Developer": "🌐",
  "Prompt Engineer": "✨",
  "Full Stack Developer": "🔗",
  "AI Engineer": "🧠",
  "Data Scientist": "📊",
};
const ROLE_DESCRIPTIONS: Record<Role, string> = {
  "Software Developer": "Backend, system design, competitive coding",
  "AIML Engineer": "Machine learning, data science, Python",
  "Web Developer": "Frontend, UI/UX, modern web frameworks",
  "Prompt Engineer": "LLM prompting, NLP, AI product design",
  "Full Stack Developer": "React, Node.js, databases, APIs",
  "AI Engineer": "Deep learning, model deployment, MLOps",
  "Data Scientist": "Statistics, ML, SQL, data visualization",
};

export function SkillGapAnalyzer() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const { data: skills = [] } = useSkills();

  const getSkillLevel = (skillName: string): number => {
    const skill = skills.find((s) => s.skillName === skillName);
    return skill ? Number(skill.level) : -1;
  };

  const getSkillProgress = (skillName: string): number => {
    const skill = skills.find((s) => s.skillName === skillName);
    return skill ? Number(skill.progressPercent) : 0;
  };

  const getGapStatus = (current: number, required: number) => {
    if (current === -1) return "missing";
    if (current < required) return "weak";
    return "ok";
  };

  const requirements = selectedRole ? ROLE_REQUIREMENTS[selectedRole] : [];
  const gaps = requirements.filter(
    (req) => getGapStatus(getSkillLevel(req.name), req.level) !== "ok",
  );
  const readinessPercent =
    requirements.length > 0
      ? Math.round(
          ((requirements.length - gaps.length) / requirements.length) * 100,
        )
      : 0;

  return (
    <div className="p-5 sm:p-6 space-y-6 max-w-4xl mx-auto">
      <PageHeader
        icon={Target}
        title="Skill Gap Analyzer"
        subtitle="Discover what you need for your dream role"
      />

      {/* Role selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {(Object.keys(ROLE_REQUIREMENTS) as Role[]).map((role) => (
          <button
            type="button"
            key={role}
            onClick={() => setSelectedRole(role === selectedRole ? null : role)}
            className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 card-hover ${
              selectedRole === role
                ? "border-primary gradient-brand-soft shadow-brand"
                : "border-border/60 bg-card hover:border-primary/30"
            }`}
          >
            <div className="text-3xl mb-3">{ROLE_EMOJIS[role]}</div>
            <div className="font-display font-bold text-sm leading-tight">
              {role}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {ROLE_DESCRIPTIONS[role]}
            </div>
            {selectedRole === role && (
              <div className="mt-3 flex items-center gap-1 text-xs text-primary font-medium">
                Selected <CheckCircle2 className="w-3 h-3" />
              </div>
            )}
          </button>
        ))}
      </div>

      {selectedRole && (
        <>
          {/* Readiness meter */}
          <Card className="border-border/60 overflow-hidden">
            <div className="gradient-brand p-5 text-white">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="text-sm opacity-80 mb-1">
                    Readiness for {selectedRole}
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="text-4xl font-display font-bold">
                      {readinessPercent}%
                    </div>
                    <div className="opacity-80 text-sm pb-1">
                      {gaps.length === 0
                        ? "You're ready! 🎉"
                        : `${gaps.length} skill${gaps.length > 1 ? "s" : ""} to improve`}
                    </div>
                  </div>
                </div>
                <TrendingUp className="w-12 h-12 opacity-30" />
              </div>
              <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-700"
                  style={{ width: `${readinessPercent}%` }}
                />
              </div>
            </div>
          </Card>

          {/* Skills comparison table */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Skills Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requirements.map((req) => {
                  const current = getSkillLevel(req.name);
                  const status = getGapStatus(current, req.level);
                  const progress = getSkillProgress(req.name);

                  return (
                    <div key={req.name} className="space-y-2">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                          {status === "ok" ? (
                            <CheckCircle2 className="w-5 h-5 text-success" />
                          ) : (
                            <AlertCircle
                              className={`w-5 h-5 ${status === "missing" ? "text-destructive" : "text-warning"}`}
                            />
                          )}
                          <div>
                            <span className="font-medium text-sm">
                              {req.name}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-muted-foreground">
                                Required:{" "}
                                <span className="font-medium text-foreground">
                                  {LEVEL_LABELS[req.level]}
                                </span>
                              </span>
                              <ArrowRight className="w-3 h-3 text-muted-foreground" />
                              <span
                                className={`text-xs font-medium ${
                                  status === "ok"
                                    ? "text-success"
                                    : status === "missing"
                                      ? "text-destructive"
                                      : "text-warning"
                                }`}
                              >
                                Current:{" "}
                                {current === -1
                                  ? "Not Started"
                                  : LEVEL_LABELS[current]}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge
                          className={
                            status === "ok"
                              ? "bg-success/10 text-success border-success/20"
                              : status === "missing"
                                ? "bg-destructive/10 text-destructive border-destructive/20"
                                : "bg-warning/10 text-warning border-warning/20"
                          }
                        >
                          {status === "ok"
                            ? "✓ Met"
                            : status === "missing"
                              ? "Not Started"
                              : "Needs Work"}
                        </Badge>
                      </div>
                      <GradientProgress value={progress} height={4} />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base">
                Recommended Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ROLE_RESOURCES[selectedRole].map((resource) => (
                  <a
                    key={resource.label}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-xl border border-border/60 hover:border-primary/40 hover:bg-accent/50 transition-all text-sm font-medium group"
                  >
                    <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    <span className="truncate">{resource.label}</span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Improvement plan */}
          {gaps.length > 0 && (
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-base">
                  Improvement Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {gaps.map((gap, i) => (
                    <div
                      key={gap.name}
                      className="flex items-start gap-3 p-3 rounded-xl bg-muted/50"
                    >
                      <div className="w-6 h-6 rounded-full gradient-brand text-white text-xs flex items-center justify-center font-bold shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{gap.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Improve from{" "}
                          <span className="font-medium text-foreground">
                            {getSkillLevel(gap.name) === -1
                              ? "zero"
                              : LEVEL_LABELS[getSkillLevel(gap.name)]}
                          </span>{" "}
                          to{" "}
                          <span className="font-medium text-primary">
                            {LEVEL_LABELS[gap.level]}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!selectedRole && (
        <div className="text-center py-16 text-muted-foreground">
          <Target className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="font-display font-bold text-lg text-foreground">
            Select a dream role above
          </p>
          <p className="text-sm mt-1">
            We'll analyze your skills and show what needs improvement
          </p>
        </div>
      )}
    </div>
  );
}
