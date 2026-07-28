"use client";

import { CheckCircle2 } from "lucide-react";
import { GRADE_SCHEDULE } from "@/lib/constants";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { CTA_LINKS } from "@/lib/constants";

export function GradeTimetable() {
  return (
    <div className="overflow-hidden rounded-xl2 border border-ink/[0.06] bg-white shadow-card">
      <div className="hidden grid-cols-4 gap-4 border-b border-ink/[0.06] bg-cream-100/60 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-ink-faint sm:grid">
        <span>Grade</span>
        <span>Class Days</span>
        <span>Lesson Time</span>
        <span className="text-right">Fee per lesson</span>
      </div>
      <RevealGroup>
        {GRADE_SCHEDULE.map((grade, i) => (
          <Reveal
            key={grade.key}
            delay={i * 0.05}
            className="grid grid-cols-2 items-center gap-2 border-b border-ink/[0.06] px-6 py-4 last:border-0 sm:grid-cols-4 sm:gap-4"
          >
            <span className="flex items-center gap-2 font-display text-base text-ink">
              <CheckCircle2 className="h-4 w-4 text-teal-500" />
              {grade.label}
            </span>
            <span className="text-sm text-ink-soft sm:order-none order-3 col-span-2 sm:col-span-1">
              {grade.day}
            </span>
            <span className="text-sm text-ink-soft">{grade.time}</span>
            <span className="text-right font-display text-base font-medium text-teal-600">
              {grade.feeLabel}
            </span>
          </Reveal>
        ))}
      </RevealGroup>
      <div className="flex flex-col items-center gap-4 bg-cream-100/60 px-6 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-sm text-ink-soft">
          Pick your grade during booking — your time slot and fee fill in automatically.
        </p>
        <Button href={CTA_LINKS.book} size="sm">
          Book Your Slot
        </Button>
      </div>
    </div>
  );
}
