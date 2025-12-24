export interface DailyLog {
  id?: string;
  date: string; // YYYY-MM-DD format
  outreach_done: boolean;
  delivery_done: boolean;
  build_hours: number;
  learning_hours: number;
  note: string;
  created_at: string;
  user_id?: string;
  custom_results?: Record<string, boolean>;
  log_projects?: LogProject[];
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface LogProject {
  id?: string;
  log_id: string;
  project_id: string;
  hours: number;
  project?: Project;
}

export interface CustomDiscipline {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface WeeklyStats {
  totalBuildHours: number;
  totalLearningHours: number;
  daysLogged: number;
  bestDay: { date: string; buildHours: number } | null;
  weeklyDelta?: number; // percentage change vs last week
}
