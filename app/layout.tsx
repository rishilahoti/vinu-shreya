import type { Metadata, Viewport } from "next";
import { Eczar } from "next/font/google";
import { wedding } from "@/lib/content";
import RevealObserver from "@/components/RevealObserver";
import "./globals.css";

// One family for the whole card: Eczar carries Latin and Devanagari, so the invocation and Hindi names match the English.
const eczar = Eczar({ variable: "--font-eczar", subsets: ["latin", "devanagari"] });

const title = `${wedding.groom.name} & ${wedding.bride.name} | ${wedding.dateLabel}`;

export const metadata: Metadata = {
  title,
  description: `You are invited to the wedding of ${wedding.groom.name} and ${wedding.bride.name}, ${wedding.dateLabel}, ${wedding.venue.name}, ${wedding.city}.`,
  openGraph: { title, description: `${wedding.dateLabel} at ${wedding.venue.name}, ${wedding.city}` },
};

export const viewport: Viewport = {
  themeColor: "#da8e8c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${eczar.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Reveal states only apply when scripting works; if the bundle never runs, show everything after 5s. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');setTimeout(function(){if(!document.documentElement.dataset.io)document.querySelectorAll('[data-reveal]').forEach(function(e){e.classList.add('is-in')})},5000)",
          }}
        />
      </head>
      <body>
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
