"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "@/components/icons";
import { useCart } from "@/components/CartProvider";
import { localizedPath } from "@/lib/i18n";
import { shopifyConfigured } from "@/lib/shopify";
import type { Locale } from "@/types/content";

const MAX_QUANTITY = 20;

export function CartPageContent({ locale }: { locale: Locale }) {
  const { items, itemCount, removeItem, setQuantity } = useCart();
  const hasItems = items.length > 0;

  return <main className="cart-page">
    <section className="section section--pink cart-page__hero">
      <div className="container cart-page__hero-inner">
        <div className="stack"><span className="eyebrow">Your order · demo mode</span><h1 className="heading-xl">Your paper trail starts here.</h1><p className="body-lg">Review items saved in this browser. Checkout remains unavailable until the commerce connection is configured.</p></div>
        <Link className="button button--secondary" href={localizedPath(locale, "/shop")}>Continue shopping</Link>
      </div>
    </section>
    <section className="section section--tight">
      <div className="container cart-page__layout">
        <div className="cart-page__items" aria-live="polite">
          {hasItems ? items.map(({ product, quantity }) => <article className="cart-page__line" key={product.id}>
            <Link href={localizedPath(locale, `/product/${product.slug}`)} aria-label={`View ${product.name}`}><Image src={product.image} alt="" width={240} height={240} /></Link>
            <div className="cart-page__line-info"><Link className="cart-page__line-title" href={localizedPath(locale, `/product/${product.slug}`)}>{product.name}</Link><span className="muted">{product.displayPrice}</span><div className="cart-page__quantity" role="group" aria-label={`Quantity for ${product.name}`}><button className="button button--icon" type="button" onClick={() => setQuantity(product.id, quantity - 1)} disabled={quantity <= 1} aria-label={`Decrease ${product.name} quantity`}><Minus size={16} aria-hidden="true" /></button><output aria-label={`Quantity for ${product.name}`}>{quantity}</output><button className="button button--icon" type="button" onClick={() => setQuantity(product.id, quantity + 1)} disabled={quantity >= MAX_QUANTITY} aria-label={`Increase ${product.name} quantity`}><Plus size={16} aria-hidden="true" /></button></div></div>
            <button className="text-link cart-page__remove" type="button" onClick={() => removeItem(product.id)}><X size={14} aria-hidden="true" /> Remove</button>
          </article>) : <div className="cart-page__empty"><span className="eyebrow">No items yet</span><h2>Make first roll count.</h2><p className="muted">Browse ROOSA products and add demo items to see them here.</p><Link className="button button--primary" href={localizedPath(locale, "/shop")}>Browse products</Link></div>}
        </div>
        <aside className="cart-page-summary" aria-labelledby="cart-summary-title"><span className="eyebrow">Summary</span><h2 id="cart-summary-title">{itemCount} {itemCount === 1 ? "item" : "items"}</h2><div className="cart-page-summary__row"><strong>Subtotal</strong><span>{hasItems ? "Calculated at checkout" : "-"}</span></div>{!shopifyConfigured && <p className="muted" role="status">Checkout becomes available when the Shopify Storefront connection is configured.</p>}<button className="button button--primary" type="button" disabled={!shopifyConfigured || !hasItems}>Continue to checkout</button><p className="cart-page-summary__note">Demo mode: cart data stays in this browser. No payment or personal data is collected.</p></aside>
      </div>
    </section>
  </main>;
}
