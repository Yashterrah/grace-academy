import { getApprovedTestimonials } from "@/firebase/firestore";
import { SEED_TESTIMONIALS } from "@/lib/seed-data";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";

export async function TestimonialsPreview() {
  const live = await getApprovedTestimonials(3).catch(() => []);
  const testimonials = live.length > 0 ? live.slice(0, 3) : SEED_TESTIMONIALS.slice(0, 3);

  return (
    <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {testimonials.map((t) => (
        <Reveal key={t.id}>
          <TestimonialCard testimonial={t} />
        </Reveal>
      ))}
    </RevealGroup>
  );
}
