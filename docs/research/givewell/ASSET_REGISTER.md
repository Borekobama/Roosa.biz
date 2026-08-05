# GiveWell asset register

The exact machine-readable URL mapping is in `public/givewell/assets/manifest.json`.

## Runtime

- Source Webflow shared stylesheet.
- Three Webflow JavaScript runtime chunks.
- jQuery 3.5.1 from Webflow's CloudFront distribution.
- GSAP 3.15.0.
- ScrollTrigger, SplitText, InertiaPlugin, Draggable, and ScrambleTextPlugin.
- Phosphor Icons regular web stylesheet.

## Typography

- Inter variable font, optical size and weight axes: `6802eb69f5be53c035b06487_Inter-VariableFont_opsz,wght.ttf`.

## Principal media

- Hero landscape AVIF.
- Four large gradient texture AVIFs used by the empowerment tabs.
- Seven vision-sequence photographs/AVIFs, including responsive 500/800/1080 px variants where supplied by Webflow.
- Two statistic images and texture layers.
- Three inline team word-image sources.
- Grain AVIF and light-noise PNG overlays.
- Footer title SVG.
- Open Graph image and favicon files.

## Local structure

- CSS: `public/givewell/assets/css/`
- Webflow JavaScript: `public/givewell/assets/js/`
- Fonts, images, textures, SVG, and GSAP files: `public/givewell/assets/media/`
- URL map: `public/givewell/assets/manifest.json`

The mirror keeps filenames and bytes intact. The served document retains the original URLs so integrity attributes and runtime behavior remain identical during fidelity verification; the local copies are the archival/offline asset set. The untouched HTML is stored as `public/givewell/source.html`; the served `index.html` adds only a rule that hides the localhost-only Webflow badge.
