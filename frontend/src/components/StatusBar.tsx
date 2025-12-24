interface StatusBarProps {
  streak: number;
  isLoggedToday: boolean;
  completionPercentage: number;
  weeklyDelta?: number;
}

const StatusBar = ({ streak, isLoggedToday, completionPercentage, weeklyDelta }: StatusBarProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
    </div>
  );
};

export default StatusBar;
