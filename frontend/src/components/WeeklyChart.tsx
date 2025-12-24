import { DailyLog } from "@/types/discipline";
import { format, subDays } from "date-fns";

interface WeeklyChartProps {
  last7Days: (DailyLog | null)[];
}

const WeeklyChart = ({ last7Days }: WeeklyChartProps) => {
  const maxHours = Math.max(
    12,
    ...last7Days.map((log) => (log ? Math.max(log.build_hours, log.learning_hours) : 0))
  );

  return (
    <div className="bg-card border border-border p-6 mb-6">
      <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-6">
        Weekly Execution
      </h2>
      
      <div className="flex items-end justify-between gap-2 h-40">
        {last7Days.map((log, index) => {
          const date = subDays(new Date(), 6 - index);
          const dayLabel = format(date, "EEE");
          const buildHeight = log ? (log.build_hours / maxHours) * 100 : 0;
          const learnHeight = log ? (log.learning_hours / maxHours) * 100 : 0;

          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              <div className="flex gap-1 items-end h-28 w-full justify-center">
                <div
                  className="w-3 bg-accent transition-all"
                  style={{ height: `${buildHeight}%`, minHeight: log?.build_hours ? "4px" : "0" }}
                  title={`Build: ${log?.build_hours || 0}h`}
                />
                <div
                  className="w-3 bg-foreground/60 transition-all"
                  style={{ height: `${learnHeight}%`, minHeight: log?.learning_hours ? "4px" : "0" }}
                  title={`Learn: ${log?.learning_hours || 0}h`}
                />
              </div>
              <span className="text-xs font-mono text-muted-foreground uppercase">
                {dayLabel}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex gap-6 mt-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-accent" />
          <span className="text-xs font-mono text-muted-foreground">Build</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-foreground/60" />
          <span className="text-xs font-mono text-muted-foreground">Learn</span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyChart;
