import { Suspense } from "react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { StaffLineDivider } from "@/components/motion/StaffLineDivider";
import { SuccessAnimation } from "@/components/forms/SuccessAnimation";
import { buildWhatsAppLink, WHATSAPP_MESSAGES } from "@/utils/whatsapp";
import { pageSeo } from "@/utils/seo";

export const metadata = pageSeo({
  title: "Payment Received",
  description: "Your payment confirmation has been received by Grace Muigai Music Academy.",
  path: "/booking/success",
  noIndex: true,
});

function SuccessContent({
  searchParams,
}: {
  searchParams: { ref?: string; booking?: string };
}) {
  const reference = searchParams.ref;
  const bookingReference = searchParams.booking;

  return (
    <div className="mx-auto max-w-lg text-center">
      <SuccessAnimation />
      <h1 className="mt-6 font-display text-3xl text-ink sm:text-4xl">
        You&apos;re all set for lessons!
      </h1>
      <p className="mt-3 text-ink-soft">
        Your payment confirmation has been received and is being verified. We&apos;ll reach out on
        WhatsApp to confirm your first lesson.
      </p>

      {reference && (
        <div className="mx-auto mt-6 inline-block rounded-full bg-teal-50 px-6 py-2 font-display text-lg font-medium text-teal-700">
          {reference}
        </div>
      )}

      <div className="my-8">
        <StaffLineDivider tone="teal" />
      </div>

      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button
          href={buildWhatsAppLink(
            bookingReference
              ? WHATSAPP_MESSAGES.payment(bookingReference)
              : WHATSAPP_MESSAGES.general
          )}
          size="lg"
        >
          Confirm on WhatsApp
        </Button>
        <Button href="/" variant="secondary" size="lg">
          Back to Home
        </Button>
      </div>
    </div>
  );
}

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; booking?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  return (
    <Section tone="light" className="pt-32 sm:pt-40">
      <Container>
        <Suspense>
          <SuccessContent searchParams={resolvedSearchParams} />
        </Suspense>
      </Container>
    </Section>
  );
}
