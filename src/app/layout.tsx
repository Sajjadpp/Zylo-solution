import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { SITE } from "@/lib/site";
import { introBootScript } from "@/components/intro/boot";
import "./globals.css";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap", weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} | ERP & Software Company in Bahrain`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  icons: { icon: [{ url: "/icon.png", type: "image/png" }], apple: "/apple-icon.png", shortcut: "/icon.png" },
  formatDetection: { telephone: false },
  other: { "geo.region": "BH", "geo.placename": "Manama" },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the intro boot script sets data-intro on <html> before hydration.
    <html lang="en" dir="ltr" className={`${sans.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        {/* Runs before first paint: decides whether the intro plays (every full page load, unless reduced motion). */}
        <script dangerouslySetInnerHTML={{ __html: introBootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
