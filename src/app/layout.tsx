import type { Metadata } from "next";
import { Geist_Mono, Manrope } from "next/font/google";
import { DeferredCursor } from "@/components/ui/deferred-cursor";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "JobFit",
  title: {
    default: "JobFit | See what your CV proves",
    template: "%s | JobFit",
  },
  description: "Compare your CV with a job description and receive structured, evidence-based recommendations.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "JobFit",
    title: "JobFit | See what your CV proves",
    description: "Compare one CV with one role and turn the overlap into an evidence-led revision plan.",
  },
  twitter: {
    card: "summary_large_image",
    title: "JobFit | See what your CV proves",
    description: "Compare one CV with one role and turn the overlap into an evidence-led revision plan.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${geistMono.variable} antialiased`}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <DeferredCursor />
      </body>
    </html>
  );
}
