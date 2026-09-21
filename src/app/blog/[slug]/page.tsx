import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import Media from "@/components/ui/Media";
import Reveal from "@/components/ui/Reveal";
import ScrollReveal from "@/components/ui/ScrollReveal";
import CopyLink from "@/components/site/CopyLink";
import PostCard from "@/components/site/PostCard";
import { Container } from "@/components/site/Section";
import { authorAvatar, home, postImages } from "@/lib/assets";
import { posts } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 4);
  const published = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <article>
        {/* The source pins the hero to the viewport and scrolls the article
            over it: a fixed image layer, a cream header block rounded at its
            bottom corners (measured 360px tall, date at 171, title at 218 in a
            960px column, lede at 304), then a viewport-tall gap that uncovers
            the image before the body rises back over it. */}
        <div aria-hidden="true" className="fixed inset-x-0 top-0 -z-10 h-screen">
          <Image
            src={postImages[post.slug].src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <header className="relative rounded-b-[16px] bg-cream pb-8 pt-[140px] sm:pt-[171px]">
          <Container>
            <Reveal>
              <p className="text-center text-[18px] leading-[24px] text-olive">{published}</p>
            </Reveal>
            <Reveal delay={70}>
              <h1 className="t-display-l mx-auto mt-[23px] max-w-[960px] text-balance text-center text-moss">
                {post.title}
              </h1>
            </Reveal>
            <Reveal delay={130}>
              <p className="t-body-l mx-auto mt-6 max-w-[960px] text-center text-moss">
                {post.excerpt}
              </p>
            </Reveal>
          </Container>
        </header>

        <div aria-hidden="true" className="h-screen" />

        <Container className="relative z-10 rounded-t-[16px] bg-cream pb-2 pt-10 sm:pt-14">
          <div className="mx-auto max-w-[68ch] pt-6">
            {post.sections.map((section) => (
              <Reveal key={section.heading} className="mt-14">
                <h2 className="t-display-m text-moss">{section.heading}</h2>
                <div className="mt-6 flex flex-col gap-6">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)} className="t-body-l text-forest/80">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}

            <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-forest/15 pt-8">
              <div className="flex items-center gap-4">
                <Image
                  src={authorAvatar.src}
                  alt=""
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div>
                  <p className="t-body text-forest">ROOSA editorial</p>
                  <p className="t-body-s text-forest/55">
                    <time dateTime={post.date}>{published}</time> · {post.readingTime} read
                  </p>
                </div>
              </div>
              <CopyLink />
            </div>
          </div>
        </Container>
      </article>

      <section className="py-24 sm:py-32">
        <Container>
          <h2 className="t-display-m text-moss">From the blog</h2>
          <p className="t-body-l mt-4 max-w-[70ch] text-forest/65">
            Neuigkeiten über ROOSA, unsere Mission und unser Engagement.
          </p>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {more.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 2) * 80}>
                <PostCard post={p} overlay />
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
