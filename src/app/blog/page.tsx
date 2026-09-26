import type { Metadata } from "next";
import Enter from "@/components/ui/Enter";
import Reveal from "@/components/ui/Reveal";
import PostCard from "@/components/site/PostCard";
import DotEyebrow from "@/components/site/DotEyebrow";
import { Container } from "@/components/site/Section";
import { posts } from "@/lib/content";
import ClosingCta from "@/components/site/ClosingCta";

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

      <ClosingCta />
    </>
  );
}
