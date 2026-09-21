# Parity notes

## How fidelity is established

Structure is taken from measurement of the live source, not from inspection by
eye alone. Two instruments do the work:

- `tools/cloner/_probe2.mjs` lists every rendered image and heading on a source
  route with its document offset, pixel size, colour and alignment. That output
  is the section map each page is built against.
- `tools/cloner/compare.mjs` captures source and clone down the same route in
  matched viewport slices, so the two can be read side by side.

An earlier revision of this clone was built from design tokens alone (colours,
type scale, section heights) without reading the rendered source. It passed
every functional check while being structurally wrong in most sections. The
probe/compare loop above exists because functional checks cannot detect that.

## Route mapping

| Source | Clone |
| --- | --- |
| `/` | `/` |
| `/science` | `/science` |
| `/merch` | `/merch` |
| `/merch/<product>` | `/merch/<product>` (7 products) |
| `/blog` | `/blog` |
| `/blog/<post>` | `/blog/<post>` (6 posts) |
| `/cookies-policy` | `/cookies-policy` |
| `/privacy-policy` | `/privacy-policy` |

## Assets

82 files under `public/assets` (56 MB), downloaded with
`tools/cloner/fetch-assets.mjs` and catalogued in
`docs/research/solene-framer-ai/ASSET_MANIFEST.json` with source URL, intrinsic
size, content type and the routes each appears on. Asset roles in
`src/lib/assets.ts` are assigned from measured document position, not guessed.

**These are third-party media.** Keep the repository private, and licence or
replace them before any public or commercial use.

## Section maps applied

`/` (source 14583px) — hero copy centred over a full-width rounded product
panel; paired benefit panels with captions over the image; 87px centred
statement; "Small habits" plus a four-image cluster; balance tiles; SOL-G7 panel
with nutrient callouts; ingredients as stacked 56px display rows; stats trio;
testimonials over a full-bleed panel; product offer with flavour picker,
detail accordion, quantity stepper and stock state; FAQ; two overlay post
cards; closing CTA.

`/science` (source 7928px) — 56px centred hero over a wide panel; stats trio
(4.2h / 63% / 96%); "Natural Ingredients" with five 433x311 tiles; statement;
nutrition panel with seven right-aligned values; comparison table; probiotics
panel over imagery; principles; FAQ; closing CTA.

`/blog` (source 3705px) — "Resources and insights", two-column grid of overlay
cards with 32px white titles, closing CTA.

`/blog/<post>` (source 6034px) — full-bleed hero with the title set over it;
body segmented by 48px section headings; author avatar; "From the blog"
two-column related grid; closing CTA.

`/merch/<product>` (source 2919px) — 648x868 main shot with 56x56 thumbnail
gallery; 40px product name; price; quantity stepper and Buy Now; closing CTA.

## Corrections made against the source

1. **No marquee.** An earlier revision invented a scrolling ingredient ticker.
   The source has no marquee on any route; ingredients render as stacked 56px
   display rows. The component, its CSS and its two checks were removed — those
   checks had been passing against invented behaviour.
2. **Hero.** Was left-aligned 87px over a forest photograph; the source is
   centred 56px over the jar-and-hand product panel with two pill CTAs.
3. **Header.** Nav sits in a pill container, with an olive Buy Offer pill and a
   circular cart control.
4. **Footer.** Olive (`#7d9153`), not dark forest, with Home / Science /
   Resources columns, social links and the wordmark.
5. **Product cards.** Carry a quantity stepper and Buy Now, as the source does.

## Bug found by the checks

`Reveal` left content permanently at `opacity: 0` when an element was already
above the viewport as it was first observed — an anchor landing on `/#faq`,
a restored scroll position, or back navigation. An IntersectionObserver reports
no intersection in that case, so the entrance never ran. Fixed with an initial
in-viewport check plus a `boundingClientRect.top < 0` branch, and covered by the
`reveal: anchor landing` check.

## Deliberate deviations

1. **Product and post slugs are ASCII.** The source serves a percent-encoded
   `/merch/daily-multivitamin%E2%84%A2`; the clone uses
   `/merch/daily-multivitamin`.
2. **Port 3111**, because 3000 was occupied on the build machine.
3. **IvyPresto Headline** (commercial) is substituted with Instrument Serif for
   the uppercase eyebrow role. All other families match the source and are
   served through `next/font`.
4. **Body copy is original.** Headings, labels and navigation match the source;
   article and description prose was written for this repository.

## Pinned scroll sequence

The source pins a 900px panel inside a ~4260px scroll container holding four
children, advancing through them as the range passes the viewport. That single
section accounts for most of the height difference an earlier revision had, and
it is the page's principal scroll interaction.

The track moves **horizontally**, not by cross-fade. The source's decorative
line art sits at left offsets of 4355px and 5560px — several screens along a
row rather than stacked — which is how the direction was established.

`src/components/site/PinnedSequence.tsx` reproduces it: container height is
driven by panel count, vertical scroll progress across the container drives
`translateX` on a flex track, and the sticky panel holds at the viewport top.
Two further sticky regions found by the same probe are reproduced: the
testimonial heading, and the offer details column.

The source fills two panel slots with inline `data:image/svg+xml` line art at
viewBox `0 0 528 723` and `0 0 192 454`. `src/components/ui/LineArt.tsx`
supplies drawings authored for this repository at the same geometry and stroke
weight — a tipped jar with pieces leaving it, and a leafed sprig.

## Harness defects found and fixed

Three bugs in the verification harness itself, each of which produced either a
false pass or a hang:

1. **False pass on invented behaviour.** Two checks asserted a scrolling
   marquee. The source has none; the checks passed against a component that
   should not have existed.
2. **Unbounded `img.decode()`.** `decode()` on a lazy-loaded image that has not
   begun loading never settles, so the footer-wordmark check hung indefinitely.
   The footer is now scrolled into view and every decode is bounded.
3. **`waitUntil: 'networkidle'`** does not settle on a page carrying 54 MB of
   imagery behind a 4200px scroll container. Checks use `domcontentloaded` plus
   explicit waits.

Interaction checks also share one browser context rather than creating one per
check, which dominated runtime once the real assets landed.

## SOL-G7 panel

Callout and decoration offsets were measured individually at 1440px rather than
approximated. The three nutrient callouts sit at left 1020 / 740 / 1012 and the
scattered decoration at left 965 / 657 / 346 within the panel, converted to
percentages so they track the container. Below `lg` the callouts fall back to a
three-column grid and the decoration is hidden, since the measured positions
only hold at desktop width.

## Why height ratio is not a fidelity metric

An earlier revision of this file reported a "96.2% mean height ratio" as though
it measured fidelity. It does not. Document height only detects missing or
collapsed sections. It is blind to a misplaced nav, a wrong font size, wrong
copy, a wrong price, or a missing interactive control — all of which were
present while that number read 96%.

Element-level comparison (`tools/cloner/geom.mjs`) and side-by-side capture
(`tools/cloner/sweep.mjs`) are the fidelity instruments. Height is retained
only as a coarse structural check.

## Defects found by element-level comparison

Measured at 1440px, source vs clone:

| Element | Source | Clone (before) |
| --- | --- | --- |
| Nav links | x=1036 / 1117 / 1174, 18px | x=613 / 687 / 740, 14px |
| Logo | 166x46 | 110x26 |
| Cart | x=1368 | x=1308 |
| Price | `$87` | `€38` |
| `<h1>` per page | 4 | 1 |
| Header links in DOM | 5 | 9 (mobile menu always rendered) |

The nav was centre-left instead of right-aligned, the type was four points
small, and the mobile menu markup shipped at every breakpoint. The product page
was missing its flavour control entirely (`Green Apple` / `Solar Mango`,
measured 138x44 and 140x44 at y=278), its quantity `<input>`, and its grey
520x46 "Out of Stock" call to action.

A whole section was absent: the benefits bento below "Real clarity begins when
your body finds balance" — five cards, a wide pair (706 / 654) over an equal
triple, measured at 360px tall with a 16px radius. Section order was also wrong:
the stats row (40px, x=32 / 516 / 999, y=6434) belongs directly below the bento,
not after the ingredient list. The ingredient list itself had eight rows where
the source has five.

## Stale-build hazard

Several verification runs silently measured unstyled markup. `next start` holds
the build manifest it booted with; rebuilding replaces `.next` with new chunk
hashes, so the running server serves HTML referencing a stylesheet that no
longer exists. Without CSS, `sticky` computes as `static` and headings fall back
to the browser default 32px — so layout assertions pass or fail for reasons
unrelated to the code.

`verify.mjs` now runs a preflight that fails loudly (exit 2) when the referenced
stylesheet does not return 200 or when `.sticky` does not compute as `sticky`.
Rebuild and restart the server before verifying; never rebuild during a run.

## Measured fidelity

Document height against the source, at 1440px, all images forced to load
(`tools/cloner/_heights.mjs`):

| Route | Source | Clone | Ratio |
| --- | ---: | ---: | ---: |
| `/` | 14583 | 13865 | 95.1% |
| `/science` | 7928 | 7447 | 93.9% |
| `/merch` | 4035 | 4021 | 99.7% |
| `/blog` | 3705 | 3640 | 98.2% |
| `/merch/cap` | 2919 | 3041 | 96.0% |
| blog post | 6034 | 5809 | 96.3% |
| `/privacy-policy` | 3981 | 3662 | 92.0% |
| `/cookies-policy` | 3537 | 3583 | 98.7% |

Mean 96.2%, every route at or above 92%. Height is a proxy for structural
completeness, not a guarantee of visual identity — it catches missing or
collapsed sections, which is what it is used for here.

## Known remaining gaps

- Section heights do not match the source exactly (`/` is ~3.8k px shorter);
  vertical rhythm inside sections is close but not measured per-section.

## Measured evidence

Clone run: `20260914T183105Z_clone_8995439a` — 19/19 routes,
`cssCoverageComplete: true`, `motionCoverageComplete: true`,
`responsiveCoverageComplete: true`.

The dead-classes audit reports `[object` / `SVGAnimatedString]` findings on
routes with inline SVG. That is an instrument defect: on an SVG element
`element.className` is an `SVGAnimatedString`, and coercing it with `String()`
yields `"[object SVGAnimatedString]"`, which then tokenises on whitespace.
Verified — 82 SVG nodes on the affected route, zero HTML elements with a bad
class. The fix belongs in the bundled runtime, outside this repository.
