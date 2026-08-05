import type { Locale } from "@/types/content";

/*
 * Roles migrated from roosa.net/telefonverkaeufer/ and the site's "Stellen" menu.
 *
 * The menu (item 10823) still lists a second role, Haustürverkäufer, pointing at
 * ?page_id=10687 — that page returns 404 publicly and 401 rest_forbidden via the
 * REST API, i.e. it exists but is unpublished. The title and its menu position
 * are the only fragments that survive, so the role is carried here as `closed`
 * with no invented description. Its context paragraph is quoted from the Jobs-
 * category post "Voller Einsatz für den guten Zweck", which is published.
 */

export type RoleSection = { heading: string; items: string[] };

export type RoleCopy = {
  title: string;
  tagline: string;
  summary: string;
  sections: RoleSection[];
  applyNote?: string;
};

export type RoleMeta = { markets: string; location: string; model: string };

export type Role = {
  slug: string;
  status: "open" | "closed";
  image: string;
  imageAlt: string;
  sourceUrl: string | null;
  meta: { de: RoleMeta; en: RoleMeta };
  contact?: { name: string; phone: string; hours: string[]; note: string };
  copy: { de: RoleCopy; en: RoleCopy };
};

export const roles: Role[] = [
  {
    slug: "telefonverkaeufer",
    status: "open",
    image: "/media/products/pink-pack.jpg",
    imageAlt: "The ROOSA Supersoft eight-roll pack sold by the sales team",
    sourceUrl: "https://roosa.net/telefonverkaeufer/",
    meta: {
      de: { markets: "Schweizer & deutscher Markt", location: "Büro Olten", model: "Fixlohn + Provision" },
      en: { markets: "Swiss & German market", location: "Olten office", model: "Fixed salary + commission" },
    },
    contact: {
      name: "Herr Thommen",
      phone: "+41 58 502 23 43",
      hours: ["Montag bis Freitag", "08:00–12:00 Uhr", "13:30–17:00 Uhr"],
      note: "Bitte keine E-Mails – Erstkontakt nur telefonisch.",
    },
    copy: {
      de: {
        title: "Telefonverkäufer",
        tagline: "Suchen junge Verkaufstalente am Telefon — 100 % mit Luxus-Provisionen",
        summary:
          "Wir sind eines der führenden Unternehmen im Bereich Hygieneartikel in der Schweiz. Als einer der grössten WC-Papier-Händler beliefern wir Geschäfts- und Privatkunden mit hochwertigen Produkten. Unser Fokus liegt auf Wachstum, klaren Verkaufsstrukturen und leistungsorientierter Entlöhnung.",
        sections: [
          {
            heading: "Schweizer Markt",
            items: [
              "Ausschliesslich Personen mit perfektem Schweizerdeutsch",
              "Telefonverkauf an Schweizer Kunden",
              "Fixlohn + Provision",
              "Arbeitsort: Büro Olten — kein Homeoffice",
            ],
          },
          {
            heading: "Deutscher Markt",
            items: [
              "Ausschliesslich Personen mit perfektem Hochdeutsch",
              "Telefonverkauf an deutsche Kunden",
              "Fixlohn + Provision",
              "Arbeitsort: Büro Olten — kein Homeoffice",
            ],
          },
          {
            heading: "Ihre Aufgaben",
            items: [
              "Telefonischer Verkauf unserer Hygieneartikel",
              "Aktive Kundenansprache und Abschlussorientierung",
              "Professionelle Beratung von Geschäftskunden",
              "Aktiver Beitrag zum Wachstum des Unternehmens",
            ],
          },
          {
            heading: "Das bieten wir",
            items: [
              "Sehr hohe Verdienstmöglichkeiten durch attraktive Provisionen",
              "Fixlohn nur beim Schweizer Markt",
              "Reiner Provisionsjob beim deutschen Markt",
              "Strukturierte Einarbeitung und Schulungen",
              "Moderner Arbeitsplatz in Olten oder Herten",
              "Langfristige Perspektive in einem wachsenden Unternehmen",
              "Klare Verkaufsprozesse",
            ],
          },
          {
            heading: "Das bringen Sie mit",
            items: [
              "Perfektes Schweizerdeutsch oder perfektes Hochdeutsch (je nach Markt)",
              "Freude am Telefonverkauf",
              "Abschlussstärke und Leistungsbereitschaft",
              "Zuverlässigkeit und Eigeninitiative",
              "Motivation für leistungsabhängigen Verdienst",
            ],
          },
        ],
        applyNote: "Dann freuen wir uns ausschliesslich auf Ihren telefonischen Kontakt.",
      },
      en: {
        title: "Telephone sales",
        tagline: "Looking for young sales talent on the phone — 100 % with premium commission",
        summary:
          "We are one of Switzerland's leading hygiene-products companies. As one of the largest toilet-paper suppliers we serve business and private customers with high-quality products. Our focus is growth, clear sales structures and performance-based pay.",
        sections: [
          {
            heading: "Swiss market",
            items: [
              "Perfect Swiss German only",
              "Telephone sales to Swiss customers",
              "Fixed salary + commission",
              "Location: Olten office — no home office",
            ],
          },
          {
            heading: "German market",
            items: [
              "Perfect High German only",
              "Telephone sales to German customers",
              "Fixed salary + commission",
              "Location: Olten office — no home office",
            ],
          },
          {
            heading: "Your role",
            items: [
              "Selling our hygiene products by telephone",
              "Actively approaching customers and closing",
              "Professional advice for business customers",
              "Contributing actively to the company's growth",
            ],
          },
          {
            heading: "What we offer",
            items: [
              "Very high earning potential through attractive commission",
              "Fixed salary on the Swiss market only",
              "Pure commission role on the German market",
              "Structured onboarding and training",
              "A modern workplace in Olten or Herten",
              "A long-term perspective in a growing company",
              "Clear sales processes",
            ],
          },
          {
            heading: "What you bring",
            items: [
              "Perfect Swiss German or perfect High German (depending on market)",
              "Enjoyment of telephone sales",
              "Closing strength and drive",
              "Reliability and initiative",
              "Motivation for performance-based earnings",
            ],
          },
        ],
        applyNote: "We look forward to hearing from you — by telephone only.",
      },
    },
  },
  {
    slug: "haustuerverkaeufer",
    status: "closed",
    image: "/media/journal/field-team.jpg",
    imageAlt: "A ROOSA door-to-door seller beside the branded pink ROOSA van",
    sourceUrl: null,
    meta: {
      de: { markets: "Schweiz", location: "Im Aussendienst", model: "Nicht ausgeschrieben" },
      en: { markets: "Switzerland", location: "Field sales", model: "Not advertised" },
    },
    copy: {
      de: {
        title: "Haustürverkäufer",
        tagline: "Unterwegs mit dem ROOSA-Bus — aktuell nicht ausgeschrieben",
        summary:
          "Auch unsere Hausverkäufer sind täglich mit vollem Einsatz unterwegs – nicht nur für den Verkauf, sondern auch für den guten Zweck. Mit jedem Gespräch, jedem Besuch und jedem Verkauf unterstützen sie aktiv den Kinder- und Jugendschutz in der Schweiz.",
        sections: [
          {
            heading: "Was von dieser Stelle bekannt ist",
            items: [
              "Die Rolle steht weiterhin im Stellen-Menü der bestehenden Website.",
              "Die verlinkte Stellenseite ist nicht mehr öffentlich abrufbar.",
              "Der oben zitierte Kontext stammt aus dem veröffentlichten Beitrag „Voller Einsatz für den guten Zweck“.",
            ],
          },
        ],
      },
      en: {
        title: "Door-to-door sales",
        tagline: "Out with the ROOSA van — not currently advertised",
        summary:
          "Our door-to-door sellers are out every day giving it everything they have — not only for the sale, but for the cause behind it. With every conversation, every visit and every sale they actively support child and youth protection in Switzerland.",
        sections: [
          {
            heading: "What is known about this role",
            items: [
              "The role still appears in the existing site's careers menu.",
              "The page it links to is no longer publicly available.",
              "The context quoted above comes from the published post “Voller Einsatz für den guten Zweck”.",
            ],
          },
        ],
      },
    },
  },
];

export function roleCopy(role: Role, locale: Locale) {
  return {
    copy: locale === "de" ? role.copy.de : role.copy.en,
    meta: locale === "de" ? role.meta.de : role.meta.en,
    isSourceLanguage: locale === "de",
    translationPending: locale === "fr",
  };
}

export function findRole(slug: string) {
  return roles.find((role) => role.slug === slug);
}
