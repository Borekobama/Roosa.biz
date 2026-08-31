"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Minus, Plus, X } from "@/components/icons";
import { useCart } from "@/components/CartProvider";
import { localizedPath } from "@/lib/i18n";
import { shopifyConfigured } from "@/lib/shopify";
import type { Locale } from "@/types/content";

export function CartDrawer({ locale }: { locale: Locale }) {
  const { isOpen, closeCart, items, removeItem, setQuantity } = useCart();
  const dialog = useRef<HTMLElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [cartItemsRef] = useAutoAnimate<HTMLDivElement>({ duration: 260, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });

  useEffect(() => {
    if (!isOpen) return;
    returnFocus.current = document.activeElement as HTMLElement;
    document.body.dataset.scrollLock = "true";
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
      if (event.key === "Tab" && dialog.current) {
        const focusable = [...dialog.current.querySelectorAll<HTMLElement>("button:not([disabled]),a[href],select,input")];
        const first = focusable[0], last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.dataset.scrollLock = "false"; returnFocus.current?.focus(); };
  }, [isOpen, closeCart]);
  if (!isOpen) return null;

  return <><button className="drawer-backdrop" type="button" onClick={closeCart} aria-label="Close cart" />
    <aside ref={dialog} className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <header className="cart-drawer__header"><div><span className="eyebrow">Your order</span><h2 id="cart-title" className="heading-md">Cart</h2></div><button ref={closeButton} className="button button--icon" type="button" onClick={closeCart} aria-label="Close cart"><X /></button></header>
      <div ref={cartItemsRef} className="cart-drawer__items" aria-live="polite">{items.length === 0 ? <div className="cart-empty"><div className="stack"><h3>Your paper trail starts here.</h3><p className="muted">Add a ROOSA product to see it in your cart.</p><Link className="button button--secondary" href={localizedPath(locale, "/shop")} onClick={closeCart}>Browse products</Link></div></div> : items.map(({product,quantity}) => <article className="cart-line" key={product.id}>
        <Image src={product.image} alt="" width={168} height={168} />
        <div className="stack"><strong>{product.name}</strong><span className="muted">{product.displayPrice}</span><div className="cluster"><button type="button" className="button button--icon" onClick={() => setQuantity(product.id, quantity - 1)} aria-label={`Decrease ${product.name} quantity`}><Minus size={16}/></button><span>{quantity}</span><button type="button" className="button button--icon" onClick={() => setQuantity(product.id, quantity + 1)} aria-label={`Increase ${product.name} quantity`}><Plus size={16}/></button></div></div>
        <button type="button" className="text-link" onClick={() => removeItem(product.id)}>Remove</button>
      </article>)}</div>
      <footer className="stack"><div className="cart-drawer__footer"><strong>Subtotal</strong><span>{items.length ? "Calculated at checkout" : "-"}</span></div>{!shopifyConfigured && <p className="muted" role="status">Checkout becomes available when the Shopify Storefront connection is configured.</p>}<button className="button button--primary" type="button" disabled={!shopifyConfigured || items.length === 0}>Continue to checkout</button></footer>
    </aside></>;
}
