import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { RegistrationForm } from "@/components/forms/RegistrationForm";
import { Reveal } from "@/components/motion/Reveal";
import { pageSeo } from "@/utils/seo";

export const metadata = pageSeo({
  title: "Student Registration",
  description:
    "Register your child for online CBC or 8-4-4 music lessons at Grace Muigai Music Academy — Grades 4 to 9.",
  path: "/register",
});

export default function RegisterPage() {
  return (
    <>
      <PageHero
        eyebrow="Step 1 of 3"
        title="Register your child"
        description="Tell us a little about the student. You'll receive a registration reference to use when booking your lesson time."
      />
      <Section tone="light">
        <Container>
          <Reveal className="mx-auto max-w-2xl rounded-xl2 border border-ink/[0.06] bg-white p-6 shadow-card sm:p-10">
            <RegistrationForm />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
