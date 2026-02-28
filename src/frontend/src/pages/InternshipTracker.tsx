import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddInternshipApplication,
  useDeleteInternshipApplication,
  useInternshipApplications,
  useUpdateInternshipApplication,
} from "@/hooks/useQueries";
import { Briefcase, Edit2, Filter, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { InternshipApplication } from "../backend.d";

const STATUS_OPTIONS = [
  "Applied",
  "Interview Scheduled",
  "Selected",
  "Rejected",
];

const STATUS_COLORS: Record<string, string> = {
  Applied: "bg-info/10 text-info border-info/20",
  "Interview Scheduled": "bg-warning/10 text-warning border-warning/20",
  Selected: "bg-success/10 text-success border-success/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

const STATUS_DOT: Record<string, string> = {
  Applied: "bg-info",
  "Interview Scheduled": "bg-warning",
  Selected: "bg-success",
  Rejected: "bg-destructive",
};

const DEFAULT_APP: Omit<InternshipApplication, "id"> = {
  company: "",
  role: "",
  dateApplied: new Date().toISOString().split("T")[0],
  status: "Applied",
};

function AppForm({
  initial,
  onSave,
  onCancel,
  isPending,
}: {
  initial: Omit<InternshipApplication, "id">;
  onSave: (data: Omit<InternshipApplication, "id">) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [form, setForm] = useState(initial);
  const update = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Company Name *</Label>
          <Input
            placeholder="Google, Microsoft..."
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Role *</Label>
          <Input
            placeholder="Software Engineer Intern"
            value={form.role}
            onChange={(e) => update("role", e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Date Applied</Label>
          <Input
            type="date"
            value={form.dateApplied}
            onChange={(e) => update("dateApplied", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(v) => update("status", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() => onSave(form)}
          disabled={isPending || !form.company || !form.role}
          className="gradient-brand text-white border-0 shadow-brand"
        >
          {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Application
        </Button>
      </div>
    </div>
  );
}

export function InternshipTracker() {
  const { data: apps = [], isLoading } = useInternshipApplications();
  const addApp = useAddInternshipApplication();
  const updateApp = useUpdateInternshipApplication();
  const deleteApp = useDeleteInternshipApplication();

  const [showAdd, setShowAdd] = useState(false);
  const [editingApp, setEditingApp] = useState<InternshipApplication | null>(
    null,
  );
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"date" | "company">("date");

  const handleAdd = async (data: Omit<InternshipApplication, "id">) => {
    try {
      await addApp.mutateAsync({ ...data, id: `app_${Date.now()}` });
      toast.success("Application added!");
      setShowAdd(false);
    } catch {
      toast.error("Failed to add application");
    }
  };

  const handleUpdate = async (data: Omit<InternshipApplication, "id">) => {
    if (!editingApp) return;
    try {
      await updateApp.mutateAsync({ ...data, id: editingApp.id });
      toast.success("Application updated!");
      setEditingApp(null);
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteApp.mutateAsync(id);
      toast.success("Application removed");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const filteredApps = apps
    .filter((a) => statusFilter === "All" || a.status === statusFilter)
    .sort((a, b) => {
      if (sortBy === "company") return a.company.localeCompare(b.company);
      return (
        new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime()
      );
    });

  const stats = {
    total: apps.length,
    selected: apps.filter((a) => a.status === "Selected").length,
    interview: apps.filter((a) => a.status === "Interview Scheduled").length,
    rejected: apps.filter((a) => a.status === "Rejected").length,
  };
  const selectedRate =
    stats.total > 0 ? Math.round((stats.selected / stats.total) * 100) : 0;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-brand-text">
            Internship Tracker
          </h1>
          <p className="text-muted-foreground mt-1">
            Track all your internship applications in one place
          </p>
        </div>
        <Button
          onClick={() => setShowAdd(true)}
          className="gradient-brand text-white border-0 shadow-brand gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Application
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Applied", value: stats.total, color: "text-primary" },
          { label: "Selected", value: stats.selected, color: "text-success" },
          {
            label: "Interviews",
            value: stats.interview,
            color: "text-warning",
          },
          {
            label: "Success Rate",
            value: `${selectedRate}%`,
            color: "text-brand-purple",
          },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/60">
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-display font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <div className="flex gap-2 flex-wrap">
          {["All", ...STATUS_OPTIONS].map((status) => (
            <button
              type="button"
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                statusFilter === status
                  ? "gradient-brand text-white shadow-brand"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {status}{" "}
              {status !== "All" &&
                `(${apps.filter((a) => a.status === status).length})`}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Sort by:</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortBy(sortBy === "date" ? "company" : "date")}
            className="text-xs h-7"
          >
            {sortBy === "date" ? "Date" : "Company"}
          </Button>
        </div>
      </div>

      {/* Applications list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="font-display font-bold text-lg text-foreground">
            No applications yet
          </p>
          <p className="text-sm mt-1">Start tracking your internship hunt!</p>
        </div>
      ) : (
        <div className="space-y-3 stagger-children">
          {filteredApps.map((app) => (
            <Card key={app.id} className="border-border/60 card-hover">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl gradient-brand-soft flex items-center justify-center shrink-0">
                      <span className="font-display font-bold text-sm gradient-brand-text">
                        {app.company.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display font-bold">{app.company}</h3>
                      <p className="text-muted-foreground text-sm">
                        {app.role}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-muted-foreground">
                          Applied:{" "}
                          {new Date(app.dateApplied).toLocaleDateString(
                            "en-IN",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </span>
                        <Badge
                          className={`text-xs ${STATUS_COLORS[app.status] || "bg-muted text-muted-foreground"}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${STATUS_DOT[app.status] || "bg-muted-foreground"}`}
                          />
                          {app.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditingApp(app)}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(app.id)}
                      disabled={deleteApp.isPending}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Add Application</DialogTitle>
          </DialogHeader>
          <AppForm
            initial={DEFAULT_APP}
            onSave={handleAdd}
            onCancel={() => setShowAdd(false)}
            isPending={addApp.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog
        open={!!editingApp}
        onOpenChange={(open) => !open && setEditingApp(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Application</DialogTitle>
          </DialogHeader>
          {editingApp && (
            <AppForm
              initial={{
                company: editingApp.company,
                role: editingApp.role,
                dateApplied: editingApp.dateApplied,
                status: editingApp.status,
              }}
              onSave={handleUpdate}
              onCancel={() => setEditingApp(null)}
              isPending={updateApp.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
