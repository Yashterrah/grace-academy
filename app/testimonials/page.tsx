import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { RevealGroup, Reveal } from "@/components/motion/Reveal";
import { getApprovedTestimonials } from "@/firebase/firestore";
import { SEED_TESTIMONIALS } from "@/lib/seed-data";
import { pageSeo } from "@/utils/seo";
import { buildWhatsAppLink, WHATSAPP_MESSAGES } from "@/utils/whatsapp";
import { Button } from "@/components/ui/Button";

export const metadata = pageSeo({
  title: "Testimonials",
  description:
    "Read what parents and students say about learning music with Tr. Grace Muigai — from exam confidence to festival performances.",
  path: "/testimonials",
});

export const revalidate = 3600;

export default async function TestimonialsPage() {
  const live = await getApprovedTestimonials(24).catch(() => []);
  const testimonials = live.length > 0 ? live : SEED_TESTIMONIALS;

  const average =
    testimonials.reduce((sum, t) => sum + t.rating, 0) / (testimonials.length || 1);

  return (
    <>
      <PageHero
        eyebrow="Testimonials"
        title="Real progress, in their own words"
        description={`Rated ${average.toFixed(1)} / 5 by parents and students across Grades 4–9.`}
      />

      <Section tone="light">
        <Container>
          <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <Reveal key={t.id}>
                <TestimonialCard testimonial={t} />
              </Reveal>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section tone="cream">
        <Container>
          <SectionHeading
            eyebrow="Share your experience"
            title="Learned with Tr. Grace? We'd love to hear from you"
            align="center"
          />
          <div className="mt-8 flex justify-center">
            <Button
              href={buildWhatsAppLink(
                "Hello Tr. Grace! I'd like to share a testimonial about my experience at the academy."
              )}
              variant="primary"
              size="lg"
            >
              Send Your Testimonial on WhatsApp
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
