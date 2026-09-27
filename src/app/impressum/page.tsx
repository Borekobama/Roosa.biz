import type { Metadata } from "next";
import LegalPage from "@/components/site/LegalPage";
import { impressum } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Anbieterangaben und rechtliche Hinweise der ROOSA AG, Basel.",
};

export default function ImpressumPage() {
  return <LegalPage title="Impressum" sections={impressum} />;
}
