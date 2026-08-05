# GiveWell behavior contract

All behavior below is copied from the source page. The implementation currently serves the same scripts rather than approximating them.

## Webflow interactions

- The empowerment tabs advance automatically every 4,000 ms.
- Clicking a tab restarts the auto-cycle from that tab.
- Auto-cycling pauses while the mobile navigation is open.
- Webflow controls the responsive navigation, tab selection, form states, and standard component accessibility attributes.

## GSAP plugins

The source registers `ScrollTrigger`, `SplitText`, `InertiaPlugin`, `Draggable`, and `ScrambleTextPlugin` against GSAP 3.15.0.

## Entrance and text reveals

- Hero visual starts at scale `1.05` and opacity `0`, then reaches scale `1` and opacity `1` over 4 seconds with `power4.out`.
- Hero title is split into characters and revealed from opacity `0` to `1` over a total duration of 1 second with randomized character staggering.
- Elements marked `animation-container="text-fade-in"` split into characters and progress from opacity `0.1` to `1` as they move from `top 90%` to `top 20%`; each runs once.

## Vision sequence

- Marquee translates horizontally from `-8vw` on desktop and `-16vw` on mobile while the vision section crosses the viewport; scrub value is `0.3`.
- The vision bottom composition pins from `top top` until `bottom 60%`, with scrub value `0.5`.
- The large center image begins at `36vw × 80vh` on desktop and `50vw × 60vh` on mobile, expands to `100vw × 100vh`, loses its border radius, and translates left by `32vw` or `25vw` respectively.
- Left and right image groups translate outward by `32vw` on desktop and `25vw` on mobile.
- Overlay copy is split into characters and toggles play/reverse around the source's `center 48%` trigger, using a 1.5 second randomized reveal.

## Statistics

- Statistic values trigger at `top 80%`, run once, and scramble toward their final values over 2 seconds.
- Scramble characters are `0123456789`, with a reveal delay of `0.3` and `power2.out` easing.

## Draggable footer CTA

- Each hand starts at opacity `0`, scale `0.9`, and a random rotation between `-20` and `20` degrees.
- Hands enter at `top 80%`, staggered by `0.2` seconds per item, over 1 second with `back.out(1.7)`.
- After entry, each hand is draggable within `#container-draggable` on both axes.
- Dragging uses inertia, edge resistance `0.65`, and no automatic z-index boost.

