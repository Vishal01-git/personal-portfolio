import type { Metadata } from "next";
import { JetBrains_Mono, Syne, Inter } from "next/font/google";
import { GlobalBackground } from "@/components/GlobalBackground";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CommandPalette } from "@/components/CommandPalette";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vishal Prajapati — Data Engineer",
  description: "Data Engineer specializing in scalable pipelines, dbt, Airflow, and AWS. Architecture Lab, projects, and more.",
  openGraph: {
    title: "Vishal Prajapati — Data Engineer",
    description: "Scalable data pipelines · dbt · Airflow · AWS · Architecture Lab",
    url: "https://vishalp.vercel.app",
    siteName: "Vishal Prajapati Portfolio",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1918,
        height: 874,
        alt: "Vishal Prajapati — Data Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vishal Prajapati — Data Engineer",
    description: "Scalable data pipelines · dbt · Airflow · AWS",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${syne.variable} ${jetBrainsMono.variable} antialiased bg-background text-textPrimary selection:bg-primaryGlow/30`}
      >
        <GlobalBackground />
        {/* Command palette is global — lives outside page transitions */}
        <CommandPalette />
        <Navbar />
        <main className="relative z-10 w-full min-h-screen pt-24 pb-10">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        <Footer />
        {/* Scroll-to-top floats above everything */}
        <ScrollToTop />
      </body>
    </html>
  );
}