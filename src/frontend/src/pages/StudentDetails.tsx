import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  Edit3,
  FileText,
  GraduationCap,
  Info,
  Lock,
  Mail,
  Monitor,
  Moon,
  Phone,
  Plus,
  Save,
  Settings,
  Shield,
  Sun,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface StudentProfile {
  fullName?: string;
  email?: string;
  college?: string;
  branch?: string;
  year?: string;
  targetRole?: string;
  skillLevel?: string;
  phone?: string;
  dob?: string;
  gender?: string;
}

interface Reminder {
  id: string;
  title: string;
  time: string;
  enabled: boolean;
}

function getProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem("ppp_user");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProfile(data: StudentProfile) {
  const existing = getProfile();
  localStorage.setItem("ppp_user", JSON.stringify({ ...existing, ...data }));
}

function getReminders(): Reminder[] {
  try {
    const raw = localStorage.getItem("gx_reminders");
    return raw
      ? JSON.parse(raw)
      : [
          {
            id: "1",
            title: "Daily Coding Practice",
            time: "09:00",
            enabled: true,
          },
          {
            id: "2",
            title: "Weekly Goal Review",
            time: "18:00",
            enabled: true,
          },
          { id: "3", title: "Interview Prep", time: "20:00", enabled: false },
        ];
  } catch {
    return [];
  }
}

function saveReminders(reminders: Reminder[]) {
  localStorage.setItem("gx_reminders", JSON.stringify(reminders));
}

const roleLabels: Record<string, string> = {
  sde: "Software Developer",
  aiml: "AIML Engineer",
  data: "Data Analyst",
  core: "Core (Non-IT)",
};

const yearLabels: Record<string, string> = {
  "1": "1st Year",
  "2": "2nd Year",
  "3": "3rd Year",
  "4": "4th Year",
};

type ThemeMode = "dark" | "light" | "system";

function getThemeMode(): ThemeMode {
  const stored = localStorage.getItem("theme");
  if (stored === "dark") return "dark";
  if (stored === "light") return "light";
  return "system";
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === "dark") {
    root.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else if (mode === "light") {
    root.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    localStorage.removeItem("theme");
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }
}

/* ─────────────────────── Settings Modal ─────────────────────── */
function SettingsModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<
    "theme" | "reminders" | "policy" | "about"
  >("theme");
  const [themeMode, setThemeMode] = useState<ThemeMode>(getThemeMode);
  const [reminders, setReminders] = useState<Reminder[]>(getReminders);
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("09:00");

  const handleTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
    applyTheme(mode);
  };

  const toggleReminder = (id: string) => {
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, enabled: !r.enabled } : r,
    );
    setReminders(updated);
    saveReminders(updated);
  };

  const addReminder = () => {
    if (!newTitle.trim()) return;
    const updated = [
      ...reminders,
      {
        id: Date.now().toString(),
        title: newTitle.trim(),
        time: newTime,
        enabled: true,
      },
    ];
    setReminders(updated);
    saveReminders(updated);
    setNewTitle("");
    setNewTime("09:00");
  };

  const deleteReminder = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    saveReminders(updated);
  };

  const tabs = [
    { id: "theme" as const, label: "Theme", icon: Sun },
    { id: "reminders" as const, label: "Reminders", icon: Bell },
    { id: "policy" as const, label: "Policy", icon: Shield },
    { id: "about" as const, label: "About", icon: Info },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        role="presentation"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-brand">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-foreground">
                Settings
              </h2>
              <p className="text-muted-foreground text-xs">
                Manage your preferences
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border px-5 shrink-0">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-3 text-xs font-medium border-b-2 transition-colors ${
                activeTab === id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Theme */}
          {activeTab === "theme" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Choose how Gars X looks to you.
              </p>
              {(
                [
                  {
                    mode: "light" as ThemeMode,
                    icon: Sun,
                    label: "Light Mode",
                    desc: "Clean bright interface",
                  },
                  {
                    mode: "dark" as ThemeMode,
                    icon: Moon,
                    label: "Dark Mode",
                    desc: "Easy on the eyes at night",
                  },
                  {
                    mode: "system" as ThemeMode,
                    icon: Monitor,
                    label: "System Default",
                    desc: "Follow your device setting",
                  },
                ] as const
              ).map(({ mode, icon: Icon, label, desc }) => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => handleTheme(mode)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                    themeMode === mode
                      ? "border-primary gradient-brand-soft"
                      : "border-border hover:border-primary/30 bg-muted/30"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${themeMode === mode ? "gradient-brand shadow-brand" : "bg-accent"}`}
                  >
                    <Icon
                      className={`w-5 h-5 ${themeMode === mode ? "text-white" : "text-muted-foreground"}`}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">
                      {label}
                    </p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  {themeMode === mode && (
                    <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Reminders */}
          {activeTab === "reminders" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Manage your study reminders.
              </p>

              {/* Add new */}
              <div className="flex gap-2 p-3 rounded-xl bg-muted/50 border border-border">
                <Input
                  placeholder="Reminder title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="flex-1 text-sm h-8"
                  onKeyDown={(e) => e.key === "Enter" && addReminder()}
                />
                <Input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-24 text-sm h-8"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={addReminder}
                  className="gradient-brand text-white h-8 px-3"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>

              {/* Reminder list */}
              <div className="space-y-2">
                {reminders.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
                  >
                    <Bell
                      className={`w-4 h-4 shrink-0 ${r.enabled ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${r.enabled ? "text-foreground" : "text-muted-foreground line-through"}`}
                      >
                        {r.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{r.time}</p>
                    </div>
                    <Switch
                      checked={r.enabled}
                      onCheckedChange={() => toggleReminder(r.id)}
                    />
                    <button
                      type="button"
                      onClick={() => deleteReminder(r.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {reminders.length === 0 && (
                  <p className="text-center text-muted-foreground text-sm py-6">
                    No reminders yet. Add one above!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Policy */}
          {activeTab === "policy" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Read our policies and terms.
              </p>
              {[
                {
                  icon: Shield,
                  label: "Privacy Policy",
                  desc: "How we handle your data",
                  href: "#",
                },
                {
                  icon: FileText,
                  label: "Terms & Conditions",
                  desc: "Rules for using Gars X",
                  href: "#",
                },
                {
                  icon: Lock,
                  label: "Data Security",
                  desc: "All data stored locally on your device",
                  href: "#",
                },
              ].map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/30 hover:border-primary/30 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">
                      {label}
                    </p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* About */}
          {activeTab === "about" && (
            <div className="space-y-5">
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center shadow-brand mb-3">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display font-bold text-xl gradient-brand-text">
                  Gars X
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Crack Placements Faster
                </p>
              </div>
              <div className="space-y-2">
                {[
                  { label: "App Name", value: "Gars X" },
                  { label: "Version", value: "1.0.0" },
                  { label: "Platform", value: "Web (Internet Computer)" },
                  {
                    label: "Description",
                    value:
                      "Comprehensive placement prep for students — roadmap, quizzes, coding, resume, and more.",
                  },
                  { label: "Developer", value: "Gars X Team" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex gap-3 p-3 rounded-xl bg-muted/40"
                  >
                    <span className="text-xs text-muted-foreground w-24 shrink-0 pt-0.5">
                      {label}
                    </span>
                    <span className="text-xs text-foreground font-medium">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Main Component ─────────────────────── */
export function StudentDetails() {
  const [profile, setProfile] = useState<StudentProfile>(getProfile);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<StudentProfile>({});
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  const startEdit = () => {
    setForm({ ...profile });
    setEditing(true);
    setSaved(false);
  };

  const handleSave = () => {
    saveProfile(form);
    setProfile({ ...profile, ...form });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const field = (key: keyof StudentProfile) => form[key] ?? "";
  const set =
    (key: keyof StudentProfile) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-brand">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                Student Profile
              </h1>
              <p className="text-muted-foreground text-sm">
                Your personal and academic details
              </p>
            </div>
          </div>
          {/* Settings Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 border-primary/30 text-primary hover:bg-primary/5"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>

        {/* Avatar + name hero card */}
        <div className="relative rounded-2xl overflow-hidden mb-6 bg-card border border-border shadow-sm">
          {/* gradient strip */}
          <div className="h-24 gradient-brand opacity-80" />
          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="-mt-10 mb-4 flex items-end gap-4">
              <div className="w-20 h-20 rounded-2xl gradient-brand shadow-brand flex items-center justify-center border-4 border-card">
                <span className="text-white text-2xl font-bold">
                  {profile.fullName
                    ? profile.fullName
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                    : "ST"}
                </span>
              </div>
              <div className="pb-1 flex-1 min-w-0">
                <p className="text-foreground text-lg font-bold truncate">
                  {profile.fullName || "Student Name"}
                </p>
                <p className="text-muted-foreground text-sm truncate">
                  {profile.email || "—"}
                </p>
              </div>
              {!editing && (
                <Button
                  type="button"
                  size="sm"
                  onClick={startEdit}
                  className="gradient-brand text-white shadow-brand hover:opacity-90 transition-opacity shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                  Edit
                </Button>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {profile.year && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {yearLabels[profile.year] ?? `${profile.year} Year`}
                </span>
              )}
              {profile.branch && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                  {profile.branch}
                </span>
              )}
              {profile.targetRole && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400">
                  {roleLabels[profile.targetRole] ?? profile.targetRole}
                </span>
              )}
              {profile.skillLevel && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 capitalize">
                  {profile.skillLevel}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Detail cards */}
        {!editing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailCard
              icon={<Building2 className="w-4 h-4" />}
              label="College"
              value={profile.college}
            />
            <DetailCard
              icon={<BookOpen className="w-4 h-4" />}
              label="Branch"
              value={profile.branch}
            />
            <DetailCard
              icon={<Phone className="w-4 h-4" />}
              label="Mobile Number"
              value={profile.phone}
            />
            <DetailCard
              icon={<Mail className="w-4 h-4" />}
              label="Email"
              value={profile.email}
            />
            <DetailCard
              icon={<Calendar className="w-4 h-4" />}
              label="Date of Birth"
              value={profile.dob}
            />
            <DetailCard
              icon={<Users className="w-4 h-4" />}
              label="Gender"
              value={
                profile.gender === "male"
                  ? "Male"
                  : profile.gender === "female"
                    ? "Female"
                    : profile.gender === "other"
                      ? "Other"
                      : profile.gender
              }
            />
            <DetailCard
              icon={<GraduationCap className="w-4 h-4" />}
              label="Year"
              value={
                profile.year
                  ? (yearLabels[profile.year] ?? `${profile.year} Year`)
                  : undefined
              }
            />
            <DetailCard
              icon={<User className="w-4 h-4" />}
              label="Target Role"
              value={
                profile.targetRole
                  ? (roleLabels[profile.targetRole] ?? profile.targetRole)
                  : undefined
              }
            />
          </div>
        ) : (
          /* Edit form */
          <div className="rounded-2xl bg-card border border-border shadow-sm p-6 space-y-5">
            <h2 className="text-base font-semibold text-foreground">
              Edit Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-sm">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  value={field("fullName")}
                  onChange={set("fullName")}
                  placeholder="Your full name"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={field("email")}
                  onChange={set("email")}
                  placeholder="you@example.com"
                />
              </div>

              {/* College */}
              <div className="space-y-1.5">
                <Label htmlFor="college" className="text-sm">
                  College
                </Label>
                <Input
                  id="college"
                  value={field("college")}
                  onChange={set("college")}
                  placeholder="College name"
                />
              </div>

              {/* Branch */}
              <div className="space-y-1.5">
                <Label htmlFor="branch" className="text-sm">
                  Branch
                </Label>
                <Input
                  id="branch"
                  value={field("branch")}
                  onChange={set("branch")}
                  placeholder="e.g. CSE, ECE, Mech"
                />
              </div>

              {/* Mobile */}
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm">
                  Mobile Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={field("phone")}
                  onChange={set("phone")}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              {/* DOB */}
              <div className="space-y-1.5">
                <Label htmlFor="dob" className="text-sm">
                  Date of Birth
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={field("dob")}
                  onChange={set("dob")}
                />
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <Label htmlFor="gender" className="text-sm">
                  Gender
                </Label>
                <select
                  id="gender"
                  value={field("gender")}
                  onChange={set("gender")}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not">Prefer not to say</option>
                </select>
              </div>

              {/* Year */}
              <div className="space-y-1.5">
                <Label htmlFor="year" className="text-sm">
                  Year
                </Label>
                <select
                  id="year"
                  value={field("year")}
                  onChange={set("year")}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                >
                  <option value="">Select year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              {/* Target Role */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="targetRole" className="text-sm">
                  Target Role
                </Label>
                <select
                  id="targetRole"
                  value={field("targetRole")}
                  onChange={set("targetRole")}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                >
                  <option value="">Select target role</option>
                  <option value="sde">Software Developer</option>
                  <option value="aiml">AIML Engineer</option>
                  <option value="data">Data Analyst</option>
                  <option value="core">Core (Non-IT)</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={handleSave}
                className="gradient-brand text-white shadow-brand hover:opacity-90 flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Saved toast */}
        {saved && (
          <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-full shadow-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-4">
            <CheckCircle2 className="w-4 h-4" />
            Profile saved successfully!
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}

function DetailCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
      <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground text-xs mb-0.5">{label}</p>
        <p className="text-foreground text-sm font-medium truncate">
          {value || (
            <span className="text-muted-foreground/50 font-normal italic">
              Not set
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
