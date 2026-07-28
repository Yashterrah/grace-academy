"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Music2 } from "lucide-react";
import { NAV_LINKS, SITE, CTA_LINKS } from "@/lib/constants";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const { direction, scrolled } = useScrollDirection();
  const pathname = usePathname();

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-transform duration-300",
        direction === "down" && !open ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <div
        className={cn(
          "transition-colors duration-300",
          scrolled || open
            ? "bg-white/90 backdrop-blur-md shadow-sm"
            : "bg-gradient-to-b from-black/25 to-transparent"
        )}
      >
        <div className="container flex h-16 items-center justify-between sm:h-20">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-lg font-semibold sm:text-xl"
          >
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full sm:h-10 sm:w-10",
                scrolled || open ? "bg-teal-600 text-cream-50" : "bg-white/15 text-cream-50 backdrop-blur"
              )}
            >
              <Music2 className="h-5 w-5" aria-hidden />
            </span>
            <span className={scrolled || open ? "text-ink" : "text-cream-50"}>
              {SITE.shortName}
              <span className="hidden sm:inline"> Music Academy</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    scrolled ? "text-ink-soft hover:text-teal-600" : "text-cream-50/90 hover:text-cream-50",
                    active && (scrolled ? "text-teal-600" : "text-cream-50")
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className={cn(
                        "absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full",
                        scrolled ? "bg-teal-600" : "bg-gold-400"
                      )}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Button href={CTA_LINKS.register} variant={scrolled ? "secondary" : "outlineLight"} size="sm">
              Register
            </Button>
            <Button href={CTA_LINKS.book} variant="gold" size="sm">
              Book a Lesson
            </Button>
          </div>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full lg:hidden",
              scrolled || open ? "text-ink" : "text-cream-50"
            )}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden bg-white shadow-lg lg:hidden"
            aria-label="Mobile"
          >
            <div className="container flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-4 py-3 text-base font-medium text-ink-soft hover:bg-cream-100 hover:text-teal-600",
                    pathname === link.href && "bg-cream-100 text-teal-600"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2 px-4">
                <Button href={CTA_LINKS.register} variant="secondary">
                  Register
                </Button>
                <Button href={CTA_LINKS.book} variant="gold">
                  Book a Lesson
                </Button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
