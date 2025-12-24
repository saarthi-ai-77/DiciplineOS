export interface DailyLog {
  date: string; // YYYY-MM-DD format
  outreach_done: boolean;
  delivery_done: boolean;
  build_hours: number;
  learning_hours: number;
  note: string;
  created_at: string;
}

export interface WeeklyStats {
  totalBuildHours: number;
  totalLearningHours: number;
  daysLogged: number;
  bestDay: { date: string; buildHours: number } | null;
}
