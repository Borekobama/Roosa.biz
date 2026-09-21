"use client";

import { useState } from "react";
import type { Product } from "@/lib/content";
import { productDetails } from "@/lib/content";
import { useCart } from "./CartDrawer";

/**
 * Purchase block, in the source's order: flavour pills, detail rows, then the
 * quantity control with its call to action, then the guarantee bar. Measured at
 * 1440px: pills 138x44 / 140x44 at y=278, stepper and input 40x46, CTA 520x46
 * reading "Nicht verfügbar" when unavailable.
 */
export default function ProductPurchase({
  product,
  flavour,
  onFarbe,
}: {
  product: Product;
  flavour: string;
  onFarbe: (value: string) => void;
}) {
  const [size, setSize] = useState<string>(product.sizes?.[0] ?? "");
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState<number[]>([]);
  const cart = useCart();

  return (
    <div>
      {product.flavours ? (
        <fieldset className="mt-7">
          <legend className="sr-only">{product.variantLabel ?? "Farbe"}</legend>
          <div className="flex flex-wrap gap-1">
            {product.flavours.map((f) => {
              const isActive = f === flavour;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => onFarbe(f)}
                  className={`m-surface h-11 rounded-[999px] px-[22px] text-[17px] font-light leading-[17px] tracking-[-0.68px] ${
                    isActive ? "bg-olive text-[#f3f3f3]" : "bg-sage text-olive hover:bg-gold hover:text-paper"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {product.sizes ? (
        <fieldset className="mt-7">
          <legend className="sr-only">Size</legend>
          <div className="flex flex-wrap gap-1">
            {product.sizes.map((sz) => {
              const isActive = sz === size;
              return (
                <button
                  key={sz}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSize(sz)}
                  className={`m-surface h-11 rounded-[999px] px-[22px] text-[17px] font-light leading-[17px] tracking-[-0.68px] ${
                    isActive ? "bg-olive text-cream" : "bg-sage text-olive hover:bg-sage/70"
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {/* Only the supplement carries these panels: the source's merch pages
          show a picker and the buy row, nothing else. */}
      {product.category === "Supplement" ? (
      <div className="mt-8 divide-y divide-forest/15 border-y border-forest/15">
        {productDetails.map((row, i) => {
          const isOpen = open.includes(i);
          return (
            <div key={row.q}>
              <h4>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`detail-panel-${i}`}
                  id={`detail-trigger-${i}`}
                  onClick={() =>
                    setOpen((cur) =>
                      cur.includes(i) ? cur.filter((n) => n !== i) : [...cur, i],
                    )
                  }
                  // Measured on the source: 18/25.2 in moss on a 73px row.
                  className="m-surface flex w-full items-center justify-between gap-6 py-6 text-left hover:text-olive"
                >
                  <span className="text-[18px] leading-[25.2px] text-moss">{row.q}</span>
                  <span
                    aria-hidden="true"
                    className="m-transform text-xl leading-none text-moss"
                    style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                  >
                    +
                  </span>
                </button>
              </h4>
              <div
                id={`detail-panel-${i}`}
                role="region"
                aria-labelledby={`detail-trigger-${i}`}
                className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr", opacity: isOpen ? 1 : 0 }}
              >
                <div className="overflow-hidden">
                  <p className="t-body max-w-[60ch] pb-5 pr-8 text-forest/70">{row.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      ) : null}

      <div className="mt-7 flex flex-wrap items-center gap-2">
        <div className="flex h-[46px] items-center overflow-hidden rounded-[999px] bg-sage">
          <button
            type="button"
            aria-label={`Decrease quantity of ${product.name}`}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            className="m-surface h-[46px] w-10 text-forest hover:bg-cream/60 disabled:opacity-40"
          >
            <span aria-hidden="true">−</span>
          </button>
          <input
            type="number"
            min={1}
            max={99}
            value={qty}
            aria-label={`Quantity of ${product.name}`}
            onChange={(e) => {
              const next = Number(e.target.value);
              if (Number.isFinite(next)) setQty(Math.min(99, Math.max(1, Math.trunc(next))));
            }}
            className="h-[46px] w-10 [appearance:textfield] bg-sage text-center text-[15px] text-forest outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            type="button"
            aria-label={`Increase quantity of ${product.name}`}
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            className="m-surface h-[46px] w-10 text-forest hover:bg-cream/60"
          >
            <span aria-hidden="true">+</span>
          </button>
        </div>

        <button
          type="button"
          disabled={!product.inStock}
          onClick={() =>
            cart.add({
              slug: product.slug,
              name: product.name,
              price: product.price,
              variant: [flavour, size].filter(Boolean).join(" · ") || undefined,
              qty,
            })
          }
          className={`m-surface flex h-[46px] min-w-[240px] flex-1 items-center justify-center gap-2 rounded-[999px] px-6 text-[16px] font-light leading-none ${
            product.inStock
              ? "bg-olive text-cream hover:bg-moss"
              : "cursor-not-allowed bg-[#757575] text-cream"
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
          {product.inStock ? "Jetzt kaufen" : "Nicht verfügbar"}
        </button>
      </div>

    </div>
  );
}
