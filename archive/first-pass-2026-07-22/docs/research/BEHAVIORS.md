# Behavior specification

## Mandatory interaction sweep findings

### Current ROOSA site

- Conventional sticky desktop navigation and carousel-based content/product lists.
- Primary commerce and editorial hierarchy is visually weak; the redesign promotes product and purchase state above news.
- Existing site uses Jost and ROOSA pink near `rgb(241, 135, 182)`.

### GiveWell reference

- Editorial rhythm uses large display headings (desktop examples: 52/65px and 179.2/134.4px) with calm off-white `rgb(252,251,250)` and deep teal `rgb(21,58,67)`.
- Section changes are communicated through scale, contrast and controlled scroll reveals rather than constant motion.

### Soma reference

- Commerce cards use tall 4:5 media, sparse metadata and restrained image swaps.
- Desktop title examples use 54/60px and 32/40px, with product/editorial modules sharing a common rhythm.

### Motion references

- Coca-Cola confines the signature product scene to the hero and uses a static HTML content layer.
- Sitasys uses masked text and image clipping; ROOSA adopts the technique only for the hero, brand statement and final CTA.

## Implemented behavior contract

### Header

- Trigger: `window.scrollY > 24`.
- Initial: transparent/minimal.
- Scrolled: paper-white backdrop, 1px border and soft shadow; 240ms ease.
- Mobile menu: click-driven dialog sheet, Escape closes, background locks, focus returns to trigger.

### Hero paper roll

- Interaction model: scroll-driven on desktop with requestAnimationFrame-throttled progress.
- Progress changes CSS custom properties controlling roll rotation, outer visual scale and paper-tail length.
- Mobile: shorter non-pinned composition with no camera movement.
- Reduced motion: static roll and short sheet; no scroll-linked transform.

### Product cards

- Hover-capable pointer: media rotates 2deg and alternate image crossfades over 320ms.
- Touch/reduced motion: no hover-dependent information.

### Cart

- Opens after a successful local add operation or header trigger.
- Background scroll locks; dialog traps focus; Escape/overlay/close button dismisses; focus restores.
- When Shopify is unconfigured, checkout is disabled with a clear configuration message.

### Metrics

- Placeholder values never count up.
- Verified numeric values may animate once when intersecting; reduced motion shows final state immediately.

### Paper masks

- IntersectionObserver adds the revealed state once.
- Motion is opacity-only for reduced-motion users.
