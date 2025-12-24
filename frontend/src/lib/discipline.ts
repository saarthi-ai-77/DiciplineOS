import { DailyLog, WeeklyStats } from "@/types/discipline";
import { format, subDays, parseISO, isAfter, isBefore, startOfWeek, endOfWeek, differenceInDays } from "date-fns";

export const getToday = (): string => {
  return format(new Date(), "yyyy-MM-dd");
};

export const calculateStreak = (logs: DailyLog[]): number => {
  if (logs.length === 0) return 0;

  const sortedDates = logs
    .map((l) => l.date)
    .sort()
    .reverse();

  const today = getToday();
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");

  // Streak must start from today or yesterday
  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0;
  }

  let streak = 0;
  let checkDate = sortedDates[0] === today ? new Date() : subDays(new Date(), 1);

  // Use a map for O(1) lookup
  const loggedDates = new Set(logs.map(l => l.date));

  for (let i = 0; i < 365; i++) {
    const dateStr = format(checkDate, "yyyy-MM-dd");
    if (loggedDates.has(dateStr)) {
      streak++;
      checkDate = subDays(checkDate, 1);
    } else {
      break;
    }
  }

  return streak;
};

export const getCompletionPercentage = (logs: DailyLog[]): number => {
  if (logs.length === 0) return 0;

  const sortedDates = logs.map((l) => l.date).sort();
  const firstDate = parseISO(sortedDates[0]);
  const today = new Date();

  const daysSinceFirst = differenceInDays(today, firstDate) + 1;

  return Math.round((logs.length / daysSinceFirst) * 100);
};

export const getLast7DaysLogs = (logs: DailyLog[]): (DailyLog | null)[] => {
  const result: (DailyLog | null)[] = [];
  const loggedDatesmap = new Map(logs.map(l => [l.date, l]));

  for (let i = 6; i >= 0; i--) {
    const date = format(subDays(new Date(), i), "yyyy-MM-dd");
    result.push(loggedDatesmap.get(date) || null);
  }

  return result;
};

export const getLast30DaysLogs = (logs: DailyLog[]): { date: string; log: DailyLog | null }[] => {
  const result: { date: string; log: DailyLog | null }[] = [];
  const loggedDatesmap = new Map(logs.map(l => [l.date, l]));

  for (let i = 29; i >= 0; i--) {
    const date = format(subDays(new Date(), i), "yyyy-MM-dd");
    result.push({ date, log: loggedDatesmap.get(date) || null });
  }

  return result;
};

export const getWeeklyStats = (logs: DailyLog[]): WeeklyStats => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const lastWeekStart = startOfWeek(subDays(weekStart, 1), { weekStartsOn: 1 });
  const lastWeekEnd = endOfWeek(subDays(weekStart, 1), { weekStartsOn: 1 });

  const weeklyLogs = logs.filter((log) => {
    const logDate = parseISO(log.date);
    return !isBefore(logDate, weekStart) && !isAfter(logDate, weekEnd);
  });

  const lastWeeklyLogs = logs.filter((log) => {
    const logDate = parseISO(log.date);
    return !isBefore(logDate, lastWeekStart) && !isAfter(logDate, lastWeekEnd);
  });

  const totalBuildHours = weeklyLogs.reduce((sum, log) => sum + log.build_hours, 0);
  const totalLearningHours = weeklyLogs.reduce((sum, log) => sum + log.learning_hours, 0);
  const lastTotalBuildHours = lastWeeklyLogs.reduce((sum, log) => sum + log.build_hours, 0);

  let weeklyDelta = 0;
  if (lastTotalBuildHours > 0) {
    weeklyDelta = Math.round(((totalBuildHours - lastTotalBuildHours) / lastTotalBuildHours) * 100);
  } else if (totalBuildHours > 0) {
    weeklyDelta = 100;
  }

  let bestDay: { date: string; buildHours: number } | null = null;
  weeklyLogs.forEach((log) => {
    if (!bestDay || log.build_hours > bestDay.buildHours) {
      bestDay = { date: log.date, buildHours: log.build_hours };
    }
  });

  return {
    totalBuildHours,
    totalLearningHours,
    daysLogged: weeklyLogs.length,
    bestDay,
    weeklyDelta,
  };
};

export const getExecutionScore = (log: DailyLog | undefined): number => {
  if (!log) return 0;

  let score = 0;
  if (log.outreach_done) score++;
  if (log.build_hours > 0) score++;
  if (log.learning_hours > 0) score++;
  if (log.delivery_done) score++;

  return score;
};

export const getMovingAverage = (logs: DailyLog[], windowSize: number): { date: string; average: number }[] => {
  const today = getToday();
  const result: { date: string; average: number }[] = [];

  for (let i = 30; i >= 0; i--) {
    const checkDate = subDays(new Date(), i);
    const dateStr = format(checkDate, "yyyy-MM-dd");

    const windowStart = subDays(checkDate, windowSize - 1);
    const windowLogs = logs.filter(l => {
      const d = parseISO(l.date);
      return !isBefore(d, windowStart) && !isAfter(d, checkDate);
    });

    const sum = windowLogs.reduce((acc, curr) => acc + curr.build_hours, 0);
    result.push({ date: dateStr, average: sum / windowSize });
  }

  return result;
};

export const getTimeToLog = (log: DailyLog): string => {
  if (!log.created_at) return "N/A";
  const date = parseISO(log.created_at);
  return format(date, "HH:mm");
};
