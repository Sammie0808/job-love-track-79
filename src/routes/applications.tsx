import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Pencil, Plus, Trash2 } from "lucide-react";
import { ApplicationDialog } from "@/components/ApplicationDialog";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUSES, useApplications, type Application } from "@/lib/applications";

export const Route = createFileRoute("/applications")({
  head: () => ({
    meta: [
      { title: "Applications — HireMe Tracker" },
      {
        name: "description",
        content:
          "Add, edit and filter every job application with status, reminders, CV and cover letter.",
      },
      { property: "og:title", content: "Applications — HireMe Tracker" },
      {
        property: "og:description",
        content: "Manage every job application, its status, reminders and documents.",
      },
    ],
  }),
  component: ApplicationsPage,
});

function ApplicationsPage() {
  const { apps, loaded, save, remove } = useApplications();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Application | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("All");

  const list = useMemo(
    () =>
      apps
        .filter((a) => (filter === "All" ? true : a.status === filter))
        .filter((a) =>
          `${a.company} ${a.role}`.toLowerCase().includes(query.trim().toLowerCase()),
        )
        .sort((a, b) => b.dateApplied.localeCompare(a.dateApplied)),
    [apps, filter, query],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Applications</h1>
          <p className="text-sm text-muted-foreground">
            {apps.length} tracked · stored in your browser
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus /> Add application
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search company or role"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loaded && list.length === 0 ? (
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-10 text-center text-sm text-muted-foreground">
            No applications match your filters yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {list.map((a) => (
            <Card key={a.id} className="shadow-[var(--shadow-card)]">
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate font-semibold">{a.role}</h2>
                    <StatusBadge status={a.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {a.company} · applied {a.dateApplied}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {a.followUpDate ? <span>Follow-up: {a.followUpDate}</span> : null}
                    {a.interviewDate ? <span>Interview: {a.interviewDate}</span> : null}
                    {a.cv ? (
                      <a
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                        href={a.cv.dataUrl}
                        download={a.cv.name}
                      >
                        <Download className="size-3" /> CV
                      </a>
                    ) : null}
                    {a.coverLetter ? (
                      <a
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                        href={a.coverLetter.dataUrl}
                        download={a.coverLetter.name}
                      >
                        <Download className="size-3" /> Cover letter
                      </a>
                    ) : null}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditing(a);
                      setOpen(true);
                    }}
                  >
                    <Pencil /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => remove(a.id)}>
                    <Trash2 /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ApplicationDialog open={open} onOpenChange={setOpen} initial={editing} onSave={save} />
    </div>
  );
}