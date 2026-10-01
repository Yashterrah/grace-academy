import type { LucideIcon } from "lucide-react";
import { MusicNoteOff } from "./icons/MusicNoteOff";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl2 border border-dashed border-ink/15 bg-cream-100/50 px-6 py-16 text-center">
      {Icon ? (
        <Icon className="mb-4 h-10 w-10 text-teal-400" aria-hidden />
      ) : (
        <MusicNoteOff className="mb-4 h-10 w-10 text-teal-400" aria-hidden />
      )}
      <h3 className="font-display text-xl text-ink">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-ink-faint">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
