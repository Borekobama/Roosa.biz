# Animation specification

## Principle

Motion is derived from rolling, unrolling, folding, perforating, wrapping or embossing paper. It communicates progression or state and never blocks navigation or purchasing.

## Hero prototype

- Server-rendered pack fallback plus CSS roll/core/sheet.
- Desktop scroll progress controls visible rotation, paper radius and tail length.
- Cardboard core remains constant; the prototype does not uniformly scale the complete model.
- Mobile and reduced-motion modes use a compact static composition.
- CTA elements remain ordinary HTML above the decorative stage.

## Production 3D handoff

Replace the decorative stage with the approved GLB/Spline scene only after licensing and performance review. Target 3–5 MB maximum, a static AVIF/WebP fallback, mobile-specific scene and 3D-to-HTML paper crossfade near 86–100% progress.

## Cleanup

All observers and scroll listeners must be removed on unmount. No nested pinned sections or scroll hijacking are permitted.
