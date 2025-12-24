import { DailyLog } from "@/types/discipline";
import { format, parseISO } from "date-fns";
import { useState } from "react";

interface HeatmapProps {
  last30Days: { date: string; log: DailyLog | null }[];
}

const Heatmap = ({ last30Days }: HeatmapProps) => {
  const [hoveredDay, setHoveredDay] = useState<{ date: string; log: DailyLog | null } | null>(null);

  return (
    <div className="bg-card border border-border p-6 mb-6">
      <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">
        30-Day Consistency
      </h2>

      <div className="grid grid-cols-10 gap-1 mb-4">
        {last30Days.map(({ date, log }) => (
          <div
            key={date}
            className={`aspect-square cursor-pointer transition-all ${
              log ? "bg-accent hover:bg-accent/80" : "bg-secondary hover:bg-secondary/80"
            }`}
            onMouseEnter={() => setHoveredDay({ date, log })}
            onMouseLeave={() => setHoveredDay(null)}
          />
        ))}
      </div>

      {hoveredDay && (
        <div className="bg-secondary border border-border p-3 text-xs font-mono">
          <div className="text-foreground mb-2">
            {format(parseISO(hoveredDay.date), "MMM d")}
          </div>
          {hoveredDay.log ? (
            <div className="text-muted-foreground">
              Build: {hoveredDay.log.build_hours}h | Learn: {hoveredDay.log.learning_hours}h<br />
              Outreach: {hoveredDay.log.outreach_done ? "Yes" : "No"} | Delivery: {hoveredDay.log.delivery_done ? "Yes" : "No"}
            </div>
          ) : (
            <div className="text-muted-foreground">—</div>
          )}
        </div>
      )}

      <div className="flex gap-4 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-accent" />
          <span className="text-xs font-mono text-muted-foreground">Logged</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-secondary" />
          <span className="text-xs font-mono text-muted-foreground">Missed</span>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
