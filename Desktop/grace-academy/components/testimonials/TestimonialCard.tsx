import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="flex h-full flex-col" hoverable={false}>
      <Quote className="mb-3 h-6 w-6 text-gold-400" aria-hidden />
      <p className="flex-1 text-sm leading-relaxed text-ink-soft">
        &ldquo;{testimonial.message}&rdquo;
      </p>
      <div className="mt-5 flex items-center justify-between border-t border-ink/[0.06] pt-4">
        <div>
          <p className="font-display text-sm font-medium text-ink">{testimonial.name}</p>
          <p className="text-xs text-ink-faint">{testimonial.role}</p>
        </div>
        <div className="flex" aria-label={`${testimonial.rating} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4",
                i < testimonial.rating ? "fill-gold-400 text-gold-400" : "text-ink/10"
              )}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
