"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";

interface SiteChromeProps {
  children: React.ReactNode;
  announcement?: string;
  startLabel?: string;
}

/**
 * Wraps the public site chrome (Navbar, Footer, WhatsApp button,
 * Announcement banner). Hides all on /admin/* routes so the admin
 * portal has a clean slate with no public navbar bleeding through.
 */
export function SiteChrome({ children, announcement = "", startLabel }: SiteChromeProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      {announcement && <AnnouncementBanner message={announcement} />}
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer startLabel={startLabel} />
      <WhatsAppButton />
    </>
  );
}
