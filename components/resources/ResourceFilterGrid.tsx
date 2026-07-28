"use client";

import * as React from "react";
import type { Resource } from "@/types";
import { GRADE_SCHEDULE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ResourceCard } from "./ResourceCard";
import { EmptyState } from "@/components/ui/EmptyState";

type FilterKey = Resource["grade"] | "all";

export function ResourceFilterGrid({ resources }: { resources: Resource[] }) {
  const [filter, setFilter] = React.useState<FilterKey>("all");

  const filtered =
    filter === "all" ? resources : resources.filter((r) => r.grade === filter || r.grade === "all");

  return (
    <div>
      <div className="mb-10 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filter resources by grade">
        <button
          role="tab"
          aria-selected={filter === "all"}
          onClick={() => setFilter("all")}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            filter === "all"
              ? "bg-teal-600 text-cream-50"
              : "bg-white text-ink-soft ring-1 ring-ink/10 hover:bg-cream-100"
          )}
        >
          All Resources
        </button>
        {GRADE_SCHEDULE.map((g) => (
          <button
            key={g.key}
            role="tab"
            aria-selected={filter === g.key}
            onClick={() => setFilter(g.key)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              filter === g.key
                ? "bg-teal-600 text-cream-50"
                : "bg-white text-ink-soft ring-1 ring-ink/10 hover:bg-cream-100"
            )}
          >
            {g.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No resources here yet"
          description="Try a different grade, or check back soon — new resources are added regularly."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((resource, i) => (
            <ResourceCard key={resource.id} resource={resource} delay={i * 0.05} />
          ))}
        </div>
      )}
    </div>
  );
}
