import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://42.serenic.xyz"),

  title: {
    default: "Mafia42 Rankings",
    template: "%s | Mafia42",
  },

  description:
    "View Mafia42 RP, Fame, and Guild rankings, explore previous days, and simulate Event Boxes based on probabilities.",

  openGraph: {
    title: "Mafia42 Rankings",
    description:
      "View Mafia42 RP, Fame, and Guild rankings, explore previous days, and simulate Event Boxes based on probabilities.",
    url: "https://42.serenic.xyz",
    siteName: "Mafia42",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Mafia42 Rankings",
    description:
      "View Mafia42 RP, Fame, and Guild rankings, explore previous days, and simulate Event Boxes based on probabilities.",
  },

  robots: {
    index: true,
    follow: true,
  },

  verification: {
    google: "zTbZG4axVkvic8rR23-gM7kiZ3B_4M3hsuB76aosQDU",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
