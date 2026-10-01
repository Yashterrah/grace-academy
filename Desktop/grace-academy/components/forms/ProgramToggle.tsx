"use client";

import { GraduationCap, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgramToggleProps {
  value: "school" | "adult";
  onChange: (value: "school" | "adult") => void;
}

export function ProgramToggle({ value, onChange }: ProgramToggleProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Program type"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      {(
        [
          {
            key: "school" as const,
            icon: GraduationCap,
            title: "School Student",
            subtitle: "CBC / 8-4-4 · Grades 4–9",
          },
          {
            key: "adult" as const,
            icon: Users,
            title: "Adult Classes",
            subtitle: "Non-CBC · 12-session package",
          },
        ]
      ).map((opt) => {
        const Icon = opt.icon;
        const active = value === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.key)}
            className={cn(
              "flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition-colors",
              active
                ? "border-teal-600 bg-teal-50"
                : "border-ink/10 bg-white hover:border-ink/20"
            )}
          >
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                active ? "bg-teal-600 text-cream-50" : "bg-cream-100 text-ink-faint"
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink">{opt.title}</span>
              <span className="block text-xs text-ink-faint">{opt.subtitle}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
