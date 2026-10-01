"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

interface StaffLineDividerProps {
  tone?: "teal" | "cream" | "gold";
  className?: string;
  withClef?: boolean;
  notes?: number[]; // x-positions (0-100) for floating note accents
}

const toneStroke: Record<NonNullable<StaffLineDividerProps["tone"]>, string> = {
  teal: "#0B4F4A",
  cream: "#FAF7F1",
  gold: "#E8A33D",
};

/**
 * The academy's signature visual motif: a five-line music staff that draws
 * itself in on scroll, used between sections instead of a generic rule.
 * Optional floating note-heads mark real content (e.g. grade positions).
 */
export function StaffLineDivider({
  tone = "teal",
  className,
  withClef = false,
  notes = [],
}: StaffLineDividerProps) {
  const reduceMotion = usePrefersReducedMotion();
  const stroke = toneStroke[tone];
  const lineYs = [10, 20, 30, 40, 50];

  return (
    <div className={cn("w-full select-none", className)} aria-hidden="true">
      <svg viewBox="0 0 1000 60" className="h-8 w-full sm:h-10" preserveAspectRatio="none">
        {lineYs.map((y, i) => (
          <motion.line
            key={y}
            x1="0"
            y1={y}
            x2="1000"
            y2={y}
            stroke={stroke}
            strokeWidth="1.2"
            strokeOpacity={0.35}
            initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: i * 0.06, ease: "easeInOut" }}
          />
        ))}

        {withClef && (
          <text
            x="6"
            y="46"
            fontSize="52"
            fill={stroke}
            fillOpacity={0.5}
            fontFamily="serif"
          >
            &#119070;
          </text>
        )}

        {notes.map((x, i) => (
          <motion.circle
            key={`${x}-${i}`}
            cx={(x / 100) * 1000}
            cy={lineYs[i % lineYs.length]}
            r="5"
            fill={stroke}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 0.85, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
          />
        ))}
      </svg>
    </div>
  );
}
