import type { Metadata, Viewport } from "next";
import { Rozha_One, Eczar } from "next/font/google";
import { wedding } from "@/lib/content";
import "./globals.css";

// Both faces carry Latin + Devanagari, so the Hindi invocation and event names match the English.
const rozha = Rozha_One({ variable: "--font-rozha", weight: "400", subsets: ["latin", "devanagari"] });
const eczar = Eczar({ variable: "--font-eczar", subsets: ["latin", "devanagari"] });

const title = `${wedding.groom.name} & ${wedding.bride.name} | ${wedding.dateLabel}`;

export const metadata: Metadata = {
  title,
  description: `You are invited to the wedding of ${wedding.groom.name} and ${wedding.bride.name}, ${wedding.dateLabel}, ${wedding.venue.name}, ${wedding.city}.`,
  openGraph: { title, description: `${wedding.dateLabel} at ${wedding.venue.name}, ${wedding.city}` },
};

export const viewport: Viewport = {
  themeColor: "#0b0d27",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${rozha.variable} ${eczar.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
