import { useState, useEffect, useCallback } from "react";
import { DailyLog, WeeklyStats } from "@/types/discipline";
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
  });

  const fetchData = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("daily_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) throw error;

      const formattedLogs: DailyLog[] = (data || []).map((log: any) => ({
        date: log.date,
        outreach_done: log.outreach_done,
        delivery_done: log.delivery_done,
        build_hours: log.build_hours,
        learning_hours: log.learning_hours,
        note: log.note || "",
        created_at: log.created_at,
      }));

      setLogs(formattedLogs);

      const today = getToday();
      setTodayLog(formattedLogs.find(l => l.date === today));
      setStreak(calculateStreak(formattedLogs));
      setCompletionPercentage(getCompletionPercentage(formattedLogs));
      setLast7Days(getLast7DaysLogs(formattedLogs));
      setLast30Days(getLast30DaysLogs(formattedLogs));
      setWeeklyStats(getWeeklyStats(formattedLogs));
    } catch (error: any) {
      console.error("Error fetching logs:", error.message);
      toast.error("Failed to load discipline data");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addLog = async (log: Omit<DailyLog, "created_at" | "date">) => {
    if (!user) return;

    const today = getToday();

    try {
      const { data, error } = await supabase
        .from("daily_logs")
        .insert([
          {
            user_id: user.id,
            date: today,
            ...log,
          },
        ])
        .select();

      if (error) {
        if (error.code === "23505") { // Unique constraint violation
          throw new Error("Log already exists for today");
        }
        throw error;
      }

      await fetchData();
      return data?.[0];
    } catch (error: any) {
      toast.error(error.message || "Failed to save log");
      throw error;
    }
  };

  return {
    logs,
    loading,
    todayLog,
    streak,
    completionPercentage,
    last7Days,
    last30Days,
    weeklyStats,
    addLog,
    refresh: fetchData,
  };
};
