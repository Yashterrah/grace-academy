import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { SITE, CONTACT } from "@/lib/constants";
import { SpeedInsights } from "@vercel/speed-insights/next";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const TEACHER_NAME = "Tr. Grace Muigai";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Online CBC & 8-4-4 Music Lessons`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "music academy Kenya",
    "CBC music lessons",
    "8-4-4 music lessons",
    "online music teacher Kenya",
    "KCSE choral music",
    "recorder lessons Kenya",
    "Grace Muigai",
  ],
  authors: [{ name: TEACHER_NAME }],
  openGraph: {
    title: `${SITE.name} — Online CBC & 8-4-4 Music Lessons`,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: SITE.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Online CBC & 8-4-4 Music Lessons`,
    description: SITE.description,
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icons/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  width: "device-width",
  initialScale: 1,
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  telephone: CONTACT.phonePrimary,
  email: CONTACT.email,
  address: { "@type": "PostalAddress", addressCountry: "KE" },
  sameAs: [CONTACT.facebook, CONTACT.instagram],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
        <WhatsAppButton />
        <SpeedInsights />
      </body>
    </html>
  );
}
