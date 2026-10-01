import { SectionHeading } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { StaffLineDivider } from "@/components/motion/StaffLineDivider";
import { StudentPerformanceVideo } from "@/components/home/StudentPerformanceVideo";
import { FEATURED_VIDEO } from "@/lib/constants";

/**
 * Homepage "Student spotlight" section.
 * Configure it in lib/constants.ts -> FEATURED_VIDEO. Renders nothing
 * until a video URL is set there.
 */
export function VideoSection() {
  if (!FEATURED_VIDEO.url) return null;

  return (
    <section className="bg-cream-100 py-16 sm:py-20">
      <Container>
        <div className="mb-10">
          <StaffLineDivider tone="teal" />
        </div>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <SectionHeading
            eyebrow="Student spotlight"
            title="Hear what a lesson produces"
            description="This is what consistent, grade-specific practice looks like in action — a real student from the academy performing their piece."
          />
          <StudentPerformanceVideo
            videoUrl={FEATURED_VIDEO.url}
            studentName={FEATURED_VIDEO.studentName}
            grade={FEATURED_VIDEO.grade}
            piece={FEATURED_VIDEO.piece}
          />
        </div>
      </Container>
    </section>
  );
}
