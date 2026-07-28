import { Music4, Users, Mic2, Piano, BookOpenCheck, Theater } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { CourseCard, type Course } from "@/components/courses/CourseCard";
import { GradeTimetable } from "@/components/home/GradeTimetable";
import { CTASection } from "@/components/home/CTASection";
import { Reveal } from "@/components/motion/Reveal";
import { pageSeo } from "@/utils/seo";

export const metadata = pageSeo({
  title: "Courses",
  description:
    "Explore CBC and 8-4-4 music courses at Grace Muigai Music Academy — set pieces, folksongs, choral music, instrumental music and exam preparation for Grades 4 to 9.",
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
        eyebrow="Courses"
        title="Structured music courses for Grades 4 to 9"
        description="Every course is taught live online by Tr. Grace Muigai, matched precisely to the CBC or 8-4-4 syllabus for each grade."
      />

      <Section tone="light">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {COURSES.map((course, i) => (
              <CourseCard key={course.title} course={course} delay={i * 0.06} />
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="cream">
        <Container>
          <SectionHeading
            eyebrow="Timetable & fees"
            title="Every grade has a fixed time and fee"
            description="Choose your grade during booking and your lesson time and fee are matched automatically — no negotiation needed."
            align="center"
          />
          <div className="mx-auto mt-12 max-w-3xl">
            <GradeTimetable />
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
