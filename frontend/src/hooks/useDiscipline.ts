import { useState, useEffect, useCallback } from "react";
import { DailyLog, WeeklyStats, Project, CustomDiscipline, LogProject } from "@/types/discipline";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import {
  calculateStreak,
  getCompletionPercentage,
  getLast7DaysLogs,
  getLast30DaysLogs,
  getWeeklyStats,
  getToday,
} from "@/lib/discipline";
import { toast } from "sonner";

export const useDiscipline = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [customDisciplines, setCustomDisciplines] = useState<CustomDiscipline[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayLog, setTodayLog] = useState<DailyLog | undefined>();
  const [streak, setStreak] = useState(0);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [last7Days, setLast7Days] = useState<(DailyLog | null)[]>([]);
  const [last30Days, setLast30Days] = useState<{ date: string; log: DailyLog | null }[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({
    totalBuildHours: 0,
    totalLearningHours: 0,
    daysLogged: 0,
    bestDay: null,
    weeklyDelta: 0,
  });

  const fetchData = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      // 1. Fetch Logs (with projects)
      const { data: logsData, error: logsError } = await supabase
        .from("daily_logs")
        .select(`
          *,
          log_projects (
            *,
            project:projects (*)
          )
        `)
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (logsError) throw logsError;

      // 2. Fetch Projects
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("name");

      if (projectsError) throw projectsError;

      // 3. Fetch Custom Disciplines
      const { data: disciplinesData, error: disciplinesError } = await supabase
        .from("custom_disciplines")
        .select("*")
        .eq("user_id", user.id)
        .order("name");

      if (disciplinesError) throw disciplinesError;

      const formattedLogs: DailyLog[] = (logsData || []).map((log: any) => ({
        id: log.id,
        date: log.date,
        outreach_done: log.outreach_done,
        delivery_done: log.delivery_done,
        build_hours: log.build_hours,
        learning_hours: log.learning_hours,
        note: log.note || "",
        created_at: log.created_at,
        custom_results: log.custom_results,
        log_projects: log.log_projects,
      }));

      setLogs(formattedLogs);
      setProjects(projectsData || []);
      setCustomDisciplines(disciplinesData || []);

      const today = getToday();
      setTodayLog(formattedLogs.find(l => l.date === today));
      setStreak(calculateStreak(formattedLogs));
      setCompletionPercentage(getCompletionPercentage(formattedLogs));
      setLast7Days(getLast7DaysLogs(formattedLogs));
      setLast30Days(getLast30DaysLogs(formattedLogs));
      setWeeklyStats(getWeeklyStats(formattedLogs));
    } catch (error: any) {
      console.error("Error fetching data:", error.message);
      toast.error("Failed to load systems");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addLog = async (
    log: Omit<DailyLog, "created_at" | "date" | "log_projects">,
    projectHours?: { project_id: string; hours: number }[]
  ) => {
    if (!user) return;

    const today = getToday();

    try {
      // 1. Insert Log
      const { data: logData, error: logError } = await supabase
        .from("daily_logs")
        .insert([
          {
            user_id: user.id,
            date: today,
            ...log,
          },
        ])
        .select()
        .single();

      if (logError) {
        if (logError.code === "23505") throw new Error("Log already exists for today");
        throw logError;
      }

      // 2. Insert Project Breakdowns if any
      if (projectHours && projectHours.length > 0) {
        const { error: projectError } = await supabase
          .from("log_projects")
          .insert(
            projectHours.map(ph => ({
              log_id: logData.id,
              project_id: ph.project_id,
              hours: ph.hours,
            }))
          );
        if (projectError) throw projectError;
      }

      await fetchData();
      return logData;
    } catch (error: any) {
      toast.error(error.message || "Failed to save log");
      throw error;
    }
  };

  const addProject = async (name: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("projects")
      .insert([{ user_id: user.id, name }]);

    if (error) {
      toast.error("Failed to create project");
      throw error;
    }
    await fetchData();
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete project");
      throw error;
    }
    await fetchData();
  };

  const addCustomDiscipline = async (name: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("custom_disciplines")
      .insert([{ user_id: user.id, name }]);

    if (error) {
      toast.error("Failed to add discipline");
      throw error;
    }
    await fetchData();
  };

  const deleteCustomDiscipline = async (id: string) => {
    const { error } = await supabase.from("custom_disciplines").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete discipline");
      throw error;
    }
    await fetchData();
  };

  return {
    logs,
    projects,
    customDisciplines,
    loading,
    todayLog,
    streak,
    completionPercentage,
    last7Days,
    last30Days,
    weeklyStats,
    addLog,
    addProject,
    deleteProject,
    addCustomDiscipline,
    deleteCustomDiscipline,
    refresh: fetchData,
  };
};
