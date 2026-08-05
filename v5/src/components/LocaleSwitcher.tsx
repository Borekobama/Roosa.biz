"use client";

import { usePathname, useRouter } from "next/navigation";
import { track } from "@/lib/analytics";
import { locales } from "@/lib/i18n";
import type { Locale } from "@/types/content";

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <label>
      <span className="sr-only">Language</span>
      <select className="locale-select" value={locale} onChange={(event) => {
        const next = event.target.value as Locale;
        const segments = pathname.split("/").filter(Boolean);
        if (locales.includes(segments[0] as Locale)) segments[0] = next;
        track("language_change", { from: locale, to: next });
        router.push(`/${segments.join("/")}`);
      }}>
        <option value="en">EN</option><option value="de">DE</option><option value="fr">FR</option>
      </select>
    </label>
  );
}
