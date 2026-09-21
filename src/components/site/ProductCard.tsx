import Link from "next/link";
import Image from "next/image";
import QuantityBuy from "@/components/site/QuantityBuy";
import { productImages } from "@/lib/assets";
import type { Product } from "@/lib/content";

/**
 * Measured from the source listing: name 32px, price 23px directly beneath it,
 * no supporting line, and the purchase control below. Cards sit on the page
 * background rather than a tinted panel.
 */
export default function ProductCard({ product }: { product: Product }) {
  const asset = productImages[product.slug];

  return (
    <div className="flex flex-col">
      <Link
        href={`/merch/${product.slug}`}
        className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest"
      >
        <div className="overflow-hidden rounded-[16px]">
          <Image
            src={asset.src}
            alt={asset.alt}
            width={asset.width}
            height={asset.height}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="m-transform aspect-[326/437] w-full object-cover group-hover:scale-[1.03] sm:aspect-[424/387]"
          />
        </div>
        {/* Measured: the name sits 32px under the image, not 20. */}
        <h3 className="t-product-name mt-8 text-moss">{product.name}</h3>
        <p className="mt-2 text-[23px] leading-[23px] tracking-[-0.69px] text-forest">{product.price}</p>
      </Link>

      {/* Measured at 390px: 55px from the price to the purchase control, not 43.
          Phone only - at desktop widths 20 already matched, and applying the
          phone figure everywhere pushed /merch from -1 to +20. */}
      <div className="mt-8 sm:mt-5">
        <QuantityBuy
          name={product.name}
          inStock={product.inStock}
          slug={product.slug}
          price={product.price}
        />
      </div>
    </div>
  );
}
