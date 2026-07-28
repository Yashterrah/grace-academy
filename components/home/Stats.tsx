"use client";

import { useCountUp } from "@/hooks/useCountUp";
import { Reveal } from "@/components/motion/Reveal";

const STATS = [
  { end: 6, suffix: "", label: "Schools taught at across Kenya" },
  { end: 6, suffix: "", label: "Grades covered — Grade 4 to Grade 9" },
  { end: 2, suffix: "", label: "Curricula — CBC & 8-4-4" },
  { end: 100, suffix: "%", label: "Live, teacher-led online lessons" },
];

function StatItem({ end, suffix, label, delay }: { end: number; suffix: string; label: string; delay: number }) {
  const { ref, value } = useCountUp(end);
  return (
    <Reveal delay={delay} className="text-center">
      <p className="font-display text-4xl font-semibold text-cream-50 sm:text-5xl">
        <span ref={ref}>{value}</span>
        {suffix}
      </p>
      <p className="mt-2 text-sm text-cream-100/70">{label}</p>
    </Reveal>
  );
}

export function Stats() {
  return (
    <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
      {STATS.map((stat, i) => (
        <StatItem key={stat.label} {...stat} delay={i * 0.1} />
      ))}
    </div>
  );
}
