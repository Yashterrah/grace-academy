import { Phone, Mail, Facebook, Instagram, Clock } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { CONTACT } from "@/lib/constants";
import { buildWhatsAppLink, WHATSAPP_MESSAGES } from "@/utils/whatsapp";
import { pageSeo } from "@/utils/seo";

export const metadata = pageSeo({
  title: "Contact",
  description:
    "Get in touch with Grace Muigai Music Academy by phone, email, WhatsApp or the contact form below.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your music journey"
        description="Whether you have a question about grades, fees, or booking a lesson — reach out and we'll respond promptly."
      />

      <Section tone="light">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal className="space-y-6">
              <div className="rounded-xl2 border border-ink/[0.06] bg-white p-6 shadow-card">
                <h2 className="font-display text-xl text-ink">Direct contact</h2>
                <ul className="mt-5 space-y-4 text-sm text-ink-soft">
                  <li className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />
                    <span>
                      {CONTACT.phonePrimary}
                      <br />
                      {CONTACT.phoneSecondary}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />
                    <a href={`mailto:${CONTACT.email}`} className="hover:text-teal-600">
                      {CONTACT.email}
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />
                    <span>Monday – Friday, 9:00 AM – 5:00 PM (EAT)</span>
                  </li>
                </ul>
                <div className="mt-6 flex gap-3">
                  <a
                    href={CONTACT.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-100 text-ink-soft hover:bg-teal-600 hover:text-cream-50"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a
                    href={CONTACT.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-100 text-ink-soft hover:bg-teal-600 hover:text-cream-50"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <a
                href={buildWhatsAppLink(WHATSAPP_MESSAGES.general)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl2 bg-[#25D366] px-6 py-5 text-cream-50 shadow-card transition-transform hover:-translate-y-0.5"
              >
                <span>
                  <span className="block font-display text-lg">Prefer WhatsApp?</span>
                  <span className="block text-sm text-white/85">
                    Message us directly for a fast reply
                  </span>
                </span>
                <span className="text-2xl">→</span>
              </a>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-xl2 border border-ink/[0.06] bg-white p-6 shadow-card sm:p-8">
                <h2 className="font-display text-xl text-ink">Send a message</h2>
                <p className="mt-1 text-sm text-ink-faint">
                  Fill in the form and we&apos;ll get back to you within one business day.
                </p>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
