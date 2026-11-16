import type { Metadata, Viewport } from "next";
import "./royal.css";

const FONTS =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,300..700&family=DM+Serif+Display:ital@0;1&family=Marcellus&family=Noto+Serif+Devanagari:wght@400;500;600;700&family=Rozha+One&family=Yatra+One&display=swap";

const title = "Vinamra & Shreya | Royal Wedding Invitation | 1st & 2nd February 2027";
const description =
  "Join us in celebrating the wedding of Vinamra & Shreya at Heaven Space Resort, Mhow on 1st & 2nd February 2027. Schedule of events, dress codes, Google Maps navigation, and celebration details.";

export const metadata: Metadata = {
  title,
  description,
  authors: [{ name: "Vinamra & Shreya" }],
  openGraph: { title: "Vinamra & Shreya | Royal Wedding Invitation", description, siteName: "Vinamra & Shreya Wedding", locale: "en_IN", type: "website" },
  twitter: { card: "summary_large_image", title: "Vinamra & Shreya | Royal Wedding Invitation", description },
};

export const viewport: Viewport = { themeColor: "#FAF8F5", width: "device-width", initialScale: 1, maximumScale: 5 };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="bg-[#FAF8F5] text-[#1C1917] antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        { }
        <link href={FONTS} rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#FAF8F5] text-[#1C1917] font-sans selection:bg-[#B8860B]/20 selection:text-[#831843]">
        {children}
      </body>
    </html>
  );
}
