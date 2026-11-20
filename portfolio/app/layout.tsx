import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
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
  title: "Jherald Ramos | Full Stack Developer & UI/UX Designer",
  description: "Personal Portfolio of Jherald Ramos - Full Stack Developer, Software Engineer & UI/UX Designer.",
  keywords: ["Jherald Ramos", "Developer", "Portfolio", "UI/UX Designer", "Next.js", "React"],
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
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
      <body className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-[#FF5A5F]/30 selection:text-[#FF5A5F] overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
