import { Suspense } from "react";
import { Smartphone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { PaymentUploadForm } from "@/components/forms/PaymentUploadForm";
import { Reveal } from "@/components/motion/Reveal";
import { Spinner } from "@/components/ui/Spinner";
import { MPESA } from "@/lib/constants";
import { pageSeo } from "@/utils/seo";

export const metadata = pageSeo({
  title: "Payment Confirmation",
  description:
    "Pay your Grace Muigai Music Academy lesson fee via M-Pesa Till Number and upload your confirmation screenshot.",
  path: "/booking/payment",
  noIndex: true,
});

export default function PaymentPage() {
  return (
    <>
      <PageHero
        eyebrow="Step 3 of 3"
        title="Complete your payment"
        description="Pay via M-Pesa Buy Goods, then upload your confirmation below to activate your lesson booking."
      />

      <Section tone="light">
        <Container>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <Reveal>
              <div className="rounded-xl2 border border-teal-100 bg-teal-50 p-6 sm:p-8">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-teal-600 text-cream-50">
                  <Smartphone className="h-5 w-5" />
                </div>
                <h2 className="font-display text-lg text-ink">Pay via M-Pesa</h2>
                <div className="mt-4 space-y-1 rounded-xl bg-white p-4 shadow-card">
                  <p className="text-xs uppercase tracking-wide text-ink-faint">Buy Goods Till Number</p>
                  <p className="font-display text-2xl font-medium text-teal-700">
                    {MPESA.tillNumber}
                  </p>
                  <p className="text-xs text-ink-faint">Business name: {MPESA.businessName}</p>
                </div>
                <ol className="mt-5 space-y-3 text-sm text-ink-soft">
                  {MPESA.paybillInstructions.map((step, i) => (
                    <li key={step} className="flex gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-600 text-[0.65rem] font-bold text-cream-50">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-xl2 border border-ink/[0.06] bg-white p-6 shadow-card sm:p-8">
                <h2 className="font-display text-lg text-ink">Upload confirmation</h2>
                <p className="mt-1 text-sm text-ink-faint">
                  Once paid, submit the details below so we can activate your booking.
                </p>
                <div className="mt-6">
                  <Suspense
                    fallback={
                      <div className="flex justify-center py-12">
                        <Spinner className="h-6 w-6 text-teal-600" />
                      </div>
                    }
                  >
                    <PaymentUploadForm />
                  </Suspense>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
