import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Bot,
  Briefcase,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Map as MapIcon,
  Menu,
  Moon,
  Sun,
  Target,
  Terminal,
  Trophy,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Route } from "../App";

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

function getProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem("ppp_user");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function getInitials(name?: string): string {
  if (!name) return "ST";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const roleLabels: Record<string, string> = {
  sde: "Software Dev",
  aiml: "AIML Engineer",
  data: "Data Analyst",
  core: "Core (Non-IT)",
};

const navItems: {
  path: Route;
  label: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  { path: "/", label: "Home", icon: LayoutDashboard },
  { path: "/roadmap", label: "Skill Roadmap", icon: MapIcon },
  { path: "/code-editor", label: "Code Practice", icon: Terminal },
  { path: "/practice", label: "Quizzzzzz", icon: Trophy },
  { path: "/ai-assistant", label: "AI Assistant", icon: Bot },
  { path: "/gap-analyzer", label: "Gap Analyzer", icon: Target },
  { path: "/resume", label: "Resume Builder", icon: FileText },
  { path: "/internships", label: "Internships", icon: Briefcase },
  { path: "/student", label: "ST (Student)", icon: GraduationCap },
];

interface LayoutProps {
  children: React.ReactNode;
  currentRoute: Route;
  navigate: (route: Route) => void;
  onLogout: () => void;
}

export function Layout({
  children,
  currentRoute,
  navigate,
  onLogout,
}: LayoutProps) {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profile = getProfile();

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const handleNav = (path: Route) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-sidebar border-r border-sidebar-border overflow-y-auto">
        {/* Logo */}
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center gradient-brand shadow-brand">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sidebar-foreground font-display font-bold text-sm leading-tight">
                Gars X
              </p>
              <p className="text-sidebar-foreground/50 text-[10px]">
                Crack Placements Faster
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = currentRoute === path;
            return (
              <button
                type="button"
                key={path}
                onClick={() => handleNav(path)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 w-full text-left",
                  active
                    ? "bg-sidebar-accent text-sidebar-foreground"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                )}
              >
                <span
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0",
                    active
                      ? "gradient-brand shadow-brand"
                      : "bg-sidebar-accent/50",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      active ? "text-white" : "text-sidebar-foreground/60",
                    )}
                  />
                </span>
                {label}
              </button>
            );
          })}
        </nav>

        {/* Profile card + controls */}
        <div className="p-4 border-t border-sidebar-border space-y-3">
          {/* Student info card */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-sidebar-accent/60 border border-sidebar-border">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center shrink-0 shadow-brand">
              <span className="text-white text-[11px] font-bold">
                {getInitials(profile.fullName)}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sidebar-foreground text-xs font-semibold truncate leading-tight">
                {profile.fullName || "Student"}
              </p>
              <p className="text-sidebar-foreground/50 text-[10px] truncate leading-tight">
                {profile.email || "—"}
              </p>
            </div>
            <User className="w-3.5 h-3.5 text-sidebar-foreground/40 shrink-0" />
          </div>

          {/* College + role row */}
          {(profile.college ||
            profile.targetRole ||
            profile.phone ||
            profile.dob ||
            profile.gender) && (
            <div className="px-3 space-y-1">
              {profile.college && (
                <p className="text-sidebar-foreground/50 text-[10px] truncate">
                  {profile.college}
                  {profile.year ? ` · ${profile.year} Year` : ""}
                  {profile.branch ? ` · ${profile.branch}` : ""}
                </p>
              )}
              {profile.targetRole && (
                <p className="text-sidebar-foreground/50 text-[10px]">
                  Target: {roleLabels[profile.targetRole] ?? profile.targetRole}
                  {profile.skillLevel ? ` · ${profile.skillLevel}` : ""}
                </p>
              )}
              {profile.phone && (
                <p className="text-sidebar-foreground/50 text-[10px] truncate">
                  📞 {profile.phone}
                </p>
              )}
              {profile.dob && (
                <p className="text-sidebar-foreground/50 text-[10px]">
                  🎂 {profile.dob}
                </p>
              )}
              {profile.gender && (
                <p className="text-sidebar-foreground/50 text-[10px] capitalize">
                  ⚥{" "}
                  {profile.gender === "male"
                    ? "Male"
                    : profile.gender === "female"
                      ? "Female"
                      : "Prefer not to say"}
                </p>
              )}
            </div>
          )}

          {/* Theme toggle */}
          <button
            type="button"
            onClick={() => setIsDark(!isDark)}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all"
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          role="presentation"
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-sidebar flex flex-col transition-transform duration-300",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-5 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center gradient-brand shadow-brand">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sidebar-foreground font-display font-bold text-sm leading-tight">
                Gars X
              </p>
              <p className="text-sidebar-foreground/50 text-[10px]">
                Crack Placements Faster
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sidebar-foreground/60"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = currentRoute === path;
            return (
              <button
                type="button"
                key={path}
                onClick={() => handleNav(path)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all w-full text-left",
                  active
                    ? "bg-sidebar-accent text-sidebar-foreground"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                )}
              >
                <span
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    active
                      ? "gradient-brand shadow-brand"
                      : "bg-sidebar-accent/50",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      active ? "text-white" : "text-sidebar-foreground/60",
                    )}
                  />
                </span>
                {label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-3">
          {/* Student info */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-sidebar-accent/60 border border-sidebar-border">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center shrink-0 shadow-brand">
              <span className="text-white text-[11px] font-bold">
                {getInitials(profile.fullName)}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sidebar-foreground text-xs font-semibold truncate leading-tight">
                {profile.fullName || "Student"}
              </p>
              <p className="text-sidebar-foreground/50 text-[10px] truncate leading-tight">
                {profile.email || "—"}
              </p>
            </div>
          </div>

          {(profile.college ||
            profile.targetRole ||
            profile.phone ||
            profile.dob ||
            profile.gender) && (
            <div className="px-3 space-y-1">
              {profile.college && (
                <p className="text-sidebar-foreground/50 text-[10px] truncate">
                  {profile.college}
                  {profile.year ? ` · ${profile.year} Year` : ""}
                  {profile.branch ? ` · ${profile.branch}` : ""}
                </p>
              )}
              {profile.targetRole && (
                <p className="text-sidebar-foreground/50 text-[10px]">
                  Target: {roleLabels[profile.targetRole] ?? profile.targetRole}
                  {profile.skillLevel ? ` · ${profile.skillLevel}` : ""}
                </p>
              )}
              {profile.phone && (
                <p className="text-sidebar-foreground/50 text-[10px] truncate">
                  📞 {profile.phone}
                </p>
              )}
              {profile.dob && (
                <p className="text-sidebar-foreground/50 text-[10px]">
                  🎂 {profile.dob}
                </p>
              )}
              {profile.gender && (
                <p className="text-sidebar-foreground/50 text-[10px] capitalize">
                  ⚥{" "}
                  {profile.gender === "male"
                    ? "Male"
                    : profile.gender === "female"
                      ? "Female"
                      : "Prefer not to say"}
                </p>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsDark(!isDark)}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all"
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-2.5 bg-card border-b border-border relative overflow-hidden">
          {/* gradient bottom line */}
          <span className="absolute bottom-0 left-0 right-0 h-px gradient-brand opacity-60" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center gradient-brand shadow-brand">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-sm">Gars X</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsDark(!isDark)}
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>

        {/* Mobile bottom navigation */}
        <nav className="lg:hidden flex items-stretch bg-card border-t border-border px-1 pb-safe">
          {navItems.slice(0, 5).map(({ path, label, icon: Icon }) => {
            const active = currentRoute === path;
            return (
              <button
                type="button"
                key={path}
                onClick={() => handleNav(path)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 py-2 px-1 relative transition-colors duration-150",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {/* Active top-line accent */}
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-b-full gradient-brand" />
                )}
                {/* Icon pill */}
                <span
                  className={cn(
                    "w-9 h-7 rounded-lg flex items-center justify-center transition-all duration-150",
                    active ? "gradient-brand shadow-brand" : "bg-transparent",
                  )}
                >
                  <Icon className={cn("w-4 h-4", active ? "text-white" : "")} />
                </span>
                <span
                  className={cn(
                    "text-[9px] font-semibold leading-none",
                    active ? "text-primary" : "",
                  )}
                >
                  {label.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
