import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-ink/[0.07]", className)}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl2 border border-ink/[0.06] bg-white p-6">
      <Skeleton className="mb-4 h-40 w-full" />
      <Skeleton className="mb-2 h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}
