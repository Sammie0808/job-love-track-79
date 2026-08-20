import type { Status } from "@/lib/applications";

const styles: Record<Status, string> = {
  Applied: "bg-secondary text-secondary-foreground",
  Interview: "bg-warning/20 text-warning-foreground",
  Offer: "bg-success/15 text-success",
  Rejected: "bg-destructive/10 text-destructive",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}