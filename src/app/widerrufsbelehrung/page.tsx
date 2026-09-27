import type { Metadata } from "next";
import LegalPage from "@/components/site/LegalPage";
import { widerruf } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Widerrufsbelehrung",
  description: "Ihr Widerrufsrecht als Verbraucher und das Muster-Widerrufsformular.",
};

export default function WiderrufPage() {
  return <LegalPage title="Widerrufsbelehrung" sections={widerruf} />;
}
