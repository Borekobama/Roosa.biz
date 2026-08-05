# ROOSA Toilet Roll — 3D Hero Prototype **V2**

A scroll-driven, real-time 3D pink-toilet-roll hero built with plain **Three.js
inside React** (no Spline, no Blender export, no react-three-fiber). Self
contained — drop the two folders into any Next.js/React project and render
`<ToiletRollHero />`. This is a second pass on the concept in
`ROOSA Toilet Roll Spline.md`, rebuilt around the new **ToiletPaperV2** asset.

It implements the full spec arc: a solid pink roll that **rotates, unrolls,
shrinks toward a constant cardboard core**, carries the six scroll-state
messages, and **hands the loose sheet off to a flat HTML paper element** that
continues into the impact section. Desktop, tablet, mobile, reduced-motion and
no-WebGL fallbacks are all covered.

See `qa/` for rendered screenshots of every state.

---

## What changed vs the V1 prototype

The V1 writeup is in `../roosa-toilet-roll-prototype/README.md`. V2 keeps V1's
proven scaffolding (manual scroll pinning, one continuous render loop, the
PMREM "softbox room" env map, the area-based shrink formula) and fixes or
upgrades the rest:

| Area | V1 | **V2** |
|---|---|---|
| **Core behaviour** | scaled the **whole** rigid mesh — so the cardboard core shrank too (a spec violation, §3/§8) | a **separate constant kraft core** that never scales; only the wrapped paper thins, so the core is *revealed* as it should be |
| **Material** | colour + bump only | full PBR — the asset's real **4K cherry-blossom quilt** (normal + faint base), matte, soft, not plastic |
| **Brand pink** | guessed `#ff5c9a` | the **real token `#ef83b6`** (+ light/dark) read from `src/app/globals.css` |
| **Loose sheet** | canvas texture, fixed anchor, tone mismatch | **dusty pink matched to the roll**, anchor tracks the shrinking radius, constant perforation spacing |
| **Rotation axis** | hand-found by rendering face-on down each axis | n/a — the roll is now procedural, so its axis is known by construction |
| **Handoff** | pink block, centred | **colour- and position-matched** to the 3D sheet so the crossfade has no visible jump; continues into a real `#impact` section |
| **Responsive** | tuned by eye | explicit desktop / tablet / mobile variants (rotations, sheet length, framing, earlier mobile handoff) |
| **Fallbacks** | present | reduced-motion **and** no-WebGL, both fixed and verified (see the two bugs found below) |

---

## Why the roll is **rebuilt**, not loaded directly

This is the important decision, so it's worth being explicit.

The ToiletPaperV2 asset is gorgeous but it is a **single-pose prop**: one mesh,
no separate parts, no morph targets, and — when you actually inspect it in
Three.js — a **thin, open ~270° paper shell** with a modelled flap and **hollow,
open ends**. It is meant to be photographed from the front in one position.

Loading it rigidly (the way V1 used its asset) and then spinning + shrinking it
fails in ways that can't be patched from the outside:

- spinning sweeps the shell's **gap** to the front and you see the hollow;
- the ends are open, so you see **through** the roll;
- the quilt only covers the arc, so ~¼ of every turn shows a **smooth patch**.

The spec anticipates exactly this: **§17 says a downloaded model is only a
*starting mesh*** and must be reworked into separate core / wrapped paper /
loose sheet with a shrinking morph. That rework is normally a Blender job — and
Blender can't be driven in this environment — so it's done in **Three.js**
instead:

- **Wrapped paper** → a solid procedural roll (rounded rims) that **wears the
  asset's real quilt**, cropped from its 4K normal map and tiled with
  `MirroredRepeatWrapping` so it's seamless and covers the full circumference.
- **Cardboard core** → a separate kraft cylinder that rotates with the paper
  but **never scales**.
- **End faces** → pink discs (concentric-ring "wound paper" bump) that scale
  with the radius, so the core hole opens up as paper is used.
- **Loose sheet** → a subdivided strip, anchored to the current radius.

Net result: correct mechanics (clean spin, area-based shrink, core reveal) **and
the artist's actual surface design**. The raw mesh is kept in `source/` for
reference. If you later rework the asset properly in Blender (real separated
parts + morph targets, exported to GLB), that GLB can replace the procedural
roll — the scroll/copy/handoff scaffolding around it stays the same.

---

## Key mechanics (all in `toiletRollScene.ts`)

- **Radius shrink** uses the spec's cross-sectional-area curve
  `R(p) = √(r² + (1−p)(R₀²−r²))`, capped at a thin final layer — not a linear
  shrink. It scales the wall / caps / rims radially; the core is left alone.
- **Rotation**: 8 turns on desktop, fewer on smaller screens (spec §8: 6–10).
- **Loose-sheet length** grows with an eased curve while a texture-repeat keeps
  **perforation spacing constant** (no stretch, spec §8).
- **Even lighting**: because the roll spins, illumination is
  environment-dominant (PMREM softbox room + ambient) with only gentle
  directionals — so the pink stays even at every angle instead of darkening as
  the lit face turns away.
- **3D→HTML handoff** (spec §6 State 6 / §14): from 86 % the 3D sheet fades and
  moves toward camera while a matching HTML paper fades in at the same position
  and colour, then flows into `#impact`.
- **Manual scroll pinning** (not CSS `sticky`): a real Next.js footgun —
  `overflow-x: hidden` on `html`/`body` forces `overflow-y: auto`, which
  detaches `position: sticky`. Pinning toggles `fixed`/`absolute` in JS instead.

---

## Files

```
roosa-toilet-roll-prototypeV2/
├── README.md                              ← this file
├── components/ToiletRollHero/
│   ├── ToiletRollHero.tsx                 React: scroll pinning, copy states, handoff, fallbacks
│   ├── ToiletRollHero.module.css          brand-token styling, responsive, handoff paper
│   └── toiletRollScene.ts                 all Three.js: procedural roll, materials, env, loop
├── model/                                 ← copy into the consuming project's public/model/
│   ├── quilt_normal.webp                  real 4K floral quilt (cropped), tiled on the roll
│   └── quilt_base.webp                    faint paper tone
├── scripts/prep-textures.sh              regenerates model/*.webp from the raw ToiletPaperV2 maps
├── source/
│   ├── ToiletPaper_HI.obj                 raw asset geometry (reference only; not loaded)
│   └── source-asset-reference.txt         asset inventory + LICENCE-UNVERIFIED note
└── qa/                                    rendered screenshots of every state
```

Runtime model payload is **~340 KB** (the roll geometry is procedural), well
under the spec's <3 MB hero budget.

---

## Use it

1. `npm install three @types/three`
2. Copy `components/ToiletRollHero/` into your `components/` (or `src/components/`).
3. Copy `model/` into your project's `public/model/` (the scene loads
   `/model/quilt_normal.webp` and `/model/quilt_base.webp`).
4. Render `<ToiletRollHero />` on a page.

The component is framework-neutral (`'use client'`, plain `<a>` links, no
`next/*` imports) so the same file runs in a bare Vite app and in Next.js.

## Reproduce the interactive sandbox

A throwaway Vite sandbox was used to build and verify this (it renders the real
component + a `?scene&p=0.5` harness for inspecting single frames). To rebuild:

```bash
npm create vite@latest sandbox -- --template react-ts
cd sandbox && npm install three @types/three
# copy components/ToiletRollHero/* into src/components/ToiletRollHero/
# copy model/* into public/model/
# render <ToiletRollHero/> in App.tsx, then:
npm run dev
```

Screenshots in `qa/` were captured with Playwright at a real 1440×900 / 390×844
viewport (the scroll states are position-driven, so a real viewport is needed).

---

## Two bugs found and fixed during verification (worth knowing)

1. **Reduced-motion rendered a black roll.** A `MeshStandardMaterial` samples an
   *unloaded* `map`/`normalMap` as **black**, and `color × black = black`. The
   animated loop re-renders after the texture arrives and hides it; the static
   (one-frame) path froze on the black frame. Fix: re-render the static frame in
   the texture `onLoad`.
2. **Reduced-motion crashed** (`Cannot access 'currentProgress' before
   initialization`) — a temporal-dead-zone bug where `resize()` renders a frame
   during setup before the `let currentProgress` line ran. Fix: hoist the
   declaration above `resize()`.

Both only affected the static path, which is exactly why they're easy to miss —
verify reduced-motion, not just the happy path.

---

## Known rough edges / still placeholder

- **Asset licence is UNVERIFIED** — no licence file shipped in the ToiletPaperV2
  package. Confirm terms and store a copy in `source/` before this goes live
  (spec §20). See `source/source-asset-reference.txt`.
- **Copy** follows the spec's states but leaves any claim not already on the
  live site as a bracketed `[PLACEHOLDER]` (`[CONTRIBUTION_AMOUNT]`,
  `[Skin-safe testing — to verify]`, …), matching the site's "clearly marked
  until verified" convention. No product specs, certifications, partners or
  figures are invented (spec §20/§22). Swap for approved copy.
- A faint horizontal channel line is visible where the quilt tile mirrors across
  the roll width — reads as a quilting seam; tighten the crop if undesired.
- No product-pack mesh (optional in the spec). The floral emboss stands in for
  the "optional ROOSA hearts"; a heart quilt can be swapped into
  `model/quilt_normal.webp` via `scripts/prep-textures.sh`.
- Camera framing, tilt and idle amounts were tuned against screenshots, not real
  devices.
