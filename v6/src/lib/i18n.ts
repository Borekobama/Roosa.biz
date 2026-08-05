import type { Locale } from "@/types/content";

export const locales: Locale[] = ["en", "de", "fr"];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export const copy = {
  en: {
    announcement: "Every pack supports child-protection work.",
    shop: "Shop",
    product: "Product",
    impact: "Impact",
    about: "About",
    b2b: "B2B",
    journal: "Journal",
    buy: "Buy ROOSA",
    cart: "Cart",
    heroTitle: "Soft on skin. Strong for children.",
    heroBody: "Pink toilet paper with a transparent path from purchase to documented impact.",
    seeImpact: "See the impact",
  },
  de: {
    announcement: "Jede Packung unterstützt Kinderschutzarbeit.",
    shop: "Shop",
    product: "Produkt",
    impact: "Wirkung",
    about: "Über uns",
    b2b: "B2B",
    journal: "Journal",
    buy: "ROOSA kaufen",
    cart: "Warenkorb",
    heroTitle: "Sanft zur Haut. Stark für Kinder.",
    heroBody: "Rosa Toilettenpapier mit einem transparenten Weg vom Kauf bis zur dokumentierten Wirkung.",
    seeImpact: "Wirkung ansehen",
  },
  fr: {
    announcement: "Chaque paquet soutient la protection de l’enfance.",
    shop: "Boutique",
    product: "Produit",
    impact: "Impact",
    about: "À propos",
    b2b: "B2B",
    journal: "Journal",
    buy: "Acheter ROOSA",
    cart: "Panier",
    heroTitle: "Doux pour la peau. Fort pour les enfants.",
    heroBody: "Du papier toilette rose avec un parcours transparent, de l’achat à l’impact documenté.",
    seeImpact: "Voir l’impact",
  },
} as const;

export function localizedPath(locale: Locale, path = "") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized === "/" ? "" : normalized}`;
}
