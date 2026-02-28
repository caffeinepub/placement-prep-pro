import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useResumeData, useUpdateResumeData } from "@/hooks/useQueries";
import {
  BookOpen,
  Code2,
  Download,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  User,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const DEFAULT_RESUME = {
  fullName: "",
  email: "",
  phone: "",
  summary: "",
  education: "",
  skills: "",
  projects: "",
};

function ResumePreview({ data }: { data: typeof DEFAULT_RESUME }) {
  const skillsList = data.skills
    ? data.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const parseProjects = (text: string) => {
    if (!text) return [];
    return text.split("\n---\n").map((block) => {
      const lines = block.trim().split("\n");
      return {
        name: lines[0] || "",
        rest: lines.slice(1).join("\n"),
      };
    });
  };

  const projects = parseProjects(data.projects);

  return (
    <div
      id="resume-preview"
      style={{
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        background: "white",
        color: "#1a1a2e",
        padding: "40px 48px",
        minHeight: "297mm",
        maxWidth: "794px",
        margin: "0 auto",
        fontSize: "13px",
        lineHeight: "1.6",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "2px solid #4f46e5",
          paddingBottom: "16px",
          marginBottom: "20px",
        }}
      >
        <h1
          style={{
            fontSize: "26px",
            fontWeight: 800,
            margin: 0,
            color: "#1a1a2e",
          }}
        >
          {data.fullName || "Your Name"}
        </h1>
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "8px",
            color: "#555",
            flexWrap: "wrap",
          }}
        >
          {data.email && <span>📧 {data.email}</span>}
          {data.phone && <span>📞 {data.phone}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div style={{ marginBottom: "20px" }}>
          <h2
            style={{
              fontSize: "14px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#4f46e5",
              marginBottom: "8px",
            }}
          >
            Professional Summary
          </h2>
          <p style={{ margin: 0, color: "#333" }}>{data.summary}</p>
        </div>
      )}

      {/* Education */}
      {data.education && (
        <div style={{ marginBottom: "20px" }}>
          <h2
            style={{
              fontSize: "14px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#4f46e5",
              marginBottom: "8px",
            }}
          >
            Education
          </h2>
          <p style={{ margin: 0, whiteSpace: "pre-line", color: "#333" }}>
            {data.education}
          </p>
        </div>
      )}

      {/* Skills */}
      {skillsList.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h2
            style={{
              fontSize: "14px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#4f46e5",
              marginBottom: "8px",
            }}
          >
            Technical Skills
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {skillsList.map((skill) => (
              <span
                key={skill}
                style={{
                  background: "#ede9fe",
                  color: "#4f46e5",
                  padding: "2px 10px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h2
            style={{
              fontSize: "14px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#4f46e5",
              marginBottom: "8px",
            }}
          >
            Projects
          </h2>
          <div style={{ marginTop: "12px" }}>
            {projects.map((proj) => (
              <div key={proj.name} style={{ marginBottom: "12px" }}>
                <div style={{ fontWeight: 700, fontSize: "13px" }}>
                  {proj.name}
                </div>
                <div
                  style={{
                    color: "#555",
                    whiteSpace: "pre-line",
                    marginTop: "4px",
                  }}
                >
                  {proj.rest}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ResumeBuilder() {
  const { data: savedResume } = useResumeData();
  const updateResume = useUpdateResumeData();
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_RESUME);

  useEffect(() => {
    if (savedResume) {
      setFormData({
        fullName: savedResume.fullName || "",
        email: savedResume.email || "",
        phone: savedResume.phone || "",
        summary: savedResume.summary || "",
        education: savedResume.education || "",
        skills: savedResume.skills || "",
        projects: savedResume.projects || "",
      });
    }
  }, [savedResume]);

  const update = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const saveResume = async () => {
    try {
      await updateResume.mutateAsync(formData);
      toast.success("Resume saved!");
    } catch {
      toast.error("Failed to save");
    }
  };

  const downloadPDF = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-brand-text">
            Resume Builder
          </h1>
          <p className="text-muted-foreground mt-1">
            Create an ATS-friendly resume for placement
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="gap-2"
          >
            {showPreview ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            {showPreview ? "Hide Preview" : "Preview"}
          </Button>
          <Button onClick={downloadPDF} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
          <Button
            onClick={saveResume}
            disabled={updateResume.isPending}
            className="gradient-brand text-white border-0 shadow-brand gap-2"
          >
            {updateResume.isPending && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            Save Resume
          </Button>
        </div>
      </div>

      <div
        className={`grid gap-6 ${showPreview ? "lg:grid-cols-2" : "lg:grid-cols-1 max-w-3xl"}`}
      >
        {/* Form */}
        <Card className="border-border/60">
          <CardContent className="p-6">
            <Tabs defaultValue="personal">
              <TabsList className="w-full grid grid-cols-5 mb-6">
                <TabsTrigger value="personal" className="text-xs gap-1">
                  <User className="w-3 h-3" /> Info
                </TabsTrigger>
                <TabsTrigger value="education" className="text-xs gap-1">
                  <BookOpen className="w-3 h-3" /> Edu
                </TabsTrigger>
                <TabsTrigger value="skills" className="text-xs gap-1">
                  <Wrench className="w-3 h-3" /> Skills
                </TabsTrigger>
                <TabsTrigger value="projects" className="text-xs gap-1">
                  <Code2 className="w-3 h-3" /> Projects
                </TabsTrigger>
                <TabsTrigger value="summary" className="text-xs gap-1">
                  <FileText className="w-3 h-3" /> Summary
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Rahul Sharma"
                    value={formData.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="rahul@college.edu"
                      value={formData.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => update("phone", e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="education" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="education">Education Details</Label>
                  <p className="text-xs text-muted-foreground">
                    Enter your degree, institution, year, and CGPA
                  </p>
                  <Textarea
                    id="education"
                    placeholder={
                      "B.Tech in Computer Science\nXYZ Institute of Technology, Pune\n2024–2028 | CGPA: 8.5/10"
                    }
                    value={formData.education}
                    onChange={(e) => update("education", e.target.value)}
                    rows={6}
                  />
                </div>
              </TabsContent>

              <TabsContent value="skills" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="skills">Technical Skills</Label>
                  <p className="text-xs text-muted-foreground">
                    Comma-separated list of skills
                  </p>
                  <Textarea
                    id="skills"
                    placeholder="Python, C++, Java, JavaScript, HTML/CSS, DSA, Oracle SQL, Git & GitHub"
                    value={formData.skills}
                    onChange={(e) => update("skills", e.target.value)}
                    rows={5}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Python",
                    "C",
                    "C++",
                    "Java",
                    "JavaScript",
                    "HTML/CSS",
                    "DSA",
                    "Oracle SQL",
                    "Git & GitHub",
                  ].map((skill) => (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => {
                        const current = formData.skills;
                        const list = current
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean);
                        if (!list.includes(skill)) {
                          update("skills", [...list, skill].join(", "));
                        }
                      }}
                      className="text-xs px-3 py-1 rounded-full border border-border/60 hover:border-primary/60 hover:bg-accent/50 transition-all"
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="projects" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="projects">Projects</Label>
                  <p className="text-xs text-muted-foreground">
                    Separate projects with{" "}
                    <code className="bg-muted px-1 py-0.5 rounded">---</code> on
                    a new line
                  </p>
                  <Textarea
                    id="projects"
                    placeholder={
                      "Student Portal Web App\nTech Stack: React, Node.js, MongoDB\nBuilt a full-stack student management system with JWT authentication.\nGitHub: github.com/rahul/student-portal\n---\nDSA Problem Tracker\nTech Stack: Python, SQLite\nBuilt a CLI tool to track daily DSA practice and maintain streaks."
                    }
                    value={formData.projects}
                    onChange={(e) => update("projects", e.target.value)}
                    rows={10}
                  />
                </div>
              </TabsContent>

              <TabsContent value="summary" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="summary">Professional Summary</Label>
                  <p className="text-xs text-muted-foreground">
                    2-3 sentences about yourself (under 160 chars)
                  </p>
                  <Textarea
                    id="summary"
                    placeholder="Motivated first-year B.Tech CSE student with strong fundamentals in Python and C++. Passionate about problem-solving and building impactful software solutions."
                    value={formData.summary}
                    onChange={(e) => update("summary", e.target.value)}
                    rows={5}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.summary.length} chars
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Preview */}
        {showPreview && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Eye className="w-4 h-4" />
              Live Preview
            </div>
            <div className="border border-border/60 rounded-2xl overflow-hidden bg-white shadow-card-md overflow-y-auto max-h-[80vh]">
              <ResumePreview data={formData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
