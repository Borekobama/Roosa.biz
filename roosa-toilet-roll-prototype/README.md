# ROOSA Toilet Roll — 3D Hero Prototype

A scroll-driven, real-time 3D toilet-roll hero built with plain **Three.js inside Next.js/React** (no Spline, no Blender export, no react-three-fiber). This folder is self-contained and not wired into the main site — copy it into any Next.js project to try it.

Live local preview while building this: `http://localhost:4173/` (throwaway sandbox — see "Where things live" below).

---

## The brief

Turn the concept in `ROOSA Toilet Roll Spline.md` (scroll-driven pink roll: rotates, shrinks, unrolls a sheet, hands off into the page) into something that actually runs, without depending on Blender/Spline (tools this assistant can't drive).

## What we tried, in order (useful if you want to skip the dead ends)

**V1 — Fully procedural, "realistic" first pass.**
Plain `THREE.CylinderGeometry` for the roll + core, canvas-generated pink textures, standard PBR material, a few directional lights. Result: looked like dated 90s CGI — hard 90° edges on the cylinder rim, muddy one-sided lighting, dull desaturated color. The hard edge under flat lighting is the single biggest "cheap 3D primitive" tell.

**V2 — Cartoon/toon pivot.**
Swapped to `MeshToonMaterial` with a stepped gradient map (flat cel-shading bands), rounded the cylinder's edges by hand-building the profile with `THREE.LatheGeometry` instead of `CylinderGeometry`, added an inverted-hull outline stroke (a slightly-scaled backface-only duplicate mesh) for a coloring-book look. Result: reads as intentionally cartoonish — not what was wanted ("weird").

**V3 — Realistic PBR, done properly.**
Kept the rounded `LatheGeometry` edges (that part was a real improvement), switched back to `MeshPhysicalMaterial` with a thin clearcoat layer, and — the important bit — built a small procedural "softbox room" (a handful of bright/colored planes) and baked it into a reflection map with `THREE.PMREMGenerator`. That's the same trick real product-photography-style 3D sites use for those curved specular highlights; without an environment map, PBR materials just look like dull grey plastic. Also added a jaunty resting tilt and continuous idle bob/sway/breathe motion instead of a static pose. Result: close, but still an obviously synthetic/procedural shape.

**V4 (current) — real 3D asset.**
User supplied an actual modeled asset (3ds Max export: `.obj` + 8192×8192 color/bump textures). Loaded it with Three.js's `OBJLoader`, kept V3's lighting/environment/motion system, pink-tinted the model via material-color multiply (so the real quilted-paper relief and shading from the source texture comes through, just recolored), and layered the existing procedural "loose sheet" plane underneath since the asset itself is a rigid, non-animated mesh. This is the version currently running.

## Key technical decisions

- **Stack:** Next.js (App Router), TypeScript, `three` npm package directly — no Spline runtime, no react-three-fiber, no Blender pipeline. One React component mounts a vanilla Three.js scene in a `useEffect`.
- **Scroll "pinning" is NOT CSS `position: sticky`.** We hit a real bug: Next's default global CSS (`overflow-x: hidden` on `html`/`body`) silently detaches `position: sticky` from the viewport (per the CSS Overflow spec, setting `overflow-x` to non-visible forces `overflow-y` to compute as `auto`, turning `body` into its own scroll container). Fix: compute scroll position manually (`getBoundingClientRect`) and toggle the stage between `position: fixed` / `position: absolute` in JS. Immune to ambient site CSS.
- **One continuous render loop.** A single `requestAnimationFrame` loop runs always; scroll just updates a `progress` value (0–1) that the loop reads each frame. Progress drives: rotation, roll radius (non-uniform scale — shrinks radius without shrinking the roll's length), loose-sheet length + droop + perforation spacing, camera dolly, and the 3D→HTML opacity crossfade at the end.
- **Radius-shrink formula** is the cross-sectional-area-based one from the original spec doc (`R(p) = √(r² + (1−p)(R₀²−r²))`), not a naive linear shrink — reads much more like paper actually being consumed.
- **Environment reflections without an HDRI file:** `createRoomEnvironment()` builds a tiny scene of bright colored planes (walls/ceiling/floor + two "softbox" highlight strips), renders it once through `PMREMGenerator`, and sets the result as `scene.environment`. This is what makes the glossy material look real instead of flat.
- **Finding the real asset's true rotation axis was a debugging detour worth knowing about:** guessing from the OBJ's raw bounding box (which axis has the largest extent) gave the *wrong* answer, because a small sculpted paper-flap detail on the mesh skewed one axis's range. The reliable method was rendering the model face-on down each world axis (`camera` positioned at `(4,0,0)`, `(0,4,0)`, `(0,0,4)`) and looking for which view shows the full end-cap circle. Answer was local **X**, not the assumed Y.
- **Texture budget:** source textures were 8192×8192 (26MB each — way too big for web). Downscaled with macOS `sips` to 2048px (color, ~980KB) and 1024px (bump, ~410KB).

## Where things live

**This folder** (`roosa-toilet-roll-prototype/`, sibling to `src/`, not imported by anything) — the permanent, portable copy:
```
roosa-toilet-roll-prototype/
├── README.md                              (this file)
├── components/ToiletRollHero/
│   ├── ToiletRollHero.tsx                 React component: scroll handling, copy states, reduced-motion fallback
│   ├── toiletRollScene.ts                 All Three.js: scene, materials, environment map, animation loop
│   └── ToiletRollHero.module.css
└── model/
    ├── tp.obj                             Real geometry (from /Users/berke/Downloads/ToiletPaper/uploads_files_1971501_tp.obj)
    ├── color.jpg                          Downscaled base-color texture (2048px, from the original 8192px ttttt.jpg)
    └── bump.jpg                           Downscaled bump/relief texture (1024px, from ttttt_b.jpg)
```

**Original raw source asset** (all formats, full-res textures, 3ds Max files): `/Users/berke/Downloads/ToiletPaper/`

**Live sandbox used while building** (throwaway, will NOT survive past this session — it's under `/private/tmp/...`): a full `create-next-app` scaffold with `three` installed and these same files wired into `app/page.tsx`. If you want to keep experimenting interactively rather than re-scaffolding, ask and it can be rebuilt from this folder in under a minute.

**Your real site** (`Roosa.biz/src/`): intentionally **not touched**. It already has its own live hero — `src/components/HeroPaperRoll.tsx`, wired into `src/app/[locale]/page.tsx` — using a static photo + CSS `--hero-progress` custom property instead of 3D. This prototype is separate on purpose.

## How your friend can reproduce/compare

1. `npx create-next-app@latest` (TypeScript, App Router) — or drop into an existing Next.js app.
2. `npm install three @types/three`
3. Copy `components/ToiletRollHero/` into their project's `components/` (or `src/components/`).
4. Copy `model/` into their project's `public/model/` (paths in `toiletRollScene.ts` assume `/model/tp.obj`, `/model/color.jpg`, `/model/bump.jpg`).
5. Render it: `<ToiletRollHero />` on any page.
6. `npm run dev`, scroll through the first ~280vh section.

If he wants to use a **different** 3D asset, the only asset-specific code is in `loadRollModel()` inside `toiletRollScene.ts` — the mesh name it looks for (`"Tube001"`), and the rotation-axis assumption (currently local X). If his asset's axis differs, use the same "render face-on down each world axis" trick described above to find it rather than guessing from the bounding box.

## Known rough edges / what's still placeholder

- Brand pink hex (`#ff5c9a`) and background gradient colors are placeholders — not verified ROOSA brand tokens.
- The loose sheet is a separate procedural plane (bump-mapped to match, but not the same mesh as the roll) since the real asset has no animatable sheet geometry — positioned to roughly line up with the model's own small sculpted flap.
- No product-pack mesh, no verified impact/contribution figures (still bracketed placeholders in the copy, per the original spec doc's own convention).
- Camera framing, tilt angle, and idle-motion amounts were tuned by eye against screenshots, not against real device testing.
