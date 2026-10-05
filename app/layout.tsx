import type { Metadata, Viewport } from "next";
import { Inter_Tight, Instrument_Serif } from "next/font/google";
import Script from "next/script";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aurel-and-ash.vercel.app";

const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter-tight",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

const description =
  "Considered essentials in heavyweight cotton and washed canvas. AUREL & ASH produces small runs of everyday staples, built to outlast the season.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AUREL & ASH — Designed for the everyday",
    template: "%s — AUREL & ASH",
  },
  description,
  applicationName: "AUREL & ASH",
  openGraph: {
    type: "website",
    siteName: "AUREL & ASH",
    locale: "en_US",
    url: siteUrl,
    title: "AUREL & ASH — Designed for the everyday",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "AUREL & ASH — Designed for the everyday",
    description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#f6f3ee",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

/** Sets a marker class so scroll-reveal styles only apply when scripting runs. */
const ENABLE_SCRIPT = "document.documentElement.classList.add('js');";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${interTight.variable} ${instrumentSerif.variable}`}>
      <body className="flex min-h-dvh flex-col bg-bone text-ink antialiased">
        <Script id="aa-enable-motion" strategy="beforeInteractive">
          {ENABLE_SCRIPT}
        </Script>

        <a
          href="#main"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-70 focus-visible:bg-ink focus-visible:px-4 focus-visible:py-2 focus-visible:text-[12px] focus-visible:tracking-[0.14em] focus-visible:text-bone focus-visible:uppercase"
        >
          Skip to content
        </a>

        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}