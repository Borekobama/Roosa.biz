import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { isLocale, locales } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const requestHeaders = await headers();
  const requestedPath = requestHeaders.get("x-roosa-pathname") ?? `/${locale}`;
  const segments = requestedPath.split("/").filter(Boolean);
  const suffix = segments.slice(1).join("/");
  const localizedRoute = (nextLocale: string) => `/${nextLocale}${suffix ? `/${suffix}` : ""}`;
  return {
    alternates: {
      canonical: localizedRoute(locale),
      languages: {
        en: localizedRoute("en"),
        de: localizedRoute("de"),
        fr: localizedRoute("fr"),
        "x-default": localizedRoute("en"),
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <SiteShell locale={locale}>{children}</SiteShell>;
}
