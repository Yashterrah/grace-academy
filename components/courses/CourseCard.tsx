import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";

export interface Course {
  icon: LucideIcon;
  title: string;
  description: string;
  grades: string;
  format: string;
  tone: "teal" | "violet" | "gold" | "azure";
}

export function CourseCard({ course, delay = 0 }: { course: Course; delay?: number }) {
  const Icon = course.icon;

  return (
    <Reveal delay={delay} className="h-full">
      <div className="flex h-full flex-col rounded-xl2 border border-ink/[0.06] bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
          <Icon className="h-6 w-6" aria-hidden />
        </div>
        <h3 className="font-display text-xl text-ink">{course.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-faint">
          {course.description}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge tone={course.tone}>{course.grades}</Badge>
          <Badge tone="teal">{course.format}</Badge>
        </div>
      </div>
    </Reveal>
  );
}
