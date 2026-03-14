import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { GlobalBackground } from "@/components/GlobalBackground";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vishal Prajapati-Portfolio",
  description: "Cinematic Data Engineer Portfolio & Architecture Lab",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} antialiased bg-background text-textPrimary selection:bg-primaryGlow/30`}
      >
        <GlobalBackground />
        <Navbar />
        <main className="relative z-10 w-full min-h-screen pt-24 pb-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
