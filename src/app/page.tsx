import type { CSSProperties } from "react";
import Image from "next/image";
import Accordion from "@/components/ui/Accordion";
import Button from "@/components/ui/Button";
import Media from "@/components/ui/Media";
import Enter from "@/components/ui/Enter";
import Reveal from "@/components/ui/Reveal";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ScrollSettle from "@/components/ui/ScrollSettle";
import PhoneFall from "@/components/ui/PhoneFall";
import { phoneDrift, phoneRise, phoneSlide } from "@/components/ui/phoneMotion";
import OfferPanel from "@/components/site/OfferPanel";
import PinnedSequence from "@/components/site/PinnedSequence";
import FadingStatement from "@/components/site/FadingStatement";
import BenefitsBento from "@/components/site/BenefitsBento";
import DotEyebrow from "@/components/site/DotEyebrow";
import IngredientRows from "@/components/site/IngredientRows";
import IngredientCarousel from "@/components/site/IngredientCarousel";
import GummyScatter from "@/components/site/GummyScatter";
import PostCard from "@/components/site/PostCard";
import StatMark from "@/components/site/StatMark";
import ReviewCard from "@/components/site/ReviewCard";
import { Container } from "@/components/site/Section";
import { home } from "@/lib/assets";
import { faqs, nutrients, posts, statCards, testimonials } from "@/lib/content";

/**
 * Where the review cards land, as a share of the source's 1440x1700 foliage
 * backdrop. Measured card origins: 32,128 / 1050,386 / 542,666 / 1050,924 /
 * 32,1182.
 */
const reviewSpots = [
  { left: "2.22%", top: "7.53%" },
  { left: "72.92%", top: "22.71%" },
  { left: "37.64%", top: "39.18%" },
  { left: "72.92%", top: "54.35%" },
  { left: "2.22%", top: "69.53%" },
];

export default function HomePage() {
  return (
    <>
      {/* 1 - Hero: centred copy set over a full-width rounded product panel.
           Measured on the source: the panel is sized to the viewport, not to a
           fixed height - 100vh minus 110px, opening at y=78, so it always ends
           32px above the fold. The picture inside is 105% of that and cropped,
           which is what leaves it room to drift. A fixed 830 only agreed with
           the source at 1440x900 and was 190px too tall at 1920x1080.

           The same rule holds on a phone, where it was left at the fixed 830:
           at an 844-tall viewport it gives 734, and 734 x 1.05 is the 771 the
           source draws there. */}
      <section className="px-4 pt-[78px] sm:px-8">
        <div className="relative h-[calc(100vh-110px)] overflow-hidden rounded-[24px]">
          <Image
            src={home.hero.src}
            alt={home.hero.alt}
            width={home.hero.width}
            height={home.hero.height}
            priority
            sizes="100vw"
            // hero-drift: the phone parallax, see globals.css. object-top: on a
            // wide, short window the photo is cropped top and bottom, and
            // centring it lifted the roll into the copy; pinned to the top it
            // only loses plain backdrop there.
            className="hero-drift h-[102%] w-full -translate-y-[2%] object-cover object-top max-[720px]:h-[105%] max-[720px]:translate-y-0"
          />
          {/* The roll's rim moves with the panel's size while this block is
              set in px, so on a short screen the buttons ran onto the roll.
              The top padding follows the window height instead - on a phone
              48px from about 740 tall easing to 24, above that 32px from 768
              tall easing to 16 - with the gaps below tightened to 12 and 20
              at every width. */}
          <div className="absolute inset-x-0 top-0 px-5 pt-[clamp(24px,calc(45vh-285px),48px)] sm:pt-[clamp(16px,calc(18vh-106px),32px)]">
            <Enter delay={120}>
              <h1 className="t-display-l mx-auto max-w-[11ch] text-balance text-center text-moss sm:max-w-[500px]">
                Mehr als nur Toilettenpapier.
              </h1>
            </Enter>
            <Enter delay={240} from="bottom">
              <p className="t-body-l mx-auto mt-3 max-w-[500px] px-2 text-center text-moss">
                {/* Measured: both columns are 500px at 18/24 and both resolve to
                    two lines; the source breaks after "clarity" where this fitted
                    "and" onto line one. Inter Display again, so forced. */}
                Supersoft für jeden Tag - und mit jeder Packung ein Beitrag zum Kinderschutz.
              </p>
            </Enter>
            <Enter delay={360} from="bottom" className="mt-5 flex justify-center gap-3">
              <Button href="/#product-offer">Jetzt entdecken</Button>
              <Button href="/science" variant="light">
                Mehr erfahren
              </Button>
            </Enter>
          </div>
        </div>
      </section>

      {/* 2 - Statement, then the pinned track, then the closing statement.
           The source keeps these two statements as ordinary full-height
           sections: only three panels ride the horizontal track. */}
      <FadingStatement>
        <h2 className="t-display-m mx-auto max-w-[800px] text-center text-moss">
          {/* The source keeps "with clean and effective nutrition." whole on the
              last line. Both columns are 800px and both set 48/52.8, so this is
              the Inter Display width difference letting "with" fit on line two
              here - forced rather than left to wrap. */}
          Eine Rolle, ein Versprechen: Komfort für heute und Schutz für morgen
          {/* The break is a desktop measurement: it keeps the last line whole
              at 1440, but on a phone it forces a sixth line where the source
              sets five, making this block 251 tall against its 209. */}
          <br className="hidden min-[720px]:inline" />
          {" "}<span className="text-gold">weich</span>, verantwortungsvoll und <span className="text-olive">mit Herz</span>.
        </h2>
      </FadingStatement>

      <PinnedSequence
        panels={[
          {
            kind: "image",
            asset: home.routinePanel,
            title: "Komfort, der\nin jeden Alltag passt",
            body: "Supersoftes Toilettenpapier im praktischen Grossvorrat - direkt und unkompliziert geliefert.",
            features: [
              {
                icon: "people",
                label: "Für jeden Haushalt",
                body: "Zuverlässige Qualität für Familien, Paare und Einzelhaushalte.",
              },
              {
                icon: "mind",
                label: "Supersoft",
                body: "Sanft zur Haut und angenehm bei jeder Nutzung.",
              },
              {
                icon: "stethoscope",
                label: "Soziale Wirkung",
                body: "Jede Packung unterstützt präventive Kinderschutzprojekte.",
              },
            ],
          },
          {
            kind: "statement",
            title: "Kleine Rolle. Grosse Wirkung.",
            note: "Mit ROOSA wird ein Alltagsprodukt zum Beitrag für Kinder.",
            scale: "l",
            art: "jar",
          },
          {
            kind: "image",
            asset: home.tennis,
            title: "Qualität mit Haltung",
            body: "Weiches, verlässliches Toilettenpapier trifft auf echtes gesellschaftliches Engagement.",
            features: [
              {
                icon: "bolt",
                label: "Praktischer Vorrat",
                body: "56 Rollen bedeuten weniger Nachkäufe und mehr Ruhe im Alltag.",
              },
              {
                icon: "recovery",
                label: "Schnell geliefert",
                body: "Ihre Bestellung erreicht Sie üblicherweise in ein bis drei Werktagen.",
              },
              {
                icon: "strength",
                label: "Kinderschutz",
                body: "Ein fester Beitrag pro Packung hilft Kindern und Familien.",
              },
            ],
          },
        ]}
      />

      {/* Mirrors the lead-in: the track's last panel slides off to the left over
          this section, so both are on screen together as the strip exits. The
          pull holds the gap between the track's end and the benefits heading at
          the source's constant 144px. That gap does not vary with viewport
          height on the source - 144 at 900, 982 and 1100 alike - while this
          screen is min-h-screen and grows, so the pull has to track 100vh
          rather than a fraction of it. Expressed as 84vh it drifted to 183, 197
          and 215 as the window grew. The constant is set so the heading still
          lands on the source's y=5368 at a 900px viewport, which it did before
          - only the scaling with height was wrong.

          Measure the heading with the reveals settled: at scroll 0 it reads
          24px off. */}
      {/* On a phone none of that applies: the source gives this heading 64px of
          clear space under the deck column and 64 below it before the benefits
          band, in ordinary flow. Centring it in a min-h-screen section put it
          380px below the column instead of 64, and pushed the benefits heading
          426 further on where the source leaves 144. The pull that compensates
          for the track is scoped to the width the track actually runs at. */}
      <section className="px-6 py-16 min-[720px]:mt-[calc(-100vh+137px)] min-[720px]:flex min-[720px]:min-h-screen min-[720px]:items-center min-[720px]:justify-center min-[720px]:py-0">
        <h2 className="t-display-xl mx-auto max-w-[750px] text-center text-forest">
          ROOSA macht Alltag <span className="text-olive">bedeutungsvoller.</span>
        </h2>
      </section>

      {/* 4 - Balance intro and the benefits bento. Measured: the heading sits
           source leaves 161px between the bento's last row and the stat body
           below it - with 128px here it was 273. The stat grid's own 48px of
           top padding and its rule carry most of that distance. */}
      <section className="pt-[34px] pb-8 min-[720px]:pt-0 min-[720px]:pb-4">
        <Container>
          {/* Measured: the source opens this band with a "Vorteile" eyebrow 46px
              above the heading. It was missing entirely.

              On a phone the source also opens the band itself with 34px of
              clear space above that eyebrow, which this had at no width. The
              eyebrow-to-heading distance is 26 on both sides at both widths and
              wants no change. */}
          {/* On a phone only the heading moves - a one-shot 30px rise. */}
          <Reveal phone="static">
            <DotEyebrow className="text-forest">Vorteile</DotEyebrow>
          </Reveal>
          <Reveal delay={60} phone={phoneRise()}>
            {/* Measured: a 600px column, broken after "when" as the source sets
                it - this face runs a little narrower, so the break is explicit.
                Only from sm up: at 358px the source wraps this naturally into
                three lines and 125px, where forcing the break gave four and
                167. */}
            <h2 className="t-display-m mx-auto mt-[26px] max-w-[600px] text-center text-moss">
              Weich im Alltag. Stark in der Wirkung.
            </h2>
          </Reveal>
          <Reveal delay={90} phone="static">
            {/* 14/21 on a phone, 18 from sm up: measured at 390px the source
                sets this lede 84 tall where 18px gave 120. */}
            <p className="mx-auto mt-6 max-w-[600px] text-center t-lede text-moss">
              Guter Alltagskomfort darf unkompliziert sein. ROOSA verbindet Supersoft-Qualität mit einem konkreten Beitrag für Kinder und Familien.
            </p>
          </Reveal>
          <BenefitsBento />
        </Container>
      </section>

      {/* 5 - Stats, directly below the bento. Measured: 193px from the stat
           body to the foliage plate, which is 145 here rather than 128. */}
      {/* 128px under the stats on a phone, measured from the last stat body
           to the SOL-G7 panel's own top. */}
      <section className="pb-32 sm:pb-[145px]">
        <Container>
          {/* Measured on the source: three 409px columns on a 75px gutter, each
              pair separated by a solid 1px rule 194px tall in rgb(235,235,235)
              sitting mid-gutter, and a 15px mark 8px before each label. This
              had none of the three. */}
          {/* No rule and no top padding on a phone: the source leaves 16px
              between the bento's floor and the first stat value, which 96 of
              bento padding plus 48 of grid padding plus the rule turned into
              145. That 16 was first read off the card's image, which overhangs
              the card by 16 on the source; from the card's own floor, which is
              what the layout actually follows, it is 32. Checked three ways - no bordered ancestor, nothing visible in
              a capture of the band, and 16px leaves no room for any of it.
              Row pitch is 172/173 there against 176/177 here, which is the
              40px row gap against the source's 36. */}
          <div className="grid gap-x-8 gap-y-9 sm:grid-cols-3 sm:gap-x-[75px] min-[720px]:border-t min-[720px]:border-forest/15 min-[720px]:pt-12">
            {statCards.map((stat, i) => (
              // On a phone each stat drifts in from 46px to the right instead.
              <Reveal key={stat.label} delay={i * 80} phone={phoneDrift(46)} className="relative">
                {i > 0 ? (
                  <span
                    aria-hidden="true"
                    className="absolute -left-[39px] top-0 hidden h-[194px] w-px bg-[#ebebeb] sm:block"
                  />
                ) : null}
                <p className="t-stat text-moss">{stat.value}</p>
                {/* 16/22.4 on a phone, 18 from sm up - measured on the source's stats row. */}
                <p className="t-stat-label mt-3 flex items-center gap-2 text-forest">
                  <StatMark name={stat.icon} />
                  {stat.label}
                </p>
                <p className="t-lede mt-3 max-w-[34ch] text-forest/60">{stat.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 6 - SOL-G7 panel. Callouts and scattered decoration sit at offsets
           measured from the source at 1440px. The band is 931 tall, not 803:
           on the source the foliage plate is the layout box and the panel sits
           64px inside it, so the plate does not overlap its neighbours. The
           64px of padding above is exactly what the plate covers; below it the
           source leaves another 64px of cream before the next band, so the
           plate bottom sits 162px above the ingredients eyebrow. */}
      {/* On a phone the stats band's own 128 already covers the plate's
          overhang above; below it the source leaves 64 of cream. */}
      <section className="px-4 pb-16 sm:px-8 sm:pb-32 sm:pt-16">
        <div className="relative">
          {/* Measured on the source: the foliage plate is drawn 1440x931 - 32px
              wider and 64px taller than the 1376x803 panel on every side - inside
              an unrounded clip, so it bleeds past the panel's rounded edge
              instead of stopping at it. */}
          {/* The panel caps at 1440 like the other content panels, and its height
              follows its width - 1376x803 at a 1440 viewport, 1440x840 at 1680.
              The plate behind it does not cap: the source runs it the full width
              of the window, 1680 wide on that screen, still 64px taller than the
              panel on each side. */}
          {/* On a phone the source draws the panel 358x571 with the plate still
              64px taller on each side, so 699 - the same relationship as the
              desktop band. This held the panel itself at 699 and clipped the
              plate to it. */}
          <div className="relative mx-auto h-[571px] max-w-[1440px] sm:h-auto sm:aspect-[1376/803]">
            <div className="absolute -inset-y-16 left-1/2 w-screen -translate-x-1/2 overflow-hidden">
              <Image
                src={home.forest.src}
                alt={home.forest.alt}
                width={home.forest.width}
                height={home.forest.height}
                sizes="100vw"
                className="h-full w-full object-cover"
              />
            </div>

            {/* The frost is not baked into the overlay. The source's panel
                carries backdrop-filter: blur(38.6px) and no tint of its own; the
                milk-glass interior is the foliage read through that blur under a
                light, largely transparent pane. */}
            <div className="absolute inset-0 overflow-hidden rounded-[24px] bg-olive/35 backdrop-blur-[38.6px]" />

            {/* Measured: one mark centred in the panel, with the callouts
                arranged around it. */}
            <Image
              src={home.gummyGreen.src}
              alt=""
              width={home.gummyGreen.width}
              height={home.gummyGreen.height}
              sizes="268px"
              // Measured: the mark sits right of centre at 67.8%/29.5% of the
              // panel, with the three callouts arranged around it.
              // On a phone the source draws the mark at its full 268x162,
              // centred across the panel and sitting 16px off its floor - not
              // 190 wide and centred vertically, which put it through the
              // middle of the copy.
              // The box is the source's 268x162 on a phone too: left square,
              // the roll stood 268 tall and ran up through the copy.
              className="pointer-events-none absolute bottom-4 left-1/2 w-[268px] -translate-x-1/2 object-contain max-[720px]:h-[162px] lg:bottom-auto lg:left-[76%] lg:top-[28%] lg:h-[340px] lg:w-[340px] lg:-translate-x-1/2 lg:translate-y-0"
            />

            {/* Measured on the source: the content column starts 152px in from
                the panel's left edge and 154px down from its top, which is far
                deeper than a section padding would put it. */}
            {/* 16px of inset on a phone, not 32: the source sets this column
                326 wide in its 358 panel, and 294 wrapped both the lede and the
                footnote onto a second line. */}
            <div className="absolute inset-0 z-10 p-4 sm:pb-14 sm:pl-[152px] sm:pr-14 sm:pt-[154px]">
              <div className="h-full">
              {/* Measured: the badge carries the mark, the heading sets in a
                  493px column so SOL-G7 stays whole, and the button is a solid
                  olive pill. */}
              {/* 122x36 on a phone at 14/21, 16px above the heading. */}
              <span className="flex w-fit items-center gap-2 rounded-[999px] bg-cream/25 py-[7.5px] pl-2 pr-4 text-[14px] leading-[21px] tracking-[-0.1px] text-cream min-[720px]:py-2 min-[720px]:text-[18px] min-[720px]:leading-[24px]">
                <Image
                  src={home.gummyGreen.src}
                  alt=""
                  width={26}
                  height={16}
                  sizes="26px"
                  className="h-4 w-[26px] object-contain"
                />
                ROOSA®
              </span>
              <PhoneFall className="mt-4 min-[720px]:mt-[15px]">
                <h2 className="t-display-m max-w-[493px] text-paper">
                  Mehr über <span className="whitespace-nowrap">ROOSA®</span> und unsere Mission erfahren
                </h2>
              </PhoneFall>
              <Button href="/science" className="mt-4 bg-olive text-paper hover:bg-moss min-[720px]:mt-[17px]">
                Mehr erfahren
              </Button>
              {/* Measured on the source: this figure slides in from the left, dx -106
                  falling to 0, while its opacity ramps 0.66 to 1. It was static. */}
              <Reveal y={12} phone="static" className="mt-[23px] min-[720px]:mt-[55px]">
                <p className="t-display-m max-w-[493px] text-paper">10 Rp.*</p>
              </Reveal>
              <p className="t-body mt-[11px] max-w-[493px] text-paper">
                Spende pro 8er-Packung für präventive Kinderschutzprojekte.
              </p>
              {/* 12px at every width, but the source leads it at 14.4 on a
                  phone and 24 above, and sets it 22px under the lede rather
                  than 55. */}
              <PhoneFall className="mt-[22px] min-[720px]:mt-[55px]">
                <p className="max-w-[493px] text-[12px] leading-[14.4px] text-paper/80 min-[720px]:leading-[24px]">
                  *10 Rappen beziehungsweise 10 Cent pro 8er-Packung.
                </p>
              </PhoneFall>
              </div>
            </div>
            {/* The dashed rules reach from each block towards the mark: two
                vertical ones on the mark's axis at x=1068, and one horizontal
                one running right out of the middle block. */}
            <div aria-hidden="true" className="pointer-events-none hidden lg:absolute lg:inset-0 lg:block">
              {nutrients.map((n) => (
                <span
                  key={n.name}
                  className="absolute block"
                  style={{
                    left: n.line.left,
                    top: n.line.top,
                    width: `${n.line.width}px`,
                    height: `${n.line.height}px`,
                    backgroundImage: `repeating-linear-gradient(${
                      n.line.width > n.line.height ? "90deg" : "180deg"
                    }, rgb(255 255 245 / 0.65) 0 5px, transparent 5px 11px)`,
                  }}
                />
              ))}
            </div>

            {/* Nutrient callouts at their measured positions. The two stacked
                blocks are centred on the mark's axis; the middle one is left
                aligned. Widths only apply once the blocks are placed.

                Not rendered below lg: the source has no trace of these on a
                phone - searching for their labels there returns nothing - while
                this stacked them in flow under the panel and added 202px. */}
            <ul className="pointer-events-none hidden lg:absolute lg:inset-0 lg:block">
              {nutrients.map((n) => (
                <li
                  key={n.name}
                  className={`lg:absolute lg:w-[var(--callout-w)] ${n.align === "center" ? "lg:text-center" : "lg:text-left"}`}
                  style={
                    {
                      left: n.pos.left,
                      top: n.pos.top,
                      "--callout-w": `${n.width}px`,
                    } as CSSProperties
                  }
                >
                  {/* Measured on the source: 16/22, weight 400, tracking normal - not
                      the 16/25.6 weight-500 the same label takes on the science
                      page, so it cannot share .t-nutrient. */}
                  <p className="text-[16px] font-normal uppercase leading-[22px] text-paper">
                    {n.name}
                  </p>
                  <p className="t-body mt-[6px] text-paper">{n.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 7 - Was ROOSA ausmacht, stacked as display rows. Measured: the source's band
           carries 98px of padding top and bottom, not 128. */}
      {/* 98 above and 64 below on a phone, with the tile carousel under the
          rows. */}
      <section className="pb-16 pt-[98px] sm:pb-[98px]">
        <Container>
          <IngredientRows />
          <IngredientCarousel />
        </Container>

      </section>

      {/* 8 - Testimonials over a full-bleed panel. Measured: the source's band
           opens with 200px above the heading and closes flush. */}
      {/* Measured at 390px: the stretch from the ingredients eyebrow to the
           offer heading runs 2903 on the source and was 43 short here. */}
      {/* On a phone 64 above the heading and nothing below the panel, which
          the offer band follows 32px on. */}
      <section className="pt-16 sm:pt-[290px]">
        {/* The heading pins while the foliage panel rides up and covers it -
            measured on the source, which holds it at viewport y=250 and then
            paints the panel over it (the strip across the heading reads foliage
            with no dark pixels once the panel arrives).

            Two things stopped that here. The sticky sat inside a Container only
            as tall as the heading, so it had no range to stick in and simply
            scrolled away; and z-10 would have kept it above the panel anyway.
            The section is the containing block now, and the panel - later in
            the DOM and positioned - paints over it. */}
        <div className="sticky top-[250px]">
          <Container>
            <Reveal phone="static">
              <h2 className="t-testimonial mx-auto text-center text-moss min-[720px]:max-w-[700px]">
                Was Kundinnen und Kunden sagen
              </h2>
            </Reveal>
          </Container>
        </div>

        {/* The source runs this plate to the window edge - 390 wide at 390 and
            1440 at 1440 - and leaves 98px between the heading and it at both
            widths. This inset it by 12 and 20 and left 56. The gutter was
            raised as an open question and never settled; the standing rule is
            that the original decides, so it follows the original. */}
        <div className="relative mt-[98px] overflow-hidden">
          <div className="relative overflow-hidden rounded-[16px] min-[720px]:rounded-[24px]">
            <Image
              src={home.testimonialBg.src}
              alt=""
              width={home.testimonialBg.width}
              height={home.testimonialBg.height}
              sizes="100vw"
              className="mx-auto h-[1404px] w-full max-w-[1440px] object-cover sm:h-[1700px]"
            />
            {/* No scattered marks on the phone panel. */}
            <div className="max-[720px]:hidden">
              <GummyScatter />
            </div>
            {/* Five cards, not six, at the points measured on the source. The
                offsets are percentages of its 1440x1700 backdrop - card boxes
                at 32,128 / 1050,386 / 542,666 / 1050,924 / 32,1182 - so they
                keep their relative scatter inside this panel's gutter. */}
            <div className="absolute inset-0 hidden lg:block">
              {testimonials.slice(0, 5).map((t, i) => (
                <div key={t.name} className="absolute w-[358px]" style={reviewSpots[i]}>
                  <Reveal delay={(i % 3) * 110}>
                    <ReviewCard
                      quote={`\u201C${t.quote}\u201D`}
                      name={t.name}
                    />
                  </Reveal>
                </div>
              ))}
            </div>

            {/* Below 720 the source runs the reviews as a vertical ticker: three
                cards climbing the 358 column at 100px/s, clipped by the panel's
                own edges. Three copies keep the 1404 panel filled through the
                whole period; 7.33s is one set's height - cards of 213, 236 and
                236 with 16 under each - at that speed. */}
            {/* Faded over the panel's top and bottom 64px, so cards drift in
                and out of the foliage instead of being sliced at its edge. */}
            <div className="absolute inset-y-0 left-4 right-4 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_64px,#000_calc(100%-64px),transparent)] min-[720px]:hidden">
              <ul
                className="animate-ticker-up"
                style={{ "--ticker-duration": "7.33s" } as CSSProperties}
              >
                {[0, 1, 2].flatMap(() => testimonials.slice(0, 3)).map((t, i) => (
                  <li key={`${t.name}-${i}`} aria-hidden={i >= 3 || undefined} className="pb-4">
                    <ReviewCard
                      quote={`\u201C${t.quote}\u201D`}
                      name={t.name}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div className="absolute inset-0 hidden content-between gap-5 p-5 sm:p-8 min-[720px]:grid lg:hidden">
              {testimonials.slice(0, 3).map((t, i) => (
                <Reveal key={t.name} delay={i * 90}>
                  <ReviewCard
                    quote={`\u201C${t.quote}\u201D`}
                    name={t.name}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9 - Product offer */}
      <OfferPanel />

      {/* 10 - FAQ */}
      {/* Measured: 53px less below the rows than a symmetric py-32 gives. */}
      {/* Measured at 390px: 87px from the last FAQ row to the news heading,
           where 96 of bottom padding gave 157. */}
      {/* Measured at 390: 82px from the offer's guarantee row to the FAQ
           eyebrow, where 51 left it 31 short. */}
      {/* At 390: 64px from the offer's guarantee pill to the FAQ eyebrow, and
           48 from the last question to the news eyebrow. */}
      <section id="faq" className="scroll-mt-24 pb-[22px] pt-16 sm:pb-[132px] sm:pt-[184px]">
        <Container>
          {/* Measured on the source: a 656px left column, the question column
              starting at 752 with its trigger text 615 wide. */}
          {/* The first question sits 64px under the lede on a phone; a row
              centres its label, so the gap is that less the row's inset. */}
          <div className="grid gap-[38px] min-[720px]:gap-12 lg:grid-cols-[656px_1fr] lg:gap-16">
            {/* On a phone only the lede moves, sliding in from the left. */}
            <Reveal phone="static">
              <DotEyebrow className="justify-start">FAQ</DotEyebrow>
              {/* The source breaks this explicitly after "Frequently" - its box is the
                  full 656px column with a hard break, not a wrap at a narrower
                  measure, which is what max-w-[12ch] was producing here. */}
              <h2 className="t-display-m mt-4 text-moss">
                Frequently
                <br />
                asked questions
              </h2>
              {/* 14/21 on a phone, as the source sets every lede there. */}
              <Reveal phoneOnly phone={phoneSlide(-236)} className="mt-5">
                <p className="max-w-[656px] t-lede text-moss">
                  Hier finden Sie klare Antworten zu Produkt, Lieferung und sozialer Wirkung.
                </p>
              </Reveal>
            </Reveal>
            <Reveal delay={90} phone="static">
              <Accordion items={faqs} />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 11 - Latest posts. Measured: 1224px from the Aktuelles eyebrow to the
           closing plate, which is 191px of tail here rather than 128. */}
      {/* Measured from the news cards' floor to the closing heading: 80 on a
           phone and 96 above, against the 96 and 124 this left. */}
      <section className="pb-20 min-[720px]:pb-24">
        <Container>
          {/* The source brings this block in late and slowly: still 0.01 with
              its top at 589 and only 0.77 once past the viewport top. */}
          {/* This block was driven by a scroll curve tuned to start={450}
              span={800} power={1.7}, which left it at 0.00 opacity through the
              whole approach and only 0.18 once well in view - it never
              appeared. Sampling the source across the same range returns 1.00
              at every offset: it does not fade this block at all. A plain
              reveal reaches 1 and stays there. */}
          <Reveal phone="static">
            <DotEyebrow className="!justify-start">Aktuelles</DotEyebrow>
            <h2 className="t-display-m mt-4 max-w-[26ch] text-moss">
              Das Neueste von ROOSA
            </h2>
            <Reveal phoneOnly phone={phoneSlide(-236)} className="mt-4">
              <p className="max-w-[48ch] t-lede text-forest/65">
                Neuigkeiten zu ROOSA, unseren Produkten und unserem Einsatz für den Kinderschutz.
              </p>
            </Reveal>
            <Button href="/blog" className="mt-7">
              Aktuelles
            </Button>
          </Reveal>

          {/* 64 under the button and 20 between cards on a phone, neither
              card animated. */}
          <div className="mt-16 grid gap-5 min-[720px]:mt-12 min-[720px]:gap-8 md:grid-cols-2">
            {posts.slice(0, 2).map((post, i) => (
              <Reveal key={post.slug} delay={i * 90} phone="static">
                <PostCard post={post} overlay />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 12 - Closing. Measured: the source caps its content panels at 1440px
           wide. Past that the window keeps growing but the panel does not - at a
           1680 viewport its closing plate is 1440x801 where this drew 1616x900. The source runs the grass under the footer, and it does
           it with a transform, not a margin: the plate's layout box sits at
           y=13075 and it renders 100px lower, so the footer still starts at the
           box's bottom edge and simply covers the overhang. A negative margin
           here moved the footer itself and shortened the document. */}
      <section className="pb-0">
        <Container>
          {/* On a phone the heading rises once as it comes into view rather
              than tracking the scroll, and the button does not move. */}
          <ScrollReveal phone="reveal">
            {/* Measured on the source: a 500px column, so it sets on two lines. */}
            <h1 className="t-display-l mx-auto max-w-[500px] text-center text-moss">
              Mehr als nur Toilettenpapier
            </h1>
          </ScrollReveal>
          <Reveal delay={100} phone="static" className="mt-8 flex justify-center">
            <Button href="/#product-offer">Jetzt entdecken</Button>
          </Reveal>
        </Container>

        {/* The source draws sZiDqyHOMLNk here, not FdMpM1DRwld - a different
            crop of the same scene, which is why the jar was reading larger and
            the flower bed denser than the source's. Its plate is 1376x766 at
            x=32, so the gutter is 32px rather than 20. */}
        {/* On a phone the plate settles from 100px low as it scrolls in, with
            no fade. It also runs under the footer as the desktop one does:
            56px down, which is the plate's 24px corner plus the footer's
            32px one, so the flower bed fills the footer's rounded corners
            instead of leaving a notch of page colour between two curves. The
            margin gives the same 56 back, so the plate still reads 62px under
            the button. */}
        <div className="mt-[6px] translate-y-14 px-4 sm:mt-8 sm:translate-y-[100px] sm:px-8">
          <ScrollSettle amount={0} phoneAmount={100}>
            <ScrollReveal y={100} start={800} span={700} phone="static">
              <Media
                asset={home.grassWide}
                fill
                rounded="rounded-[24px]"
                className="mx-auto aspect-[1249/974] w-full max-w-[1440px]"
                sizes="100vw"
              />
            </ScrollReveal>
          </ScrollSettle>
        </div>
      </section>
    </>
  );
}
