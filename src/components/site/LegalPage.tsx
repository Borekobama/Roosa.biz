import Button from "@/components/ui/Button";
import Media from "@/components/ui/Media";
import Reveal from "@/components/ui/Reveal";
import DotEyebrow from "@/components/site/DotEyebrow";
import { Container } from "@/components/site/Section";
import { home } from "@/lib/assets";

export type LegalSection = { heading: string; paragraphs: string[] };

export default function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
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
            <DotEyebrow>Published in {updated}</DotEyebrow>
          </Reveal>
          <Reveal delay={70}>
            <h1 className="t-display-l mx-auto mt-[26px] max-w-[18ch] text-center text-moss min-[720px]:mt-4">
              {title}
            </h1>
          </Reveal>
          <Reveal delay={130}>
            {/* The source scales this page down on a phone: 14/21 for the lede and the
              body against 16 and 18, and 12px for the published line. */}
            <p className="mx-auto mt-4 max-w-[62ch] text-center text-[14px] leading-[21px] text-forest/70 sm:text-[16px] sm:leading-[22px]">{intro}</p>
          </Reveal>
        </Container>
      </section>

      <section className="pb-16 pt-14 sm:pb-20">
        <Container>
          <div className="mx-auto max-w-[68ch]">

            {/* Measured on the source: 40px from a section's last paragraph to
                the next heading, not 56. */}
            {sections.map((section, i) => (
              <Reveal key={section.heading} className={i === 0 ? "" : "mt-10"}>
                <h2 className="t-product text-moss">{section.heading}</h2>
                <div className="mt-5 flex flex-col gap-5">
                  {section.paragraphs.map((p) => (
                    <p
                    key={p.slice(0, 40)}
                    className="text-[14px] leading-[21px] text-forest/75 sm:text-[18px] sm:leading-[24px]"
                  >
                      {p}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-0">
        <Container>
          <Reveal pop>
            <h1 className="t-display-l mx-auto max-w-[18ch] text-center text-moss">
              Mehr als nur Toilettenpapier
            </h1>
          </Reveal>
          <Reveal delay={100} className="mt-8 flex justify-center">
            <Button href="/#product-offer">Jetzt entdecken</Button>
          </Reveal>
        </Container>
        {/* The source draws sZiDqyHOMLNk at 1376x766 in a 32px gutter on every
            route that closes with this plate - not FdMpM1DRwld at 1400x779. */}
        <div className="mt-8 px-4 sm:px-8">
          <Reveal>
            <Media
              asset={home.grassWide}
              fill
              rounded="rounded-[24px]"
              className="aspect-[1376/766] w-full"
              sizes="100vw"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
