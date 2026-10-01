import { FileText, Music, Video, Link2, Download } from "lucide-react";
import type { Resource } from "@/types";
import { GRADE_SCHEDULE } from "@/lib/constants";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";

const FILE_ICONS: Record<Resource["fileType"], typeof FileText> = {
  pdf: FileText,
  audio: Music,
  video: Video,
  link: Link2,
};

export function ResourceCard({ resource, delay = 0 }: { resource: Resource; delay?: number }) {
  const Icon = FILE_ICONS[resource.fileType];
  const gradeLabel =
    resource.grade === "all"
      ? "All grades"
      : GRADE_SCHEDULE.find((g) => g.key === resource.grade)?.label ?? resource.grade;

  return (
    <Reveal delay={delay} className="h-full">
      <div className="flex h-full flex-col rounded-xl2 border border-ink/[0.06] bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-azure-50 text-azure-500">
            <Icon className="h-5 w-5" aria-hidden />
          </div>
          <Badge tone="azure">{gradeLabel}</Badge>
        </div>
        <h3 className="font-display text-lg text-ink">{resource.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-faint">
          {resource.description}
        </p>
        <a
          href={resource.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700"
        >
          <Download className="h-3.5 w-3.5" /> Access resource
        </a>
      </div>
    </Reveal>
  );
}
