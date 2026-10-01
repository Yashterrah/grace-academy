import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  tone?: "light" | "cream" | "dark";
}

const toneClasses: Record<NonNullable<SectionProps["tone"]>, string> = {
  light: "bg-white",
  cream: "bg-cream-100",
  dark: "bg-surface-night text-cream-50",
};

export function Section({ children, className, id, tone = "light" }: SectionProps) {
  return (
    <section id={id} className={cn("py-16 sm:py-20 lg:py-28", toneClasses[tone], className)}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <p
          className={cn(
            "mb-3 font-body text-xs font-semibold uppercase tracking-[0.2em]",
            light ? "text-gold-300" : "text-teal-500"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-display text-3xl font-medium leading-tight sm:text-4xl",
          light ? "text-cream-50" : "text-ink"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-lg",
            light ? "text-cream-100/80" : "text-ink-soft"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
