"use client";

import { useState } from "react";
import Image from "next/image";
import { flavourImages, home } from "@/lib/assets";
import { flavours, productDetails, products } from "@/lib/content";
import { Container } from "@/components/site/Section";
import Reveal from "@/components/ui/Reveal";
import { useCart } from "@/components/site/CartDrawer";

const product = products[0];

export default function OfferPanel() {
  const [flavour, setFarbe] = useState<string>(flavours[0].name);
  const [qty, setQty] = useState(1);
  // The source lets these rows stand open together - picking Ingredients does
  // not close Benefits. This closed the others.
  const [open, setOpen] = useState<number[]>([]);
  const cart = useCart();

  const selected = flavours.find((f) => f.name === flavour);
  // The source swaps the product shot with the flavour; this held one image.
  const shot = flavourImages[flavour] ?? home.offer;
  const inStock = selected?.available ?? false;

  return (
    <section id="product-offer" className="scroll-mt-24 pt-24 sm:pt-[110px]">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal zoom className="overflow-hidden rounded-[24px] bg-sage/60">
            <Image
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="aspect-square w-full object-cover"
            />
          </Reveal>

          <Reveal delay={100} className="lg:sticky lg:top-[110px]">
            <div key={flavour} className="offer-copy-in">
              <h3 className="t-product text-moss">ROOSA® Toilettenpapier {flavour}</h3>
              <p className="t-price mt-3 text-forest">{product.price}</p>
            </div>
            {/* The source sets this at 12px on a phone and 16 from sm up, the same way
                it scales the footer. At 16 throughout it stood 110 tall against the
                source's 43. */}
            <p className="mt-6 max-w-[54ch] text-[12px] leading-[14.4px] text-forest/70 sm:text-[16px] sm:leading-[22px]">
              {product.description}
            </p>

            <fieldset className="mt-8">
              <legend className="sr-only">Farbe</legend>
              <div className="flex flex-wrap gap-3">
                {flavours.map((f) => {
                  const active = f.name === flavour;
                  return (
                    <button
                      key={f.name}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFarbe(f.name)}
                      // Measured: 44 tall with 22px side padding, and the
                      // inactive pill sets its label in olive, not forest. The
                      // product page already does this; this panel did not.
                      className={`m-surface h-11 rounded-[999px] px-[22px] text-[14px] font-light leading-[17px] tracking-[-0.68px] sm:text-[17px] ${
                        active ? "bg-olive text-[#f3f3f3]" : "bg-sage text-olive hover:bg-gold hover:text-paper"
                      }`}
                    >
                      {f.name}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Measured at 390px: 33px from the flavour pills to the first detail
                row, where 40 of margin plus the row's own padding gave 61. */}
            <div className="mt-3 divide-y divide-forest/15 border-y border-forest/15 sm:mt-10">
              {productDetails.map((row, i) => {
                const isOpen = open.includes(i);
                return (
                  <div key={row.q}>
                    <h3>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`offer-panel-${i}`}
                        id={`offer-trigger-${i}`}
                        onClick={() =>
                          setOpen((prev) =>
                            prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
                          )
                        }
                        className="m-surface flex w-full items-center justify-between gap-6 py-5 text-left hover:text-moss"
                      >
                        <span className="t-body text-forest">{row.q}</span>
                        <span
                          aria-hidden="true"
                          className="m-transform text-xl leading-none"
                          style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                        >
                          +
                        </span>
                      </button>
                    </h3>
                    <div
                      id={`offer-panel-${i}`}
                      role="region"
                      aria-labelledby={`offer-trigger-${i}`}
                      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="t-body-s max-w-[60ch] pb-5 pr-8 text-forest/70">{row.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-[999px] bg-sage px-1 py-1">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  className="m-surface flex h-9 w-9 items-center justify-center rounded-full text-forest hover:bg-cream disabled:opacity-40"
                >
                  <span aria-hidden="true">−</span>
                </button>
                <span aria-live="polite" className="t-body-s w-7 text-center tabular-nums text-forest">
                  {qty}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => Math.min(99, q + 1))}
                  className="m-surface flex h-9 w-9 items-center justify-center rounded-full text-forest hover:bg-cream"
                >
                  <span aria-hidden="true">+</span>
                </button>
              </div>

              <button
                type="button"
                disabled={!inStock}
                onClick={() =>
                  inStock &&
                  cart.add({
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    variant: flavour,
                    qty,
                  })
                }
                // Measured: 528x46 at 16/16 weight 300, and out of stock is a
                // solid grey #757575 with a light label - not a cream pill with
                // faded text. QuantityBuy already renders it this way.
                className={`m-surface flex h-[46px] flex-1 items-center justify-center gap-2 rounded-[999px] px-5 text-[16px] font-light leading-none ${
                  inStock
                    ? "bg-olive text-[#f3f3f3] hover:bg-moss"
                    : "cursor-not-allowed bg-[#757575] text-[#f3f3f3]"
                }`}
              >
                {inStock ? "In den Warenkorb" : "Nicht verfügbar"}
              </button>
            </div>

            {/* Measured on the source: a plain 22-tall row at 12px with an
                18x22 mark, no pill and no padding - 319 wide against the 656
                this filled. The sage pill and its 12/20 of padding made it 44
                tall, which is the whole of the offer band's overrun. */}
            <p className="mt-4 flex items-center justify-center gap-2 text-[12px] leading-[14.4px] text-forest/70 min-[720px]:leading-[22px]">
              <svg width="18" height="22" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M8 1.5 2.5 3.8v3.7c0 3 2.3 5.8 5.5 7 3.2-1.2 5.5-4 5.5-7V3.8L8 1.5Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path d="m5.6 8 1.7 1.7 3.1-3.4" fill="none" stroke="currentColor" strokeWidth="1.3" />
              </svg>
              Lieferzeit 1–3 Werktage. Sichere Bestellung.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
