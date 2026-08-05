# QA checklist

## Automated

- [ ] ESLint passes.
- [ ] TypeScript passes with no emit.
- [ ] Production build passes.
- [ ] No browser console errors on critical routes.
- [ ] All internal links resolve.

## Interaction

- [ ] Header scroll state.
- [ ] Mobile menu open, Escape, focus restore and scroll lock.
- [ ] Cart open, quantity, remove, Escape, focus trap and focus restore.
- [ ] Product quantity floor and transparent unknown-stock state.
- [ ] Forms show demo/configuration state without transmitting data.

## Viewports and modes

- [ ] 1440px, 992px, 768px, 390px.
- [ ] Keyboard only and 200% zoom.
- [ ] Reduced motion.
- [ ] Mobile Safari and Chrome; desktop Chrome, Safari, Firefox and Edge.
- [ ] JavaScript failure: critical copy and links remain available.

## Claims and data

- [ ] Every impact metric has period and source.
- [ ] No unapproved certification/price/stock/partner claim.
- [ ] Legal content approved.
- [ ] Child-safeguarding and image permissions reviewed.
