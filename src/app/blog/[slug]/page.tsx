import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Reveal from "@/components/ui/Reveal";
import CopyLink from "@/components/site/CopyLink";
import PostCard from "@/components/site/PostCard";
import { Container } from "@/components/site/Section";
import { authorAvatar, postImages } from "@/lib/assets";
import { posts } from "@/lib/content";
import ClosingCta from "@/components/site/ClosingCta";

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
      {/* Clipped to itself so the fixed image shows only behind the article:
          unclipped it filled every transparent area below as well, showing
          through behind the related posts and the closing block. The extra
          pixel at the floor hides a hairline of image that showed where the
          article ends on a fractional pixel. */}
      <article className="relative [clip-path:inset(0_0_1px_0)]">
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

      <ClosingCta />
    </>
  );
}
