import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductView from "@/components/site/ProductView";
import { Container } from "@/components/site/Section";
import { productGalleries } from "@/lib/assets";
import { products } from "@/lib/content";
import ClosingCta from "@/components/site/ClosingCta";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};
  return { title: product.name, description: product.tagline };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const images = productGalleries[slug === "toilettenpapier-weiss" ? "Weiss" : "Rosa"];

  return (
    <>
      {/* Measured on the source: the image and the title column both start at
          y=140, inside a 40px page gutter. */}
      <section className="pt-[120px] sm:pt-[140px]">
        <Container className="sm:px-10">
          <ProductView product={product} images={images} />
        </Container>
      </section>

      {/* Measured: the closing heading sits 172px under the product image, not
          200 - this opened on 128px of padding where the source has 100. */}
      <ClosingCta className="pt-24 sm:pt-[100px]" />
    </>
  );
}
