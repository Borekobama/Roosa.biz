import { notFound } from "next/navigation";
import { CartPageContent } from "@/components/CartPageContent";
import { isLocale } from "@/lib/i18n";

type CartPageProps = { params: Promise<{ locale: string }> };

export default async function CartPage({ params }: CartPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <CartPageContent locale={locale} />;
}
