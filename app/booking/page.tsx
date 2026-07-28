import { Suspense } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { BookingForm } from "@/components/forms/BookingForm";
import { Reveal } from "@/components/motion/Reveal";
import { Spinner } from "@/components/ui/Spinner";
import { pageSeo } from "@/utils/seo";

export const metadata = pageSeo({
  title: "Book a Lesson",
  description:
    "Book your CBC or 8-4-4 music lesson at Grace Muigai Music Academy — select your grade and your class time and fee are matched automatically.",
  path: "/booking",
});

export default function BookingPage() {
  return (
    <>
      <PageHero
        eyebrow="Step 2 of 3"
        title="Book your lesson time"
        description="Select your grade and we'll automatically match your class time and fee — no back-and-forth needed."
      />
      <Section tone="light">
        <Container>
          <Reveal className="mx-auto max-w-2xl rounded-xl2 border border-ink/[0.06] bg-white p-6 shadow-card sm:p-10">
            <Suspense fallback={<div className="flex justify-center py-12"><Spinner className="h-6 w-6 text-teal-600" /></div>}>
              <BookingForm />
            </Suspense>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
