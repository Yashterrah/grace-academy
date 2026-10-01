import { Music4, Users, Mic2, Piano, BookOpenCheck, Theater } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { CourseCard, type Course } from "@/components/courses/CourseCard";
import { GradeTimetable } from "@/components/home/GradeTimetable";
import { CTASection } from "@/components/home/CTASection";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ADULT_PROGRAM } from "@/lib/constants";
import { pageSeo } from "@/utils/seo";

export const metadata = pageSeo({
  title: "Courses & Pricing",
  description:
    "CBC and 8-4-4 music courses at Grace Muigai Music Academy — Grades 4 to 9. Pay per holiday or save with a 3-holiday bundle. Grades 7–9 include piece recording.",
  path: "/courses",
});

const COURSES: Course[] = [
  {
    icon: Theater,
    title: "Set Pieces for Music",
    description:
      "In-depth, exam-focused coaching on the official set pieces examined each year — covering technique, interpretation, and performance.",
    grades: "Grades 4–9",
    format: "Live online",
    tone: "teal",
  },
  {
    icon: Users,
    title: "Folksongs",
    description:
      "Traditional Kenyan folksongs taught with correct pronunciation, rhythm, and the cultural storytelling behind each piece.",
    grades: "Grades 4–9",
    format: "Live online",
    tone: "gold",
  },
  {
    icon: Mic2,
    title: "KCSE Choral Music",
    description:
      "Structured choral music preparation for KCSE candidates — part-singing, harmony, sight-reading and conducting fundamentals.",
    grades: "8-4-4 / KCSE",
    format: "Live online",
    tone: "violet",
  },
  {
    icon: Piano,
    title: "Instrumental Music",
    description:
      "Hands-on instrumental lessons starting with the recorder — building note-reading, fingering technique and ensemble playing.",
    grades: "Grades 4–9",
    format: "Live online",
    tone: "azure",
  },
  {
    icon: BookOpenCheck,
    title: "CBC Music Grades 4–9",
    description:
      "A full grade-by-grade CBC music curriculum path, matched to the Kenya Institute of Curriculum Development syllabus for each grade.",
    grades: "CBC",
    format: "Weekday lessons",
    tone: "teal",
  },
  {
    icon: Music4,
    title: "Exam & Recital Preparation",
    description:
      "Focused, short-term coaching ahead of exams, assessments or school recitals — building confidence under performance pressure.",
    grades: "All grades",
    format: "Flexible",
    tone: "gold",
  },
];

export default function CoursesPage() {
  return (
    <>
      <PageHero
        eyebrow="Courses & Pricing"
        title="Structured music courses for Grades 4 to 9"
        description="Every course is taught live online by Tr. Grace Muigai, matched precisely to the CBC or 8-4-4 syllabus for each grade."
      />

      {/* Course cards */}
      <Section tone="light">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {COURSES.map((course, i) => (
              <CourseCard key={course.title} course={course} delay={i * 0.06} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Pricing table */}
      <Section tone="cream">
        <Container>
          <SectionHeading
            eyebrow="Timetable & fees"
            title="Two ways to pay — choose what suits you"
            description="Pay per holiday (one term at a time) or save with the 3-holiday bundle — a one-time discounted offer covering three full terms."
            align="center"
          />
          <div className="mx-auto mt-12 max-w-3xl">
            <GradeTimetable />
          </div>

          {/* What's included note */}
          <Reveal>
            <div className="mx-auto mt-8 max-w-3xl rounded-xl bg-teal-50 px-5 py-4 text-sm text-teal-800">
              <p className="font-semibold">What&apos;s included in every lesson?</p>
              <ul className="mt-2 space-y-1 text-teal-700">
                <li>✓ Live, real-time instruction with Tr. Grace Muigai</li>
                <li>✓ Curriculum-matched content (CBC or 8-4-4) for your specific grade</li>
                <li>✓ Per-lesson assessment feedback</li>
                <li>✓ End-of-holiday exam + certificate on completion</li>
                <li>✓ Grades 7, 8 &amp; 9 — a professional recording of your set piece</li>
              </ul>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Adult Classes */}
      <Section tone="light">
        <Container>
          <Reveal>
            <div className="overflow-hidden rounded-xl2 bg-violet-600 text-cream-50">
              <div className="grid grid-cols-1 gap-8 p-8 sm:p-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
                <div>
                  <Badge tone="gold">{ADULT_PROGRAM.tagline}</Badge>
                  <h2 className="mt-4 font-display text-2xl sm:text-3xl">{ADULT_PROGRAM.label}</h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-violet-100/90 sm:text-base">
                    {ADULT_PROGRAM.description}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-3 text-sm">
                    <li className="rounded-full bg-white/10 px-4 py-1.5">
                      {ADULT_PROGRAM.sessions} sessions
                    </li>
                    <li className="rounded-full bg-white/10 px-4 py-1.5">
                      {ADULT_PROGRAM.feeLabel} total ({ADULT_PROGRAM.perSessionLabel})
                    </li>
                    <li className="rounded-full bg-white/10 px-4 py-1.5">No CBC/8-4-4 exam pressure</li>
                  </ul>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Button href="/register?program=adult" variant="gold" size="lg">
                    Register for Adult Classes
                  </Button>
                  <Button href="/contact" variant="outlineLight" size="lg">
                    Ask a question first
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* CTA */}
      <Section tone="cream">
        <Container>
          <Reveal>
            <CTASection />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
