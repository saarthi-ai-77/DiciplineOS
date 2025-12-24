import { useDiscipline } from "@/hooks/useDiscipline";
import Navigation from "@/components/Navigation";
import StatusBar from "@/components/StatusBar";
import WeeklyChart from "@/components/WeeklyChart";
import Heatmap from "@/components/Heatmap";
import ActionScore from "@/components/ActionScore";

const Dashboard = () => {
  const {
    streak,
    todayLog,
    completionPercentage,
    last7Days,
    last30Days,
    loading,
  } = useDiscipline();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-4xl flex items-center justify-center h-[50vh]">
          <p className="font-mono animate-pulse uppercase tracking-widest text-muted-foreground">
            Loading System...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <StatusBar
          streak={streak}
          isLoggedToday={!!todayLog}
          completionPercentage={completionPercentage}
        />

        <WeeklyChart last7Days={last7Days} />

        <Heatmap last30Days={last30Days} />

        <ActionScore todayLog={todayLog} />
      </main>
    </div>
  );
};

export default Dashboard;
