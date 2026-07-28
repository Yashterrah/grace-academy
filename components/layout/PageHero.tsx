import { StaffLineDivider } from "@/components/motion/StaffLineDivider";
import { Reveal } from "@/components/motion/Reveal";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-grace-mesh pb-16 pt-32 text-cream-50 sm:pb-20 sm:pt-40">
      <div className="pointer-events-none absolute inset-0 bg-grace-mesh-soft" />
      <div className="container relative">
        <Reveal>
          <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">
            {eyebrow}
          </p>
          <h1 className="max-w-2xl font-display text-4xl font-medium leading-[1.1] sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-5 max-w-xl text-base leading-relaxed text-cream-100/80 sm:text-lg">
              {description}
            </p>
          )}
        </Reveal>
      </div>
      <div className="container relative mt-12">
        <StaffLineDivider tone="cream" />
      </div>
    </section>
  );
}
