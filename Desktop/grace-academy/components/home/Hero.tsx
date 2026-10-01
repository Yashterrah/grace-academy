"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StaffLineDivider } from "@/components/motion/StaffLineDivider";
import { CTA_LINKS, TERM } from "@/lib/constants";
import { buildWhatsAppLink, WHATSAPP_MESSAGES } from "@/utils/whatsapp";

export function Hero({ startLabel = TERM.onlineClassesStartLabel }: { startLabel?: string }) {
  return (
    <section className="relative overflow-hidden bg-grace-mesh pb-24 pt-32 text-cream-50 sm:pb-32 sm:pt-40">
      <div className="pointer-events-none absolute inset-0 bg-grace-mesh-soft" />

      {/* ambient floating notes */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[8%] top-28 hidden text-6xl text-gold-300/25 sm:block"
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        ♪
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-[6%] top-56 hidden text-4xl text-azure-300/25 sm:block"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        ♫
      </motion.div>

      <div className="container relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300 backdrop-blur"
            >
              Online classes begin {startLabel}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="max-w-xl font-display text-4xl font-medium leading-[1.08] sm:text-5xl lg:text-6xl"
            >
              Where every learner finds their <span className="text-gold-300">voice</span>,
              their <span className="text-azure-300">rhythm</span>, their grade.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 max-w-lg text-base leading-relaxed text-cream-100/85 sm:text-lg"
            >
              Live online CBC & 8-4-4 music lessons with Tr. Grace Muigai — a trained,
              experienced high school music teacher. Set pieces, folksongs, choral and
              instrumental music, taught grade by grade, Grade 4 through Grade 9.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Button href={CTA_LINKS.register} variant="gold" size="lg">
                Register Your Child <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href={CTA_LINKS.book} variant="outlineLight" size="lg">
                Book a Lesson
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="mt-8"
            >
              <a
                href={buildWhatsAppLink(WHATSAPP_MESSAGES.general)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-cream-100/80 underline decoration-cream-100/30 underline-offset-4 transition-colors hover:text-gold-300"
              >
                <PlayCircle className="h-4 w-4" /> Or say hello on WhatsApp
              </a>
            </motion.div>
          </div>

          {/* Grade staff visual — the signature element: grades sit on the staff like notes */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative rounded-xl2 border border-white/10 bg-white/[0.06] p-6 backdrop-blur-md sm:p-8"
          >
            <p className="mb-6 font-body text-xs font-semibold uppercase tracking-[0.2em] text-cream-100/60">
              Grades on the staff
            </p>
            <StaffLineDivider tone="gold" withClef notes={[26, 40, 54, 68, 82, 94]} />
            <ul className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-2">
              {["Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9"].map(
                (g, i) => (
                  <li
                    key={g}
                    className="rounded-lg bg-white/5 px-3 py-2 text-center text-sm font-medium text-cream-50/90"
                  >
                    {g}
                  </li>
                )
              )}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
