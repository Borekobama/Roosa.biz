import Image from "next/image";
import { UprightJarLineArt } from "@/components/ui/LineArt";
import ScrollSettle from "@/components/ui/ScrollSettle";
import { home } from "@/lib/assets";
import { benefits } from "@/lib/content";

const tones: Record<string, string> = {
  sage: "bg-sage text-moss",
  butter: "bg-butter text-moss",
  cream: "bg-sage/50 text-moss",
};

const images = {
  habits: home.habits,
  focus: home.focus,
  hand: home.hand,
  simplicity: home.simplicity,
} as const;

type Benefit = (typeof benefits)[number];

/**
 * Measured on the source: every card is 360px tall with a 16px radius and 16px
 * of padding, title at 26/31.2 and body at 16/22. Cards that carry a photo are
 * full-bleed - the image is the card, with the text sitting over it.
 */
function Card({ item }: { item: Benefit }) {
  const image = "image" in item ? images[item.image as keyof typeof images] : null;
  const onPaper = "ink" in item && item.ink === "paper";
  const inset = "inset" in item && item.inset === true;
  const contained = "image" in item && item.image === "focus";

  return (
    <div
      className={`group/card relative flex h-[360px] flex-col overflow-hidden rounded-[16px] p-4 ${
        tones[item.tone]
      }`}
    >
      {image && !inset && !contained ? (
        <Image
          src={image.src}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="pointer-events-none object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.06]"
        />
      ) : null}
      {image && contained ? (
        <Image
          src={image.src}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="pointer-events-none object-cover object-center transition-transform duration-700 ease-out group-hover/card:scale-[1.04]"
        />
      ) : null}
      {image && inset ? (
        <Image
          src={image.src}
          alt=""
          width={336}
          height={262}
          sizes="336px"
          className="pointer-events-none absolute bottom-0 left-1/2 h-[262px] w-[336px] -translate-x-1/2 object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.04]"
        />
      ) : null}

      <h3 className={`t-heading-xs relative z-10 ${onPaper ? "text-paper" : ""}`}>{item.title}</h3>
      {/* Only the lede card caps its body, and only from 1200 up: measured
          400 wide there against the card's own 674 of content. Every other
          card fills its card at every width (622 on the 654-wide one), and
          both fill it outright below 1200 -- 326 at 390 and 312 at 768. The
          40ch cap here applied the desktop idea at every width and to every
          card, holding the body to 303 on a phone. */}
      <p
        className={`t-body relative z-10 mt-[15px] ${
          "art" in item && item.art === "jar" ? "min-[1200px]:max-w-[400px]" : ""
        } ${onPaper ? "text-paper" : "text-moss"}`}
      >
        {item.body}
      </p>

      {"art" in item && item.art === "jar" ? (
        <UprightJarLineArt className="pointer-events-none absolute bottom-0 right-6 h-[228px] w-[242px] text-forest/25" />
      ) : null}
    </div>
  );
}

/** Row one is a wide pair (706 / 654), row two an equal triple, gaps of 16. */
export default function BenefitsBento() {
  const [a, b, ...rest] = benefits;

  // Measured: the bento opens 64px below the lede on a desktop and 32 on a
  // phone - the 64 was applied at both widths and pushed the whole block down.
  return (
    // Let entering cards cross the container gutter; the page clips at its edge.
    <div className="mt-8 flex flex-col gap-4 sm:mt-16">
      <div className="grid gap-4 lg:grid-cols-[706fr_654fr]">
        <ScrollSettle amount={156}>
          <Card item={a} />
        </ScrollSettle>
        <ScrollSettle amount={141}>
          <Card item={b} />
        </ScrollSettle>
      </div>
      {/* The outer pair slide inward and the middle one rises. Measured on the
          source: dx -72 on the left and +82 on the right, against dy for the
          row above. The middle card's own travel was not captured, so it takes
          the row-one vertical amount. */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((item, i) => {
          const axis = i === 1 ? "y" : "x";
          const amount = i === 0 ? -72 : i === 1 ? 141 : 82;
          return (
            <ScrollSettle key={item.title} axis={axis} amount={amount}>
              <Card item={item} />
            </ScrollSettle>
          );
        })}
      </div>
    </div>
  );
}
