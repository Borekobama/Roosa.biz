import Reveal from "@/components/ui/Reveal";
import DotEyebrow from "@/components/site/DotEyebrow";
import { Container } from "@/components/site/Section";
import ClosingCta from "@/components/site/ClosingCta";
import type { LegalBlock, LegalSection } from "@/lib/legal";

/** Stable in-page anchor for a section heading, e.g. "Cookies" -> "cookies". */
export function sectionId(heading: string) {
  return heading
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Web addresses and e-mail addresses in the legal texts become links. */
function Linked({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s)]+[^\s).,;]|[\w.+-]+@[\w-]+\.[\w.]+\w)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 0) return part;
        const email = !part.startsWith("http");
        return (
          <a
            key={`${part}-${i}`}
            href={email ? `mailto:${part}` : part}
            {...(email ? {} : { target: "_blank", rel: "noreferrer noopener" })}
            className="text-moss underline underline-offset-2 hover:text-olive"
          >
            {part}
          </a>
        );
      })}
    </>
  );
}

// Wrap anywhere as a last resort: the payment section lists providers'
// privacy URLs 60+ characters long, which ran off a 320px screen.
const bodyText =
  "text-[14px] leading-[21px] text-forest/75 [overflow-wrap:anywhere] sm:text-[18px] sm:leading-[24px]";

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === "string") {
    return (
      <p className={`whitespace-pre-line ${bodyText}`}>
        <Linked text={block} />
      </p>
    );
  }
  if ("list" in block) {
    return (
      <ul className={`flex list-disc flex-col gap-2 pl-5 marker:text-olive ${bodyText}`}>
        {block.list.map((item) => (
          <li key={item.slice(0, 60)}>
            <Linked text={item} />
          </li>
        ))}
      </ul>
    );
  }
  return <h3 className="t-heading-xs mt-3 text-moss">{block.sub}</h3>;
}

export default function LegalPage({
  title,
  eyebrow = "Rechtliches",
  intro,
  sections,
}: {
  title: string;
  eyebrow?: string;
  intro?: string;
  sections: LegalSection[];
}) {
  return (
    <>
      {/* The source's published line sits at 134 on /cookies-policy and 150 on
          /privacy-policy -- its two legal pages genuinely differ by 16 there --
          and both leave 26px from it to the title. This shared component takes
          the cookies figures, which lands that page exactly and leaves privacy
          16 high. */}
      <section className="pt-[134px] sm:pt-[150px]">
        <Container>
          <Reveal>
            <DotEyebrow>{eyebrow}</DotEyebrow>
          </Reveal>
          <Reveal delay={70}>
            {/* Hyphenated so the long German titles break inside a word on a
                phone rather than running off the screen. */}
            <h1 className="t-display-l mx-auto mt-[26px] max-w-[18ch] hyphens-auto text-balance text-center text-moss min-[720px]:mt-4">
              {title}
            </h1>
          </Reveal>
          {intro ? (
            <Reveal delay={130}>
              {/* The source scales this page down on a phone: 14/21 for the lede and the
                body against 16 and 18, and 12px for the published line. */}
              <p className="mx-auto mt-4 max-w-[62ch] text-center text-[14px] leading-[21px] text-forest/70 sm:text-[16px] sm:leading-[22px]">
                {intro}
              </p>
            </Reveal>
          ) : null}
        </Container>
      </section>

      <section className="pb-16 pt-14 sm:pb-20">
        <Container>
          <div className="mx-auto max-w-[68ch]">
            {/* Measured on the source: 40px from a section's last paragraph to
                the next heading, not 56. */}
            {sections.map((section, i) => (
              <Reveal
                key={`${section.heading ?? "intro"}-${i}`}
                className={i === 0 ? "" : "mt-10"}
              >
                <div id={section.heading ? sectionId(section.heading) : undefined} className="scroll-mt-24">
                  {section.heading ? (
                    // "Schlussbestimmungen/Streitbeilegung" has no break point a
                    // phone can use, so it may wrap anywhere.
                    <h2 className="t-product mb-5 hyphens-auto text-moss [overflow-wrap:anywhere]">
                      {section.heading}
                    </h2>
                  ) : null}
                  <div className="flex flex-col gap-5">
                    {section.blocks.map((block, j) => (
                      <Block key={j} block={block} />
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <ClosingCta legal />
    </>
  );
}
