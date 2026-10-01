"use client";

import { Check, Mic } from "lucide-react";
import { GRADE_SCHEDULE } from "@/lib/constants";
import { Reveal } from "@/components/motion/Reveal";

/**
 * GradeTimetable — shows the full pricing structure:
 * - Per-holiday fee (pay one term at a time)
 * - 3-holiday bundle (one-time discounted offer)
 * - How much the bundle saves
 * - Recording-included badge for Grades 7–9
 */
export function GradeTimetable() {
  return (
    <Reveal>
      <div className="overflow-x-auto rounded-xl2 border border-ink/[0.06] bg-white shadow-card">
        <div className="min-w-[560px]">
        {/* Header */}
        <div className="grid grid-cols-4 gap-0 border-b border-ink/[0.06] bg-cream-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">
          <span>Grade</span>
          <span>Time</span>
          <span>Per Holiday</span>
          <span>3-Holiday Bundle</span>
        </div>

        {GRADE_SCHEDULE.map((g, i) => (
          <div
            key={g.key}
            className={`grid grid-cols-4 gap-0 px-4 py-4 text-sm ${
              i < GRADE_SCHEDULE.length - 1 ? "border-b border-ink/[0.04]" : ""
            }`}
          >
            {/* Grade + recording badge */}
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-ink">{g.label}</span>
              {g.recordingIncluded && (
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[0.65rem] font-semibold text-violet-700">
                  <Mic className="h-2.5 w-2.5" />
                  Recording incl.
                </span>
              )}
            </div>

            {/* Time slot */}
            <div className="flex items-center text-ink-soft">{g.time}</div>

            {/* Per-holiday fee */}
            <div className="flex items-center">
              <span className="font-display text-base font-medium text-ink">
                {g.feeLabel}
              </span>
            </div>

            {/* Bundle fee + saving */}
            <div className="flex flex-col gap-0.5">
              <span className="font-display text-base font-medium text-teal-700">
                {g.bundleFeeLabel}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-teal-600">
                <Check className="h-3 w-3" />
                Save {g.bundleSavingLabel}
              </span>
            </div>
          </div>
        ))}

        {/* Footer notes */}
        <div className="space-y-2 border-t border-ink/[0.06] bg-cream-100/50 px-4 py-4 text-xs text-ink-faint">
          <p className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-teal-500" />
            <span>
              <strong className="text-ink">Per Holiday</strong> — pay one term at a time.
            </span>
          </p>
          <p className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-teal-500" />
            <span>
              <strong className="text-ink">3-Holiday Bundle</strong> — a one-time discounted
              offer covering three full holidays (terms).
            </span>
          </p>
          <p className="flex items-center gap-1.5">
            <Mic className="h-3.5 w-3.5 text-violet-500" />
            <span>
              <strong className="text-ink">Recording included</strong> — Grades 7, 8 & 9
              lessons include a recorded performance of the student&apos;s set piece.
            </span>
          </p>
          <p className="mt-1 text-[0.7rem] text-ink-faint">
            All payments via M-Pesa Buy Goods · Classes run Monday – Friday
          </p>
        </div>
        </div>
      </div>
    </Reveal>
  );
}
