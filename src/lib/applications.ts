import { useCallback, useEffect, useState } from "react";

export const STATUSES = ["Applied", "Interview", "Offer", "Rejected"] as const;
export type Status = (typeof STATUSES)[number];

export type StoredFile = { name: string; dataUrl: string };

export type Application = {
  id: string;
  company: string;
  role: string;
  dateApplied: string;
  status: Status;
  followUpDate?: string;
  followUpNote?: string;
  interviewDate?: string;
  cv?: StoredFile;
  coverLetter?: StoredFile;
};

const KEY = "hireme.applications.v1";

function read(): Application[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Application[]) : [];
  } catch {
    return [];
  }
}

const listeners = new Set<(a: Application[]) => void>();

function write(apps: Application[]) {
  window.localStorage.setItem(KEY, JSON.stringify(apps));
  listeners.forEach((l) => l(apps));
}

export function useApplications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setApps(read());
    setLoaded(true);
    const l = (a: Application[]) => setApps(a);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  const save = useCallback((app: Application) => {
    const current = read();
    const idx = current.findIndex((a) => a.id === app.id);
    if (idx >= 0) current[idx] = app;
    else current.unshift(app);
    write(current);
  }, []);

  const remove = useCallback((id: string) => {
    write(read().filter((a) => a.id !== id));
  }, []);

  return { apps, loaded, save, remove };
}

export function fileToStored(file: File): Promise<StoredFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, dataUrl: String(reader.result) });
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function stats(apps: Application[]) {
  const total = apps.length;
  const byStatus = Object.fromEntries(
    STATUSES.map((s) => [s, apps.filter((a) => a.status === s).length]),
  ) as Record<Status, number>;
  const reached = byStatus.Interview + byStatus.Offer;
  const interviewRate = total ? Math.round((reached / total) * 100) : 0;
  const successRate = total ? Math.round((byStatus.Offer / total) * 100) : 0;
  return { total, byStatus, interviewRate, successRate };
}

export function monthlySeries(apps: Application[]) {
  const map = new Map<string, { month: string; applications: number; offers: number }>();
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    map.set(key, {
      month: d.toLocaleString("en", { month: "short" }),
      applications: 0,
      offers: 0,
    });
  }
  apps.forEach((a) => {
    const key = (a.dateApplied || "").slice(0, 7);
    const entry = map.get(key);
    if (entry) {
      entry.applications += 1;
      if (a.status === "Offer") entry.offers += 1;
    }
  });
  return [...map.values()];
}

export function upcomingReminders(apps: Application[]) {
  const items: { id: string; label: string; date: string; company: string; role: string }[] = [];
  apps.forEach((a) => {
    if (a.followUpDate)
      items.push({
        id: a.id + "-f",
        label: a.followUpNote?.trim() || "Follow-up email",
        date: a.followUpDate,
        company: a.company,
        role: a.role,
      });
    if (a.interviewDate)
      items.push({
        id: a.id + "-i",
        label: "Interview",
        date: a.interviewDate,
        company: a.company,
        role: a.role,
      });
  });
  return items.sort((x, y) => x.date.localeCompare(y.date));
}