import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
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

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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

const themeInit = `
try {
  var t = localStorage.getItem("theme");
  if (t === "dark" || (!t && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add("dark");
  }
} catch (e) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${plusJakarta.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="noise min-h-full flex flex-col">
        <div className="dot-grid pointer-events-none fixed inset-0 -z-10 opacity-40" />
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