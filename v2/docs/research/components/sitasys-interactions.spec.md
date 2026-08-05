# SitasysInteractionLayer specification

## Overview
- Target: selected headings, product images, and section transitions only.
- Source: Sitasys Interactions capture and Webflow interaction export.
- Interaction model: scroll entry + hover.

## Allowed behaviors
- Text masks on major headings.
- Image clipping on product/brand media.
- Paper-shaped SVG/CSS masks and perforated section transitions.
- Restrained layered movement on product media.
- Product hover opacity/clip transition.

## Constraints
- Do not change GiveWell section geometry.
- Do not add continuous cursor effects, scroll hijacking, heading animation on
  every section, excessive parallax, or long page transitions.
- Paragraphs remain stable and readable.
- Each reveal resolves to an ordinary accessible final state.
- Disable or greatly reduce all movement under `prefers-reduced-motion`.

