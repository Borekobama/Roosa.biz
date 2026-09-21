# Handoff prompt — Solene clone, panel tinting and fine-detail sweep

Copy everything below the line into a new chat.

---

Continue a 1:1 clone of https://solene.framer.ai/ in
`/Users/berke/Downloads/Projects/Website/templates/solene`.

The geometry and motion are largely matched. Your job this session is the
**remaining visual gap list** — panel tinting above all — plus finding what the
previous sessions' measurements missed. Read
`docs/research/side-by-side-review.md` first: it is a frame-by-frame reading of
the comparison captures with measurements, and it is the agenda.

## Standing rules — these are not negotiable

- **The original is the source of truth.** Where my audit and the live site
  disagree, follow the site and tell me. That rule has already settled two
  disputes (see *Settled decisions*).
- **Measure before changing.** If the clone already matches, say "already
  matches" and change nothing.
- **Never delete or weaken a failing assertion to go green.** Several checks in
  `verify.mjs` previously encoded the clone's old behaviour rather than the
  source's. If an assertion is wrong, rewrite it to the source's *measured*
  behaviour and say why.
- **Always start the server with `bash tools/cloner/serve.sh`**, never
  `npm run start` directly. It frees the port, rebuilds, and refuses to return
  until the page's referenced stylesheet resolves and `.sticky` computes as
  `sticky`. A stale `next start` serves HTML pointing at a stylesheet that no
  longer exists — the page renders with **no CSS**, and every probe then
  silently grades unstyled markup as if it were real.
- **Port is 3111.** Another app of mine answers on 3000; a probe pointed there
  grades *that* site and reports nonsense. `verify.mjs` now defaults to 3111 —
  keep it that way.
- I need it **1:1, no shortcuts, no "they won't notice" reasoning.** If
  something cannot be done, say so plainly rather than working around it
  quietly.
- **Record findings as you go, including false alarms**, in `notes/1/`.
- Skills installed at `~/.claude/skills/`: `clone-website`, `webapp-testing`,
  `frontend-testing-debugging`, `dev-browser`, `frontend-design`.

## Read this before you trust any measurement

Five wrong conclusions in previous sessions came from flawed probes, not from
the code. Each made me confidently report the opposite of the truth. Expect
more of this class.

1. **Sweeping the page before sampling fires one-shot scroll reveals.** Probes
   that scrolled the whole page to mount lazy content then came back to sample
   found the source "static" in five places it was not. The corrected method is
   **fresh load, walk down in steps, sample as the target enters** — see
   `tools/cloner/_fresh.mjs` and `_reveals.mjs`. This recovered the ingredient
   rows, nutrition rows, comparison rows, the Natural Ingredients heading and
   the closing block.
2. **Tailwind v4 compiles scale utilities to the CSS `scale` property, not
   `transform`.** Reading `getComputedStyle().transform` reports `none` on a
   perfectly working hover zoom. Read `scale` too.
3. **A probe that finds a card's background will not tell you the card has a
   child image.** The benefits bento's "Energy support" card was stripped to
   plain sage for exactly this reason. It carries a photo inset at 336×262
   inside the 448×360 card.
4. **`.catch(() => {})` around a Playwright click swallows a racing selector**
   and makes a working control look broken. The cart quantity stepper looked
   dead twice for this reason.
5. **Element labels matter.** The cart increase button is
   `aria-label="Increase <product name>"`, not "Increase quantity".

The general lesson: when a probe says the source does nothing, assume the probe
is wrong until a second method agrees.

## Where the work stands

Branch `main`, at `9bf6eba`, tree clean, **101 commits, 46 of them unpushed**
(`git push` when you're confident). Remote is
`https://github.com/Borekobama/website-template-solene.git`.

`npm run typecheck` and `node_modules/.bin/eslint .` are both clean.

### The check suite

`node tools/cloner/verify.mjs` — **PASS, 57 route loads + 22 interaction
checks.** It covers 19 routes × 3 viewports plus reload, scroll, hover, menu,
panels, thumbnails, flavours, merch sizes and variants, Buy Offer, and the cart
including the empty state. Takes several minutes; run it in the background and
poll the log. Keep it green or explain precisely why not.

Other tools in `tools/cloner/` (the `_`-prefixed ones are ad-hoc probes, 96 of
them, safe to read for technique):

| tool | purpose |
| --- | --- |
| `serve.sh` | the only correct way to start the server |
| `verify.mjs` | the suite above |
| `compare.mjs` | walks both sides down in viewport slices |
| `_sbs.mjs` | composites those slices side by side |
| `_band2.mjs` | aligns both sides on a named section and composites |
| `_pair.mjs` | composites one route at one scroll offset |
| `_align.mjs` | aligns both sides on a shared asset stem |
| `_pixels.mjs` / `_sample.mjs` | decode both screenshots in a canvas and report **real RGB** per region — use this for any colour claim |
| `_reveals.mjs` / `_fresh.mjs` | the corrected reveal-audit method |
| `_secpos.mjs` | where every section lands in the document, both sides |
| `_scroll.mjs` | scroll cost under 6× CPU throttle |

### What already matches, measured

Don't re-litigate these; spot-check at most.

| Property | Source | Clone |
| --- | --- | --- |
| Page height | 14583 | 14604 |
| Hero image | 1377×830 @ 31,77 | 1376×830 @ 32,77 |
| Entrance travel | −123 → 0 | −123 → 0 |
| Ingredient marquee | 100 px/s | 100 px/s |
| Gummy drift | 96px per 120 scrolled | 96px per 120 scrolled |
| Row reveal curve | 0.50·y123 → 0.92·y21 → 0.99·y3 | same cubic |
| Scroll cost (6× CPU) | 823ms, 33ms median, 0 long tasks | 769ms, 33ms median, 0 long tasks |
| Product page image | 648×868 @ 40,140 | identical |
| FAQ / comparison / news overlay / cart panel | — | all within a few px |

Carousel pacing matches including a **dwell** — the source holds the track still
for ~300px of scroll while the middle panel sits flush. The pinned track holds
**three** panels, and its lead-in and lead-out overlap the sections either side.

## The work: ranked gap list

From `docs/research/side-by-side-review.md`.

### 1. Panel tinting — the real one

Affects the routine panel, the tennis panel and SOL-G7 (`home-01`, `home-02`,
`home-04`, `z-solg7`). The clone's panels read brighter and more olive; the
source's are darker and more desaturated-teal.

What is known:

- Both sides load the **same two assets** — background
  `9I5p6FC8NC01AUfPTsTJIysiU` and overlay `rt7EhbM0b89GV3Exm5VCRoV728Q`
  (1376×802) — and the clone renders the overlay at the same geometry.
- The source draws the background **1440×931 anchored 85px above the panel**, a
  zoomed and shifted crop. That is matched.
- The overlay PNG is a *light* pane, so something else darkens the source's
  interior. **I never identified the mechanism.** The clone's tint under it is
  fitted to sampled pixels, which gets three of four regions within 7 RGB but
  leaves the panel's lower left about **25 out on every channel**.

Start by finding the mechanism — check pseudo-elements (`::before`/`::after`),
blend modes, filters on ancestors, and whether Framer serves a different
rendition of the overlay than the one in `public/assets/images/`. Use
`_pixels.mjs` for any claim about colour.

### 2. Feature column icons

The pinned image panels' three-column callouts use filled, specific glyphs on
the source — a face, a head, a stethoscope, and on the tennis panel a bolt and
others. The clone uses thin generic line icons in
`src/components/ui/PanelIcon.tsx`. Wrong weight, wrong subjects. Draw
replacements that read like the source's set **without tracing their artwork**.

### 3. Foliage bleed below the SOL-G7 panel

On the source the background image continues past the rounded panel edge before
the section ends. The clone stops at the panel boundary and goes to cream.

### 4. Review card opacity and text size

The source's glass cards are lighter — foliage reads clearly through them — and
their quote text is smaller, so more cards fit and they sit *in* the image
rather than on it. Clone's are denser and bulkier.
`src/app/page.tsx`, the testimonial section.

### 5. FAQ heading line break

Source sets `Frequently / asked questions`; clone sets
`Frequently asked / questions`.

### 6. Closing jar scale

Clone renders 230px wide against the source's 216px, with a denser flower bed.

## Settled decisions — do not re-open

- **The logotype is not reconstructed.** The Solene wordmark is the brand's
  mark, not layout. The clone sets the name in the template's own display face
  at the source's measured **166×46** box, so header geometry is exact and a
  real mark drops straight in. The jar drawn for the benefits card carries no
  branding for the same reason. If I send you artwork, wire it up; otherwise
  leave it.
- **Inter Display is unavailable.** The source uses it; the clone uses Inter,
  which runs a few px wider at the same size. This causes the nav pill at 229px
  against 216px, the Buy Offer pill at 106px against 100px, and several
  line-break differences. Do not chase these with letter-spacing hacks.
- **Copy is original.** FAQ answers, feature descriptions and blog posts are
  written for this template, not lifted. Several density and wrapping
  differences follow from that and are acceptable.
- **Rounded corners are kept** throughout, against the source's sharper edges.
  This is an explicit preference of mine.
- **"Small habits. Big difference." stays.** My audit said to remove it;
  enumerating the source's track returns three panels with that statement in the
  middle, visible in captures at y=2500 and y=2900. Original wins.
- **No per-row ingredient imagery.** My audit implied pictures appear per row;
  scanning the source in 120px steps returns no images at any offset while the
  list is on screen. There *is* a per-row scroll animation, and that is
  implemented.
- **The supplement is out of stock, merch is purchasable.** The source shows
  everything out of stock, which makes the cart untestable. Supplement matches
  the source; merch sells so the cart flow can be exercised end to end. Both
  pages must agree about a given product — they disagreed once and it was a bug.

## How I want you to work

Screenshot everything and show me side-by-side composites — I want to see them,
not just read that you took them. Use `compare.mjs` + `_sbs.mjs` for whole
pages and `_band2.mjs` for a named section.

When you find something, fix it, re-measure, and show me the before/after
numbers. When a measurement contradicts what I told you, say so and show the
evidence rather than quietly following either one.
