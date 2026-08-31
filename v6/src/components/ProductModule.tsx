"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useCart } from "@/components/CartProvider";
import { QuantityControl } from "@/components/QuantityControl";
import styles from "@/components/Commerce.module.css";
import type { Product } from "@/types/content";

export function ProductModule({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const stockLabel = product.inStock === true ? "Available" : product.inStock === false ? "Currently unavailable" : "Inventory confirmation pending";
  const galleryImages = [
    { src: product.image, alt: `${product.name} pack` },
    { src: product.alternateImage, alt: `${product.name} detail` },
    { src: "/media/products/embossed-roll.webp", alt: "Close view of the paper texture" },
  ];

  const updateCarouselState = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", updateCarouselState).on("reInit", updateCarouselState);
    const frame = window.requestAnimationFrame(updateCarouselState);
    return () => {
      window.cancelAnimationFrame(frame);
      emblaApi.off("select", updateCarouselState).off("reInit", updateCarouselState);
    };
  }, [emblaApi, updateCarouselState]);

  function addToDemoCart() {
    addItem(product, quantity);
    setMessage(`${quantity} × ${product.name} added. The cart drawer is open.`);
  }

  return (
    <div className={styles.productModule}>
      <div className={styles.gallery} aria-label={`${product.name} gallery`}>
        <div className={styles.galleryDesktop}>
          {galleryImages.map((image, index) => (
            <figure className={styles.galleryFrame} key={image.src}>
              <Image src={image.src} alt={image.alt} fill loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : undefined} sizes="(max-width: 767px) 100vw, 56vw" />
            </figure>
          ))}
        </div>
        <div className={styles.galleryCarouselShell}>
          <div className={styles.galleryCarousel} ref={emblaRef} role="region" aria-roledescription="carousel" aria-label={`${product.name} gallery`}>
            <div className={styles.galleryCarouselContainer}>
              {galleryImages.map((image, index) => (
                <figure className={styles.gallerySlide} key={image.src} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${galleryImages.length}`}>
                  <Image src={image.src} alt={image.alt} fill loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : undefined} sizes="88vw" />
                </figure>
              ))}
            </div>
          </div>
          <div className={styles.galleryControls}>
            <button className={styles.galleryControl} type="button" onClick={() => emblaApi?.scrollPrev()} disabled={!canScrollPrev} aria-label="Previous product image">←</button>
            <div className={styles.galleryDots} aria-label="Select product image">
              {galleryImages.map((image, index) => (
                <button className={styles.galleryDot} key={image.src} type="button" onClick={() => emblaApi?.scrollTo(index)} aria-label={`Show image ${index + 1}`} aria-current={selectedIndex === index ? "true" : undefined} />
              ))}
            </div>
            <button className={styles.galleryControl} type="button" onClick={() => emblaApi?.scrollNext()} disabled={!canScrollNext} aria-label="Next product image">→</button>
          </div>
        </div>
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
          <strong>Shipping:</strong> shipping regions and times pending approval<br />
          <strong>Impact:</strong> Amount pending approval per basis pending approval
        </div>
      </section>
    </div>
  );
}
