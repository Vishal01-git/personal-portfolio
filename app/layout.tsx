import type { Metadata } from "next";
import { JetBrains_Mono, Syne, Inter } from "next/font/google";
import { GlobalBackground } from "@/components/GlobalBackground";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CommandPaletteProvider } from "@/components/CommandPalette";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ThemeProvider } from "@/components/ThemeProvider";
import { meta } from "@/data/meta";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

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
  metadataBase: new URL(meta.siteUrl),
  title:       meta.title,
  description: meta.description,
  openGraph: {
    title:       meta.title,
    description: meta.ogDescription,
    url:         meta.siteUrl,
    siteName:    meta.title,
    type:        "website",
  },
  twitter: {
    card:        "summary_large_image",
    title:       meta.title,
    description: meta.ogDescription,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" data-theme="terminal">
      <body className={`${inter.variable} ${syne.variable} ${jetBrainsMono.variable} antialiased bg-background text-textPrimary selection:bg-primaryGlow/30`}>
        <ThemeProvider>
          <GlobalBackground />
          <CommandPaletteProvider>
            <Navbar />
            <main className="relative z-10 w-full min-h-screen pt-24 pb-10">
              <PageTransition>{children}</PageTransition>
            </main>
          </CommandPaletteProvider>
          <Footer />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}