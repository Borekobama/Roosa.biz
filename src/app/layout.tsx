import type { Metadata } from "next";
import { ViewTransition } from "react";
import {
  Be_Vietnam_Pro,
  Bricolage_Grotesque,
  DM_Sans,
  Instrument_Serif,
  Inter,
  Kantumruy_Pro,
} from "next/font/google";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { CartProvider } from "@/components/site/CartDrawer";
import { brand } from "@/lib/assets";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-be-vietnam",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const kantumruy = Kantumruy_Pro({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-kantumruy",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-serif-display",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-bricolage",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: "Roosa",
    template: "%s - Roosa",
  },
  description: "Roosa toilet paper.",
  icons: { icon: brand.favicon, apple: brand.favicon },
  openGraph: {
    title: "Roosa",
    description: "Roosa toilet paper.",
    type: "website",
    images: [brand.ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // The font variables must land on :root - Tailwind's @theme resolves
    // var(--font-be-vietnam) there, so declaring them on <body> leaves every
    // --font-* token invalid and the display faces fall back to system sans.
    <html
      lang="de"
      className={`${beVietnam.variable} ${inter.variable} ${kantumruy.variable} ${instrumentSerif.variable} ${bricolage.variable} ${dmSans.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-forest focus:px-5 focus:py-3 focus:text-paper"
        >
          Skip to content
        </a>
        <CartProvider>
          <Header />
          <ViewTransition enter="page-enter" exit="page-exit">
            <main id="main">{children}</main>
          </ViewTransition>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
