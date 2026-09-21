"use client";

import { useState } from "react";
import Image from "next/image";
import ProductPurchase from "@/components/site/ProductPurchase";
import ProductThumbs from "@/components/site/ProductThumbs";
import Reveal from "@/components/ui/Reveal";
import { productGalleries, type Asset } from "@/lib/assets";
import type { Product } from "@/lib/content";

/**
 * Image and purchase controls share a component so the selected flavour can
 * drive the product shot, as it does on the source.
 */
export default function ProductView({
  product,
  images,
}: {
  product: Product;
  images: Asset[];
}) {
  const [flavour, setFarbe] = useState<string>(product.flavours?.[0] ?? "");
  const [shot, setShot] = useState(0);

  const flavours = product.flavours ?? [];
  const gallery = flavours.length
    ? productGalleries[flavour] ?? images
    : images;
  const active = shot;
  const main = gallery[active] ?? images[0];
  const onFarbe = (value: string) => {
    setFarbe(value);
    setShot(0);
  };

  return (
    <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
      <Reveal>
        <div className="overflow-hidden rounded-[24px] bg-[#f4f4f1]">
          <Image
            key={main.src}
            src={main.src}
            alt={main.alt}
            width={main.width}
            height={main.height}
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="h-auto w-full"
          />
        </div>
        <ProductThumbs
          images={gallery}
          name={product.name}
          active={active}
          onSelect={setShot}
        />
      </Reveal>

      <Reveal delay={90}>
        <h3 className="t-product text-moss">{product.name}</h3>
        <p className="t-price mt-[15px] text-moss">{product.price}</p>
        {/* The supplement renders its description once, inside the accordion's
            Ingredients row, and carries none under the price -- checked at 390,
            768 and 1440. The merch products have no accordion and do set it
            here, measured 12px and 358 wide at 390, 15px under the price. A
            copy under the price on the supplement page cost nothing at 1440,
            where this column is not the taller of the two, and 110px at 390
            where the page is one column. */}
        {product.category === "Supplement" ? null : (
          <p className="t-body mt-[15px] max-w-[648px] text-moss">{product.description}</p>
        )}
        <ProductPurchase product={product} flavour={flavour} onFarbe={onFarbe} />
      </Reveal>
    </div>
  );
}
