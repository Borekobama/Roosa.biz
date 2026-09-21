# Manual side-by-side audit — home page

Findings from a human pass over both sites. These are observations the probes
did not catch; several are behavioural or animation differences that no
geometry measurement would surface. Verbatim intent preserved; wording tidied.

## Sizing (systemic — suspected single root cause)

1. **Hero image does not fit the screen.** On the source the whole picture sits
   within the first screen; ours is stretched taller so you must scroll to see
   it. Tell: in the source the arm cuts into the corner, in ours it does not.
2. **Pinned panels have the same problem** — the source fits them to the
   viewport frame, ours are stretched.
3. **SOL-G7 glass panel likewise** should fit the viewport better, and sits
   slightly misplaced to the right.

Hypothesis to test first: the source sizes these to the viewport while the
clone uses a fixed aspect ratio, so they agree at 1440x900 and diverge
everywhere else.

## Corners

4. Hero banner corners are more rounded here, sharper on the source.
5. Pinned panel image edges are not rounded on the source.

   NOTE: this contradicts the standing "rounded corners are kept" decision.
   Needs confirmation before changing.

## Header

6. Nav pills are sized differently — should be slightly larger / wider.
7. Cart icon is the wrong shape and too large. The circle around it is right.

## Copy and text

8. Hero lede ("Real vitamins crafted...") is written differently on the source.
9. Fading statement breaks differently: the source sets "with clean and
   effective nutrition" on one line.
10. Footer "Grown with care..." uses a different font on the source and carries
    apostrophes ours lacks.
11. Footer column links use a different font. The source has no rule above
    them; ours does — **keep ours, it looks better** (explicit preference).

## Missing content

12. **"Benefits" eyebrow is missing** above "Real clarity begins when your body
    finds balance".
13. Stats row (72% more consistency, 57% fewer fluctuations) should be
    separated by rules and carry icons — a timer, an arrow and a star.

## Motion

14. **Pinned track feel is wrong.** The source snaps — it lands on a frame,
    magnetic, on rails, with weight. Ours dashes through, fluid and watery.
15. **Bento reveal**: source cards converge into place from right, left and
    bottom, arranging into the group. Ours simply appears.
16. **"3—5x*" is animated** on the source (pops in). Ours is static.
17. **News heading** ("Our latest regenerative news") does not appear to load —
    too opaque, fades in too late.
18. **Closing "Daily well-being requires real vitamins"** is animated on the
    source where the footer begins. Ours is not.
19. **Testimonial heading**: on the source the panel rides up over the heading
    and hides it, rather than the heading floating up.
20. Falling gummies are slightly tilted on the source; ours are not.

## Behaviour

21. **Offer accordion is single-open here, multi-open on the source.** On the
    source Benefits and Ingredients can both be open at once; ours closes the
    others.
22. **Flavour switch does not change the product image.** Green Apple / Solar
    Mango changes the picture on the source; ours does not.

## Confirmed fine

- Hero heading text and its break.
- Out of stock on both flavours — matches the source.
- FAQ.
- Ingredient tile sizing.
- Falling-gummy effect itself (only the tilt differs).
- The logotype difference is the known, settled one.

---

# Outcomes

18 of 22 closed, 1 measured as a non-issue, 3 waiting on a decision.

## Closed

| # | finding | what it was |
| --- | --- | --- |
| 1,2 | hero and panels do not fit the screen | both were pinned to fixed heights right only at 1440x900. Hero is 100vh-110px with the picture at 105%; the pinned sticky is 100vh, its panel 100vh-102px, its container 4.7*vh+30 |
| 3 | SOL-G7 sizing | already matched — fixed 1376x803 on both sides at every viewport height |
| 6 | nav pills sized differently | settled Inter Display width, not chased |
| 7 | cart icon too large | box and disc already exact; the drawing ran edge to edge |
| 8 | hero lede written differently | same wording — a wrap. Source breaks after "clarity" |
| 9 | statement line break | source keeps "with clean and effective nutrition." whole |
| 10 | footer type | column is 300px, not 343. The face is Inter Display (settled) and the quote marks belong to the source's own quotation |
| 12 | Benefits eyebrow missing | added, lands at y=5322 exactly |
| 13 | stats need rules and icons | three 409px columns on a 75px gutter, 1px rules in rgb(235,235,235), 15px marks |
| 14 | track feels weightless | critically damped spring at w=15, plus a recovered start frame |
| 15 | bento cards appear rather than converge | no fade on the source at all; each card travels on one axis, dy 114/126 and dx -66/+64, decaying as (top/vh)^2.3 |
| 16 | "3-5x" not animated | dx -106 to 0 on a ^4 curve with opacity 0.66 to 1 |
| 17 | news heading does not load | was 0.00 opacity through the whole approach; the source never fades it |
| 18 | closing section animated differently | ours ran ahead the whole way; retuned to start 513, span 700, power 1.18 |
| 19 | panel should cover the heading | the sticky had no range to stick in, and z-10 kept it above the panel |
| 21 | accordion single-open | now holds rows open together |
| 22 | flavour does not swap the image | the asset was already in the repo and already mapped |

Plus one the audit did not name: the page set `scroll-behavior: smooth` where the
source leaves it `auto`.

## Measured as a non-issue

**Gummy tilt.** Neither side rotates those marks — rotate none, matrix angle 0,
both sides. What differs is which gummy sits in which slot and their sizes.

## Waiting on a decision

- **Corners.** Reverses the standing "rounded corners are kept" preference.
- **/science's four authored blocks**, about 668px, now the entire remaining
  difference on that route.
- **Testimonial panel gutter**, 20px inset against the source's full-bleed 1440.

## What this pass cost, and why

Three passes were spent tuning the track against numbers that were not the
track:

1. `scroll-behavior: smooth` meant every programmatic scroll animated over
   ~460ms, so the measured "response" was the scroll ramp.
2. The step-response jump ran 2000 to 3000, which spans the dwell at progress
   .403-.597 — the flat middle was the hold working, not a stall.
3. Two diagnoses along the way ("React drops frames", "dt spikes") both came
   from tracing the wrong element: the page has several inline translate3d
   nodes and the first is the fading statement.

The check that ended it was simulating the integrator with no browser at all.
It matched the source, which proved the maths was right and the measurement
wrong. Reach for that earlier next time.
