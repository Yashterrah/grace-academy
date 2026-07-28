import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { TeacherProfile } from "@/components/about/TeacherProfile";
import { CTASection } from "@/components/home/CTASection";
import { Reveal } from "@/components/motion/Reveal";
import { pageSeo } from "@/utils/seo";

export const metadata = pageSeo({
  title: "About Tr. Grace Muigai",
  description:
    "Meet Tr. Grace Muigai — a trained high school music teacher preparing students for CBC and 8-4-4 music exams, from set pieces to KCSE choral music.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About the academy"
        title="A classroom teacher, now in your living room."
        description="Grace Muigai Music Academy was built around one belief: music education should feel personal, structured, and rooted in real teaching experience — not a generic course."
      />

      <Section tone="light">
        <Container>
          <TeacherProfile />
        </Container>
      </Section>

      <Section tone="cream">
        <Container>
          <SectionHeading
            eyebrow="Our approach"
            title="Why lessons are grade-specific, not one-size-fits-all"
            align="center"
          />
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                title: "Curriculum-matched",
                text: "Every lesson is planned against the CBC or 8-4-4 syllabus for that specific grade — nothing generic.",
              },
              {
                title: "Small, live classes",
                text: "Real-time online lessons with direct feedback, not pre-recorded videos.",
              },
              {
                title: "Exam-ready",
                text: "Set pieces, folksongs and choral music are taught with KCSE and CBC assessment in mind.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <div className="h-full rounded-xl2 bg-white p-6 shadow-card">
                  <h3 className="font-display text-lg text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-faint">{item.text}</p>
                </div>
              </Reveal>
            ))}
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
