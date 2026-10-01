import { cn } from "@/lib/utils";

const TONE_MAP: Record<string, string> = {
  pending: "bg-gold-50 text-gold-700 ring-gold-200",
  confirmed: "bg-teal-50 text-teal-700 ring-teal-200",
  rejected: "bg-red-50 text-red-700 ring-red-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
  completed: "bg-violet-50 text-violet-700 ring-violet-200",
  new: "bg-azure-50 text-azure-700 ring-azure-200",
  read: "bg-slate-100 text-slate-600 ring-ink/10",
  responded: "bg-teal-50 text-teal-700 ring-teal-200",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1",
        TONE_MAP[status] ?? "bg-slate-100 text-slate-600 ring-ink/10"
      )}
    >
      {status}
    </span>
  );
}
