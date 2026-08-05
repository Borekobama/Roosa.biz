# EditorialPages specification

## Overview

- Targets: about, B2B, journal, support, contact, careers and legal routes.
- Interaction model: mostly static; accordion and form controls are click-driven.

## Exact implementation values

- Page hero padding: clamp(120px, 16vw, 220px) top; 72px bottom.
- Editorial measure: 760px.
- Heading: clamp(52px, 8vw, 112px), line-height .9.
- Forms: 52px controls, visible labels, 1px graphite border, pink focus state.
- Legal pages: 72ch maximum line length.

## Responsive behavior

- Split layouts collapse below 768px.
- Form fields remain single column below 640px.

## Content rules

- Legal copy remains explicitly marked for legal review.
- B2B and contact submissions are demo-only until an approved form endpoint is configured.
