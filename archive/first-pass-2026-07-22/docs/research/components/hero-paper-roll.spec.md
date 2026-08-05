# HeroPaperRoll specification

## Overview

- Target file: `src/components/HeroPaperRoll.tsx`.
- Interaction model: scroll-driven progressive enhancement.

## DOM structure

Hero copy and actions remain normal HTML. Decorative product stage contains pack image, CSS roll, core, loose sheet and perforated handoff.

## Exact implementation values

- Desktop minimum height: 160svh; sticky frame: 100svh.
- Content max width: 1360px; copy width: 620px.
- H1: clamp(60px, 9vw, 136px), line-height .86, letter-spacing -.065em.
- Roll: clamp(260px, 36vw, 560px); pink matte radial gradient; core 31% of diameter.
- Rotation: 0 to 7 turns; visual paper radius reduces to 72% without scaling the core.
- Tail: 80px to 52svh; 18px repeating perforations.

## Behavior

- Scroll progress maps only to CSS variables and uses no scroll hijacking.
- Static product pack appears immediately.
- Reduced motion and viewports below 768px use a compact static state.

## Text

- “Soft on skin. Strong for children.”
- “Pink toilet paper with a transparent path from purchase to documented impact.”
- CTAs: Buy ROOSA / See the impact.
