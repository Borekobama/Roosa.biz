import type { Metadata } from "next";
import Image from "next/image";
import Accordion from "@/components/ui/Accordion";
import Media from "@/components/ui/Media";
import Enter from "@/components/ui/Enter";
import Reveal from "@/components/ui/Reveal";
import ScrollReveal from "@/components/ui/ScrollReveal";
import DotEyebrow from "@/components/site/DotEyebrow";
import PanelIcon, { type PanelIconName } from "@/components/ui/PanelIcon";
import NutritionRows from "@/components/site/NutritionRows";
import ComparisonRows from "@/components/site/ComparisonRows";
import Logo from "@/components/site/Logo";
import { Container } from "@/components/site/Section";
import { home, ingredientTiles, science } from "@/lib/assets";
import ClosingCta from "@/components/site/ClosingCta";
import {
  faqs,
  nutrients,
  principles,
  scienceStats,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Science",
  description:
    "Wie ROOSA Komfort, Qualität und Engagement für Kinder verbindet.",
};

/** Comparison marker: the source sets a filled shape in its own column. */
function Mark() {
  return (
    <span className="relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-pink/20" role="img" aria-label="Enthalten">
      <Image src={home.gummyGreen.src} alt="" fill sizes="48px" className="object-cover" />
    </span>
  );
}

export default function SciencePage() {
  return (
    <>
      {/* Hero */}
      {/* Measured on the source: heading at y=128 in a 700px column so it sets
          on two lines, lede at 267 in solid moss, hero image at 32,379 as
          1376x549 with a 32px radius. */}
      <section className="pt-[128px]">
        <Container>
          <Enter delay={80}>
            <h1 className="t-display-l mx-auto max-w-[17ch] text-balance text-center text-moss sm:max-w-[700px]">
              Mehr als weich: Qualität mit sozialer Wirkung
            </h1>
          </Enter>
          <Enter delay={160} from="bottom">
            {/* 14/21 on a phone, 18 from sm up - the source scales this page down
                there the same way it does the legal pages. */}
            <p className="mx-auto mt-4 max-w-[700px] text-center t-lede text-moss">
              Supersoftes Toilettenpapier für jeden Tag - mit Herz für den Kinderschutz.
            </p>
          </Enter>
        </Container>
        {/* 64px under the lede at both widths. This carried "14px on a phone,
            64 from sm up"; measured again at 390 the source's lede ends at 338
            and its hero image starts at 402, so the gap is 64 there too and the
            14 was costing this route 50px at the top of the page. */}
        <div className="mx-auto mt-16 max-w-[1440px] px-4 sm:px-8">
          <Enter delay={80} from="bottom">
            <Media
              asset={science.hero2}
              fill
              rounded="rounded-[32px]"
              className="aspect-[358/549] w-full sm:aspect-[1376/549]"
              sizes="100vw"
              priority
            />
          </Enter>
        </div>
      </section>

      {/* Stats trio. Measured on the source: eyebrow 222, heading 257 in a
          700px column, lede 378, then three 443x348 sage cards on a 24px gap
          with 40px padding - badge pill, stat, label, and the body pinned to
          the card floor. */}
      <section className="pb-24 pt-[130px] sm:pb-32 sm:pt-[193px]">
        <Container>
          <Reveal>
            <DotEyebrow>Vorteile</DotEyebrow>
          </Reveal>
          <Reveal delay={70}>
            <h2 className="t-display-m mx-auto mt-[15px] max-w-[700px] text-balance text-center text-moss">
              Für Alltag und Verantwortung gemacht
            </h2>
          </Reveal>
          <Reveal delay={130}>
            <p className="mx-auto mt-[15px] max-w-[528px] text-center t-lede text-moss">
              Toilettenpapier für Komfort, Vorrat und soziale Wirkung.
            </p>
          </Reveal>
          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {scienceStats.map((stat, i) => (
              <Reveal key={stat.value} zoom delay={i * 80}>
                {/* The 348px floor and 40px padding are desktop measurements. On a phone
                    the source puts these cards on a 258px pitch, so they sit around
                    234 tall - a third shorter than this drew them. */}
                <div className="flex h-full min-h-[234px] flex-col rounded-[13px] bg-sage p-6 sm:min-h-[348px] sm:p-10">
                  {/* The pill is 20 tall on a phone, not 28: its own font size drives the
                      line box, so setting only the label inside left it unchanged. */}
                  <p className="inline-flex h-5 w-fit items-center gap-2 rounded-[64px] bg-cream px-2 py-1 text-[12px] sm:h-7 sm:text-[14px]">
                    <PanelIcon
                      name={stat.icon as PanelIconName}
                      className="h-3 w-3 shrink-0 text-forest"
                    />
                    <span className="text-[12px] leading-[20px] tracking-[-0.01em] text-forest sm:text-[14px]">
                      {stat.badge}
                    </span>
                  </p>
                  <p className="t-display-l mt-6 text-moss">{stat.value}</p>
                  <p className="mt-2 text-[12px] leading-[14.4px] text-forest sm:text-[16px] sm:leading-[22px]">
                    {stat.label}
                  </p>
                  {/* Hyphenated between 720 and 1200, where three cards share the row
                      and "Kinderschutzprojekte." ran 28px out of a 139 column. */}
                  <p className="mt-auto pt-10 text-[12px] leading-[14.4px] text-moss sm:text-[16px] sm:leading-[22px] min-[720px]:max-[1200px]:hyphens-auto">
                    {stat.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Natural ingredients */}
      <section id="ingredients" className="scroll-mt-24 pb-24 sm:pb-32">
        <Container>
          {/* Measured: this block comes up late and almost linearly - still 0.00
              at 30px of offset with its top at 795, 0.45 at 17px when 402, and
              0.81 at 6px when 11. */}
          <ScrollReveal start={800} span={1000} y={30}>
            <DotEyebrow>ROOSA Qualität</DotEyebrow>
            <h2 className="t-display-m mt-4 text-center text-moss">Komfort mit Verantwortung</h2>
          </ScrollReveal>
          <Reveal delay={130}>
            <p className="t-body-l mx-auto mt-4 max-w-[46ch] text-center text-forest/70">
              Fünf Eigenschaften, die ROOSA im Alltag auszeichnen - von Supersoft-Komfort
              bis zum Beitrag für den Kinderschutz.
            </p>
          </Reveal>
        </Container>

        {/* Measured: five 433x311 tiles, 25px radius, 16px gaps, the row
            starting at x=-65 so it bleeds past both viewport edges. */}
        <div className="mt-14 overflow-hidden">
          {/* Measured: tiles are 358x328 at 390px and 433x311 at 1440px. The
              source renders the five tiles four times over, so the track loops;
              the duplicate below supplies the seam. */}
          <div className="animate-tiles flex w-max gap-4" style={{ ["--tile-duration" as string]: "23s" }}>
            {[0, 1, 2, 3].map((copy) => (
              <div key={copy} className="flex gap-4" aria-hidden={copy > 0}>
                {ingredientTiles.map((tile) => (
                  <Media
                    key={`${copy}-${tile.src}`}
                    asset={tile}
                    fill
                    rounded="rounded-[25px]"
                    className="h-[201px] w-[358px] shrink-0 sm:h-[244px] sm:w-[433px]"
                    sizes="(max-width: 640px) 358px, 433px"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statement */}
      <section className="pb-24 sm:pb-32">
        <Container>
          <Reveal>
            <DotEyebrow>Grundsätze</DotEyebrow>
          </Reveal>
          <Reveal delay={70}>
            <h2 className="t-display-m mx-auto mt-4 max-w-[16ch] text-balance text-center text-moss">
              Für den Alltag gemacht, für Kinder engagiert
            </h2>
          </Reveal>

          {/* 12px on a phone, 18 from sm up. The source sets this lede at 12/29
              there; at 18 throughout it stood 72 tall. */}
          <p className="mx-auto mt-5 max-w-[56ch] text-center text-[12px] leading-[14.4px] text-forest/65 sm:text-[18px] sm:leading-[24px]">
            Supersoft, zuverlässig und mit einem festen Beitrag für Kinderschutzprojekte.
          </p>

          {/* Measured on the source: 444x241 sage cards on a 22px gap, 24px
              radius and 40px padding, each opening with a centred 64px cream
              disc holding the glyph, then centred label and body. */}
          <div className="mt-12 grid gap-[22px] sm:grid-cols-3">
            {principles.map((item, i) => (
              <Reveal key={item.title} delay={i * 90}>
                <div className="flex h-full min-h-[223px] flex-col items-center rounded-[24px] bg-sage p-10 text-center sm:min-h-[241px]">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream">
                    <PanelIcon
                      name={item.icon as PanelIconName}
                      className="h-[26px] w-[26px] text-moss"
                    />
                  </span>
                  <h3 className="mt-4 text-[16px] leading-[22px] text-forest">{item.title}</h3>
                  {/* Card body is 12px on a phone: the source draws these cards 223 tall
                    there, where 16px copy pushed them to 256 and 278. */}
                  <p className="mt-2 text-[12px] leading-[14.4px] text-moss sm:text-[16px] sm:leading-[22px]">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Nutrition panel */}
      <section className="pb-24 sm:pb-32">
        <Container>
          {/* Measured on the source: two 688px columns on an 88px row pitch -
              the label at 26/31.2 on the left, the value at 48/52.8 starting at
              the midpoint rather than pushed to the right edge. Both solid
              moss. Rows rise into place as they are reached. */}
          <Reveal>
            <h2 className="t-display-m text-moss">ROOSA auf einen Blick</h2>
          </Reveal>

          <NutritionRows />
        </Container>
      </section>

      {/* Comparison. Measured: the panel band below opens 574px after this
           table's heading, which is 35px of tail here rather than 128. */}
      {/* Measured at 390: 34px from the comparison table's last row of text to
           the band's plate, where 96 of bottom padding left 97. The table's
           own rows touch, so its last row carries 16px of cell padding that
           the source's 79-tall row does not; this allows for it. */}
      <section className="pb-[17px] sm:pb-[35px]">
        <Container>
          <Reveal>
            <h2 className="t-display-m max-w-none text-moss">
              ROOSA® verbindet Komfort und Verantwortung
            </h2>
          </Reveal>

          {/* Measured on the source: a 756px criterion column, the wordmark set
              at 166x46 over the ROOSA column, and a 302px Others column - all
              type solid moss, with the Others value at 18px rather than a faded
              14px. Row pitch 75. */}
          <Reveal delay={90} className="mt-12">
            {/* At 390 the source fits this table in the 358 column rather than
                scrolling it: cells of 177/57/124 -- the label's content box
                measuring 161 inside 16px of right padding -- which is 49.4%,
                15.9% and 34.6%. The 640px floor here made it 640 wide and
                scrolling, with a 352 label cell that wrapped to two lines where
                the source takes three. */}
            <table className="w-full table-fixed border-collapse">
              <caption className="sr-only">ROOSA im Vergleich mit gewöhnlichem Toilettenpapier</caption>
              <colgroup>
                <col className="w-[49.4%] min-[720px]:w-[55%]" />
                <col className="w-[15.9%] min-[720px]:w-[23%]" />
                <col className="w-[34.6%] min-[720px]:w-[22%]" />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col" className="py-4 text-left">
                    <span className="sr-only">Merkmal</span>
                  </th>
                  <th scope="col" className="py-4 text-center align-middle">
                    <Logo className="mx-auto !text-[18px] text-moss min-[720px]:!text-[46px]" />
                  </th>
                  <th
                    scope="col"
                    className="t-heading-xs whitespace-nowrap py-4 text-center text-moss"
                    style={{ fontWeight: 300 }}
                  >
                    Andere
                  </th>
                </tr>
              </thead>
              <ComparisonRows mark={<Mark />} />
            </table>
          </Reveal>
        </Container>
      </section>

      {/* Probiotics panel over imagery. The same construct as the home SOL-G7
           band and measured the same way: the plate is 1440x974 - 32px wider
           and 64px taller than the 1376x846 panel on every side - inside an
           unrounded clip, and the panel itself carries backdrop-filter:
           blur(38.6px) with no tint of its own. This drew a bg-forest/55 wash
           under a 0.9 overlay over a 1400x760 plate instead, so the frost was
           a flat scrim rather than the blurred plate read through a pane. */}
      <section className="px-4 sm:px-8 sm:py-16">
        <div className="relative h-[857px] sm:h-[846px]">
          {/* The plate is full-bleed at every width - 390 wide on a phone, where an
              inset box gave 358. */}
          <div className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 overflow-hidden sm:-inset-y-16">
            <Image
              src={science.hero.src}
              alt={science.hero.alt}
              width={science.hero.width}
              height={science.hero.height}
              sizes="100vw"
              className="h-full w-full object-cover"
            />
          </div>

          {/* On a phone the plate is the layout box at 390x857 and the panel
              sits 32px inside it top and bottom, so it reads 358x793. This
              filled the box outright at 857. */}
          <div className="absolute inset-x-0 inset-y-8 overflow-hidden rounded-[24px] bg-olive/35 backdrop-blur-[38.6px] sm:inset-y-0" />

          <Image
            src={home.gummyGreen.src}
            alt=""
            width={home.gummyGreen.width}
            height={home.gummyGreen.height}
            sizes="(max-width: 639px) 300px, 400px"
            className="pointer-events-none absolute left-1/2 top-[285px] w-[300px] -translate-x-1/2 object-contain sm:w-[400px]"
          />
          {/* Measured: the heading sits 167px down the panel, not centred in it. */}
          <div className="absolute inset-0 flex flex-col items-center px-6 pt-[110px] text-center">
            <Reveal>
              <h2 className="t-display-m mx-auto max-w-[22ch] text-paper">
                ROOSA® macht aus jeder Rolle einen Beitrag.
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="t-body-l mx-auto mt-6 max-w-[48ch] text-paper/80">
                Supersoft, zuverlässig und mit einem festen Beitrag für präventive
                Kinderschutzprojekte.
              </p>
            </Reveal>

            <ul className="absolute inset-x-5 top-[610px] grid grid-cols-3 gap-3 text-center sm:hidden">
              {nutrients.map((n) => (
                <li key={n.name}>
                  {/* Both boxes measure 164 wide on the source at every width,
                      and the body runs the t-body ramp (12/14/16) rather than
                      t-body-s's flat 14/20. */}
                  <p className="t-nutrient text-lime">{n.name}</p>
                  <p className="mt-2 text-[12px] leading-[1.35] text-paper/80 max-[720px]:hyphens-auto">{n.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden sm:block">
            <div className="absolute left-[75%] top-[430px] w-[190px] text-left">
              <p className="t-nutrient text-lime">{nutrients[0].name}</p>
              <p className="t-body mt-2 text-paper/80">{nutrients[0].body}</p>
            </div>
            <span className="absolute left-[calc(50%+149px)] right-[26%] top-[470px] h-[3px] bg-[repeating-linear-gradient(90deg,rgb(255_255_245_/_0.65)_0_5px,transparent_5px_11px)]" />
            <div className="absolute left-[12%] top-[430px] w-[190px] text-left">
              <p className="t-nutrient text-lime">{nutrients[1].name}</p>
              <p className="t-body mt-2 text-paper/80">{nutrients[1].body}</p>
            </div>
            <span className="absolute left-[26%] right-[calc(50%+149px)] top-[470px] h-[3px] bg-[repeating-linear-gradient(90deg,rgb(255_255_245_/_0.65)_0_5px,transparent_5px_11px)]" />
            <span className="absolute left-1/2 top-[665px] h-[26px] w-[3px] bg-[repeating-linear-gradient(180deg,rgb(255_255_245_/_0.65)_0_5px,transparent_5px_11px)]" />
            <div className="absolute left-1/2 top-[700px] w-[190px] -translate-x-1/2 text-center">
              <p className="t-nutrient text-lime">{nutrients[2].name}</p>
              <p className="t-body mt-2 text-paper/80">{nutrients[2].body}</p>
            </div>
          </div>
        </div>
      </section>

      {/* The source runs its FAQ straight after the nutrient band. The four
          authored blocks that used to sit here -- Formulation, Delivery,
          Testing and Limits -- have no counterpart on it, and they were the
          single largest deviation in the project: 667 of this route's 751px
          overrun at 1440 and most of its 1361 at 390.

          They are not deleted. scienceSections still holds them in
          src/lib/content.ts, so restoring them is putting this block back. */}

      {/* FAQ */}
      {/* Measured at 390: the source leaves 72px between the band's plate and
           this heading, where 36 fell out of the two sections meeting with no
           padding between them. */}
      {/* Measured: 72px between the band's plate and this heading at 390 and
           136 at 1440, where the two sections met with nothing between them;
           and 96px from the last accordion row to the closing heading against
           the 153 that pb-32 gave. */}
      <section className="pt-9 pb-24 min-[720px]:pt-[100px] sm:pb-[96px]">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.4fr] lg:gap-20">
            <Reveal>
              <DotEyebrow className="justify-start">FAQ</DotEyebrow>
              <h2 className="t-display-m mt-4 max-w-[12ch] text-moss">Häufige Fragen</h2>
              <p className="t-body-l mt-5 max-w-[46ch] text-forest/65">
                Antworten zu ROOSA, Lieferung und unserem Beitrag für den Kinderschutz.
              </p>
            </Reveal>
            <Reveal delay={90}>
              <Accordion items={faqs} />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Closing */}
      <ClosingCta />
    </>
  );
}
