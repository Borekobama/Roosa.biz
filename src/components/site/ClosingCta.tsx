import Button from "@/components/ui/Button";
import Media from "@/components/ui/Media";
import Reveal from "@/components/ui/Reveal";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ScrollSettle from "@/components/ui/ScrollSettle";
import { Container } from "@/components/site/Section";
import { home } from "@/lib/assets";

/**
 * The closing heading, button and meadow plate every route ends on, directly
 * above the footer. It lived as seven copies, so a phone fix to one (the home
 * page's) left the other six behind.
 *
 * Desktop, per the source: a 500px heading column, the plate 1376 wide in a
 * 32px gutter and capped at 1440, translated 100px so it runs under the
 * footer. The legal pages keep their own variant - a popped heading and a
 * 1376/766 plate that does not run under the footer.
 *
 * Phone, the same on every route: the heading rises once rather than tracking
 * the scroll, the button holds still, and the plate settles from 100px low
 * with no fade. It runs 40px under the footer - its own 24px corner plus the
 * footer's 16px one - so the flower bed fills the footer's rounded corners
 * instead of leaving a notch of page colour between two curves. The margin
 * gives those 40 back, so the plate still reads 62px under the button.
 */
export default function ClosingCta({
  className = "",
  legal = false,
}: {
  className?: string;
  legal?: boolean;
}) {
  const heading = (
    <h1
      className={`t-display-l mx-auto text-center text-moss ${legal ? "max-w-[18ch]" : "max-w-[500px]"}`}
    >
      Mehr als nur Toilettenpapier
    </h1>
  );

  return (
    <section className={`pb-0 ${className}`}>
      <Container>
        {legal ? (
          <Reveal pop phone={{ y: 30 }}>
            {heading}
          </Reveal>
        ) : (
          <ScrollReveal phone="reveal">{heading}</ScrollReveal>
        )}
        <Reveal delay={100} phone="static" className="mt-8 flex justify-center">
          <Button href="/#product-offer">Jetzt entdecken</Button>
        </Reveal>
      </Container>

      <div
        className={`mt-[22px] translate-y-10 px-4 sm:mt-8 sm:px-8 ${
          legal ? "min-[720px]:translate-y-0" : "sm:translate-y-[100px]"
        }`}
      >
        <ScrollSettle amount={0} phoneAmount={100}>
          {legal ? (
            <Reveal phone="static">
              <Media
                asset={home.grassWide}
                fill
                rounded="rounded-[24px]"
                className="aspect-[1249/974] w-full min-[720px]:aspect-[1376/766]"
                sizes="100vw"
              />
            </Reveal>
          ) : (
            <ScrollReveal y={100} start={800} span={700} phone="static">
              <Media
                asset={home.grassWide}
                fill
                rounded="rounded-[24px]"
                className="mx-auto aspect-[1249/974] w-full max-w-[1440px]"
                sizes="100vw"
              />
            </ScrollReveal>
          )}
        </ScrollSettle>
      </div>
    </section>
  );
}
