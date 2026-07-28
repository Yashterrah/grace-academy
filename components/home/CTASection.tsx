import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { StaffLineDivider } from "@/components/motion/StaffLineDivider";
import { CTA_LINKS } from "@/lib/constants";

export function CTASection() {
  return (
    <div className="relative overflow-hidden rounded-xl2 bg-grace-mesh px-6 py-14 text-center text-cream-50 sm:px-12 sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-grace-mesh-soft" />
      <div className="relative">
        <Reveal>
          <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">
            Ready when you are
          </p>
          <h2 className="mx-auto max-w-xl font-display text-3xl font-medium leading-tight sm:text-4xl">
            Give your child a music education that fits both curricula — and their schedule.
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href={CTA_LINKS.register} variant="gold" size="lg">
              Register Now <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href={CTA_LINKS.book} variant="outlineLight" size="lg">
              Book a Lesson
            </Button>
          </div>
        </Reveal>
        <div className="mx-auto mt-10 max-w-md">
          <StaffLineDivider tone="cream" />
        </div>
      </div>
    </div>
  );
}
