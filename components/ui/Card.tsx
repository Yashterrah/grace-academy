import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  hoverable = true,
}: {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl2 border border-ink/[0.06] bg-white p-6 shadow-card transition-all duration-300",
        hoverable && "hover:-translate-y-1 hover:shadow-card-hover",
        className
      )}
    >
      {children}
    </div>
  );
}
