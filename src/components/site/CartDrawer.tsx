"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { home, productImages } from "@/lib/assets";

export type CartLine = {
  /** slug + variant, so the same product in two sizes stays distinct. */
  id: string;
  slug: string;
  name: string;
  price: string;
  variant?: string;
  qty: number;
};

type CartApi = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
  lines: CartLine[];
  add: (line: Omit<CartLine, "id">) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  count: number;
};

const Ctx = createContext<CartApi | null>(null);

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

const toNumber = (price: string) => Number(price.match(/[0-9]+(?:[.,][0-9]+)?/)?.[0].replace(",", ".")) || 0;
const money = (n: number) => `${n.toFixed(2).replace(".", ",")} CHF`;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [placed, setPlaced] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const add = useCallback((line: Omit<CartLine, "id">) => {
    const id = `${line.slug}::${line.variant ?? "default"}`;
    setPlaced(false);
    setLines((cur) => {
      const found = cur.find((l) => l.id === id);
      if (found) {
        return cur.map((l) => (l.id === id ? { ...l, qty: l.qty + line.qty } : l));
      }
      return [...cur, { ...line, id }];
    });
    setIsOpen(true);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((cur) =>
      qty <= 0
        ? cur.filter((l) => l.id !== id)
        : cur.map((l) => (l.id === id ? { ...l, qty: Math.min(99, qty) } : l)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setLines((cur) => cur.filter((l) => l.id !== id));
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + toNumber(l.price) * l.qty, 0);

  const value = useMemo(
    () => ({ open, close, isOpen, lines, add, setQty, remove, count }),
    [open, close, isOpen, lines, add, setQty, remove, count],
  );

  return (
    <Ctx.Provider value={value}>
      {children}

      <div
        aria-hidden={!isOpen}
        onClick={close}
        className="fixed inset-0 z-[60] bg-forest/40 transition-opacity duration-300"
        style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none" }}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Warenkorb"
        aria-hidden={!isOpen}
        // Measured on the source: a 460px cream panel inset 20px with a 16px
        // radius.
        className="fixed right-0 top-0 z-[70] flex h-full w-[min(460px,94vw)] flex-col overflow-hidden bg-cream transition-transform duration-300 ease-out sm:right-5 sm:top-5 sm:h-[calc(100%-40px)] sm:rounded-[16px]"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(105%)",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <p className="t-heading-xs text-moss">
            Warenkorb{count > 0 ? ` (${count})` : ""}
          </p>
          <button
            type="button"
            onClick={close}
            aria-label="Warenkorb schliessen"
            className="m-surface flex h-10 w-10 items-center justify-center rounded-full bg-sage text-forest hover:bg-olive hover:text-cream"
          >
            <span aria-hidden="true" className="text-xl leading-none">
              &times;
            </span>
          </button>
        </div>

        {lines.length === 0 ? (
          <>
            <div className="relative flex flex-1 flex-col items-center justify-center px-8 text-center">
              {/* The source puts a gummy above the empty message - 104x63,
                  centred in the panel. */}
              <Image
                src={home.gummyGreen.src}
                alt=""
                width={104}
                height={63}
                sizes="104px"
                className="mb-[10px] h-[63px] w-[104px] object-contain"
              />
              <p className="t-heading-xs text-moss">
                {placed ? "Bestellung erfasst" : "Ihr Warenkorb ist leer"}
              </p>
              <p className="t-body mt-3 max-w-[30ch] text-forest/60">
                {placed
                  ? "Dies ist ein Demo-Checkout. Es wurde nichts belastet."
                  : "Ihr Warenkorb ist noch leer. Entdecken Sie unsere ROOSA Produkte."}
              </p>
              <Link
                href="/merch"
                onClick={close}
                className="m-surface mt-7 inline-flex h-[42px] items-center rounded-[999px] bg-olive px-6 text-[18px] leading-[25px] text-cream hover:bg-moss"
              >
                Zum Shop
              </Link>
            </div>

            <div className="border-t border-forest/15 px-6 py-5">
              <div className="flex items-baseline justify-between">
                <p className="t-body text-forest/65">Zwischensumme</p>
                <p className="t-price text-forest/40">0,00 CHF</p>
              </div>
              <button
                type="button"
                disabled
                className="mt-4 flex h-[46px] w-full cursor-not-allowed items-center justify-center rounded-[999px] bg-sage text-[16px] font-light text-forest/45"
              >
                Zur Kasse
              </button>
            </div>
          </>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6">
              {lines.map((line) => {
                const art = productImages[line.slug];
                return (
                  <li key={line.id} className="flex gap-4 border-b border-forest/10 py-5">
                    {art ? (
                      <Image
                        src={art.src}
                        alt=""
                        width={72}
                        height={72}
                        className="h-[72px] w-[72px] shrink-0 rounded-[12px] object-cover"
                      />
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <p className="t-body text-forest">{line.name}</p>
                      {line.variant ? (
                        <p className="t-body-s text-forest/55">{line.variant}</p>
                      ) : null}
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex h-9 items-center overflow-hidden rounded-[999px] bg-sage">
                          <button
                            type="button"
                            aria-label={`Decrease ${line.name}`}
                            onClick={() => setQty(line.id, line.qty - 1)}
                            className="m-surface h-9 w-8 text-[#111111] hover:bg-cream/60"
                          >
                            <span aria-hidden="true">−</span>
                          </button>
                          <span className="w-8 text-center text-[15px] tabular-nums text-[#111111]">
                            {line.qty}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase ${line.name}`}
                            onClick={() => setQty(line.id, line.qty + 1)}
                            className="m-surface h-9 w-8 text-[#111111] hover:bg-cream/60"
                          >
                            <span aria-hidden="true">+</span>
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(line.id)}
                          className="m-surface t-body-s text-forest/55 underline underline-offset-4 hover:text-forest"
                        >
                          Entfernen
                        </button>
                      </div>
                    </div>
                    <p className="t-body shrink-0 text-forest">
                      {money(toNumber(line.price) * line.qty)}
                    </p>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-forest/15 px-6 py-5">
              <div className="flex items-baseline justify-between">
                <p className="t-body text-forest/65">Zwischensumme</p>
                <p className="t-price text-forest">{money(subtotal)}</p>
              </div>
              <p className="t-body-s mt-2 text-forest/55">
                Versand und Steuern werden an der Kasse berechnet.
              </p>
              <button
                type="button"
                onClick={() => {
                  setLines([]);
                  setPlaced(true);
                }}
                className="m-surface mt-4 flex h-[46px] w-full items-center justify-center rounded-[999px] bg-olive text-[16px] font-light text-cream hover:bg-moss"
              >
                Zur Kasse
              </button>
            </div>
          </>
        )}
      </aside>
    </Ctx.Provider>
  );
}
