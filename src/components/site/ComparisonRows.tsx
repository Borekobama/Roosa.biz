"use client";

import { useScrollFall } from "@/components/ui/useScrollFall";
import { comparison } from "@/lib/content";

/**
 * Comparison rows on the same scroll-linked curve the source gives its other
 * row stacks - 0.50 opacity at 123px of offset with the row's top at 1299,
 * 0.92 at 21px when 816, 0.99 at 3px when 418.
 *
 * The style goes on the <tr> itself: wrapping table rows in a div to carry it
 * would break the table.
 */
export default function ComparisonRows({ mark }: { mark: React.ReactNode }) {
  const { refs, styleFor } = useScrollFall<HTMLTableRowElement>(comparison.length);

  return (
    <tbody>
      {comparison.map((row, i) => (
        <tr
          key={row.label}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="border-t border-forest/15"
          style={styleFor(i)}
        >
          {/* The source's phone rows run 79 tall on a 112 pitch; 22px of cell
              padding gave 91 on 96. The column widths themselves live in the
              colgroup on /science, which is what actually governs them under
              table-fixed. */}
          <th
            scope="row"
            className="t-heading-xs py-4 pr-4 text-left font-light text-moss min-[720px]:pr-0 min-[720px]:py-[22px]"
          >
            {row.label}
          </th>
          <td className="py-4 text-center min-[720px]:py-[22px]">{mark}</td>
          <td className="py-4 text-center text-[18px] leading-[24px] text-moss min-[720px]:py-[22px]">
            {row.others}
          </td>
        </tr>
      ))}
    </tbody>
  );
}
