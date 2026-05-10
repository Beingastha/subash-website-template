import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bharatiya Vidya Bhavan, Bhopal — Nurturing Minds, Shaping Futures",
  description:
    "Bharatiya Vidya Bhavan, Bhopal is a premier CBSE affiliated senior secondary school established in 1985. Nurturing minds and shaping futures with excellence in academics, sports, and cultural activities.",
  keywords: [
    "Bharatiya Vidya Bhavan",
    "Bhopal",
    "CBSE School",
    "Senior Secondary School",
    "Education",
    "Madhya Pradesh",
    "India",
    "School Admission",
  ],
  authors: [{ name: "Bharatiya Vidya Bhavan, Bhopal" }],
  icons: {
    icon: "/images/logo.png",
  },
  openGraph: {
    title: "Bharatiya Vidya Bhavan, Bhopal",
    description: "Nurturing Minds, Shaping Futures — A Premier CBSE Institution in the Heart of Bhopal",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
