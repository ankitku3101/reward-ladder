import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Instrument_Serif,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

/* The three faces the ambassador site loads. next/font lives in the demo
 * app only — the RewardLadder component itself reads `var(--font-display)`
 * with a fallback stack, so it renders identically in a non-Next build. */
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
});

const DESCRIPTION =
  "Earned, not handed. What Campus Ambassadors unlock as they bring EYFI to their campus.";

export const metadata: Metadata = {
  // Vercel injects VERCEL_PROJECT_PRODUCTION_URL at build time; the
  // localhost fallback keeps `next build` happy off-platform.
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000",
  ),
  title: "EYFI Reward Ladder",
  description: DESCRIPTION,
  openGraph: {
    title: "EYFI Reward Ladder",
    description: DESCRIPTION,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport = {
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${spaceGrotesk.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}
        <Analytics />
      </body>
    </html>
  );
}
