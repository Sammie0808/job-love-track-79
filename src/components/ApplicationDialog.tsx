import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  STATUSES,
  fileToStored,
  type Application,
  type Status,
  type StoredFile,
} from "@/lib/applications";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial?: Application | null;
  onSave: (app: Application) => void;
};

const today = () => new Date().toISOString().slice(0, 10);

const empty = (): Application => ({
  id: crypto.randomUUID(),
  company: "",
  role: "",
  dateApplied: today(),
  status: "Applied",
});

export function ApplicationDialog({ open, onOpenChange, initial, onSave }: Props) {
  const [form, setForm] = useState<Application>(empty());

  useEffect(() => {
    if (open) setForm(initial ? { ...initial } : empty());
  }, [open, initial]);

  const set = <K extends keyof Application>(key: K, value: Application[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function handleFile(key: "cv" | "coverLetter", file?: File | null) {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Files must be under 2 MB to store locally.");
      return;
    }
    set(key, (await fileToStored(file)) as StoredFile);
  }

  function submit() {
    if (!form.company.trim() || !form.role.trim()) {
      toast.error("Company and role are required.");
      return;
    }
    onSave(form);
    toast.success(initial ? "Application updated" : "Application added");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit application" : "New application"}</DialogTitle>
          <DialogDescription>
            Track the role, its status, reminders and documents.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                placeholder="Acme Inc."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
                placeholder="Frontend Engineer"
              />
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date applied</Label>
              <Input
                id="date"
                type="date"
                value={form.dateApplied}
                onChange={(e) => set("dateApplied", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v as Status)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
            <div className="grid gap-2">
              <Label htmlFor="followup">Follow-up reminder</Label>
              <Input
                id="followup"
                type="date"
                value={form.followUpDate ?? ""}
                onChange={(e) => set("followUpDate", e.target.value || undefined)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="interview">Interview date</Label>
              <Input
                id="interview"
                type="date"
                value={form.interviewDate ?? ""}
                onChange={(e) => set("interviewDate", e.target.value || undefined)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="note">Reminder note</Label>
            <Input
              id="note"
              value={form.followUpNote ?? ""}
              onChange={(e) => set("followUpNote", e.target.value)}
              placeholder="Email the recruiter about next steps"
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
            <div className="grid gap-2">
              <Label htmlFor="cv">CV {form.cv ? `(${form.cv.name})` : ""}</Label>
              <Input
                id="cv"
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => handleFile("cv", e.target.files?.[0])}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cl">
                Cover letter {form.coverLetter ? `(${form.coverLetter.name})` : ""}
              </Label>
              <Input
                id="cl"
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => handleFile("coverLetter", e.target.files?.[0])}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>Save application</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}