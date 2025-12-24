import { DailyLog, Project } from "@/types/discipline";
import { format, parseISO } from "date-fns";
import { useState, useMemo } from "react";

interface HeatmapProps {
  last30Days: { date: string; log: DailyLog | null }[];
  projects?: Project[];
}

const Heatmap = ({ last30Days, projects = [] }: HeatmapProps) => {
  const [hoveredDay, setHoveredDay] = useState<{ date: string; log: DailyLog | null } | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");

  const getIntensity = (log: DailyLog | null) => {
    if (!log) return 0;

    if (selectedProjectId === "all") {
      return log.build_hours > 0 ? 1 : 0;
    }

    const projectLog = log.log_projects?.find(lp => lp.project_id === selectedProjectId);
    return projectLog && projectLog.hours > 0 ? 1 : 0;
  };

  return (
    <div className="bg-card border border-border p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          Consistency Heatmap
        </h2>

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
          return (
            <div
              key={date}
              className={`aspect-square cursor-pointer transition-all ${intensity > 0 ? "bg-accent hover:bg-accent/80" : "bg-secondary hover:bg-secondary/80"
                }`}
              onMouseEnter={() => setHoveredDay({ date, log })}
              onMouseLeave={() => setHoveredDay(null)}
            />
          );
        })}
      </div>

      {hoveredDay && (
        <div className="bg-secondary border border-border p-3 text-xs font-mono">
          <div className="text-foreground mb-2">
            {format(parseISO(hoveredDay.date), "MMM d, yyyy")}
          </div>
          {hoveredDay.log ? (
            <div className="text-muted-foreground space-y-1">
              <div>Total Build: {hoveredDay.log.build_hours}h</div>
              {hoveredDay.log.log_projects && hoveredDay.log.log_projects.length > 0 && (
                <div className="border-t border-border mt-1 pt-1 opacity-70">
                  {hoveredDay.log.log_projects.map(lp => (
                    <div key={lp.id}>{lp.project?.name || "Project"}: {lp.hours}h</div>
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
