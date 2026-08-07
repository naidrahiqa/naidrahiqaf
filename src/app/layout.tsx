import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Naidrahiqa",
    template: "%s — Naidrahiqa",
  },
  description:
    "Faqih Ardian Syah — TKJ Student | Kernel Developer | IoT Builder | CyberSecurity Enthusiast",
  keywords: [
    "Faqih Ardian Syah",
    "Naidrahiqa",
    "kernel developer",
    "IoT",
    "cybersecurity",
    "CTF",
    "TKJ",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="noise min-h-full flex flex-col">
        <div className="grid-bg pointer-events-none fixed inset-0 -z-10" />
        <Navbar />
        <main className="flex-1 w-full max-w-5xl mx-auto px-5 sm:px-8 pb-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
