"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TERM } from "@/lib/constants";
import { formatStartLabel } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function diffToParts(ms: number): TimeParts {
  const abs = Math.max(0, ms);
  const days = Math.floor(abs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((abs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((abs / (1000 * 60)) % 60);
  const seconds = Math.floor((abs / 1000) % 60);
  return { days, hours, minutes, seconds };
}

/**
 * Counts down to TERM.onlineClassesStart. Once that date has passed, it
 * flips direction and counts *up* — how many days classes have been running
 * — instead of just freezing at zero.
 */
export function CountdownTimer({
  compact = false,
  startDate = TERM.onlineClassesStart,
}: {
  compact?: boolean;
  /** ISO date (YYYY-MM-DD). Comes from Admin → Settings; defaults to the built-in term date. */
  startDate?: string;
}) {
  const targetTime = React.useMemo(
    () => new Date(`${startDate}T09:00:00+03:00`).getTime(),
    [startDate]
  );
  const reduceMotion = usePrefersReducedMotion();
  const [now, setNow] = React.useState<number | null>(null);

  React.useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null) return null; // avoid SSR/client mismatch flash

  const hasStarted = now >= targetTime;
  const parts = diffToParts(hasStarted ? now - targetTime : targetTime - now);

  const units: { label: string; value: number }[] = [
    { label: "Days", value: parts.days },
    { label: "Hours", value: parts.hours },
    { label: "Minutes", value: parts.minutes },
    { label: "Seconds", value: parts.seconds },
  ];

  return (
    <div
      className={compact ? "" : "rounded-xl2 border border-white/10 bg-white/[0.06] p-6 backdrop-blur-md sm:p-8"}
      role="timer"
      aria-live="off"
    >
      <p className="mb-4 text-center font-body text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
        {hasStarted ? "Online classes are live" : `Online classes begin ${formatStartLabel(startDate) || TERM.onlineClassesStartLabel}`}
      </p>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="flex flex-col items-center rounded-xl bg-white/10 py-3 sm:py-4"
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                key={unit.value}
                initial={reduceMotion ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
                className="font-display text-2xl font-medium text-cream-50 sm:text-3xl tabular-nums"
              >
                {unit.value.toString().padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
            <span className="mt-1 text-[0.65rem] uppercase tracking-wider text-cream-100/60 sm:text-xs">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-cream-100/60">
        {hasStarted
          ? `${parts.days} ${parts.days === 1 ? "day" : "days"} since classes began — enrollment is still open.`
          : "Register and book your slot before the countdown ends."}
      </p>
    </div>
  );
}
