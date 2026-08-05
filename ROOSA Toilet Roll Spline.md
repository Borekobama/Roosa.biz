# ROOSA Animated Toilet Roll — Creative and Technical Handoff

## 1. Concept summary

### Working title

**The Pink Paper Trail**

### Core interaction

A large, stylized pink toilet-paper roll occupies the hero section. As the visitor scrolls:

* The roll rotates.
* Paper visibly unrolls.
* The loose sheet becomes longer.
* The amount of paper remaining around the cardboard core decreases.
* Product and impact messages appear at defined scroll points.
* The loose sheet eventually leaves the 3D environment and becomes a flat graphic element that guides the visitor into the rest of the website.

The animation is not merely decorative. It visually connects:

1. The ROOSA product.
2. Product quality.
3. Everyday use.
4. Purchase.
5. Social contribution.
6. Documented impact.

---

# 2. Recommended art direction

## Chosen style

Use a **stylized-realistic 3D model**.

The model should look like a beautifully art-directed physical product rather than:

* A photorealistic bathroom render.
* A flat cartoon.
* A character with eyes, arms or facial expressions.
* A plastic toy.
* A generic stock 3D asset.

Recommended balance:

* 70% believable physical product.
* 30% stylized shape, material and animation.

## Why this direction fits ROOSA

A completely realistic model would require highly accurate paper fibres, deformation, shadows and surface imperfections. It could also make the website resemble a conventional supermarket advertisement.

A heavily cartoonish model would create personality, but it could make the product feel inexpensive or childish. It would also create a difficult tonal transition when the website begins discussing child-protection work.

The stylized-realistic direction provides:

* Strong brand recognition.
* Premium product presentation.
* Playful movement.
* Better tolerance for simplified web geometry.
* A suitable transition into serious impact content.
* A more distinctive result than standard product photography alone.

---

# 3. Visual characteristics

## Roll geometry

The toilet roll should have:

* A clean cylindrical shape.
* A clearly visible cardboard core.
* Softly rounded paper edges.
* Slightly exaggerated paper thickness.
* A separate loose sheet.
* Visible but simplified perforation marks.
* Optional embossed ROOSA hearts.
* A slight imperfection in the loose edge so it does not look computer-perfect.

Do not create every real paper layer as separate geometry.

Small detail should come from:

* Normal maps.
* Roughness maps.
* Baked texture.
* Simplified embossing.

## Proportions

Recommended starting proportions:

```text
Full outer radius:        1.00
Cardboard-core radius:    0.30–0.34
Roll width:               1.10–1.25
Final outer radius:       0.36–0.40
Loose-sheet width:        equal to roll width
```

The roll should stop before becoming completely empty. Leave a thin layer of pink paper around the core.

## Cardboard core

The core should:

* Remain constant in size.
* Rotate with the paper roll.
* Use a warm kraft-paper material.
* Have visible but subtle roughness.
* Become increasingly visible as the roll decreases.

The cardboard core must not shrink.

## Pink paper

The paper should use:

* Matte pink material.
* High roughness.
* Almost no metallic reflection.
* Very subtle fibre texture.
* Soft edge highlights.
* Minimal or no translucency.
* Optional shallow heart embossing.

Avoid strong plastic reflections.

## Loose sheet

The loose sheet should:

* Remain visually attached to the roll.
* Extend as the roll becomes smaller.
* Bend naturally under its own visual weight.
* Include regularly spaced perforation lines.
* Have a slightly curved or imperfect bottom edge.
* Eventually approach the camera or foreground.

The loose sheet should not stretch unnaturally. Its perforations and paper texture should retain approximately constant spacing.

---

# 4. Lighting and environment

Use a stylized studio environment rather than a literal bathroom.

## Recommended lighting

* One large soft key light.
* One gentle fill light.
* Optional soft rim light.
* Soft grounding shadow.
* Warm off-white or paper-white background.

## Lighting objective

The model should appear:

* Soft.
* Tactile.
* Premium.
* Simple.
* Clearly separated from the background.

Avoid:

* Dramatic glossy reflections.
* Dark cinematic lighting.
* Hard bathroom lighting.
* Complex room environments.
* Large reflective floors.
* Excessive depth of field.

The product itself should remain the visual focus.

---

# 5. Hero composition

## Desktop

Recommended composition:

* Roll positioned slightly right of centre.
* Headline positioned left.
* Product pack subtly visible behind or beside the roll.
* Loose sheet travelling downward.
* Large amount of negative space.
* CTA visible immediately.

Suggested copy:

**Soft on skin. Strong for children.**

Supporting copy:

> Pink three-ply toilet paper with documented social impact.

Primary CTA:

**Buy ROOSA**

Secondary CTA:

**See the impact**

## Mobile

Recommended composition:

* Roll centred or slightly above centre.
* Headline above or below the model.
* Shorter paper tail.
* Reduced number of rotations.
* No complex camera movement.
* CTA remains normal HTML and visible immediately.

---

# 6. Animation storyboard

## Overall scroll duration

Desktop starting point:

```text
240–300vh
```

Mobile starting point:

```text
160–200vh
```

The final length should be determined through usability testing.

## Animation states

### State 1 — Full roll

Scroll progress:

```text
0–12%
```

Visual:

* Full pink roll.
* Product pack visible.
* Very subtle floating or settling motion.
* Loose sheet is short.

Content:

**Soft on skin.**

Purpose:

Establish the product immediately.

---

### State 2 — Roll begins moving

Scroll progress:

```text
12–30%
```

Visual:

* Roll begins rotating.
* Loose sheet becomes longer.
* Outer roll radius decreases slightly.
* Camera remains mostly stable.

Content:

* Three-ply.
* Dermatologically tested.
* FSC-certified.
* Product pack and sheet information.

Purpose:

Connect movement with product quality.

---

### State 3 — Product in use

Scroll progress:

```text
30–52%
```

Visual:

* Roll rotates more noticeably.
* Perforation lines pass over the tangent point.
* Outer radius visibly decreases.
* Cardboard core becomes slightly more exposed.

Content:

**Unexpected colour. Serious quality.**

Purpose:

Build brand character without becoming cartoonish.

---

### State 4 — Everyday purchase

Scroll progress:

```text
52–72%
```

Visual:

* Roll approaches approximately half-full.
* Loose sheet extends toward the lower part of the viewport.
* Product pack moves out or becomes secondary.
* Camera may gently move closer.

Content:

> An everyday product can carry something further.

Purpose:

Begin the transition from product to mission.

---

### State 5 — Contribution

Scroll progress:

```text
72–86%
```

Visual:

* Roll approaches the cardboard core.
* Rotation slows.
* Loose sheet becomes the main visual object.
* Pink paper begins flattening toward the screen plane.

Content:

* Exact contribution mechanism.
* Partner organisation.
* Reporting period.

Use placeholders until verified:

```text
[CONTRIBUTION_AMOUNT]
[PARTNER_NAME]
[REPORTING_PERIOD]
```

Purpose:

Make the relationship between purchase and impact explicit.

---

### State 6 — 3D-to-page transition

Scroll progress:

```text
86–100%
```

Visual:

* Loose sheet approaches the camera.
* It fills part of the viewport.
* A matching HTML paper layer appears in the same position.
* The 3D sheet fades out.
* The HTML sheet continues into the impact section.

Content:

**Your pack has a paper trail.**

Purpose:

Transform the product animation into the website’s wider visual system.

---

# 7. Motion character

The movement should be playful but not cartoon-character animation.

## Suitable motion

* Gentle anticipation before rotation.
* Soft acceleration.
* Subtle bounce when a perforation passes the roll edge.
* Slight settling motion at important states.
* Smooth reversible scroll scrubbing.
* Mild paper flutter near the loose end.

## Unsuitable motion

* The roll jumping.
* Eyes or a face.
* Elastic squash-and-stretch across the whole roll.
* Extreme spinning.
* Confetti.
* Cartoon sound effects.
* Roll chasing the cursor.
* Constant floating after the hero.
* Comedic animation inside sensitive impact sections.

Stylize the timing, not the basic product physics.

---

# 8. Physical animation logic

The animation must separate three physical behaviours:

1. The cardboard core remains constant.
2. The wrapped paper radius decreases.
3. The loose-sheet length increases.

Do not uniformly scale the complete model.

## Roll radius

The visible paper remaining around the cardboard core is related to cross-sectional area rather than radius alone.

Use the following relationship as a visual guide:

```text
R(p) = √[r² + (1 − p)(R₀² − r²)]
```

Where:

```text
p  = normalized scroll or animation progress
r  = cardboard-core radius
R₀ = full-roll outer radius
R  = current outer radius
```

This produces a more convincing visual reduction than decreasing the radius linearly.

The formula does not have to run live in the browser. The resulting curve can be baked into the Blender animation.

## Rotation

Do not simulate every real rotation of a complete toilet roll.

Recommended visible rotation across the sequence:

```text
6–10 complete turns
```

This is enough to communicate unrolling without creating distracting motion blur.

## Loose-sheet length

Recommended approaches, in order:

1. Morph-target animation.
2. Baked curve deformation.
3. Masked reveal of a pre-existing strip.
4. Simple vertical scaling for an early prototype only.

For production, avoid scaling the strip because that stretches the paper texture and changes perforation spacing.

---

# 9. Required model hierarchy

Recommended Blender hierarchy:

```text
ROOSA_Toilet_Roll
├── Roll_Rotation_Empty
│   ├── Cardboard_Core
│   └── Wrapped_Paper
├── Loose_Sheet
├── Loose_Edge
├── Product_Pack
├── Ground_Shadow
└── Optional_Heart_Emboss
```

## Roll rotation parent

`Roll_Rotation_Empty` controls:

* Cardboard-core rotation.
* Wrapped-paper rotation.

The loose sheet should not be fully parented to this rotating object because it must remain visually hanging from the tangent point.

## Cardboard core

Separate mesh.

## Wrapped paper

Separate mesh with shrinking morph target.

## Loose sheet

Separate subdivided strip with length and shape deformation.

## Product pack

Optional separate object.

It should be removable on mobile without affecting the roll.

---

# 10. Recommended Blender implementation

## Wrapped-paper reduction

Use shape keys or morph targets.

Required states:

```text
Basis:       full roll
NearlyEmpty: thin paper layer around core
```

The `NearlyEmpty` shape should:

* Move exterior paper vertices radially inward.
* Preserve the roll width.
* Preserve the centre position.
* Preserve the cardboard-core size.
* Avoid collapsing the paper into the core.

Blender can export shape keys as glTF morph targets.

## Loose sheet

Use one of the following:

### Preferred approach

Create several loose-sheet morph states:

```text
Sheet_Short
Sheet_Medium
Sheet_Long
Sheet_Transition
```

Blend between them during the animation.

### Alternative

Use a curve modifier in Blender and bake the resulting deformation before export.

## Perforations

Prefer:

* Texture.
* Normal map.
* Alpha-safe material detail.
* Shallow baked geometry where necessary.

Do not create deep cuts across the sheet because they can cause shading and export problems.

## Heart embossing

Use:

* Baked normal map.
* Very shallow displacement.
* One repeated heart pattern.

Avoid modelling many high-polygon hearts.

## Keyframe interpolation

Use mostly linear interpolation for the animation exported to Spline.

Scroll scrubbing should determine the timing. Excessive easing inside the baked animation can make reverse scrolling feel inconsistent.

---

# 11. Recommended production pipeline

## Preferred pipeline

```text
Base asset or custom mesh
        ↓
Blender modification
        ↓
Shape keys and baked animation
        ↓
Optimized GLB export
        ↓
Spline import and scene styling
        ↓
Webflow embed
        ↓
Webflow Interactions with GSAP
        ↓
Scroll-controlled animation
```

Spline supports importing GLB/GLTF and animated objects produced in software such as Blender.

Spline also supports imported morph targets, allowing morph-target states created in Blender to be manipulated after GLB/GLTF import.

Webflow’s GSAP-powered interaction system can animate Spline scenes directly in its timelines, including material opacity. This makes the proposed Spline-to-Webflow transition technically feasible without requiring a completely custom WebGL implementation.

Webflow also supports breakpoint-specific interactions, reduced-motion preferences and page-scoped interaction loading.

---

# 12. Spline scene setup

## Import

Import the optimized GLB into Spline.

Recommended object names:

```text
roll_rotation
wrapped_paper
cardboard_core
loose_sheet
loose_edge
product_pack
ground_shadow
```

## Scene configuration

Create:

* Warm off-white background.
* Soft lighting.
* Matte materials.
* One ground shadow.
* Desktop camera.
* Tablet camera.
* Mobile camera.

## Material targets

Where useful, expose:

* Pink-paper colour.
* Paper roughness.
* Loose-sheet opacity.
* Pack opacity.
* Shadow opacity.

Webflow’s Spline action supports animating Spline properties within GSAP timelines, including material opacity.

## Responsive states

### Desktop

* Complete model.
* Six to ten visible rotations.
* Longer loose sheet.
* Optional camera movement.
* Product pack visible.

### Tablet

* Reduced camera movement.
* Smaller product pack.
* Shorter sticky duration.
* Simplified shadow.

### Mobile

* Reduced model complexity.
* Three or four visual roll states.
* Fewer rotations.
* Shorter sheet.
* Earlier handoff to HTML.
* Optional static or video fallback.

---

# 13. Webflow implementation

## Suggested structure

```html
<section class="roll-story" data-roosa="roll-story">
  <div class="roll-story__sticky">
    <div class="roll-story__fallback">
      <!-- Static AVIF/WebP product render -->
    </div>

    <div class="roll-story__spline" data-roosa="spline-scene">
      <!-- Spline scene -->
    </div>

    <div class="roll-story__copy">
      <article data-roosa-step="intro"></article>
      <article data-roosa-step="quality"></article>
      <article data-roosa-step="product"></article>
      <article data-roosa-step="impact"></article>
    </div>

    <div class="paper-handoff" data-roosa="paper-handoff"></div>
  </div>
</section>
```

## Suggested starting CSS

```css
.roll-story {
  position: relative;
  min-height: 280vh;
}

.roll-story__sticky {
  position: sticky;
  top: 0;
  height: 100svh;
  overflow: hidden;
}

.roll-story__fallback,
.roll-story__spline {
  position: absolute;
  inset: 0;
}

.roll-story__copy {
  position: relative;
  z-index: 2;
  height: 100%;
  pointer-events: none;
}

.roll-story__copy a,
.roll-story__copy button {
  pointer-events: auto;
}

.paper-handoff {
  position: absolute;
  z-index: 3;
  opacity: 0;
}
```

## Required behaviour

* Headline and CTAs load before the 3D scene.
* Static product image is visible initially.
* Spline replaces or covers the static image only after loading.
* If the Spline scene fails, the static image remains.
* Scroll is never trapped.
* Buttons remain clickable.
* Content exists as normal HTML.

---

# 14. 3D-to-HTML handoff

The 3D paper should not continue through the entire website.

At approximately 85–90% animation progress:

1. Position the loose 3D sheet close to the camera.
2. Match it with a flat HTML paper shape.
3. Crossfade from the 3D object to the HTML element.
4. Continue the HTML element into the impact section.
5. Disable or remove the 3D scene after it is no longer visible.

Match:

* Pink colour.
* Sheet width.
* Position.
* Rotation.
* Perforation pattern.
* Edge shape.

Suggested transition:

```text
Spline loose-sheet opacity: 100% → 0%
HTML paper opacity:           0% → 100%
```

This approach improves performance and makes the paper trail easier to reuse throughout the remainder of the website.

---

# 15. Performance budget

Recommended targets:

```text
Hero package ideal:        below 3 MB
Hero package acceptable:   3–5 MB
Hero package risky:        above 6 MB

Desktop geometry:          25k–60k triangles
Mobile geometry:           10k–25k triangles
Texture size:              1K–2K per essential map
Fallback image:            AVIF or WebP
```

The exact limits depend on the final scene and loading strategy, but the guiding principle is that the 3D animation must not delay the headline, CTA or purchase journey.

## Optimization rules

* Remove invisible faces.
* Merge static meshes where useful.
* Keep separately animated objects separate.
* Compress textures.
* Use normal maps instead of detailed geometry.
* Avoid large environment maps.
* Avoid transparent materials where possible.
* Limit dynamic lights.
* Do not model individual paper fibres.
* Create a mobile-specific scene.
* Load the 3D scene after critical HTML.

---

# 16. Accessibility and fallback

## Reduced motion

When the visitor prefers reduced motion:

* Remove extended sticky scrolling.
* Show a static full roll.
* Optionally fade to one smaller-roll state.
* Do not rotate continuously.
* Do not use camera movement.
* Keep the same copy and CTAs.
* Continue to the impact section through normal page flow.

Webflow’s current GSAP interaction tooling supports respecting reduced-motion settings and configuring interactions by breakpoint.

## Static fallback

Provide:

* Desktop static render.
* Mobile static render.
* Meaningful HTML product description.
* Normal purchase CTA.
* No dependency on WebGL for product comprehension.

## Semantic treatment

The 3D scene should normally be treated as decorative:

```html
aria-hidden="true"
```

All essential product and impact information must exist in HTML.

---

# 17. Asset options

A downloaded model should be treated as a starting mesh, not the finished ROOSA asset.

Every option still requires:

* Pink material.
* Separate cardboard core.
* Separate loose sheet.
* Shrinking morph target.
* ROOSA heart embossing.
* Optimization.
* Licence verification.
* Custom animation.

## Option A — CC0-named Sketchfab model

Asset:

**CC0 — Toilet Paper Roll by plaggy**

Technical properties listed on the asset page include:

* 456 triangles.
* 228 vertices.
* PBR textures.
* UV mapping.
* glTF and other formats.
* 4096-pixel textures.
* Baked normal map.

This is the strongest technical starting point because it is lightweight and textured.

### Important licence warning

The same asset page contains inconsistent licence information: its description references a CC0 public-domain dedication, while a separate licence field displays Creative Commons Attribution. Verify the actual licence shown during download and preserve a screenshot or licence file before using it commercially.

### Required changes

* Downscale textures.
* Separate core and paper if necessary.
* Add loose-sheet geometry.
* Create morph targets.
* Replace white material with ROOSA pink.
* Create custom perforation and embossing.

---

## Option B — Simple Toilet Paper 2.0

Asset:

**Simple Toilet Paper 2.0 by Blender3D**

The asset page lists:

* Approximately 1,500 triangles.
* 776 vertices.
* Creative Commons Attribution licence.
* Free download.

This may be useful when a slightly more detailed starting shape is preferred.

### Required changes

* Confirm mesh separation.
* Create UV and material treatment as needed.
* Add morph targets.
* Add loose sheet.
* Add cardboard material.
* Add ROOSA styling.
* Provide attribution according to the licence.

---

## Option C — Minimal low-poly model

Asset:

**Toilet Paper Roll by clon6767**

The asset page lists:

* 356 triangles.
* 177 vertices.
* Creative Commons Attribution licence.
* Free download.

This is a good option for:

* Mobile prototype.
* Fast proof of concept.
* Simplified stylized model.
* Very small download size.

It will require more custom texturing and detail work.

---

## Option D — Commercial separated-parts model

A CGTrader low-poly toilet-paper model currently lists:

* Separate parts.
* UV unwrapping.
* Texturing.
* 1024-pixel textures.
* Blender, OBJ and FBX formats.
* Royalty-free licence.

A paid asset with separated parts may reduce preparation work, but the licence and file contents must be checked before purchase.

### Selection requirements

Before buying, confirm:

* Cardboard core is separate.
* Loose sheet is separate.
* Source Blender file is included.
* Commercial website use is permitted.
* Modification is permitted.
* Redistribution is prohibited or clearly understood.
* Polygon count is suitable.
* UVs are clean.
* No required renderer-specific material is embedded.

---

## Wider marketplace search

Sketchfab maintains downloadable toilet-paper and toilet-roll model collections, while CGTrader provides free and commercial models with low-poly and format filters.

Useful search terms:

```text
toilet paper roll low poly
toilet paper roll loose sheet
animated toilet paper roll
paper roll GLB
toilet roll PBR
unrolling paper 3D model
stylized toilet paper roll
```

---

# 18. Asset-selection checklist

The selected model should ideally include:

* Separate cardboard core.
* Separate wrapped paper.
* Separate loose sheet.
* Clean cylindrical topology.
* Clean UV mapping.
* Commercially usable licence.
* Permission to modify.
* Blender, FBX, GLB or GLTF format.
* Fewer than approximately 50,000 triangles.
* PBR-compatible material.
* No bathroom environment attached.
* No excessive fibre geometry.
* No baked background.
* No inaccessible proprietary renderer dependency.

Reject an asset when:

* The core and paper cannot be separated.
* The loose sheet exists only as a texture.
* The licence is unclear.
* The mesh contains unnecessary hundreds of thousands of polygons.
* The source file cannot be edited.
* The model cannot be exported cleanly to GLB.
* The paper shape collapses when modified.

---

# 19. Prototype phases

## Prototype 1 — Mechanics

Build only:

* Cardboard core.
* Wrapped paper.
* Loose sheet.
* Pink material.
* Scroll-controlled rotation.
* Shrinking outer radius.
* Increasing sheet length.

Do not include:

* Product pack.
* Final texture.
* Embossing.
* Marketing copy.
* Complex camera movement.

### Success criteria

* Core remains constant.
* Wrapped paper decreases convincingly.
* Loose sheet remains attached.
* Reverse scrolling works.
* No mesh tearing.
* No severe texture stretching.
* Mobile frame rate remains usable.
* Static fallback remains visible before load.

---

## Prototype 2 — Visual direction

Add:

* Final stylized material.
* Soft studio lighting.
* Perforations.
* Heart embossing.
* Product pack.
* One headline.
* One CTA.

### Success criteria

* Roll feels soft rather than plastic.
* Pink matches the brand system.
* Product is immediately recognizable.
* Animation does not obscure copy.
* Scene package remains within the agreed budget.

---

## Prototype 3 — Page transition

Add:

* 3D-to-HTML sheet handoff.
* Product-quality messages.
* Impact transition.
* Reduced-motion state.
* Mobile-specific version.

### Success criteria

* The 3D sheet and HTML sheet appear continuous.
* No visible jump during handoff.
* The impact section remains calm and readable.
* 3D is unloaded or deactivated after use where practical.

---

# 20. Definition of done

The toilet-roll interaction is complete when:

* The model has separate core, wrapped paper and loose sheet.
* The core does not shrink.
* The wrapped paper radius decreases.
* The loose sheet becomes longer.
* Scroll direction controls the animation in both directions.
* Product copy is readable throughout.
* CTA is available immediately.
* Desktop implementation is complete.
* Tablet implementation is complete.
* Mobile implementation is complete.
* Reduced-motion implementation is complete.
* Static fallback is complete.
* 3D-to-HTML handoff works.
* Performance budget is met.
* No critical console errors occur.
* Asset licence is documented.
* Source model and modified files are stored.
* Product and impact facts are not fabricated.

---

# 21. Deliverables

The 3D designer or Codex agent should provide:

```text
/source
  roosa-toilet-roll.blend
  source-asset-license.pdf-or-screenshot
  source-asset-reference.txt

/export
  roosa-toilet-roll-desktop.glb
  roosa-toilet-roll-mobile.glb

/textures
  paper-basecolor.webp
  paper-normal.webp
  paper-roughness.webp
  cardboard-basecolor.webp
  cardboard-normal.webp

/fallback
  hero-roll-desktop.avif
  hero-roll-mobile.avif

/spline
  spline-scene-reference.txt

/webflow
  component-structure.md
  interaction-setup.md
  reduced-motion.md
  fallback-behaviour.md

/qa
  performance-results.md
  browser-test-results.md
  known-issues.md
```

---

# 22. Codex-agent prompt

> Create a proof-of-concept for a scroll-controlled, stylized-realistic pink toilet-paper roll for the ROOSA Webflow website.
>
> The animation must contain separate cardboard-core, wrapped-paper and loose-sheet objects. The cardboard core must remain constant in size. As normalized scroll progress moves from zero to one, the wrapped paper’s outer radius must decrease, the roll must rotate, and the loose sheet must become longer.
>
> Do not implement the reduction by uniformly scaling the entire model.
>
> Art direction:
>
> * Believable product form.
> * Stylized matte pink material.
> * Warm cardboard core.
> * Soft studio lighting.
> * Slightly exaggerated paper thickness and perforations.
> * Optional shallow heart embossing.
> * No eyes, face, limbs or mascot behaviour.
> * No literal bathroom environment.
>
> Preferred workflow:
>
> 1. Select or create a lightweight source model.
> 2. Preserve the asset licence.
> 3. Modify the model in Blender.
> 4. Create a shrinking wrapped-paper morph target.
> 5. Create expanding loose-sheet morph states or a baked deformation.
> 6. Animate six to ten visible roll rotations.
> 7. Export optimized desktop and mobile GLB files.
> 8. Import the desktop model into Spline.
> 9. Connect the scene to a Webflow GSAP scroll timeline.
> 10. Crossfade the 3D loose sheet into a matching HTML paper element near the end.
> 11. Provide reduced-motion and static fallbacks.
>
> Use the following visual radius relationship:
>
> `R(p) = sqrt(r² + (1 − p)(R₀² − r²))`
>
> Do not invent product specifications, prices, certifications, partner names, contribution values or legal claims.
>
> Begin with a mechanics-only prototype before applying final materials or building the full homepage.
>
> Deliver the source Blender file, optimized GLB exports, texture files, Spline scene reference, Webflow component instructions, fallback images, licence record, performance results and browser QA notes.

---

# 23. Source register

## Webflow

* Webflow Interactions with GSAP can directly animate Spline scenes and material opacity.
* Webflow supports interaction breakpoints, reduced-motion preferences and page scoping.

## Spline

* Spline supports GLB/GLTF imports.
* Spline supports animated GLB/GLTF and FBX assets made in third-party 3D software.
* Spline supports imported morph targets created in tools such as Blender.

## Blender

* Blender’s glTF export supports shape keys as morph targets.

## Starting 3D assets

* CC0-named toilet-paper model by plaggy, with lightweight geometry and PBR textures; licence discrepancy must be checked.
* Simple Toilet Paper 2.0, downloadable under Creative Commons Attribution.
* Lightweight Toilet Paper Roll by clon6767, downloadable under Creative Commons Attribution.
* Commercial low-poly separated-parts model on CGTrader.
