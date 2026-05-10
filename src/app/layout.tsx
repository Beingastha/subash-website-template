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
  title: "Govt. HSS Excellence, Subhash Nagar, Bhopal — Nurturing Tomorrow's Leaders",
  description:
    "Govt. Higher Secondary School for Excellence, Subhash Shivaji Nagar, Bhopal — A Government School of Distinction under the Department of School Education, Madhya Pradesh. MP Board affiliated with excellence in academics, sports, and holistic development.",
  keywords: [
    "Govt HSS Excellence",
    "Subhash Shivaji Nagar",
    "Bhopal",
    "MP Board School",
    "Government School of Excellence",
    "Madhya Pradesh",
    "School Education MP",
    "Senior Secondary School",
    "UDISE 23320301711",
    "Bhopal School",
    "Hostel School",
  ],
  authors: [{ name: "Govt. HSS Excellence, Subhash Nagar, Bhopal" }],
  icons: {
    icon: "/images/logo.png",
  },
  openGraph: {
    title: "Govt. HSS Excellence, Subhash Nagar, Bhopal",
    description: "Nurturing Tomorrow's Leaders — A Government School of Distinction in Subhash Shivaji Nagar, Bhopal",
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
