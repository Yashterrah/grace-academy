"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { GalleryItem } from "@/types";
import { cn } from "@/lib/utils";
import { Lightbox } from "./Lightbox";
import { RevealGroup, Reveal } from "@/components/motion/Reveal";
import { EmptyState } from "@/components/ui/EmptyState";

const CATEGORIES: { key: GalleryItem["category"] | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "recital", label: "Recitals" },
  { key: "classroom", label: "Classroom" },
  { key: "choir", label: "Choir" },
  { key: "exam", label: "Exams" },
  { key: "event", label: "Events" },
];

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = React.useState<GalleryItem["category"] | "all">("all");
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const filtered = filter === "all" ? items : items.filter((i) => i.category === filter);

  return (
    <div>
      <div className="mb-10 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Gallery filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            role="tab"
            aria-selected={filter === cat.key}
            onClick={() => setFilter(cat.key)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              filter === cat.key
                ? "bg-teal-600 text-cream-50"
                : "bg-white text-ink-soft ring-1 ring-ink/10 hover:bg-cream-100"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No photos in this category yet"
          description="Check back soon, or browse another category above."
        />
      ) : (
        <RevealGroup className="columns-2 gap-4 sm:columns-3 [&>*]:mb-4" stagger={0.04}>
          {filtered.map((item, i) => (
            <Reveal key={item.id} as="div" className="break-inside-avoid">
              <motion.button
                type="button"
                onClick={() => setActiveIndex(i)}
                whileHover={{ scale: 1.02 }}
                className="group relative block w-full overflow-hidden rounded-xl2 bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  width={480}
                  height={480}
                  className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 text-left text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {item.title}
                </span>
              </motion.button>
            </Reveal>
          ))}
        </RevealGroup>
      )}

      {activeIndex !== null && (
        <Lightbox
          items={filtered}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNavigate={setActiveIndex}
        />
      )}
    </div>
  );
}
