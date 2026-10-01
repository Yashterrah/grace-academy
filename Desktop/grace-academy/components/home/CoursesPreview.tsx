import Link from "next/link";
import { ArrowRight, Music4 } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const COURSES = [
  {
    title: "Set Pieces for Music",
    tag: "CBC & 8-4-4",
    body: "Guided practice on the official set pieces examined each year, with technique, interpretation and performance coaching.",
  },
  {
    title: "Folksongs",
    tag: "Grades 4–9",
    body: "Traditional Kenyan folksongs taught with correct pronunciation, rhythm and the storytelling behind each piece.",
  },
  {
    title: "KCSE Choral Music",
    tag: "8-4-4",
    body: "Choral music preparation for KCSE candidates — part-singing, harmony and conducting fundamentals.",
  },
  {
    title: "Instrumental Music",
    tag: "Recorder-based",
    body: "Hands-on instrumental lessons, starting with the recorder, building reading, fingering and ensemble skills.",
  },
];

export function CoursesPreview() {
  return (
    <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {COURSES.map((course) => (
        <Reveal key={course.title}>
          <Card className="flex h-full flex-col">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-50 text-violet-500">
                <Music4 className="h-5 w-5" aria-hidden />
              </div>
              <Badge tone="violet">{course.tag}</Badge>
            </div>
            <h3 className="font-display text-xl text-ink">{course.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-faint">{course.body}</p>
            <Link
              href="/courses"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700"
            >
              Learn more <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Card>
        </Reveal>
      ))}
    </RevealGroup>
  );
}
