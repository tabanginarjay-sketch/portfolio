import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import VisitTracker from "../components/VisitTracker";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ar-jay Tabangin | Developer, UI/UX Designer & Photo/Video Editor",
  description: "Personal Portfolio of Ar-jay Tabangin - Developer, UI/UX Designer, Certified Customer Service Professional, and Photo/Video Editor based in the Philippines.",
  keywords: ["Ar-jay Tabangin", "Ar-jay", "Developer", "UI/UX Designer", "Customer Service", "Photo Video Editor", "Portfolio", "Next.js", "React"],
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${plusJakarta.variable} dark bg-black text-white antialiased scroll-smooth`}
    >
      <body className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-[#FF5A5F]/30 selection:text-[#FF5A5F] overflow-x-clip">
        {children}
        <VisitTracker />
        <Analytics />
      </body>
    </html>
  );
}
