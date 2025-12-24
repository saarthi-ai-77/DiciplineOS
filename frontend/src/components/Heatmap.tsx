import { DailyLog, Project } from "@/types/discipline";
import { format, parseISO } from "date-fns";
import { useState, useMemo } from "react";

interface HeatmapProps {
  last30Days: { date: string; log: DailyLog | null }[];
  projects?: Project[];
}

const Heatmap = ({ last30Days, projects = [] }: HeatmapProps) => {
  const [hoveredDay, setHoveredDay] = useState<{ date: string; log: DailyLog | null } | null>(null);
  const [selectedDay, setSelectedDay] = useState<{ date: string; log: DailyLog | null } | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");

  const getIntensity = (log: DailyLog | null) => {
    if (!log) return 0;

    if (selectedProjectId === "all") {
      return log.build_hours > 0 ? 1 : 0;
    }

    const projectLog = log.log_projects?.find(lp => lp.project_id === selectedProjectId);
    return projectLog && projectLog.hours > 0 ? 1 : 0;
  };

  const activeDay = selectedDay || hoveredDay;

  return (
    <div className="bg-card border border-border p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Consistency Heatmap
          </h2>
          <p className="text-[10px] font-mono text-muted-foreground/50 lowercase">
            Click to lock day details
          </p>
        </div>

        {projects.length > 0 && (
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-background border border-border text-[10px] font-mono uppercase tracking-wider px-2 py-1 outline-none"
          >
            <option value="all">Global Execution</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        )}
      </div>

      <div className="grid grid-cols-10 gap-1 mb-4">
        {last30Days.map(({ date, log }) => {
          const intensity = getIntensity(log);
          const isSelected = selectedDay?.date === date;
          return (
            <div
              key={date}
              className={`aspect-square cursor-pointer transition-all border-2 ${isSelected ? "border-accent scale-105 z-10" : "border-transparent"
                } ${intensity > 0 ? "bg-accent hover:bg-accent/80" : "bg-secondary hover:bg-secondary/80"
                }`}
              onMouseEnter={() => setHoveredDay({ date, log })}
              onMouseLeave={() => setHoveredDay(null)}
              onClick={() => setSelectedDay(isSelected ? null : { date, log })}
            />
          );
        })}
      </div>

      {activeDay && (
        <div className={`bg-secondary border p-3 text-xs font-mono transition-colors ${selectedDay ? 'border-accent/40' : 'border-border'}`}>
          <div className="flex justify-between items-start mb-2">
            <div className="text-foreground">
              {format(parseISO(activeDay.date), "MMM d, yyyy")}
            </div>
            {selectedDay && (
              <button
                onClick={() => setSelectedDay(null)}
                className="text-[10px] text-muted-foreground hover:text-foreground uppercase tracking-tighter"
              >
                [unlock]
              </button>
            )}
          </div>
          {activeDay.log ? (
            <div className="text-muted-foreground space-y-2">
              <div className="flex justify-between">
                <span>Total Build: {activeDay.log.build_hours}h</span>
                <span>Learn: {activeDay.log.learning_hours}h</span>
              </div>

              {activeDay.log.note && (
                <div className="bg-background/50 p-2 border-l-2 border-accent/20 italic text-foreground/90 whitespace-pre-wrap">
                  "{activeDay.log.note}"
                </div>
              )}

              {activeDay.log.log_projects && activeDay.log.log_projects.length > 0 && (
                <div className="border-t border-border mt-1 pt-1 opacity-70 text-[10px]">
                  {activeDay.log.log_projects.map(lp => (
                    <div key={lp.id} className="flex justify-between">
                      <span>{lp.project?.name || "Project"}</span>
                      <span>{lp.hours}h</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-muted-foreground italic">No system logs recorded.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Heatmap;
