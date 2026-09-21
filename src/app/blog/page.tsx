import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import Media from "@/components/ui/Media";
import Enter from "@/components/ui/Enter";
import Reveal from "@/components/ui/Reveal";
import ScrollReveal from "@/components/ui/ScrollReveal";
import PostCard from "@/components/site/PostCard";
import DotEyebrow from "@/components/site/DotEyebrow";
import { Container } from "@/components/site/Section";
import { home } from "@/lib/assets";
import { posts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Neuigkeiten zu ROOSA und unserem Einsatz für Kinder.",
};

export default function BlogPage() {
  return (
    <>
      {/* Measured on the source: eyebrow at y=122, heading at 168, lede at 242
          in an 18/24 solid moss, and the first card row at 330. */}
      <section className="pt-[102px] sm:pt-[122px]">
        <Container>
          <Enter delay={0}>
            <DotEyebrow>Our Blog</DotEyebrow>
          </Enter>
          <Enter delay={60}>
            <h1 className="t-display-l mx-auto mt-[26px] max-w-[11ch] text-balance text-center text-moss sm:max-w-[560px]">
              Resources and insights
            </h1>
          </Enter>
          <Enter delay={130} from="bottom">
            <p className="t-body-l mx-auto mt-3 max-w-[504px] text-center text-moss">
              The latest research, interviews, sourcing notes and product updates.
            </p>
          </Enter>
        </Container>
      </section>

      <section className="pb-16 pt-10 sm:pb-[95px]">
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            {posts.map((post, i) => (
              <Reveal key={post.slug} delay={(i % 2) * 80}>
                <PostCard post={post} overlay />
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
