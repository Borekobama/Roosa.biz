"use client";

import { useState } from "react";
import { useCart } from "./CartDrawer";

/** Quantity stepper + Jetzt kaufen, as the source merch cards present it. */
export default function QuantityBuy({
  name,
  compact = false,
  inStock = true,
  slug,
  price,
}: {
  name: string;
  compact?: boolean;
  inStock?: boolean;
  slug?: string;
  price?: string;
}) {
  const [qty, setQty] = useState(1);
  const cart = useCart();

  return (
    <div className={`flex items-center gap-2 ${compact ? "" : "w-full"}`}>
      <div className="flex h-[46px] items-center overflow-hidden rounded-[999px] bg-sage">
        <button
          type="button"
          aria-label={`Decrease quantity of ${name}`}
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={qty <= 1}
          className="m-surface flex h-[46px] w-9 items-center justify-center text-[#111111] hover:bg-cream/60 disabled:opacity-40 min-[720px]:w-10"
        >
          <span aria-hidden="true">−</span>
        </button>
        <span
          aria-live="polite"
          aria-label={`Quantity of ${name}`}
          className="w-9 text-center text-[16px] tabular-nums text-[#111111] min-[720px]:w-10"
        >
          {qty}
        </span>
        <button
          type="button"
          aria-label={`Increase quantity of ${name}`}
          onClick={() => setQty((q) => Math.min(99, q + 1))}
          className="m-surface flex h-[46px] w-9 items-center justify-center text-[#111111] hover:bg-cream/60 min-[720px]:w-10"
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>

      <button
        type="button"
        disabled={!inStock}
        onClick={() => {
          if (slug && price) cart.add({ slug, name, price, qty });
        }}
        // Tighter on a phone so the label keeps to one line in a narrow card:
        // at 320 it had 128px and broke in two.
        className={`m-surface flex flex-1 items-center justify-center gap-1.5 h-[46px] whitespace-nowrap rounded-[999px] px-3 text-[16px] font-light leading-none min-[720px]:gap-2 min-[720px]:px-5 ${
          inStock ? "bg-olive text-[#f3f3f3] hover:bg-moss" : "cursor-not-allowed bg-[#757575] text-[#f3f3f3]"
        }`}
      >
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M1.5 1.5h2l1.6 8.2a1 1 0 0 0 1 .8h6a1 1 0 0 0 1-.8l1.1-5.2H4"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="6.5" cy="13.5" r="1.1" fill="currentColor" />
          <circle cx="12" cy="13.5" r="1.1" fill="currentColor" />
        </svg>
        {inStock ? "Jetzt kaufen" : "Nicht verfügbar"}
      </button>
    </div>
  );
}
