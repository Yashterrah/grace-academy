import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

interface PageSeoOptions {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

/**
 * Build consistent per-page metadata (title template, OG, Twitter card, canonical).
 * Usage: export const metadata = pageSeo({ title: "About", path: "/about" });
 */
export function pageSeo({
  title,
  description = SITE.description,
  path = "/",
  image = "/images/og-cover.jpg",
  noIndex = false,
}: PageSeoOptions): Metadata {
  const url = `${SITE.url}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: `${title} | ${SITE.name}`,
      description,
      url,
      siteName: SITE.name,
      images: [{ url: image, width: 1200, height: 630, alt: SITE.name }],
      locale: SITE.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.name}`,
      description,
      images: [image],
    },
  };
}
