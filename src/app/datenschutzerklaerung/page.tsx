import type { Metadata } from "next";
import LegalPage from "@/components/site/LegalPage";
import { datenschutz } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Wie die ROOSA AG personenbezogene Daten erhebt, verarbeitet und schützt.",
};

export default function DatenschutzPage() {
  return <LegalPage title="Datenschutzerklärung" sections={datenschutz} />;
}
