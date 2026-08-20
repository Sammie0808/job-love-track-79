import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BriefcaseBusiness, CalendarClock, Plus, Target, Trophy } from "lucide-react";
import { ApplicationDialog } from "@/components/ApplicationDialog";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { STATUSES, stats, upcomingReminders, useApplications } from "@/lib/applications";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HireMe — Job Application Tracker Dashboard" },
      {
        name: "description",
        content:
          "Track job applications, interview rate and follow-up reminders in one clean HireMe dashboard.",
      },
      { property: "og:title", content: "HireMe — Job Application Tracker Dashboard" },
      {
        property: "og:description",
        content: "Track applications, interviews and offers with a clean, minimal dashboard.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { apps, loaded, save } = useApplications();
  const [open, setOpen] = useState(false);
  const s = stats(apps);
  const reminders = upcomingReminders(apps).slice(0, 5);
  const recent = apps.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Your job search at a glance.</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus /> Add application
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total applications"
          value={s.total}
          icon={<BriefcaseBusiness className="size-5" />}
        />
        <StatCard
          label="Interview rate"
          value={`${s.interviewRate}%`}
          hint="Interviews + offers / total"
          icon={<Target className="size-5" />}
        />
        <StatCard
          label="Offers"
          value={s.byStatus.Offer}
          hint={`${s.successRate}% success rate`}
          icon={<Trophy className="size-5" />}
        />
        <StatCard
          label="Upcoming reminders"
          value={reminders.length}
          icon={<CalendarClock className="size-5" />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>Pipeline progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {STATUSES.map((status) => {
              const count = s.byStatus[status];
              const pct = s.total ? (count / s.total) * 100 : 0;
              return (
                <div key={status} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{status}</span>
                    <span className="text-muted-foreground">
                      {count} · {Math.round(pct)}%
                    </span>
                  </div>
                  <Progress value={pct} />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>Reminders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reminders.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No reminders yet. Add follow-up or interview dates to an application.
              </p>
            ) : (
              reminders.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary/40 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{r.label}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {r.company} · {r.role}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{r.date}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Recent applications</CardTitle>
          <Link to="/applications" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </CardHeader>
        <CardContent className="space-y-2">
          {!loaded ? null : recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nothing tracked yet — add your first application.
            </p>
          ) : (
            recent.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{a.role}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {a.company} · {a.dateApplied}
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <ApplicationDialog open={open} onOpenChange={setOpen} onSave={save} />
    </div>
  );
}
