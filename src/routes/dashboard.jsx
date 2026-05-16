import { createFileRoute } from "@tanstack/react-router";
import {
  WelcomeBanner, StatsGrid, DailyProgress, TodaySchedule, TaskManager,
  WeeklyGoals, StickyNotes, UpcomingExams, ActivityFeed,
} from "@/components/widgets";
import AppShell from "@/components/AppShell";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Notes Pilot" },
      { name: "description", content: "Your study command center: plans, tasks, sticky notes and a real study stopwatch in one beautiful workspace." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <AppShell title="Dashboard" subtitle="Friday · May 15, 2026">
      <div className="space-y-6">
        <WelcomeBanner />
        <StatsGrid />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <TodaySchedule />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UpcomingExams />
              <WeeklyGoals />
            </div>
            <ActivityFeed />
          </div>
          <div className="space-y-6">
            <DailyProgress />
            <TaskManager />
            <StickyNotes compact />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
