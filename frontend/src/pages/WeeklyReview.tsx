import { useDiscipline } from "@/hooks/useDiscipline";
import Navigation from "@/components/Navigation";
import { format, parseISO } from "date-fns";

const WeeklyReview = () => {
  const { weeklyStats, loading } = useDiscipline();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-lg flex items-center justify-center h-[50vh]">
          <p className="font-mono animate-pulse uppercase tracking-widest text-muted-foreground">
            Synchronizing...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-lg">
        <h1 className="text-xl font-mono font-bold text-foreground mb-6 uppercase tracking-wider">
          Weekly Review
        </h1>

        <div className="space-y-4">
          <div className="bg-card border border-border p-6">
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
              Total Build Hours
            </div>
            <div className="text-4xl font-mono font-bold text-accent">
              {weeklyStats.totalBuildHours}
              <span className="text-lg text-muted-foreground ml-1">hrs</span>
            </div>
          </div>

          <div className="bg-card border border-border p-6">
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
              Total Learning Hours
            </div>
            <div className="text-4xl font-mono font-bold text-foreground">
              {weeklyStats.totalLearningHours}
              <span className="text-lg text-muted-foreground ml-1">hrs</span>
            </div>
          </div>

          <div className="bg-card border border-border p-6">
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
              Days Logged
            </div>
            <div className="text-4xl font-mono font-bold text-foreground">
              {weeklyStats.daysLogged}
              <span className="text-lg text-muted-foreground ml-1">/ 7</span>
            </div>
            <div className="mt-2 h-2 bg-secondary">
              <div
                className="h-full bg-accent transition-all"
                style={{ width: `${(weeklyStats.daysLogged / 7) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-card border border-border p-6">
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
              Best Day
            </div>
            {weeklyStats.bestDay ? (
              <div>
                <div className="text-2xl font-mono font-bold text-foreground">
                  {format(parseISO(weeklyStats.bestDay.date), "EEEE")}
                </div>
                <div className="text-sm font-mono text-muted-foreground">
                  {weeklyStats.bestDay.buildHours} build hours
                </div>
              </div>
            ) : (
              <div className="text-lg font-mono text-muted-foreground">
                No data yet
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WeeklyReview;
