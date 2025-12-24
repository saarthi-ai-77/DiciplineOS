interface StatusBarProps {
  streak: number;
  isLoggedToday: boolean;
  completionPercentage: number;
  weeklyDelta?: number;
}

const StatusBar = ({ streak, isLoggedToday, completionPercentage, weeklyDelta }: StatusBarProps) => {
  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      <div className="bg-card border border-border p-4">
        <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">
          Streak
        </div>
        <div className="text-3xl font-mono font-bold text-foreground">
          {streak}
          <span className="text-sm text-muted-foreground ml-1">days</span>
        </div>
      </div>

      <div className="bg-card border border-border p-4">
        <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">
          Today
        </div>
        <div
          className={`text-xl font-mono font-bold ${isLoggedToday ? "text-accent" : "text-destructive"
            }`}
        >
          {isLoggedToday ? "LOGGED" : "NOT LOGGED"}
        </div>
      </div>

      <div className="bg-card border border-border p-4">
        <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">
          Completion
        </div>
        <div className="text-3xl font-mono font-bold text-foreground">
          {completionPercentage}
          <span className="text-sm text-muted-foreground">%</span>
        </div>
      </div>

      <div className="bg-card border border-border p-4">
        <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">
          Weekly Trend
        </div>
        <div className="text-3xl font-mono font-bold text-foreground">
          <span className={weeklyDelta && weeklyDelta > 0 ? "text-accent" : weeklyDelta && weeklyDelta < 0 ? "text-destructive" : ""}>
            {weeklyDelta && weeklyDelta > 0 ? `+${weeklyDelta}` : weeklyDelta || 0}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
