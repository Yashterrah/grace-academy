import { Suspense } from "react";
import { Hero } from "@/components/home/Hero";
import { CountdownTimer } from "@/components/home/CountdownTimer";
import { Stats } from "@/components/home/Stats";
import { WhyUs } from "@/components/home/WhyUs";
import { CoursesPreview } from "@/components/home/CoursesPreview";
import { GradeTimetable } from "@/components/home/GradeTimetable";
import { TestimonialsPreview } from "@/components/home/TestimonialsPreview";
import { CTASection } from "@/components/home/CTASection";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { StaffLineDivider } from "@/components/motion/StaffLineDivider";
import { Reveal } from "@/components/motion/Reveal";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { VideoSection } from "@/components/home/VideoSection";
import { getSiteSettings } from "@/firebase/firestore";
import { formatStartLabel } from "@/lib/utils";

// Pick up changes made in Admin → Settings within 5 minutes, no redeploy needed.
export const revalidate = 300;

export default async function HomePage() {
  const settings = await getSiteSettings();
  const startLabel = formatStartLabel(settings.onlineClassesStart) || undefined;

  return (
    <>
      <Hero startLabel={startLabel} />

      <Section tone="dark" className="py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-2xl">
            <CountdownTimer startDate={settings.onlineClassesStart} />
          </div>
        </Container>
      </Section>

      <Section tone="dark" className="pt-4">
        <Container>
          <Stats />
        </Container>
      </Section>

      <Section tone="light">
        <Container>
          <SectionHeading
            eyebrow="Why families choose us"
            title="A teacher who already knows both curricula"
            description="Tr. Grace Muigai brings real high-school classroom experience to every online lesson — not a generic tutoring script."
          />
          <div className="mt-12">
            <WhyUs />
          </div>
        </Container>
      </Section>

      <Section tone="cream">
        <Container>
          <SectionHeading
            eyebrow="What we teach"
            title="Courses across both curricula"
            description="From set pieces to folksongs, choral music to the recorder — structured for CBC and 8-4-4 learners alike."
            align="center"
          />
          <div className="mx-auto mt-12 max-w-4xl">
            <StaffLineDivider tone="teal" className="mb-12" />
            <CoursesPreview />
          </div>
        </Container>
      </Section>

      <VideoSection />

      <Section tone="light">
        <Container>
          <SectionHeading
            eyebrow="Timetable & fees"
            title="Pay per holiday, or save with the 3-holiday bundle"
            description="Choose your grade when you book and your lesson time and fee are filled in for you. Every lesson is assessed, with an end-of-holiday exam and certificate."
            align="center"
          />
          <div className="mx-auto mt-12 max-w-3xl">
            <GradeTimetable />
          </div>
        </Container>
      </Section>

      <Section tone="cream">
        <Container>
          <SectionHeading
            eyebrow="From our students & parents"
            title="Real progress, real feedback"
            align="center"
          />
          <div className="mt-12">
            <Suspense
              fallback={
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </div>
              }
            >
              <TestimonialsPreview />
            </Suspense>
          </div>
        </Container>
      </Section>

      <Section tone="light">
        <Container>
          <Reveal>
            <CTASection />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
