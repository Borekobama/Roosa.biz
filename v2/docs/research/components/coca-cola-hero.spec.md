# CocaColaHeroMotion specification

## Overview
- Target: the existing GiveWell hero visual container.
- Source: Coca-Cola 3D concept homepage capture.
- Interaction model: scroll-driven product image transform.

## Source facts
- Total source narrative height: 8000px.
- Hero section: 1000px, relative positioning, visible overflow.
- Product vector image: absolute positioning.
- Source uses Webflow transforms and Lenis smooth scrolling.

## ROOSA adaptation
- Use the ROOSA pack and pink roll as layered absolute product assets.
- Immediate static frame shows both product type and pink paper.
- On scroll through the GiveWell hero: roll rotates 20–40 degrees, pack translates
  modestly, and one paper strip extends into the mission divider.
- No audio, canvas dependency, or site-wide 3D.
- Animation failure leaves the static composition visible.
- Reduced motion and mobile use a static/lightweight frame.

