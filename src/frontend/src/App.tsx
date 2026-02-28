import { Layout } from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";
import { useActor } from "@/hooks/useActor";
import { AIAssistant } from "@/pages/AIAssistant";
import { AuthFlow } from "@/pages/AuthFlow";
import { CodeEditor } from "@/pages/CodeEditor";
import { Dashboard } from "@/pages/Dashboard";
import { InternshipTracker } from "@/pages/InternshipTracker";
import { QuizArena } from "@/pages/QuizArena";
import { ResumeBuilder } from "@/pages/ResumeBuilder";
import { SkillGapAnalyzer } from "@/pages/SkillGapAnalyzer";
import { SkillRoadmap } from "@/pages/SkillRoadmap";
import { StudentDetails } from "@/pages/StudentDetails";
import { useEffect, useState } from "react";

export type Route =
  | "/"
  | "/roadmap"
  | "/practice"
  | "/gap-analyzer"
  | "/resume"
  | "/internships"
  | "/ai-assistant"
  | "/student"
  | "/code-editor";

function getInitialRoute(): Route {
  const hash = window.location.hash.replace("#", "") as Route;
  const validRoutes: Route[] = [
    "/",
    "/roadmap",
    "/practice",
    "/gap-analyzer",
    "/resume",
    "/internships",
    "/ai-assistant",
    "/student",
    "/code-editor",
  ];
  return validRoutes.includes(hash) ? hash : "/";
}

function AppInit({ children }: { children: React.ReactNode }) {
  const { actor, isFetching } = useActor();

  useEffect(() => {
    if (actor && !isFetching) {
      actor.initialize().catch(console.error);
    }
  }, [actor, isFetching]);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (
      stored === "dark" ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return <>{children}</>;
}

function PageView({
  route,
  navigate,
}: { route: Route; navigate: (r: Route) => void }) {
  switch (route) {
    case "/":
      return <Dashboard navigate={navigate} />;
    case "/roadmap":
      return <SkillRoadmap />;
    case "/practice":
      return <QuizArena />;
    case "/gap-analyzer":
      return <SkillGapAnalyzer />;
    case "/resume":
      return <ResumeBuilder />;
    case "/internships":
      return <InternshipTracker />;
    case "/ai-assistant":
      return <AIAssistant />;
    case "/student":
      return <StudentDetails />;
    case "/code-editor":
      return <CodeEditor />;
    default:
      return <Dashboard navigate={navigate} />;
  }
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("ppp_auth") === "true",
  );
  const [appVisible, setAppVisible] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<Route>(getInitialRoute);

  const navigate = (route: Route) => {
    setCurrentRoute(route);
    window.location.hash = route;
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (isAuthenticated) {
      // Small delay then fade in the main app
      const t = setTimeout(() => setAppVisible(true), 30);
      return () => clearTimeout(t);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") as Route;
      const validRoutes: Route[] = [
        "/",
        "/roadmap",
        "/practice",
        "/gap-analyzer",
        "/resume",
        "/internships",
        "/ai-assistant",
        "/student",
        "/code-editor",
      ];
      if (validRoutes.includes(hash)) {
        setCurrentRoute(hash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // second validRoutes list used in the hashchange effect - also needs /student
  // (handled inline above)

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("ppp_auth");
    localStorage.removeItem("ppp_remember");
    setIsAuthenticated(false);
    setAppVisible(false);
    setCurrentRoute("/");
    window.location.hash = "";
  };

  if (!isAuthenticated) {
    return (
      <>
        <AuthFlow onAuthenticated={handleAuthenticated} />
        <Toaster richColors position="top-right" />
      </>
    );
  }

  return (
    <AppInit>
      <div
        className={`transition-opacity duration-500 ${appVisible ? "opacity-100" : "opacity-0"}`}
      >
        <Layout
          currentRoute={currentRoute}
          navigate={navigate}
          onLogout={handleLogout}
        >
          <PageView route={currentRoute} navigate={navigate} />
        </Layout>
      </div>
      <Toaster richColors position="top-right" />
    </AppInit>
  );
}
