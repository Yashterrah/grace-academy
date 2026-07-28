import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "teal",
  className,
}: {
  children: React.ReactNode;
  tone?: "teal" | "gold" | "violet" | "azure";
  className?: string;
}) {
  const tones: Record<string, string> = {
    teal: "bg-teal-50 text-teal-700 ring-teal-200",
    gold: "bg-gold-50 text-gold-700 ring-gold-200",
    violet: "bg-violet-50 text-violet-700 ring-violet-200",
    azure: "bg-azure-50 text-azure-700 ring-azure-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
