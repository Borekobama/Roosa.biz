import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import Media from "@/components/ui/Media";
import Enter from "@/components/ui/Enter";
import Reveal from "@/components/ui/Reveal";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ProductCard from "@/components/site/ProductCard";
import { Container } from "@/components/site/Section";
import { home } from "@/lib/assets";
import { products } from "@/lib/content";

export const metadata: Metadata = {
  title: "Shop",
  description: "ROOSA Toilettenpapier in Rosa und Weiss.",
};

export default function ShopPage() {
  return (
    <>
      <section className="pt-[130px] sm:pt-[128px]">
        <Container className="text-center">
          <Enter delay={80}>
            <h1 className="t-display-l mx-auto max-w-[10ch] text-balance text-moss sm:max-w-[18ch]">
              ROOSA für Ihr Zuhause
            </h1>
          </Enter>
          <Enter delay={160} from="bottom">
            {/* The lede role, not body: the source sets this 14/21 on a phone
                where t-body gives 12/14.4, one line short of its two. */}
            <p className="t-lede mx-auto mt-4 max-w-[54ch] text-forest/65">
              Supersoftes Toilettenpapier bequem im Grossvorrat bestellen.
            </p>
          </Enter>
        </Container>
      </section>

      {/* Keep the two ROOSA variants at roughly the source's 424px card width. */}
      {/* Measured at 390px: 301px from the last product name to the closing
           heading, where 80px of bottom padding gave 220. */}
      {/* Measured from the hero lede's floor to the first card: 41 at 1440 and
           61 at 390. The 21 here was compensating for a lede that wrapped to
           two lines at desktop because 54ch at 16px is narrower than the
           source's measure; with the lede on its right role it is one line on
           both sides and the gap has to carry itself. */}
      <section className="pb-[161px] pt-[59px] sm:pb-[151px] sm:pt-[41px]">
        <Container>
          <div className="mx-auto grid max-w-[900px] gap-x-6 gap-y-24 px-4 sm:grid-cols-2 sm:gap-x-[52px] sm:gap-y-[100px] sm:px-0">
            {products.map((product, i) => (
              <Reveal key={product.slug} delay={(i % 3) * 70}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-0">
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
