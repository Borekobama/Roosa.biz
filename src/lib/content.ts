export type Product = {
  slug: string; name: string; price: string; tagline: string; category: string; art: string;
  colorway: { bg: string; ink: string }; details: string[]; description: string;
  specs: { label: string; value: string }[]; aspect: "square" | "portrait"; inStock: boolean;
  flavours?: string[]; variantLabel?: string; sizes?: string[];
};

export type Post = {
  slug: string; title: string; excerpt: string; category: string; readingTime: string;
  date: string; art: string; body: string[]; sections: { heading: string; paragraphs: string[] }[];
};

export const nav = [
  { label: "Mission", href: "/mission" },
  { label: "Aktuelles", href: "/blog" },
  { label: "Shop", href: "/merch" },
] as const;

export const ingredients = ["Supersoft", "Sicher & hautfreundlich", "Alltagstauglich", "Verantwortungsvoll", "Mit Herz für Kinder"] as const;

export const pillars = [
  { eyebrow: "Komfort", title: "Sanft im Alltag", body: "Weiches Toilettenpapier, das zuverlässig funktioniert und sich angenehm anfühlt.", art: "field" },
  { eyebrow: "Wirkung", title: "Kleine Rolle. Grosse Wirkung.", body: "Mit jedem Kauf unterstützt ROOSA Projekte für Kinder und Familien.", art: "seed" },
  { eyebrow: "Qualität", title: "Supersoft und verlässlich", body: "Sorgfältig gefertigt für Komfort, Reissfestigkeit und ein gutes Gefühl.", art: "leaf" },
  { eyebrow: "Einfach", title: "Vorrat ohne Umwege", body: "Praktische Grosspackungen werden direkt zu Ihnen nach Hause geliefert.", art: "bottle" },
] as const;

export const nutrients = [
  { name: "Supersoft", body: "Angenehm weich bei jeder Nutzung.", pos: { left: "70%", top: "13%" }, width: 170, align: "center", line: { left: "76%", top: "24%", width: 3, height: 48 } },
  { name: "Stark", body: "Zuverlässig und reissfest im Alltag.", pos: { left: "45%", top: "48%" }, width: 180, align: "left", line: { left: "58%", top: "52%", width: 74, height: 3 } },
  { name: "Hilft", body: "Jede Packung unterstützt Kinderschutz.", pos: { left: "70%", top: "76%" }, width: 180, align: "center", line: { left: "76%", top: "70%", width: 3, height: 30 } },
] as const;

export const benefits = [
  { title: "Mehr als nur Toilettenpapier", body: "ROOSA verbindet weichen Alltagskomfort mit echtem Engagement für den Kinderschutz.", tone: "sage", art: "jar" },
  { title: "Supersoft", body: "Sanft zur Haut und angenehm bei jeder Nutzung.", tone: "sage", image: "simplicity", ink: "paper" },
  { title: "Praktischer Vorrat", body: "Grosspackungen sparen Wege und halten länger.", tone: "butter", image: "habits" },
  { title: "Verlässliche Qualität", body: "Weich, stabil und für den täglichen Gebrauch gemacht.", tone: "cream", image: "focus" },
  { title: "Kauf mit Wirkung", body: "Ein Teil jedes Verkaufs fliesst in präventive Kinderschutzprojekte.", tone: "sage", image: "hand", inset: true },
] as const;

export const statCards = [
  { value: "56", icon: "timer" as const, label: "Rollen pro Sack", body: "Genug Vorrat für viele Wochen, bequem nach Hause geliefert." },
  { value: "10 Rp.", icon: "arrow" as const, label: "Spende pro 8er-Pack", body: "Jede Packung leistet einen direkten Beitrag für den Kinderschutz." },
  { value: "3", icon: "star" as const, label: "Länder", body: "Engagement in der Schweiz, Deutschland und Österreich." },
] as const;

export const flavours = [{ name: "Rosa", available: true }, { name: "Weiss", available: true }] as const;

export const productDetails = [
  { q: "Produkt", a: "Supersoft Toilettenpapier für den täglichen Gebrauch, erhältlich in Rosa und Weiss." },
  { q: "Lieferumfang", a: "Ein Sack enthält 56 Rollen in sieben handlichen 8er-Packungen." },
  { q: "Soziale Wirkung", a: "Pro 8er-Packung spendet ROOSA 10 Rappen beziehungsweise 10 Cent an Kinderschutzprojekte." },
] as const;

export const stats = [
  { value: "56", label: "Rollen pro Sack" },
  { value: "250", label: "Blatt pro Rolle" },
  { value: "10 Rp.", label: "Spende pro 8er-Pack" },
] as const;

export const testimonials = [
  { quote: "Weich, zuverlässig und dazu eine Marke mit Sinn. Genau das wollte ich.", name: "Mara K.", role: "Kundin" },
  { quote: "Der grosse Vorrat ist praktisch und die Lieferung war schnell und unkompliziert.", name: "Daniel S.", role: "Kunde" },
  { quote: "Rosa bringt etwas Freude ins Bad. Das Engagement für Kinder überzeugt zusätzlich.", name: "Lena W.", role: "Kundin" },
  { quote: "Gute Qualität und eine klare Mission. Wir bestellen ROOSA regelmässig nach.", name: "Fabian R.", role: "Kunde" },
  { quote: "Ein Alltagsprodukt, das gleichzeitig etwas Gutes bewirkt.", name: "Sofia M.", role: "Kundin" },
] as const;

export const faqs = [
  { q: "Was macht ROOSA besonders?", a: "ROOSA verbindet supersoftes Toilettenpapier mit nachhaltigem Engagement für den Kinderschutz." },
  { q: "Wie viele Rollen enthält ein Sack?", a: "Ein Sack enthält 56 Rollen, aufgeteilt in sieben 8er-Packungen." },
  { q: "Welche Farben gibt es?", a: "ROOSA Toilettenpapier ist in Rosa und Weiss erhältlich." },
  { q: "Wie schnell wird geliefert?", a: "Die übliche Lieferzeit beträgt ein bis drei Werktage." },
  { q: "Wie unterstützt mein Kauf Kinder?", a: "Pro 8er-Packung fliessen 10 Rappen oder 10 Cent an Projekte zum Schutz von Kindern." },
  { q: "Wo ist ROOSA aktiv?", a: "ROOSA unterstützt Kinderschutzorganisationen in der Schweiz, Deutschland und Österreich." },
] as const;

const sharedSpecs = [
  { label: "Inhalt", value: "56 Rollen" }, { label: "Verpackung", value: "7 × 8 Rollen" },
  { label: "Qualität", value: "Supersoft" }, { label: "Lieferzeit", value: "1–3 Werktage" },
];

export const products: Product[] = [
  { slug: "toilettenpapier-rosa", name: "ROOSA® Toilettenpapier Rosa", price: "ab 43,90 CHF", tagline: "56 Rollen Supersoft in Rosa.", category: "Toilettenpapier", art: "bottle", aspect: "square", inStock: true, flavours: ["Rosa", "Weiss"], colorway: { bg: "var(--color-butter)", ink: "var(--color-forest)" }, details: ["56 Rollen", "Supersoft", "250 Blatt pro Rolle"], description: "Supersoftes Toilettenpapier in unverwechselbarem Rosa. Praktischer Grossvorrat mit sozialer Wirkung.", specs: sharedSpecs },
  { slug: "toilettenpapier-weiss", name: "ROOSA® Toilettenpapier Weiss", price: "ab 43,90 CHF", tagline: "56 Rollen Supersoft in Weiss.", category: "Toilettenpapier", art: "bottle", aspect: "square", inStock: true, colorway: { bg: "var(--color-sage)", ink: "var(--color-forest)" }, details: ["56 Rollen", "Supersoft", "250 Blatt pro Rolle"], description: "Klassisch weisses, supersoftes Toilettenpapier im praktischen Vorratspack.", specs: sharedSpecs },
];

const makePost = (slug: string, title: string, excerpt: string, date: string, category: string): Post => ({
  slug, title, excerpt, category, readingTime: "4 Min.", date, art: "field",
  body: [excerpt, "ROOSA setzt sich gemeinsam mit Partnerorganisationen für Prävention, Aufklärung und konkrete Unterstützung von Kindern und Familien ein."],
  sections: [
    { heading: "Worum es geht", paragraphs: [excerpt, "Ein Alltagsprodukt kann mehr leisten, wenn wirtschaftlicher Erfolg und gesellschaftliche Verantwortung zusammen gedacht werden."] },
    { heading: "Unser Beitrag", paragraphs: ["Mit jeder verkauften Packung wächst der Beitrag für präventive Projekte und Aufklärungsarbeit.", "ROOSA berichtet transparent über neue Partnerschaften, Aktionen und Spenden."] },
  ],
});

export const posts: Post[] = [
  makePost("kinderschutz-gemeinsam-staerken", "Kinderschutz gemeinsam stärken", "Wie ROOSA mit jedem Verkauf Projekte für Kinder und Familien unterstützt.", "2026-05-27", "Engagement"),
  makePost("kleine-rolle-grosse-wirkung", "Kleine Rolle, grosse Wirkung", "Warum Verantwortung bei einem Produkt beginnt, das jeder Haushalt braucht.", "2026-05-13", "Mission"),
  makePost("supersoft-mit-herz", "Supersoft mit Herz", "Komfort, Alltagstauglichkeit und soziales Engagement in einem Produkt.", "2026-04-21", "Produkt"),
];

export const principles = [
  { icon: "flask", title: "Supersoft", body: "Angenehm weich und für den täglichen Gebrauch gemacht." },
  { icon: "chart", title: "Direkt geliefert", body: "Praktische Vorratspackungen kommen bequem nach Hause." },
  { icon: "leaf", title: "Soziale Wirkung", body: "Jede Packung unterstützt Projekte für den Kinderschutz." },
] as const;

export const scienceStats = [
  { value: "56", badge: "Vorrat", icon: "bolt", label: "Rollen pro Sack", body: "Sieben handliche 8er-Packungen für viele Wochen." },
  { value: "10 Rp.", badge: "Beitrag", icon: "mind", label: "Spende pro Pack", body: "Jeder Kauf unterstützt präventive Kinderschutzprojekte." },
  { value: "3", badge: "Gemeinsam", icon: "people", label: "Länder", body: "Engagement in der Schweiz, Deutschland und Österreich." },
] as const;

export const nutritionFacts = [
  { label: "Rollen pro Sack", value: "56" }, { label: "Packungen", value: "7 × 8" },
  { label: "Blatt pro Rolle", value: "250" }, { label: "Farbe", value: "Rosa / Weiss" },
  { label: "Qualität", value: "Supersoft" }, { label: "Lieferzeit", value: "1–3 Tage" },
] as const;

export const comparison = [
  { label: "Supersoft für angenehmen Komfort", others: "Variiert" },
  { label: "Spende für Kinderschutz pro Packung", others: "Selten" },
  { label: "Praktischer Grossvorrat", others: "Teilweise" },
  { label: "Rosa und Weiss erhältlich", others: "Selten" },
] as const;

export const scienceSections = [
  { eyebrow: "Qualität", title: "Für jeden Tag gemacht", body: "ROOSA verbindet weichen Komfort mit zuverlässiger Alltagstauglichkeit." },
  { eyebrow: "Lieferung", title: "Vorrat ohne Umwege", body: "Grosspackungen reduzieren Nachkäufe und werden direkt geliefert." },
  { eyebrow: "Engagement", title: "Jede Packung hilft", body: "Ein fester Beitrag fliesst in präventive Kinderschutzprojekte." },
] as const;
