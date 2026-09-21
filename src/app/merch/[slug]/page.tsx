import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import Media from "@/components/ui/Media";
import ProductView from "@/components/site/ProductView";
import Reveal from "@/components/ui/Reveal";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Container } from "@/components/site/Section";
import { home, productGalleries } from "@/lib/assets";
import { products } from "@/lib/content";

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
      <section className="pb-0 pt-24 sm:pt-[100px]">
        <Container>
          <ScrollReveal>
            <h1 className="t-display-l mx-auto max-w-[500px] text-center text-moss">
              Mehr als nur Toilettenpapier
            </h1>
          </ScrollReveal>
          <Reveal delay={100} className="mt-8 flex justify-center">
            <Button href="/#product-offer">Jetzt entdecken</Button>
          </Reveal>
        </Container>
        {/* The source draws sZiDqyHOMLNk at 1376x766 in a 32px gutter on every
            route that closes with this plate - not FdMpM1DRwld at 1400x779. */}
        <div className="mt-8 px-4 sm:translate-y-[100px] sm:px-8">
          <ScrollReveal y={100} start={800} span={700}>
            <Media
              asset={home.grassWide}
              fill
              rounded="rounded-[24px]"
              className="mx-auto aspect-[1249/974] w-full max-w-[1440px]"
              sizes="100vw"
            />
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
