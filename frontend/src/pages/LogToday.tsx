import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDiscipline } from "@/hooks/useDiscipline";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const LogToday = () => {
  const navigate = useNavigate();
  const {
    todayLog,
    projects,
    customDisciplines,
    addLog,
    loading: hookLoading
  } = useDiscipline();

  const [submitting, setSubmitting] = useState(false);

  const [outreachDone, setOutreachDone] = useState(false);
  const [deliveryDone, setDeliveryDone] = useState(false);
  const [learningHours, setLearningHours] = useState("");
  const [note, setNote] = useState("");

  // State for dynamic inputs
  const [projectHours, setProjectHours] = useState<Record<string, string>>({});
  const [customResults, setCustomResults] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (todayLog) {
      setOutreachDone(todayLog.outreach_done);
      setDeliveryDone(todayLog.delivery_done);
      setLearningHours(todayLog.learning_hours.toString());
      setNote(todayLog.note);

      const pours: Record<string, string> = {};
      todayLog.log_projects?.forEach(lp => {
        pours[lp.project_id] = lp.hours.toString();
      });
      setProjectHours(pours);
      setCustomResults(todayLog.custom_results || {});
    }
  }, [todayLog]);

  const handleProjectHourChange = (projectId: string, value: string) => {
    setProjectHours(prev => ({ ...prev, [projectId]: value }));
  };

  const handleCustomDisciplineChange = (disciplineId: string, checked: boolean) => {
    setCustomResults(prev => ({ ...prev, [disciplineId]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const learnH = parseInt(learningHours) || 0;
    const projectBreakdown = Object.entries(projectHours)
      .map(([id, hours]) => ({ project_id: id, hours: parseInt(hours) || 0 }))
      .filter(p => p.hours > 0);

    const totalBuildH = projectBreakdown.reduce((sum, p) => sum + p.hours, 0);

    if (totalBuildH > 12) {
      toast.error("Total build hours cannot exceed 12");
      return;
    }

    if (learnH < 0 || learnH > 6) {
      toast.error("Learning hours must be between 0 and 6");
      return;
    }

    if (note.length > 140) {
      toast.error("Note must be 140 characters or less");
      return;
    }

    setSubmitting(true);
    try {
      await addLog({
        outreach_done: outreachDone,
        delivery_done: deliveryDone,
        build_hours: totalBuildH,
        learning_hours: learnH,
        note: note.trim(),
        custom_results: customResults,
      }, projectBreakdown);

      toast.success("Daily execution logged");
      navigate("/");
    } catch (error) {
      // Error handled by hook toasts
    } finally {
      setSubmitting(false);
    }
  };

  if (hookLoading && !todayLog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-mono animate-pulse">LOADING LOG INTERFACE...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 max-w-lg">
        <h1 className="text-xl font-mono font-bold text-foreground mb-6 uppercase tracking-wider">
          Log Today
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Core Disciplines */}
          <div className="bg-card border border-border p-6 space-y-4">
            <h2 className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] mb-4">Core Execution</h2>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="outreach"
                checked={outreachDone}
                onCheckedChange={(checked) => setOutreachDone(!!checked)}
                disabled={!!todayLog}
                className="border-border data-[state=checked]:bg-accent data-[state=checked]:border-accent"
              />
              <Label htmlFor="outreach" className="text-sm font-mono text-foreground cursor-pointer">
                Outreach Done
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="delivery"
                checked={deliveryDone}
                onCheckedChange={(checked) => setDeliveryDone(!!checked)}
                disabled={!!todayLog}
                className="border-border data-[state=checked]:bg-accent data-[state=checked]:border-accent"
              />
              <Label htmlFor="delivery" className="text-sm font-mono text-foreground cursor-pointer">
                Delivery Progress
              </Label>
            </div>
          </div>

          {/* Custom Disciplines */}
          {customDisciplines.length > 0 && (
            <div className="bg-card border border-border p-6 space-y-4">
              <h2 className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] mb-4">Custom Disciplines</h2>
              {customDisciplines.map(disc => (
                <div key={disc.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={disc.id}
                    checked={customResults[disc.id] || false}
                    onCheckedChange={(checked) => handleCustomDisciplineChange(disc.id, !!checked)}
                    disabled={!!todayLog}
                    className="border-border data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                  />
                  <Label htmlFor={disc.id} className="text-sm font-mono text-foreground cursor-pointer">
                    {disc.name}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {/* Project Breakdown */}
          <div className="bg-card border border-border p-6 space-y-4">
            <h2 className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] mb-4">Project Hours</h2>
            {projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map(project => (
                  <div key={project.id}>
                    <Label className="text-[10px] font-mono text-muted-foreground uppercase mb-1 block">
                      {project.name}
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      max="12"
                      value={projectHours[project.id] || ""}
                      onChange={(e) => handleProjectHourChange(project.id, e.target.value)}
                      disabled={!!todayLog}
                      className="bg-input border-border text-foreground font-mono text-sm"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs font-mono text-muted-foreground italic">
                No projects defined. Configure in Systems.
              </div>
            )}
          </div>

          {/* General Stats */}
          <div className="bg-card border border-border p-6 space-y-4">
            <h2 className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] mb-4">General</h2>
            <div>
              <Label htmlFor="learning" className="text-[10px] font-mono text-muted-foreground uppercase">
                Learning Hours (0-6)
              </Label>
              <Input
                id="learning"
                type="number"
                min="0"
                max="6"
                value={learningHours}
                onChange={(e) => setLearningHours(e.target.value)}
                disabled={!!todayLog}
                placeholder="0"
                className="mt-1 bg-input border-border text-foreground font-mono"
              />
            </div>

            <div>
              <Label htmlFor="note" className="text-[10px] font-mono text-muted-foreground uppercase">
                Note (max 140)
              </Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={!!todayLog}
                maxLength={140}
                placeholder="Brief summary..."
                className="mt-1 bg-input border-border text-foreground font-mono resize-none"
                rows={2}
              />
            </div>
          </div>

          {!todayLog && (
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-mono uppercase tracking-wider h-12"
            >
              {submitting ? "RECORDING..." : "Record Execution"}
            </Button>
          )}

          {todayLog && (
            <div className="w-full bg-accent/10 border border-accent/20 text-accent py-4 text-center font-mono text-xs uppercase tracking-widest">
              ✓ Systems Synchronized for Today
            </div>
          )}
        </form>
      </main>
    </div>
  );
};

export default LogToday;
