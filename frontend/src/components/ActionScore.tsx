import { DailyLog } from "@/types/discipline";
import { getExecutionScore } from "@/lib/discipline";

interface ActionScoreProps {
  todayLog: DailyLog | undefined;
}

const ActionScore = ({ todayLog }: ActionScoreProps) => {
  const score = getExecutionScore(todayLog);

  const tiles = [
    {
      label: "Outreach",
      done: todayLog?.outreach_done ?? false,
    },
    {
      label: "Build",
      done: (todayLog?.build_hours ?? 0) > 0,
    },
    {
      label: "Learning",
      done: (todayLog?.learning_hours ?? 0) > 0,
    },
    {
      label: "Delivery",
      done: todayLog?.delivery_done ?? false,
    },
  ];

  return (
    <div className="bg-card border border-border p-6">
      <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">
        Today's Action Score
      </h2>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className={`p-3 border text-center ${
              tile.done
                ? "bg-accent/10 border-accent text-accent"
                : "bg-secondary border-border text-muted-foreground"
            }`}
          >
            <div className="text-lg font-mono font-bold mb-1">
              {tile.done ? "YES" : "NO"}
            </div>
            <div className="text-xs font-mono uppercase tracking-wider">
              {tile.label}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center py-4 border border-border bg-secondary">
        <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">
          Daily Execution Score
        </div>
        <div className="text-4xl font-mono font-bold text-foreground">
          {score} <span className="text-muted-foreground text-xl">/ 4</span>
        </div>
      </div>
    </div>
  );
};

export default ActionScore;
