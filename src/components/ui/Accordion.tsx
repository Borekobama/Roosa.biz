"use client";

import { useState } from "react";

/**
 * Rows open independently - opening one does not close another - and each
 * panel animates its height rather than appearing instantly.
 */
export default function Accordion({
  items,
}: {
  items: readonly { q: string; a: string }[];
}) {
  const [open, setOpen] = useState<number[]>([]);

  const toggle = (i: number) =>
    setOpen((current) =>
      current.includes(i) ? current.filter((n) => n !== i) : [...current, i],
    );

  return (
    // Each question has the same minimum height; longer text can grow.
    <div className="divide-y divide-forest/15">
      {items.map((item, i) => {
        const isOpen = open.includes(i);
        return (
          <div key={item.q}>
            <h3 className="t-heading-xs">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                id={`faq-trigger-${i}`}
                onClick={() => toggle(i)}
                // Center label and control in evenly spaced rows.
                // An 80px row pitch on a phone, 89 from 720 up.
                className="m-surface flex min-h-[79px] w-full min-[720px]:min-h-[88px] items-center justify-between gap-6 text-left text-moss hover:text-olive"
              >
                {/* Measured: the question sets in a 615px column with the
                    control pushed to the far right of the row. */}
                <span className="min-w-0 flex-1 lg:max-w-[615px]">{item.q}</span>
                <span
                  className="m-transform shrink-0 text-2xl leading-none"
                  style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={`faq-panel-${i}`}
              role="region"
              aria-labelledby={`faq-trigger-${i}`}
              className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
              style={{
                gridTemplateRows: isOpen ? "1fr" : "0fr",
                opacity: isOpen ? 1 : 0,
              }}
            >
              <div className="overflow-hidden">
                <p className="t-body-l max-w-[615px] pb-7 pr-10 text-moss">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
