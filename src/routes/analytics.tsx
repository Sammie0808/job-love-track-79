import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { monthlySeries, stats, useApplications } from "@/lib/applications";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — HireMe Job Search Insights" },
      {
        name: "description",
        content:
          "See applications per month, interview rate and offer success rate for your job search.",
      },
      { property: "og:title", content: "Analytics — HireMe Job Search Insights" },
      {
        property: "og:description",
        content: "Applications per month, interview rate and success rate at a glance.",
      },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { apps } = useApplications();
  const s = stats(apps);
  const series = monthlySeries(apps);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Analytics</h1>
        <p className="text-sm text-muted-foreground">Momentum and conversion over time.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Applications" value={s.total} />
        <StatCard label="Interview rate" value={`${s.interviewRate}%`} />
        <StatCard label="Success rate" value={`${s.successRate}%`} hint="Offers / applications" />
      </div>

      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle>Applications per month</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis allowDecimals={false} stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.5rem",
                }}
              />
              <Bar dataKey="applications" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle>Offers per month</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis allowDecimals={false} stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.5rem",
                }}
              />
              <Line
                type="monotone"
                dataKey="offers"
                stroke="var(--chart-3)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle>Conversion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Interview rate</span>
              <span className="text-muted-foreground">{s.interviewRate}%</span>
            </div>
            <Progress value={s.interviewRate} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Offer success rate</span>
              <span className="text-muted-foreground">{s.successRate}%</span>
            </div>
            <Progress value={s.successRate} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}