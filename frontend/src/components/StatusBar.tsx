import { ExecutionRank } from "@/lib/discipline";
import { Shield } from "lucide-react";

interface StatusBarProps {
  streak: number;
  isLoggedToday: boolean;
  completionPercentage: number;
  weeklyDelta?: number;
  rank?: ExecutionRank;
}

const StatusBar = ({ streak, isLoggedToday, completionPercentage, weeklyDelta, rank }: StatusBarProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      <div className="bg-card border border-border p-4">
        <div className="text-[10px] md:text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">
          Streak
        </div>
        <div className="text-2xl md:text-3xl font-mono font-bold text-foreground">
          {streak}
          <span className="text-[10px] md:text-sm text-muted-foreground ml-1">days</span>
        </div>
      </div>

      <div className="bg-card border border-border p-4">
        <div className="text-[10px] md:text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">
          Today
        </div>
        <div
          className={`text-sm md:text-xl font-mono font-bold ${isLoggedToday ? "text-accent" : "text-destructive"
            }`}
        >
          {isLoggedToday ? "LOGGED" : "NOT LOGGED"}
        </div>
      </div>

      <div className="bg-card border border-border p-4">
        <div className="text-[10px] md:text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">
          Completion
        </div>
        <div className="text-2xl md:text-3xl font-mono font-bold text-foreground">
          {completionPercentage}
          <span className="text-[10px] md:text-sm text-muted-foreground ml-1">%</span>
        </div>
      </div>

      <div className="bg-card border border-border p-4">
        <div className="text-[10px] md:text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">
          Weekly Trend
        </div>
        <div className="text-2xl md:text-3xl font-mono font-bold text-foreground">
          <span className={weeklyDelta && weeklyDelta > 0 ? "text-accent" : weeklyDelta && weeklyDelta < 0 ? "text-destructive" : ""}>
            {weeklyDelta && weeklyDelta > 0 ? `+${weeklyDelta}` : weeklyDelta || 0}%
          </span>
        </div>
      </div>

      <div className="bg-card border-2 border-accent/20 p-4 col-span-2 md:col-span-1 flex flex-col justify-center items-center">
        <div className="text-[10px] font-mono text-accent uppercase tracking-[0.2em] mb-1">
          User Rank
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent" />
          <div className="text-xl font-black text-accent tracking-tighter uppercase italic">
            {rank || "NOVICE"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
