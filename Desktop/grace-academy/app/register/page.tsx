import { Suspense } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { RegistrationForm } from "@/components/forms/RegistrationForm";
import { Reveal } from "@/components/motion/Reveal";
import { Spinner } from "@/components/ui/Spinner";
import { pageSeo } from "@/utils/seo";
import { getSiteSettings } from "@/firebase/firestore";
import { CONTACT } from "@/lib/constants";

// Re-check the enrollment switch (Admin → Settings) at most every 5 minutes.
export const revalidate = 300;

export const metadata = pageSeo({
  title: "Student Registration",
  description:
    "Register your child for online CBC or 8-4-4 music lessons at Grace Muigai Music Academy — Grades 4 to 9.",
  path: "/register",
});

export default async function RegisterPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHero
        eyebrow="Step 1 of 3"
        title="Register your child"
        description="Tell us a little about the student. You'll receive a registration reference to use when booking your lesson time."
      />
      <Section tone="light">
        <Container>
          {!settings.enrollmentOpen && (
            <div
              role="status"
              className="mx-auto mb-6 max-w-2xl rounded-xl border border-gold-200 bg-gold-50 px-5 py-4 text-sm text-gold-700"
            >
              <p className="font-semibold">Enrollment is not currently open.</p>
              <p className="mt-1">
                You can still send us your details, and we will confirm availability. For urgent
                questions call {CONTACT.phonePrimary} or message us on WhatsApp.
              </p>
            </div>
          )}
          <Reveal className="mx-auto max-w-2xl rounded-xl2 border border-ink/[0.06] bg-white p-6 shadow-card sm:p-10">
            <Suspense
              fallback={
                <div className="flex justify-center py-12">
                  <Spinner className="h-6 w-6 text-teal-600" />
                </div>
              }
            >
              <RegistrationForm />
            </Suspense>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
