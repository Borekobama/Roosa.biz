# Panel tinting and the gap list — findings

Session worked the ranked gap list in `docs/research/side-by-side-review.md`.
Everything below is measured, with the probe named. False alarms are recorded
alongside the real findings, as asked.

---

## 1. Panel tinting — mechanism found

**There was never a tint.** The clone's `rgb(36 66 70 / 0.13)` wash was an
invention fitted to sampled pixels.

Reading the source's DOM (`_tint.mjs`, `_tint2.mjs`) instead of its pixels
gives the whole recipe:

```
DIV  [-32,-64,1440,931]  overflow:hidden          <- foliage plate
  IMG  9I5p6FC8NC01AUfPTsTJIysiU  object-fit:cover
  DIV  [0,0,1376,803]  radius 16  backdrop-filter: blur(38.6px)   <- the panel
    IMG  rt7EhbM0b89GV3Exm5VCRoV728Q  object-fit:fill
```

The milk-glass interior is the foliage read through `blur(38.6px)` under a
light, largely transparent pane. The clone had no blur at all, which is why it
rendered a sharp photograph. No pseudo-element, no blend mode, no filter on any
ancestor, and no second rendition of the overlay — Framer serves the same
1376x802 bitmap the repo already has.

Two things fell out of the same dump:

- The plate is **1440x931 centred on the panel** — 32px wider and 64px taller
  on every side, in an *unrounded* clip. That is the foliage bleed (gap #3),
  and it corrects the vertical anchor from the 85px the clone used to 64px.
- The content column starts at **152px in, 154px down**, not at a section
  padding. The clone had it at 64/64.

### Result

`_grid.mjs` samples 20 cells across the panel plus four bleed bands.

| | before | after |
| --- | --- | --- |
| bleed bands (4) | not sampled | 0,0,0 / 0,1,0 / 0,1,0 / 0,0,0 |
| panel cells within ±2 | 13 of 16 | **20 of 20** |
| worst cell | −26,−22,−31 | −1,−1,−1 |

Panel content now matches box for box: heading `[152,209,493,158]`, pill
`[152,384,_,45]`, `3—5x*` `[152,484,493,53]`, body `[152,548,493,22]`, footnote
`[152,625,493,24]`, mark `[933,237,268,351]`, all three callouts on their
measured origins. The only residual is two callout bodies wrapping to 3 lines
where the source takes 2 — Inter vs Inter Display, a settled difference.

---

## 2. Feature icons — redrawn

Source marks are **solid shapes 28–31px wide**, not hairlines; the set here was
drawn at a 1.4px stroke and read as a different family. Redrawn filled, and
"Disease prevention" takes a stethoscope rather than a shield.

Geometry was already right: mark 30px, 21px above the label, 277px column
pitch, against the source's 31px mark and 21px gap. Marks sit 5px left of the
source's, whose glyphs carry their own bearing inside a wider frame — not worth
chasing on an original drawing.

---

## 3. Review cards — the handoff had this backwards

The gap list said the source's cards are glass, lighter than the clone's, with
foliage reading through. **Measured, they are fully opaque with no backdrop
filter**, and the clone was the translucent one. `home-source-05.png` agrees:
nothing reads through them.

| | source | clone (before) |
| --- | --- | --- |
| frame | 358x247, moss, r24, pad 16 | 300x266, forest/80 + blur(8px), r16, pad 24 |
| inner panel | 326 wide, olive, r16, pad 14 | none |
| type | 18/25.2 sage | 18/24 cream |
| rating | 5 marks 18x17, pitch 21.3 | one text span at 16px |
| count | 5 | 6 |

Rebuilt to the source's anatomy at its five measured origins. Quote lengths set
to the source's line counts, so four cards resolve at 247 and one at 222,
exactly. Those are our own words, so their length was free to set.

**Left deliberately:** the panel keeps its 20px gutter and rounded corner where
the source runs the foliage full-bleed to 1440, per the standing rounded-corner
preference. That is why card x-offsets land at 1021 rather than 1050.

---

## 4. FAQ heading

The source's heading box is the full 656px column with a **hard break** after
"Frequently" — a zero-width rect sits between its two line boxes. The clone's
`max-w-[12ch]` squeezed it to 378px and let it wrap. Now 656 wide with an
explicit break; second line 322 exact, first 210 against 218 (Inter).

---

## 5. Closing block — wrong asset, not wrong scale

The jar read 230px against 216px because **the two sides were drawing different
images**. Source: `sZiDqyHOMLNkK6k3lDGwXiqc`. Clone: `FdMpM1DRwldCWMFCB2vcXKrdN0`
— a different crop of the same scene. Swapped, and the gutter set to 32px, so
the plate is `[32,_,1376,766]` on both sides.

---

## 6. Pills were 42px site-wide and should be 45

Found while measuring the panel button. `_pills.mjs` says every Framer pill is
45 tall: Buy Offer 100x45, Know more 115x45, Open Blog 108x45. `Button.tsx`
encoded 42 and called it measured. Fixed in `Button`, not at the call site.

Same probe flagged two more, **not yet fixed**:

- flavour pills 44 tall on the source, 37 here
- "Out of Stock" 528x46 on a **grey rgb(117,117,117)** fill; the clone renders
  528x43 in cream

---

## False alarms — probes that lied

1. **The "lower left is 25 RGB out" panel gap does not exist.** The sample
   region overlapped Framer's "BUY LICENSE" watermark on the source side; a
   near-white banner covering ~19% of a cell shifts its average by ~29. Masking
   both watermarks on both images drops that cell from −26 to −1. `_grid.mjs`
   now carries the mask so this cannot be read as a tint gap again.

2. **"Panel never flush" was a duplicate-DOM artifact.** The clone renders the
   pinned panels twice — a `display:none` mobile copy comes first — so a probe
   taking the first element matching a label measured a zero-size node.
   `_iconshot.mjs` / `_icongeo.mjs` now take the first match with a real box.

3. **`_cards.mjs` first filtered out the review cards themselves** by excluding
   anything containing a quote mark or "4.5", then reported Framer's licence
   banner as a card. Re-anchored on the foliage backdrop.

4. **`_closeshot.mjs` captured the hero** — it is also 1376 wide (830 tall)
   and comes first in the document. Filter on the 766 height.

5. **My own shell reported a false PASS.** `node verify.mjs > log; echo $?;
   tail log` reports the exit of `tail`, not of node. `verify.mjs` does
   `process.exit(1)` on failures and is fine. Capture the exit code
   immediately.

6. **Do not restart the server while `verify.mjs` runs.** `serve.sh` frees the
   port, so every check in flight fails with `ERR_CONNECTION_REFUSED`.

---

## State

`npm run typecheck` and `eslint .` clean. `node tools/cloner/verify.mjs` —
**PASS, 57 route loads, 22 interaction checks**, run with no server restart
underneath it. Document height 14597 against the source's 14583.

---

# Second pass — layout drift

Section positions were drifting by up to 269px while total page height agreed
within 13: the errors cancelled. `_spacing.mjs` measures the distance between
consecutive anchors rather than absolute offsets, which is what localises them —
an absolute offset just inherits every error above it.

## Pinned track

| | source | clone was |
| --- | --- | --- |
| container | [0,964,1440,4260] | [0,1155,1440,4060] |
| sticky padding | none | 16px 20px |
| panel | 1440x798 at y=70 | 1400x868 at [20,16] |

Every panel was the wrong shape. The scroll budget is now stated as measured —
765px per panel, 300px dwell, 900px viewport — and the dwell is in pixels
rather than a 0.1 share, which had been producing 316. The statement section
below still pulled up by the old 715 after that constant became 765, pushing
everything under it down by 50. Container and panel are exact now.

**Pacing is not identical.** The source's track eases: it keeps settling after
progress stops, resting at -4444 against this clone's -4320, and its first leg
runs about 3.1 px of travel per px of scroll against 1.7 here. The dwell lands
in the same place (y 2600-2900 both sides). Recorded, not changed — the
handoff marks pacing as settled, and this contradicts it.

## SOL-G7 band

On the source the foliage plate **is** the layout box: 931 tall with the panel
64px inside it. Here the plate overflowed an 803-tall section, so the band
contributed 128px less. It carries its own height now, with 64px of cream below
the plate — plate bottom to ingredients eyebrow is 162 on both sides.

## Section padding, from the source's own bands

ingredients 98/98 not 128 · reviews opening on 200px above its heading · offer
closing flush not on 128 · FAQ closing on 75 · closing grass running under the
footer by 100px not 25.

| gap | before | after |
| --- | --- | --- |
| page height | +304 | **+49** |
| offer to FAQ | +130 | **+2** |
| FAQ to blog | +53 | **0** |
| plate to footer | +75 | **+1** |
| pinned track | +191 | **0** |

## Product pills

`OfferPanel` had diverged from `ProductPurchase` and `QuantityBuy`, which were
already right: flavour pills 37 tall instead of 44 with forest labels instead of
olive, and an out-of-stock CTA as a cream pill with faded text where the source
draws solid grey `#757575` at 528x46. All three set their labels in the
measured `#f3f3f3` now.

**Stock state re-checked and unchanged.** One probe read the offer CTA as "Buy
Now" in olive. Clicking each flavour on the source shows "Out of Stock",
disabled, for both — the olive pill is a hidden Framer variant that still
carries a box. The settled decision stands.

## Asset declarations

The routine panel file is 3600x2100 and was declared 358x208; the testimonial
backdrop is 1536x2752 and was declared 1439x2579.

## Still open

- ~~Testimonial backdrop upscaled 1.22x~~ — **resolved: it was not.** See
  false alarm 11 below. Every image on the page renders at 0.68-0.91x of its
  bitmap; nothing is upscaled.
- Testimonial panel gutter: 20px inset here, full-bleed 1440 on the source.
  Kept for the rounded-corner preference; it is why card x-offsets land at
  1021 rather than 1050.
- Pinned track easing and first-leg rate, above.
- Remaining absolute drift of about +85 through the middle of the page, and
  +49 at the end.
- Callout and feature body copy wrapping one line longer than the source
  (Inter vs Inter Display).

## More probes that lied, this pass

7. **`_spacing.mjs`'s solg7 anchor is not comparable between sides.** It
   resolves 332px into the panel on the source and 209 on the clone, so its
   gap readings for that row are meaningless. The plate-relative measurement in
   `_seam.mjs` is the one to trust.
8. **Its blog anchor resolves above the blog eyebrow**, so that row is wrong
   too. Use `_tailseam.mjs`.
9. **`_sections.mjs` cannot align the two sides** — the source groups the page
   into 8 bands and the clone into 13, so index-to-index comparison is noise.
10. **`_secbox.mjs` climbs to different levels per side**, reporting 0/0
    padding for the clone because the padding lives on a parent.

11. **`naturalWidth` is not the bitmap size, and `_natural.mjs` read it as
    though it were.** When an image is picked from a srcset with `w`
    descriptors, the UA divides the intrinsic size by the density it derived
    from the chosen candidate and `sizes`. The testimonial backdrop is a 1536px
    bitmap chosen as the 1920w candidate at `sizes=100vw` on a 1440 viewport, so
    `naturalWidth` reports 1536 / (1920/1440) = 1152 — which reads as a 1.22x
    upscale that is not happening. This is why `curl` of the exact URL the
    browser requested returned 1536x2752 while the page "decoded" 1152: both
    were true, and the probe was comparing the wrong number.

    `_natural.mjs` is deleted rather than kept, because its output was
    confidently wrong in the same shape every time. `_bitmap.mjs` replaces it
    and decodes `currentSrc` with `createImageBitmap` to get real pixels. It
    reports every image on the page at 0.68-0.91x — nothing upscaled.


---

# Third pass — the rest of the page, and the other routes

## Whole page aligned

Layout positions (offsetTop chain, not client rect) now agree end to end:
plate 0, ingredients eyebrow +1, testimonial backdrop +1, offer heading +1, FAQ
eyebrow +1, blog eyebrow -1, closing plate -1, height 14581 against 14583.

Three errors between the plate and the FAQ were cancelling: ingredients to
backdrop 90 short, backdrop to offer 146 long, offer to FAQ 56 short. They sum
to zero, so the FAQ eyebrow read exact while everything between it and the
plate was wrong.

The closing plate was a wrong **mechanism**. The source runs the grass under
its footer with a transform — the plate's layout box is at y=13075 and it
renders 100px lower, so the footer still begins at the box's bottom edge and
covers the overhang. A negative margin was doing that job here, which moved the
footer and shortened the document by 75. `Footer` takes `relative` so it still
paints above; a transform makes a stacking context, and without that the grass
drew on top of the footer.

## Pinned track travel

Retracted: the source does **not** ease past the end of its range. Sampled 90ms
after a scroll jump it looks like a damped follower; settled at every sample it
is plainly piecewise linear. The parameters were what differed, and all five
were wrong.

| | source | was |
| --- | --- | --- |
| entry x | +3000 (2.083 panel widths) | +1440 (1.0) |
| held x | -1464 | -1440 |
| exit x | -4444 (3.086) | -4320 (3.0) |
| dwell | 650px | 300px |
| entry rate | 3.31 px/px | 1.71 px/px |

Both legs take equal scroll despite covering different distances, so the entry
leg runs half again as fast as the exit leg. Settled, the clone now tracks the
source within about 30px at worst.

## Other routes

The gap list was home-only. Every route that closes with the grass plate drew
the wrong image at the wrong size — `FdMpM1DRwld` at 1400x779 in a 20px gutter
against the source's `sZiDqyHOMLNk` at 1376x766 in a 32px gutter. Fixed on
/science, /merch, /merch/[slug], /blog, /blog/[slug] and the legal pages; home
had already been fixed and the others never shared it.

Document height per route, source to clone:

| route | before | after |
| --- | --- | --- |
| / | -2 | **-2** |
| /blog | +29 | **+15** |
| /merch | +56 | **+42** |
| /privacy-policy | +166 | **+153** |
| /cookies-policy | -60 | **-73** |
| /science | +578 | **+565** |

## Still open

- **/science carries a section the source does not have** — four blocks headed
  "Built around what people actually under-eat", "Form chosen before dose",
  "Every batch, independently verified" and "What we do not claim", about 668px
  between the comparison table and the FAQ. That is authored content, not copy
  inside an existing section, so removing it is a scope call rather than a
  parity fix. With the rest of /science now exact, it is the **entire**
  remaining difference on that route.
- ~~/science draws a 1400x760 plate the source does not have~~ — **fixed.** Its
  probiotics panel is the same construct as the home SOL-G7 band and was built
  the same wrong way: a bg-forest/55 wash under a 0.9 overlay over a 1400x760
  plate, instead of a 1440x974 plate with the 1376x846 panel carrying
  backdrop-filter: blur(38.6px) and no tint. Rebuilt; the plate now lands at
  4590 and the second comparison heading at 4821, both exact. The stats section
  also opened on 94px of padding where the source has 193, and the panel's
  heading was centred in the band where the source puts it 167px down.
- ~~/privacy-policy +153 and /cookies-policy -73 are unexamined~~ —
  **examined, and they are copy length.** Both pages carry the source's section
  set in the source's order, and on /privacy-policy the first four sections
  track within 11px before the last three grow by 36, 36 and 40. On
  /cookies-policy the swings run in both directions section by section (+38,
  -32, +35, +36, -56, -32, -100). That is body text length, which is already
  settled as acceptable, not spacing — so these two are done as they stand.
- /merch is closed: its listing grid used a 24px column gutter where the source
  uses 52, which inflated every card from 424x387 to 443x404 and dragged every
  row below it. Rows now land at 271/929/1587 against 271/929/1586 and the page
  is 4034 against 4035.
- Testimonial panel gutter: 20px inset here, full-bleed 1440 on the source.
  Held for the rounded-corner preference.
- Callout and feature body copy wrapping one line longer (Inter vs Inter
  Display).

## The closing block was 32px wrong on every route

The source puts its closing plate 232px under the closing heading everywhere;
`mt-16` made that 264. It read as correct on home only because that page's
closing heading was itself 33px early, so the two errors cancelled and the
plate landed on the right y for the wrong reason. Corrected on home, /science,
/merch, /blog, both detail routes and the legal pages, with home's blog band
closing 33px later so its heading lands on the source's y.

Route heights after: / -1, /merch -1, /blog -2, /privacy-policy +121 (copy),
/cookies-policy -105 (copy), /science +753 (the authored section).

## More probes that lied, this pass

12. **Client rect is not layout.** Several landmarks sit inside
    `position: sticky` wrappers (the reviews heading, the offer column) or
    inside scroll-driven transforms that are a function of scroll rather than
    one-shot, so their rect depends on where the page is parked.
    `_spacing.mjs` read the benefits heading 24px off at scroll 0 and I
    "corrected" the page the wrong way on the strength of it. `_layout.mjs`
    walks the offsetTop chain instead and is the one to trust for position.

13. **`_pace2.mjs` at 90ms per sample measures lag, not mapping.** That is
    where "the source eases past its range" came from. Use `SETTLE=700`.

14. **`_routes.mjs` on a single fast sweep reports a height still growing** —
    the source's home page read 14443 on one pass and 14583 on a thorough one.
    It sweeps twice now.

15. **`_landmarks.mjs` matched two different headings** that share their first
    14 characters ("Solene® outper…"), reporting an 805px gap that does not
    exist. Dump both sides with `DUMP=1` before trusting a matched row.
