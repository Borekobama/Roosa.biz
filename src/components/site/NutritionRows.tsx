"use client";

import { useScrollFall } from "@/components/ui/useScrollFall";
import { nutritionFacts } from "@/lib/content";

/**
 * Nutrition rows, scroll-driven on the source's measured curve - 0.50 opacity
 * at 123px of offset with the row's top at 1163, 0.92 at 21px when 680, 0.99 at
 * 3px when 282. Layout is two 688px columns on an 88px pitch.
 */
export default function NutritionRows() {
  const { refs, styleFor } = useScrollFall<HTMLDivElement>(nutritionFacts.length);

  return (
    <dl className="mt-12 border-t border-forest/15">
      {nutritionFacts.map((row, i) => (
        <div
          key={row.label}
          ref={(el) => {
            refs.current[i] = el;
          }}
          // Two equal columns with no gap, measured 179 wide at 390 and 688 at
          // 1440; the 16px gap here took 8 off each, which wrapped the longest
          // label onto a second line on a phone. Row pitch measures 75 and 88
          // against the 79 and 90 that 18px of padding gave.
          className="grid grid-cols-2 items-center border-b border-forest/15 py-4 min-[720px]:py-[17px]"
          style={styleFor(i)}
        >
          <dt className="t-heading-xs text-moss">{row.label}</dt>
          <dd className="t-display-m text-moss">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
