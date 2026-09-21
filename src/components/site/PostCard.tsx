import Link from "next/link";
import Image from "next/image";
import Media from "@/components/ui/Media";
import { postImages } from "@/lib/assets";
import type { Post } from "@/lib/content";

export default function PostCard({ post, overlay = false }: { post: Post; overlay?: boolean }) {
  const asset = postImages[post.slug];
  const published = new Date(post.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (overlay) {
    return (
      <article>
        <Link
          href={`/blog/${post.slug}`}
          className="group relative block overflow-hidden rounded-[16px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest"
        >
          <Image
            src={asset.src}
            alt={asset.alt}
            width={asset.width}
            height={asset.height}
            sizes="(max-width: 768px) 100vw, 50vw"
            // The card is a fixed 500 tall at every width -- 358x500, 342x500
            // and 678x500 at 390/768/1440 -- so its shape follows its width
            // rather than a ratio. The aspect pair here was right at 390 and
            // 1440 and left the card 248 tall at 768, half the source's.
            className="h-[500px] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
          {/* Measured on the source: the block is inset 16px on every side so
              the image edges show around it - solid olive, 16px radius, 16px
              padding, no blur, white type. */}
          <div className="absolute inset-x-4 bottom-4 rounded-[16px] bg-olive p-4">
            {/* The title is the heading-s role exactly -- 24/28/32 at
                390/768/1440 -- which these utilities rendered as 26 and then 32
                from 640 up, a size out at two of the three widths. The date
                steps 12 to 14 at 720. */}
            <h3 className="t-heading-s text-paper">{post.title}</h3>
            <p className="mt-[33px] text-[12px] leading-[15px] text-paper min-[720px]:text-[14px] min-[720px]:leading-[17px]">
              {published}
            </p>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article>
      <Link
        href={`/blog/${post.slug}`}
        className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest"
      >
        <Media
          asset={asset}
          fill
          className="m-transform aspect-[3/2] w-full group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="mt-5 flex items-center gap-3">
          <span className="t-eyebrow text-moss">{post.category}</span>
          <span aria-hidden="true" className="text-forest/30">·</span>
          <span className="t-body-s text-forest/55">{post.readingTime}</span>
        </div>
        <h3 className="t-heading-s mt-3 max-w-[22ch] text-forest">{post.title}</h3>
        <p className="t-body mt-3 max-w-[46ch] text-forest/65">{post.excerpt}</p>
      </Link>
    </article>
  );
}
