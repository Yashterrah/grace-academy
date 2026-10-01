import { GraduationCap, BookOpenCheck, Users2, Laptop2 } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { Card } from "@/components/ui/Card";

const REASONS = [
  {
    icon: GraduationCap,
    title: "Trained & experienced",
    body: "A trained high school music teacher with years of classroom experience across multiple Kenyan schools.",
  },
  {
    icon: BookOpenCheck,
    title: "Two curricula, one teacher",
    body: "Prepares candidates for both CBC and 8-4-4 music exams — set pieces, folksongs, choral and instrumental music.",
  },
  {
    icon: Users2,
    title: "Grade-by-grade classes",
    body: "Structured lessons for Grades 4 through 9, each with a dedicated time slot so learners aren't mixed across levels.",
  },
  {
    icon: Laptop2,
    title: "Learn from anywhere",
    body: "Live online classes mean your child learns from home, on schedule, with the same personal attention as in class.",
  },
];

export function WhyUs() {
  return (
    <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {REASONS.map((reason) => {
        const Icon = reason.icon;
        return (
          <Reveal key={reason.title} as="div">
            <Card className="h-full">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="font-display text-lg text-ink">{reason.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-faint">{reason.body}</p>
            </Card>
          </Reveal>
        );
      })}
    </RevealGroup>
  );
}
