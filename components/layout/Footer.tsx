import Link from "next/link";
import { Mail, Phone, Facebook, Instagram, Music2 } from "lucide-react";
import { CONTACT, NAV_LINKS, SITE, TERM } from "@/lib/constants";
import { buildWhatsAppLink, WHATSAPP_MESSAGES } from "@/utils/whatsapp";
import { StaffLineDivider } from "@/components/motion/StaffLineDivider";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-night text-cream-100/80">
      <div className="container pt-14">
        <StaffLineDivider tone="cream" />
      </div>

      <div className="container grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div>
          <Link href="/" className="flex items-center gap-2 font-display text-lg text-cream-50">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600">
              <Music2 className="h-5 w-5" aria-hidden />
            </span>
            {SITE.name}
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-100/70">
            {SITE.tagline} Online CBC & 8-4-4 music lessons for Grades 4–9, taught live by
            Tr. Grace Muigai.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={CONTACT.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Grace Muigai Music Academy on Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-teal-600"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Grace Muigai Music Academy on Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-teal-600"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-cream-50">
            Explore
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-gold-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-cream-50">
            Student Portal
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/register" className="transition-colors hover:text-gold-300">
                Register as a Student
              </Link>
            </li>
            <li>
              <Link href="/booking" className="transition-colors hover:text-gold-300">
                Book a Lesson
              </Link>
            </li>
            <li>
              <Link href="/booking/payment" className="transition-colors hover:text-gold-300">
                Upload Payment Proof
              </Link>
            </li>
            <li>
              <Link href="/resources" className="transition-colors hover:text-gold-300">
                Resource Center
              </Link>
            </li>
          </ul>
          <p className="mt-4 rounded-lg bg-white/5 px-3 py-2 text-xs text-cream-100/70">
            Online classes begin {TERM.onlineClassesStartLabel}.
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-cream-50">
            Get in Touch
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
              <span>
                {CONTACT.phonePrimary} / {CONTACT.phoneSecondary}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
              <a href={`mailto:${CONTACT.email}`} className="hover:text-gold-300">
                {CONTACT.email}
              </a>
            </li>
          </ul>
          <a
            href={buildWhatsAppLink(WHATSAPP_MESSAGES.general)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-teal-600 px-4 py-2.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-teal-500"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="container flex flex-col items-center justify-between gap-3 text-xs text-cream-100/50 sm:flex-row">
          <p>
            &copy; {year} {SITE.name}. All rights reserved.
          </p>
          <p>Built with care for music learners across Kenya.</p>
        </div>
      </div>
    </footer>
  );
}
