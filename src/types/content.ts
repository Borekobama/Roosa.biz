export type Locale = "en" | "de" | "fr";

export type Product = {
  id: string;
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  displayPrice: string;
  unitAmount?: number;
  currency: "CHF" | "EUR";
  image: string;
  alternateImage: string;
  packSize: string;
  rolls: string;
  sheets: string;
  ply: string;
  material: string;
  origin: string;
  certification: string;
  inStock: boolean | null;
  purchaseMode: "one-time" | "subscription" | "b2b";
};

export type ImpactMetric = {
  value: string;
  label: string;
  period: string;
  source: string;
};

export type ImpactProject = {
  slug: string;
  name: string;
  partner: string;
  location: string;
  period: string;
  objective: string;
  result: string;
  contribution: string;
  status: "planned" | "active" | "complete";
  image: string;
};

export type JournalPost = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  category: "Product" | "Impact" | "Partnerships" | "Company" | "Campaigns";
  image: string;
};
