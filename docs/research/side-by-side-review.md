# Side-by-side review — source vs clone

Frame-by-frame reading of the comparison captures, with measurements where I
have them and an honest note where I only have an impression.

Captures live in `docs/research/_compare/` (raw halves) and are composited to
`sbs/*.png`. In every composite the **source is on the left with a green
outline**, the **clone on the right with orange**.

Two things to know before reading the frames:

- The source carries Framer's **"BUY LICENSE TO PUBLISH YOUR STORE"** banner at
  the lower left and a **"Made in Framer"** badge at the lower right. Those are
  watermarks on the unlicensed demo, not design, and they obscure a corner of
  most source frames.
- Now that the scroll-driven reveals are actually implemented, a still can
  catch one side **mid-animation**. Where that is the likely explanation I say
  so rather than calling it a layout defect.

Slice frames (`home-00` … `home-07`) are taken by walking both pages down in
viewport steps. Page heights are within 21px (14583 source, 14604 clone), so
the same index lands on roughly the same content.

---

## Where the build stands, measured

| Property | Source | Clone |
| --- | --- | --- |
| Page height | 14583 | 14604 |
| Hero image | 1377×830 @ 31,77 | 1376×830 @ 32,77 |
| Entrance travel | −123 → 0 | −123 → 0 |
| Tagline fade | 0.45 / 0.95 / 1.00 / 0.91 / 0.69 / 0.46 / 0.24 / 0.13 | 0.47 / 0.94 / 1.00 / 0.91 / 0.69 / 0.47 / 0.24 / 0.13 |
| Ingredient marquee | 100 px/s | 100 px/s |
| Gummy drift | 96px per 120 scrolled | 96px per 120 scrolled |
| Row reveal curve | 0.50·y123 → 0.92·y21 → 0.99·y3 | same cubic |
| Scroll cost (6× CPU) | 823ms, 33ms median, 0 long tasks | 769ms, 33ms median, 0 long tasks |
| Product image | 648×868 @ 40,140 | 648×868 @ 40,140 |
| FAQ question column | x=752, 26px, moss | x=752, 26px, moss |
| Comparison columns | label x=32 / Others x=1106 | label x=32 / Others x=1105 |
| News card overlay | inset 16,16 · 646×126 · r16 · olive | inset 16,16 · 640×127 · r16 · olive |
| Cart panel | 960,20 · 460×860 · r16 · cream | 960,20 · 460×860 · r16 · cream |

---

## home-00 — hero

**Matches:** heading text and line break, jar, hand and gummy, background tone,
button set and order, header pill geometry.

**Differences:**

1. **Logo letterforms.** The source's wordmark is a slanted script with the ®
   tucked tight to the upper right of the final "e". The clone is upright with
   a smaller ® sitting lower. This is deliberate — see *Settled decisions*.
2. **Lede wrap.** Source breaks `…your energy, clarity / and balance…`; the
   clone breaks `…clarity and / balance…`. Both columns are 500px wide and both
   set 18/24, so this is a font-metric difference, not a layout one (see
   *Inter Display* below).
3. **Button baseline.** The clone's button row sits roughly 4px lower and the
   "Know more" pill runs a few pixels wider.

---

## home-01 — routine panel

**Matches:** title text and its two-line break, panel position in the track,
three-column feature layout, column x-positions within ~20px.

**Differences:**

1. **Scrim too heavy.** The clone's lower half is visibly darker and more
   olive; the source keeps the hillside's natural green and the sky's blue. Same
   root cause as the SOL-G7 panel below — the tint under the treatment is doing
   too much work.
2. **Feature icons are the wrong drawing.** The source uses filled, specific
   glyphs — a face, a head, a stethoscope. The clone uses thin generic line
   icons. Different stroke weight and different subjects. These are mine,
   drawn for the repo, and they do not read like the source's set.
3. **Column copy density.** Source runs four lines per column, clone three, so
   the columns resolve at different heights. The copy is original to this
   template, so this is a consequence of that choice rather than a bug.

---

## home-02 — tennis panel

**Differences:**

1. **Track running behind.** The clone shows a cream gutter on the left with
   jar line-art still visible — the previous panel has not cleared. The source
   is already full-bleed at the same scroll offset. The pacing curve and dwell
   match when measured, so this is a phase offset of roughly half a panel at
   this particular sample, not a wrong curve.
2. Same icon and scrim issues as `home-01`.

---

## home-03 — benefits bento

**This frame found a real defect, now fixed.**

1. **"Energy support" card was missing its image.** The source card carries a
   photograph inset at **336×262** inside the 448×360 card — not bled to the
   edges like its two neighbours. I had previously stripped this card to plain
   sage on the strength of a probe that only reported the card's *background*
   and never looked for a child image. Restored; the clone now renders
   333×259 against the source's 336×262.
2. **Card 1 line art.** The source's jar outline includes the wordmark as part
   of the drawing. The clone's jar carries no mark, by the same decision as the
   logo. The silhouettes also differ — the source's jar is rounder with a
   visible lid rim.
3. **Body copy wrapping.** "Recovery boost" runs one line on the source and two
   on the clone; "Cognitive clarity" breaks at a different word. Copy length
   again.

**Matches:** row 1 is 706/654 and row 2 is three × 448, all 360 tall with 16px
gaps, 16px radius and 16px padding; the blurred green photo on "Recovery
boost"; white type on that card and moss elsewhere; heading in a 600px column
breaking after "when"; lede in 600px solid moss.

---

## home-04 — SOL-G7 base and ingredients

**The worst frame in the set.**

1. **Panel far too bright.** The source's panel is dark and muted; the clone
   reads as a bright, saturated sunny photograph. Sampling matched regions
   gives the clone within 7 RGB on three of four regions, but the fourth — the
   panel's lower left, which is most of what this frame shows — is still about
   **25 out on every channel**. This is the one place in the build where the
   value is fitted to sampled pixels rather than derived from understanding how
   the source composites the layer.
2. **Foliage should bleed below the panel.** On the source the image continues
   past the rounded panel edge before the section ends. The clone stops at the
   panel boundary and goes straight to cream.

**Matches:** the ingredient stack — gutter label at x=32, names starting at
x=180, 62px pitch, uniform forest, no rules, no per-row imagery. The rows are
also now scroll-driven on the source's measured cubic, which they were not
until recently.

---

## home-05 — reviews

**Differences:**

1. **Cards too opaque.** The source's glass is lighter — foliage reads clearly
   through it. The clone's are denser and darker, so they sit on the image
   rather than in it.
2. **Card text larger.** The clone's quotes run at a bigger size with more
   lines, making the cards bulkier and spacing them further apart.
3. **Different crop of the backdrop.** The source frame shows palm fronds and
   sky, the clone grass and mushrooms. Same 1440×1700 asset, different vertical
   alignment at this sample — a capture artifact, not a defect.

**Matches:** scattered card placement rather than a row, 4.5 + stars + quote +
avatar + name structure, the gummy scatter and its 0.2× drift.

---

## home-06 — product offer and FAQ

**This frame found a real bug, now fixed.**

1. **Homepage CTA disagreed with the merch page.** The clone's offer block read
   **"Add to bag"** where the source reads **"Out of Stock"** — while the
   clone's own merch page already said "Out of Stock" for the same product. The
   offer block was reading a separate `flavours[].available` flag instead of the
   product's `inStock` state, so two pages disagreed about one product. Fixed:
   both flavours are out of stock, matching the source and the merch page.
2. **FAQ heading breaks differently.** Source sets `Frequently / asked
   questions`; the clone sets `Frequently asked / questions`.

**Matches:** all six FAQ questions are identical in text and order; the question
column starts at x=752 at 26px in moss on both; row rhythm and the "+" control
position agree.

---

## home-07 — closing product block

1. **Jar slightly larger.** 230px wide on the clone against 216px on the
   source, with a denser and wider flower bed beneath it.

**Matches:** heading text, its two-line break in a 500px column, the Buy Offer
pill, and the grass meeting the footer with no white gap.

---

## Section captures

| Capture | Reading |
| --- | --- |
| `z-clarity` | Holds up. Card geometry, tones and type all line up. |
| `z-science` | Holds up. Principle cards at 444×256 with centred discs and glyphs. |
| `z-tshirt` | Holds up. $22, S/M/L, description, qty and CTA all at measured positions. |
| `z-solg7` | The brightness gap above. |
| `z-reviews` | The card opacity gap above. |

---

## Ranked fix list

1. **Panel tinting** — affects `home-01`, `home-02`, `home-04`, `z-solg7`. The
   only item where I do not yet understand the source's mechanism.
2. **Feature column icons** — wrong drawings, three frames.
3. **Foliage bleed below the SOL-G7 panel.**
4. **Review card opacity and text size.**
5. **FAQ heading line break.**
6. **Closing jar scale** (14px).

---

## Settled decisions

These are choices, not outstanding work:

- **The logotype.** The Solene wordmark is not reconstructed as artwork — it is
  the brand's mark rather than layout. The clone sets the name in the
  template's own display face at the source's measured 166×46 box, so header
  geometry is exact and a real mark drops straight in. The same reasoning is
  why the jar drawn for the benefits card carries no branding.
- **Inter Display.** The source uses it and it is not publicly available. The
  clone uses Inter, which runs a few pixels wider at the same size — this is
  the cause of the nav pill being 229px against 216px, the Buy Offer pill being
  106px against 100px, and several of the line-break differences above.
- **Copy.** FAQ answers, feature descriptions and blog posts are original text
  written for this template rather than the source's prose. Several density and
  wrapping differences above follow from that.
- **Rounded corners** are kept throughout per the brief, against the source's
  sharper edges.

---

## A note on the measurements

Five conclusions in this document's history were wrong because of a flaw in the
probes rather than the code. The sweep that mounted lazy content also fired
one-shot scroll reveals before sampling them, which made the source read as
static in five places it was not. Re-auditing every page under a corrected
method — fresh load, walk down in steps — recovered the ingredient rows, the
nutrition rows, the comparison rows, the Natural Ingredients heading and the
closing block.

The "Energy support" card in `home-03` is the same class of error found by
looking at a picture rather than by measuring: the probe reported the card's
background and never asked whether it had a child image.

Where this document states a number, it comes from a probe in `tools/cloner/`.
Where it states an impression, it says so.
