import type { Metadata } from "next";
import { Geist_Mono, Manrope } from "next/font/google";
import Script from "next/script";
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
    images: [
      {
        url: "/images/hero-desk.jpg",
        width: 1280,
        height: 720,
        alt: "A candidate reviewing a CV beside a laptop displaying a job posting.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JobFit | See what your CV proves",
    description: "Compare one CV with one role and turn the overlap into an evidence-led revision plan.",
    images: ["/images/hero-desk.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <Script id="remove-extension-hydration-attributes" strategy="beforeInteractive">
          {`(() => {
          const knownAttributes = ["bis_skin_checked", "bis_register"];
          const isExtensionAttribute = (name) => knownAttributes.includes(name) || name.startsWith("__processed_");
          const clean = (element) => {
            for (const attribute of Array.from(element.attributes)) {
              if (isExtensionAttribute(attribute.name)) {
                element.removeAttribute(attribute.name);
              }
            }
          };
          const cleanTree = (root) => {
            if (root.nodeType !== Node.ELEMENT_NODE) return;
            clean(root);
            root.querySelectorAll("*").forEach(clean);
          };

          cleanTree(document.documentElement);
          new MutationObserver((records) => {
            for (const record of records) {
              if (record.type === "attributes" && record.target instanceof Element) {
                clean(record.target);
              }
              for (const node of record.addedNodes) {
                cleanTree(node);
              }
            }
          }).observe(document.documentElement, {
            attributes: true,
            childList: true,
            subtree: true,
          });
        })();`}
        </Script>
      </head>
      <body className={`${manrope.variable} ${geistMono.variable} antialiased`}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
