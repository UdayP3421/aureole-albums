import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers";

/* ── Luxury fonts ── */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600"]
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"]
});

export const metadata: Metadata = {
  title: {
    default: "Aureole Albums — Cinematic Wedding Memory Platform",
    template: "%s | Aureole Albums"
  },
  description:
    "A premium multi-tenant wedding album SaaS with encrypted Cloudinary storage, immersive 3D experiences, and cinematic storytelling.",
  keywords: ["wedding album", "3D wedding photos", "cinematic wedding", "wedding SaaS"],
  authors: [{ name: "Aureole Albums" }],
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    siteName: "Aureole Albums",
    title: "Aureole Albums — Cinematic Wedding Memory Platform",
    description: "Immersive 3D wedding albums with luxury UI and per-user Cloudinary storage."
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#341a2d"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased" suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
