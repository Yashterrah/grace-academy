import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { TEACHER } from "@/lib/constants";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";

export function TeacherProfile() {
  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
      <Reveal>
        <div className="relative mx-auto max-w-sm">
          <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-teal-200 via-violet-100 to-azure-100" />
          <div className="overflow-hidden rounded-[1.75rem] border border-white bg-white shadow-card">
            <Image
              src="/images/tr-grace-portrait.jpg"
              alt="Portrait of Tr. Grace Muigai"
              width={480}
              height={560}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>
      </Reveal>

      <div className="space-y-8">
        <Reveal>
          <Badge tone="gold">{TEACHER.title}</Badge>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">{TEACHER.name}</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft">{TEACHER.bio}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <h3 className="flex items-center gap-2 font-display text-lg text-ink">
            <GraduationCap className="h-5 w-5 text-teal-500" /> Education
          </h3>
          <ul className="mt-4 space-y-3 border-l-2 border-teal-100 pl-5">
            {TEACHER.education.map((item) => (
              <li key={item.institution}>
                <p className="font-medium text-ink">{item.level}</p>
                <p className="text-sm text-ink-faint">{item.institution}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.2}>
          <h3 className="font-display text-lg text-ink">Teaching Experience</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {TEACHER.experience.map((item) => (
              <Badge key={item.school} tone="teal">
                {item.school}
                {item.note ? ` · ${item.note}` : ""}
              </Badge>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <h3 className="font-display text-lg text-ink">Trained In</h3>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {TEACHER.specialties.map((s) => (
              <li
                key={s}
                className="rounded-lg bg-cream-100 px-4 py-2.5 text-sm text-ink-soft"
              >
                {s}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  );
}
