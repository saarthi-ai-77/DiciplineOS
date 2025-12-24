import { useState, useMemo } from "react";
import { useDiscipline } from "@/hooks/useDiscipline";
import Navigation from "@/components/Navigation";
import StatusBar from "@/components/StatusBar";
import WeeklyChart from "@/components/WeeklyChart";
import Heatmap from "@/components/Heatmap";
import ActionScore from "@/components/ActionScore";
import SearchBar from "@/components/SearchBar";
import { format, parseISO } from "date-fns";
import { getMovingAverage, getTimeToLog } from "@/lib/discipline";

const Dashboard = () => {
  const {
    logs,
    streak,
    todayLog,
    projects,
    completionPercentage,
    last7Days,
    last30Days,
    weeklyStats,
    loading,
  } = useDiscipline();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return logs.filter(log =>
      log.note.toLowerCase().includes(query)
    );
  }, [logs, searchQuery]);

  const movingAverage7d = useMemo(() => getMovingAverage(logs, 7), [logs]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-4xl flex items-center justify-center h-[50vh]">
          <p className="font-mono animate-pulse uppercase tracking-widest text-muted-foreground">
            Loading System...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <StatusBar
          streak={streak}
          isLoggedToday={!!todayLog}
          completionPercentage={completionPercentage}
          weeklyDelta={weeklyStats.weeklyDelta}
        />

        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {searchQuery ? (
          <div className="space-y-4 mb-8">
            <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              Search Results ({filteredLogs.length})
            </h2>
            {filteredLogs.length > 0 ? (
              <div className="grid gap-2">
                {filteredLogs.map(log => (
                  <div key={log.id} className="bg-card border border-border p-4 flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex gap-2 items-center">
                        <span className="text-xs font-mono text-muted-foreground">
                          {format(parseISO(log.date), "MMM d, yyyy")}
                        </span>
                        <span className="text-[10px] font-mono text-accent/60 bg-accent/5 px-1 px-1 py-0.5">
                          {getTimeToLog(log)}
                        </span>
                      </div>
                      <div className="text-sm font-mono text-foreground">{log.note}</div>
                    </div>
                    <div className="text-xs font-mono font-bold text-accent">
                      {log.build_hours} HRS
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm font-mono text-muted-foreground">No matches found in logs.</div>
            )}
          </div>
        ) : (
          <>
            <WeeklyChart last7Days={last7Days} movingAverage7d={movingAverage7d} />
            <Heatmap last30Days={last30Days} projects={projects} />
            <ActionScore todayLog={todayLog} />
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
