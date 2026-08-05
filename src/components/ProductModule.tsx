"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { QuantityControl } from "@/components/QuantityControl";
import styles from "@/components/Commerce.module.css";
import type { Product } from "@/types/content";

export function ProductModule({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const stockLabel = product.inStock === true ? "Available" : product.inStock === false ? "Currently unavailable" : "Inventory confirmation pending";

  function addToDemoCart() {
    addItem(product, quantity);
    setMessage(`${quantity} × ${product.name} added. The cart drawer is open.`);
  }

  return (
    <div className={styles.productModule}>
      <div className={styles.gallery} aria-label={`${product.name} gallery`}>
        <figure className={styles.galleryFrame}>
          <Image src={product.image} alt={`${product.name} pack`} fill loading="eager" fetchPriority="high" sizes="(max-width: 767px) 100vw, 56vw" />
        </figure>
        <figure className={styles.galleryFrame}>
          <Image src={product.alternateImage} alt={`${product.name} detail`} fill sizes="(max-width: 767px) 50vw, 28vw" />
        </figure>
        <figure className={styles.galleryFrame}>
          <Image src="/media/products/embossed-roll.webp" alt="Close view of the paper texture" fill sizes="(max-width: 767px) 50vw, 28vw" />
        </figure>
      </div>

      <section className={styles.purchasePanel} aria-labelledby="product-title">
        <span className="eyebrow">{product.eyebrow}</span>
        <h1 className={styles.productTitle} id="product-title">{product.name}</h1>
        <div className={styles.priceRow}>
          <span className={styles.price}>{product.displayPrice}</span>
          <span className={styles.status}>{stockLabel}</span>
        </div>
        <p className="body-lg">{product.description}</p>
        <dl className={styles.specList}>
          <div className={styles.specItem}><dt>Pack</dt><dd>{product.packSize}</dd></div>
          <div className={styles.specItem}><dt>Rolls</dt><dd>{product.rolls}</dd></div>
          <div className={styles.specItem}><dt>Sheets</dt><dd>{product.sheets}</dd></div>
          <div className={styles.specItem}><dt>Layers</dt><dd>{product.ply}</dd></div>
        </dl>
        {product.purchaseMode === "subscription" && (
          <p className={styles.finePrint}>This is a subscription concept only. No recurring purchase is preselected, and terms must be confirmed before launch.</p>
        )}
        <div className={styles.addArea}>
          <div className={styles.purchaseRow}>
            <QuantityControl quantity={quantity} onChange={setQuantity} productName={product.name} />
            <button className={styles.buttonPrimary} type="button" onClick={addToDemoCart} disabled={product.inStock === false}>Add to demo cart</button>
          </div>
          <p className={styles.finePrint}>Demo only: final price, inventory and checkout require the Shopify connection.</p>
          <p className={styles.liveRegion} aria-live="polite">{message}</p>
        </div>
        <div className={styles.finePrint}>
          <strong>Shipping:</strong> [SHIPPING_REGIONS_AND_TIMES]<br />
          <strong>Impact:</strong> [CONTRIBUTION_AMOUNT] per [CONTRIBUTION_UNIT]
        </div>
      </section>
    </div>
  );
}
