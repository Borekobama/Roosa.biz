import type { Metadata } from "next";
import LegalPage from "@/components/site/LegalPage";
import { agb } from "@/lib/legal";

export const metadata: Metadata = {
  title: "AGB",
  description: "Allgemeine Geschäftsbedingungen für Bestellungen im ROOSA Online-Shop.",
};

export default function AgbPage() {
  return <LegalPage title="Allgemeine Geschäftsbedingungen" sections={agb} />;
}
