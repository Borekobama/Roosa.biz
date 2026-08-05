import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Newsreader } from "next/font/google";
import { headers } from "next/headers";
import { isLocale } from "@/lib/i18n";
import "./globals.css";

const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument", display: "swap" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://roosa.biz"),
  title: "ROOSA - Pink paper with a purpose",
  description: "ROOSA pink toilet paper, product information and transparent child-protection impact reporting.",
  openGraph: {
    title: "ROOSA - Pink paper with a purpose",
    description: "Soft on skin. Strong for children.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ef83b6",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const requestedLocale = requestHeaders.get("x-roosa-locale") ?? "en";
  const lang = isLocale(requestedLocale) ? requestedLocale : "en";
  return (
    <html lang={lang} className={`${instrument.variable} ${newsreader.variable}`} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
