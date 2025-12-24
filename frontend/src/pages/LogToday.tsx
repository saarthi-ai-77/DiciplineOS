import { useState } from "react";
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
  const { todayLog, addLog, loading: hookLoading } = useDiscipline();
  const [submitting, setSubmitting] = useState(false);

  const [outreachDone, setOutreachDone] = useState(false);
  const [deliveryDone, setDeliveryDone] = useState(false);
  const [buildHours, setBuildHours] = useState("");
  const [learningHours, setLearningHours] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const buildH = parseInt(buildHours) || 0;
    const learnH = parseInt(learningHours) || 0;

    if (buildH < 0 || buildH > 12) {
      toast.error("Build hours must be between 0 and 12");
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
        build_hours: buildH,
        learning_hours: learnH,
        note: note.trim(),
      });

      toast.success("Log saved successfully");
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
        <p className="font-mono animate-pulse">LOADING...</p>
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

        {todayLog ? (
          <div className="space-y-6">
            <div className="bg-card border border-border p-6 space-y-4 opacity-50">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="outreach"
                  checked={todayLog.outreach_done}
                  disabled
                  className="border-border data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                />
                <Label htmlFor="outreach" className="text-sm font-mono text-foreground">
                  Outreach Done Today
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="delivery"
                  checked={todayLog.delivery_done}
                  disabled
                  className="border-border data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                />
                <Label htmlFor="delivery" className="text-sm font-mono text-foreground">
                  Delivery Progress Today
                </Label>
              </div>
            </div>

            <div className="bg-card border border-border p-6 space-y-4 opacity-50">
              <div>
                <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Build Hours (0-12)
                </Label>
                <Input
                  type="number"
                  value={todayLog.build_hours}
                  disabled
                  className="mt-2 bg-input border-border text-foreground font-mono"
                />
              </div>

              <div>
                <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Learning Hours (0-6)
                </Label>
                <Input
                  type="number"
                  value={todayLog.learning_hours}
                  disabled
                  className="mt-2 bg-input border-border text-foreground font-mono"
                />
              </div>
            </div>

            {todayLog.note && (
              <div className="bg-card border border-border p-6 opacity-50">
                <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Note
                </Label>
                <p className="mt-2 text-sm font-mono text-foreground">{todayLog.note}</p>
              </div>
            )}

            <div className="w-full bg-accent/20 border border-accent text-accent py-4 text-center font-mono uppercase tracking-wider">
              ✓ Logged for today
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-card border border-border p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="outreach"
                  checked={outreachDone}
                  onCheckedChange={(checked) => setOutreachDone(!!checked)}
                  className="border-border data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                />
                <Label
                  htmlFor="outreach"
                  className="text-sm font-mono text-foreground cursor-pointer"
                >
                  Outreach Done Today
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="delivery"
                  checked={deliveryDone}
                  onCheckedChange={(checked) => setDeliveryDone(!!checked)}
                  className="border-border data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                />
                <Label
                  htmlFor="delivery"
                  className="text-sm font-mono text-foreground cursor-pointer"
                >
                  Delivery Progress Today
                </Label>
              </div>
            </div>

            <div className="bg-card border border-border p-6 space-y-4">
              <div>
                <Label
                  htmlFor="build"
                  className="text-xs font-mono text-muted-foreground uppercase tracking-wider"
                >
                  Build Hours (0-12)
                </Label>
                <Input
                  id="build"
                  type="number"
                  min="0"
                  max="12"
                  value={buildHours}
                  onChange={(e) => setBuildHours(e.target.value)}
                  placeholder="0"
                  className="mt-2 bg-input border-border text-foreground font-mono"
                />
              </div>

              <div>
                <Label
                  htmlFor="learning"
                  className="text-xs font-mono text-muted-foreground uppercase tracking-wider"
                >
                  Learning Hours (0-6)
                </Label>
                <Input
                  id="learning"
                  type="number"
                  min="0"
                  max="6"
                  value={learningHours}
                  onChange={(e) => setLearningHours(e.target.value)}
                  placeholder="0"
                  className="mt-2 bg-input border-border text-foreground font-mono"
                />
              </div>
            </div>

            <div className="bg-card border border-border p-6">
              <Label
                htmlFor="note"
                className="text-xs font-mono text-muted-foreground uppercase tracking-wider"
              >
                Note (optional, max 140 chars)
              </Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={140}
                placeholder="Brief note about today..."
                className="mt-2 bg-input border-border text-foreground font-mono resize-none"
                rows={2}
              />
              <div className="text-right text-xs font-mono text-muted-foreground mt-1">
                {note.length}/140
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-mono uppercase tracking-wider"
            >
              {submitting ? "SAVING..." : "Save Log"}
            </Button>
          </form>
        )}
      </main>
    </div>
  );
};

export default LogToday;
