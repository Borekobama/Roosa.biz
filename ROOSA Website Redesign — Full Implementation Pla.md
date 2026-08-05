# ROOSA Website Redesign — Full Implementation Plan

## 1. Project summary

### Project

Complete redesign and rebuild of the ROOSA website.

### Current website

`https://roosa.biz/`

### Primary objective

Transform ROOSA from a corporate information website into a modern, product-first social-impact brand experience that:

* Clearly explains the product.
* Makes purchasing easy.
* Presents the child-protection mission credibly.
* Establishes a distinctive visual identity.
* Uses premium, product-derived animation.
* Supports multiple languages and markets.
* Can scale to future products, projects and editorial content.

### Core design concept

**The Pink Paper Trail**

A pink sheet visually unrolls through the website and connects:

1. Product discovery.
2. Product quality.
3. Purchase.
4. Contribution.
5. Partner organisation.
6. Documented social result.

All major visual effects should derive from the physical behaviour of paper:

* Rolling.
* Unrolling.
* Folding.
* Tearing.
* Perforating.
* Wrapping.
* Embossing.
* Layering.

Do not add effects that have no relationship to the product or story.

---

# 2. Reference hierarchy

The following references serve different purposes.

## Overall structure and impact storytelling

### GSAP x GiveWell

Reference:

`https://webflow.com/templates/html/gsap-x-givewell-website-template`
`https://givewell.webflow.io`

Use for:

* Editorial page rhythm.
* Impact storytelling.
* Large typography.
* Alternating content sections.
* Project case studies.
* Strong calls to action.
* Controlled scroll-based motion.
* Reduced-motion implementation.

Do not reproduce its charity-specific visual styling.

ROOSA should remain product-led. The impact mission supports the product journey rather than replacing it.

---

## Store and product presentation

### Soma / CartGenie

Reference:

`https://webflow.com/made-in-webflow/website/cartgenie-template-soma`
`https://cartgenie-template-soma.webflow.io`

Use for:

* Product-card proportions.
* Product-detail layouts.
* Large product photography.
* Generous whitespace.
* Editorial commerce.
* Cart-drawer presentation.
* Journal and product-content relationships.

Do not inherit the earthy or wellness-focused style.

Replace it with:

* Saturated ROOSA pink.
* Stronger typography.
* Surreal product imagery.
* More assertive spacing.
* Product-derived shapes.

---

## Commerce architecture

### Bovist

Reference:

`https://webflow.com/made-in-webflow/website/bovist`
`https://bovist.webflow.io/`

Use for:

* Shopify or Smootify integration patterns.
* Cart behaviour.
* Product availability.
* Quantity controls.
* Discount handling.
* Product variant handling.
* Related products.
* Store data architecture.

Do not copy its catalogue complexity.

ROOSA should initially support a focused catalogue:

* Main toilet-paper pack.
* Multipack or family bundle.
* Subscription option, where operationally available.
* Limited campaign editions.
* B2B quantities.

---

## Signature product animation

### Coca-Cola 3D

Reference:

`https://webflow.com/made-in-webflow/website/coca-cola-3d-website`
`https://coca-cola-3d-website.webflow.io/`

Use for:

* One signature hero animation.
* Product-scale visual.
* Scroll-linked rotation.
* Pack reveal.
* Cylindrical product movement.
* High-impact opening moment.

Do not make the entire website a 3D experience.

The product must remain visible and understandable even when 3D fails or motion is disabled.

---

## Supporting interaction language

### Sitasys Interactions

Reference:

`https://webflow.com/made-in-webflow/website/sitasys-interactions`
`https://sitasys-interactions.webflow.io/`

Use for:

* Text masks.
* Image clipping.
* Section transitions.
* SVG masks.
* Paper-shaped reveals.
* Layered movement.
* Restrained kinetic typography.
* Product hover states.

Avoid:

* Excessive parallax.
* Constant cursor effects.
* Scroll hijacking.
* Motion on every heading.
* Long page transitions.

---

# 3. Mandatory design principles

## Product first

A visitor must understand within approximately ten seconds:

* ROOSA is pink toilet paper.
* The product is positioned as high quality.
* Buying it supports child protection.
* The impact process is transparent.
* The product can be purchased immediately.

## Impact must be factual

Impact content must clearly show:

* What contribution is generated.
* Who receives it.
* When it is transferred.
* Which project uses it.
* What result is documented.

Never fabricate or infer impact figures.

When data is unavailable, display a clearly marked placeholder or omit the metric.

## Animation must communicate

Every animation must communicate at least one of:

* Hierarchy.
* Cause and effect.
* State change.
* Narrative progression.

Animation must not prevent access to content or purchasing.

## Commerce must remain simple

The store must feel premium but straightforward.

The user should not need to explore animations to:

* View a price.
* See specifications.
* Add a product to the cart.
* Change quantity.
* Find shipping information.
* Begin checkout.

## Mobile is a primary experience

The mobile version must not be treated as a reduced desktop design.

Avoid heavy 3D, large pinned sections and excessive scroll length on mobile.

---

# 4. Assumptions

The implementation may proceed using the following assumptions until the client provides final business details.

## Platform assumptions

* Webflow will control the marketing website and CMS.
* Shopify will control checkout, orders and inventory.
* Smootify or an equivalent connector may connect Shopify and Webflow.
* GSAP will control advanced interactions.
* Spline may be used for the hero product scene if performance is acceptable.
* Webflow Localization will manage supported languages.

## Content assumptions

* Product and impact content will initially contain placeholders where verified information has not been provided.
* English or German will be configured as the source locale.
* Existing legal text will be migrated but must be reviewed separately.
* Existing project/news content will be restructured rather than copied directly into one generic news collection.

## Catalogue assumptions

Initial catalogue:

1. Standard ROOSA pack.
2. Larger or bundled pack.
3. Optional subscription.
4. Optional B2B quantity.

Do not build complex filtering until there are enough products to justify it.

---

# 5. Blocking business decisions

The following data is required before the website can be considered production-ready.

## Product information

* Definitive product name.
* Rolls per pack.
* Sheets per roll.
* Ply count.
* Paper material.
* Product dimensions.
* Colouring or dye details.
* Manufacturing country.
* Packaging materials.
* Certification details.
* Dermatological test documentation.
* Retail price.
* Price per roll.
* Shipping regions.
* Return policy.
* Product variants.

## Impact information

* Exact contribution mechanism.
* Contribution amount or percentage.
* Whether the contribution is based on revenue, profit or packs.
* Transfer frequency.
* Recipient organisation.
* Partner responsibilities.
* Historical contribution figures.
* Supported projects.
* Reporting methodology.
* Available downloadable reports.
* Approved project photography.
* Child-safeguarding requirements.

## Commerce information

* Shopify store access.
* Existing SKUs.
* Inventory rules.
* Tax setup.
* Currency setup.
* Shipping setup.
* Subscription provider.
* Discount strategy.
* Checkout markets.
* Retailer handoff requirements.

## Brand information

* Current logo source files.
* Approved slogans.
* Existing brand guidelines.
* Approved photography.
* Founder biography.
* Company structure.
* Legal company names.
* Tone restrictions.
* Approved child-protection messaging.

The Codex agent must not invent these values.

Use explicit placeholders such as:

* `[CONTRIBUTION_AMOUNT]`
* `[PRODUCT_PRICE]`
* `[CERTIFICATE_URL]`
* `[PARTNER_NAME]`
* `[REPORTING_PERIOD]`

---

# 6. Recommended technical architecture

## Webflow responsibilities

Use Webflow for:

* Page layouts.
* Responsive components.
* Navigation.
* Brand system.
* CMS collections.
* Project case studies.
* Impact reporting.
* Editorial content.
* Localization.
* B2B pages.
* Campaign landing pages.
* GSAP interactions.
* SEO metadata.
* Analytics event hooks.

## Shopify responsibilities

Use Shopify for:

* Products.
* Product variants.
* Inventory.
* Prices.
* Discounts.
* Orders.
* Checkout.
* Customer accounts.
* Taxes.
* Shipping.
* Subscription integration.
* Market-specific commerce logic.

## Integration layer

Preferred order:

1. Smootify, if it supports all required functionality.
2. Shopify Storefront API with a custom integration.
3. Shopify Buy Button only as a temporary fallback.

Do not duplicate product prices manually inside Webflow if Shopify is the source of truth.

## Recommended domains

Preferred:

* `roosa.biz`
* `roosa.biz/shop`

Acceptable:

* `shop.roosa.biz`

Avoid redirecting visitors to an unrelated-looking external domain without preserving brand and analytics continuity.

## Source of truth

| Data                  | Source of truth                         |
| --------------------- | --------------------------------------- |
| Product title         | Shopify                                 |
| Product price         | Shopify                                 |
| Inventory             | Shopify                                 |
| Variant availability  | Shopify                                 |
| Product storytelling  | Webflow CMS                             |
| Product certification | Webflow CMS                             |
| Project data          | Webflow CMS                             |
| Impact totals         | Webflow CMS or verified external source |
| Orders                | Shopify                                 |
| Customer details      | Shopify                                 |
| Editorial content     | Webflow CMS                             |
| Localized page copy   | Webflow Localization                    |

---

# 7. Suggested code and repository architecture

If a supporting code repository is required, use the following structure:

```text
roosa-site/
├── README.md
├── docs/
│   ├── architecture.md
│   ├── cms-schema.md
│   ├── analytics-events.md
│   ├── animation-spec.md
│   ├── localization.md
│   └── qa-checklist.md
├── src/
│   ├── scripts/
│   │   ├── app.ts
│   │   ├── interactions/
│   │   │   ├── hero-paper-trail.ts
│   │   │   ├── text-reveals.ts
│   │   │   ├── section-transitions.ts
│   │   │   ├── product-hover.ts
│   │   │   └── impact-timeline.ts
│   │   ├── commerce/
│   │   │   ├── cart.ts
│   │   │   ├── product.ts
│   │   │   ├── quantity.ts
│   │   │   └── analytics.ts
│   │   ├── accessibility/
│   │   │   ├── reduced-motion.ts
│   │   │   ├── focus-management.ts
│   │   │   └── keyboard.ts
│   │   └── utils/
│   │       ├── breakpoints.ts
│   │       ├── dom.ts
│   │       └── cleanup.ts
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── global.css
│   │   ├── utilities.css
│   │   └── components/
│   └── types/
├── dist/
└── package.json
```

Use TypeScript for external scripts where possible.

The production site must fail gracefully when JavaScript does not load.

---

# 8. Webflow class system

Use a consistent naming convention.

Recommended:

* Client-First-style utilities and structures.
* Component classes using a readable BEM-like convention.
* Attribute selectors for JavaScript hooks.

Examples:

```text
page-wrapper
main-wrapper
container-large
section-hero
section-product
section-impact
product-card
product-card__media
product-card__content
impact-card
impact-card__metric
button
button--primary
button--secondary
```

Use data attributes for interactions:

```html
data-roosa="hero"
data-roosa="paper-roll"
data-roosa="paper-sheet"
data-roosa="product-card"
data-roosa="impact-counter"
data-roosa="cart-open"
data-roosa="cart-close"
```

Do not target autogenerated Webflow class names in JavaScript.

---

# 9. Design-token system

Create variables before page construction.

## Colour tokens

```text
--color-roosa-pink
--color-roosa-pink-light
--color-roosa-pink-dark
--color-graphite
--color-paper
--color-white
--color-muted
--color-border
--color-success
--color-warning
--color-error
```

Exact values must be finalized during visual design.

## Typography tokens

```text
--font-display
--font-body

--text-display-xl
--text-display-lg
--text-heading-xl
--text-heading-lg
--text-heading-md
--text-body-lg
--text-body
--text-small
--text-label
```

## Spacing tokens

Use a consistent fluid scale:

```text
--space-2xs
--space-xs
--space-sm
--space-md
--space-lg
--space-xl
--space-2xl
--space-3xl
```

## Shape tokens

```text
--radius-small
--radius-medium
--radius-large
--radius-pill
```

ROOSA should not rely excessively on generic rounded cards.

Use paper edges, circles and perforated borders where appropriate.

## Motion tokens

```text
--duration-fast: 160ms
--duration-medium: 320ms
--duration-slow: 700ms
--ease-standard
--ease-emphasized
```

Large narrative movement may exceed these values but should remain controlled.

---

# 10. Breakpoint strategy

Recommended ranges:

* Large desktop: 1440px and above.
* Desktop: 992px–1439px.
* Tablet: 768px–991px.
* Mobile landscape: 480px–767px.
* Mobile portrait: below 480px.

Do not rely only on device width for interaction behaviour.

Also account for:

* Pointer precision.
* Hover support.
* Reduced-motion preference.
* Device memory.
* Connection speed where detectable.

Disable or simplify complex animation on smaller devices.

---

# 11. Sitemap

## Primary pages

```text
/
├── /shop
├── /product
│   └── /product/[slug]
├── /impact
│   └── /impact/projects/[slug]
├── /about
├── /b2b
├── /journal
│   └── /journal/[slug]
├── /support
├── /contact
├── /careers
├── /privacy
├── /imprint
├── /shipping
├── /returns
└── /404
```

## Localized URL strategy

Examples:

```text
/en/
 /de/
 /fr/
```

Use one consistent localization strategy.

Do not combine locale folders with inconsistent query parameters.

---

# 12. Global navigation specification

## Desktop header

Elements:

* ROOSA logo.
* Shop.
* Product.
* Impact.
* About.
* B2B.
* Journal.
* Country/language selector.
* Cart icon with item count.
* Primary Buy ROOSA button.

Behaviour:

* Transparent or minimal over the hero.
* Converts to solid background after scrolling.
* Remains sticky.
* Avoid shrinking so much that navigation becomes difficult to use.

## Mobile header

Elements:

* Logo.
* Menu trigger.
* Cart trigger.

Mobile menu:

* Full-screen or large sheet.
* Clear Shop CTA.
* Locale selector.
* No complex animation.
* Keyboard accessible.
* Locks page scrolling while open.
* Restores focus after closing.

## Sticky mobile purchase bar

On product-focused pages, show:

* Product price.
* Buy or Add to Cart button.

Do not obscure legal notices, cookie controls or mobile browser controls.

---

# 13. Homepage implementation specification

## Section 1: Announcement bar

Content:

> Every pack supports child-protection work.

Optional:

* Link to impact explanation.
* Campaign message.
* Country-specific availability.

Acceptance criteria:

* Dismissible only when necessary.
* Accessible text contrast.
* Does not cause layout shift after page load.

---

## Section 2: Hero

### Content

Headline:

**Soft on skin. Strong for children.**

Supporting copy:

> Pink three-ply toilet paper with documented social impact.

Primary CTA:

**Buy ROOSA**

Secondary CTA:

**See the impact**

### Visual composition

* Large 3D or high-resolution render of a pink toilet roll.
* Product pack visible in the scene.
* Warm paper background.
* Minimal supporting elements.
* Product remains recognizable at every viewport.

### Hero animation sequence

1. Hero content renders immediately.
2. Product pack fades or slides into place.
3. Toilet roll rotates approximately 20–40 degrees.
4. Paper sheet begins to unroll.
5. The sheet extends toward the next section as the user scrolls.
6. The sheet edge transforms into a perforated divider.

### Technical requirements

* Do not block page rendering while loading the 3D scene.
* Provide a static fallback image.
* Lazy-load nonessential scene assets.
* Do not autoplay audio.
* Reduced-motion mode displays static product imagery.
* Mobile version uses a lighter animation or static render.
* Primary CTA must be clickable immediately.

### Acceptance criteria

* Largest Contentful Paint target: below 2.5 seconds on a typical 4G test.
* Product and headline visible before interaction scripts initialize.
* No horizontal overflow.
* No significant layout shift.
* Hero remains usable without JavaScript.

---

## Section 3: Product-proof strip

Show four claims:

* Three-ply softness.
* Dermatologically tested.
* FSC-certified.
* Supports child protection.

Each item contains:

* Small icon.
* Short title.
* Optional explanation.
* Link to proof or supporting document.

Do not show certifications without a valid source.

---

## Section 4: Main product module

### Layout

Desktop:

* Product gallery on the left.
* Product information and purchase controls on the right.

Mobile:

* Gallery first.
* Product title.
* Rating, when available.
* Price.
* Specifications.
* Purchase controls.
* Shipping message.

### Required content

* Product name.
* Product imagery.
* Price.
* Pack size.
* Roll count.
* Sheets per roll.
* Ply count.
* Certifications.
* Quantity controls.
* Stock status.
* Add to Cart.
* Buy Now, if supported.
* Shipping summary.
* Returns summary.
* Impact statement.

### Commerce behaviour

* Product data must load from Shopify.
* Add-to-cart operation must provide visible feedback.
* Quantity must never fall below one.
* Out-of-stock products disable purchase actions.
* Cart state persists between pages.
* Error messages must be visible and understandable.

---

## Section 5: Brand statement

Headline:

**Unexpected colour. Serious quality.**

Interaction:

* Headline reveals through a paper-shaped mask.
* Product macro photograph appears through a roll-core or perforated frame.

Constraints:

* Text must remain readable during and after the animation.
* Avoid animating the paragraph text.

---

## Section 6: How impact works

Three-step structure:

1. You buy ROOSA.
2. A defined contribution is allocated.
3. A verified partner project receives support.

Required data:

* Contribution explanation.
* Partner name.
* Reporting period.
* Link to methodology.

Visual:

* The pink paper trail connects all three steps.

Do not publish vague contribution wording when exact data exists.

---

## Section 7: Product options

Show only relevant options:

* Standard pack.
* Bundle.
* Subscription.
* B2B purchase.

Use Soma-inspired card proportions.

Use Bovist-inspired purchase controls.

Each card must include:

* Product image.
* Title.
* Price.
* Pack information.
* Purchase action.
* Stock status.

---

## Section 8: Impact metrics

Possible metrics:

* Total contributions.
* Projects supported.
* Partner organisations.
* Reporting period.

Implementation:

* Metrics come from CMS.
* Every metric includes a reporting period.
* Optional count-up animation runs only once.
* Reduced-motion mode shows the final number immediately.

Do not use continuously changing fake counters.

---

## Section 9: Featured project

Required content:

* Project name.
* Partner.
* Location.
* Contribution amount, where approved.
* Project objective.
* Status.
* Result.
* Date.
* Link to full project page.

Visual direction:

* Documentary photography.
* Calm layout.
* Minimal playful animation.
* No decorative animation around sensitive imagery.

---

## Section 10: Founder and origin

Content:

* Founder image.
* Short origin story.
* Why pink toilet paper.
* Why child protection.
* Link to About page.

Keep this concise on the homepage.

---

## Section 11: Retailer and trust section

Possible content:

* Retailer logos.
* Certifications.
* Reviews.
* Press references.
* B2B CTA.

Logos must not be displayed without permission.

---

## Section 12: Final purchase CTA

Visual:

* The paper trail returns to the product.
* Roll completes a subtle unrolling loop.
* Product pack becomes central again.

Copy:

> Make an everyday purchase count.

Actions:

* Buy ROOSA.
* Find a retailer.

---

## Section 13: Footer

Columns:

* Shop.
* Support.
* Impact.
* Company.
* Legal.
* Languages.

Include:

* Company legal name.
* Address.
* Contact.
* Privacy.
* Imprint.
* Current year.
* Social links.
* Locale selector.

---

# 14. Product-page specification

## Page sections

1. Product gallery.
2. Product summary.
3. Purchase controls.
4. Core product facts.
5. Material and manufacturing details.
6. Certification proof.
7. Impact contribution explanation.
8. Reviews.
9. FAQs.
10. Related products.
11. Shipping and returns.
12. Final purchase CTA.

## Gallery

Support:

* Product pack.
* Individual roll.
* Macro texture.
* Packaging.
* Lifestyle image.
* Optional short product video.

Requirements:

* Responsive images.
* Meaningful alt text.
* Keyboard-operable thumbnails.
* No mandatory swipe-only functionality.

## Product information

Include:

* Title.
* Subtitle.
* Price.
* Price per roll.
* Stock.
* Variant.
* Quantity.
* Add to Cart.
* Subscription selector, where supported.

## Subscription

When supported:

* Clearly show frequency.
* Show cancellation terms.
* Show discount.
* Do not preselect subscription without explicit user choice.

## Product facts

Display as a concise grid:

* Rolls.
* Sheets.
* Ply.
* Material.
* Production location.
* Certification.
* Packaging.
* Dermatological testing.

## Impact contribution

Explain exactly what the purchase supports.

Include a link to the full impact methodology.

---

# 15. Shop-page specification

## Initial version

Keep the store intentionally small.

Do not add filters unless the product range requires them.

Sections:

* Shop hero.
* Product grid.
* Subscription explanation.
* B2B block.
* Shipping summary.
* FAQ.

## Product cards

Each card includes:

* Image.
* Product name.
* Pack details.
* Price.
* Stock state.
* Add to Cart.
* View Product.

Hover effects should be subtle:

* Small product rotation.
* Alternate image.
* Slight paper lift.

No large 3D scene inside each card.

---

# 16. Cart-drawer specification

## Behaviour

* Opens after adding a product.
* Can be opened from the global header.
* Locks background scrolling.
* Traps focus while open.
* Closes using button, Escape key or overlay.
* Returns focus to the initiating element.

## Content

* Product image.
* Product title.
* Variant.
* Quantity controls.
* Price.
* Remove action.
* Subtotal.
* Shipping notice.
* Checkout CTA.
* Continue Shopping action.

## Error handling

Display clear errors for:

* Inventory change.
* Invalid quantity.
* Network error.
* Checkout initialization failure.

Never silently fail.

---

# 17. Impact-page specification

## Page objective

Create verifiable trust.

The impact page should feel more like a transparent report than a campaign landing page.

## Sections

1. Impact proposition.
2. Contribution mechanism.
3. Current reporting period.
4. Impact dashboard.
5. Project database.
6. Partner organisations.
7. Methodology.
8. Reports and downloads.
9. Governance or company relationship.
10. FAQ.

## Contribution diagram

Visually show:

```text
Customer purchase
    ↓
ROOSA contribution allocation
    ↓
Partner organisation
    ↓
Named project
    ↓
Documented outcome
```

Every step must include a short factual description.

## Dashboard requirements

Each metric must include:

* Value.
* Label.
* Reporting period.
* Source or supporting report.

## Project filtering

Only add filters when there are enough projects.

Possible filters:

* Year.
* Region.
* Partner.
* Project category.
* Status.

## Reports

Support:

* PDF report.
* Reporting year.
* Summary.
* File size.
* Publication date.

---

# 18. Impact project-page specification

Required fields:

* Project name.
* Partner.
* Location.
* Reporting period.
* Objective.
* ROOSA contribution.
* Total project funding, where relevant.
* Status.
* Activities.
* Outcome.
* Methodology.
* Approved photographs.
* Downloadable evidence.
* Related projects.

Safeguarding rules:

* Do not expose identities of children without documented consent.
* Avoid manipulative or sensational imagery.
* Do not include unnecessary personal data.
* Provide alt text that remains respectful and factual.

---

# 19. About-page specification

Sections:

1. Brand introduction.
2. Origin story.
3. Founder.
4. Why pink.
5. Why child protection.
6. Company structure.
7. Values.
8. Team.
9. Timeline.
10. CTA.

Company-structure module should clarify:

* Consumer brand.
* Operating company.
* Impact partner.
* Distribution partners.

---

# 20. B2B-page specification

Audience:

* Retailers.
* Offices.
* Hotels.
* Restaurants.
* Distributors.
* Corporate buyers.

Sections:

* B2B proposition.
* Available pack formats.
* Minimum quantities.
* Delivery regions.
* Retail presentation.
* Social-impact benefit.
* Partner logos.
* Enquiry form.

Form fields:

* Name.
* Company.
* Work email.
* Country.
* Business type.
* Estimated volume.
* Message.
* Consent checkbox.

Do not request unnecessary personal information.

---

# 21. Journal specification

Categories:

* Product.
* Impact.
* Partnerships.
* Company.
* Campaigns.

Article template:

* Title.
* Summary.
* Date.
* Author.
* Category.
* Hero media.
* Body.
* Related project.
* Related product.
* Share controls.
* Related articles.

Do not place impact project reporting only inside the Journal.

Projects require their own structured collection.

---

# 22. CMS schema

## Collection: Products

Fields:

* Name.
* Slug.
* Shopify product ID.
* Shopify handle.
* Short description.
* Long description.
* Pack size.
* Roll count.
* Sheets per roll.
* Ply count.
* Material.
* Manufacturing country.
* Packaging details.
* Certification references.
* Gallery.
* Hero image.
* Featured state.
* Related FAQs.
* Related journal articles.
* Related impact projects.
* Locale.

## Collection: Impact Projects

Fields:

* Name.
* Slug.
* Partner.
* Location.
* Latitude and longitude, where needed.
* Start date.
* End date.
* Reporting period.
* Contribution amount.
* Currency.
* Objective.
* Activities.
* Results.
* Status.
* Project category.
* Hero image.
* Gallery.
* Documents.
* Related journal posts.
* Featured state.
* Locale.

## Collection: Partners

Fields:

* Name.
* Slug.
* Logo.
* Website.
* Organisation type.
* Description.
* Role.
* Country.
* Verification details.
* Related projects.
* Locale.

## Collection: Impact Periods

Fields:

* Year or reporting period.
* Start date.
* End date.
* Total contribution.
* Currency.
* Projects supported.
* Partners supported.
* Methodology.
* Report file.
* Publication date.
* Featured state.
* Locale.

## Collection: Certifications

Fields:

* Name.
* Issuing body.
* Certificate number.
* Valid from.
* Valid until.
* Document.
* Verification URL.
* Related product.
* Locale.

## Collection: Retailers

Fields:

* Name.
* Country.
* Region.
* Type.
* Purchase URL.
* Physical address.
* Online state.
* Featured state.

## Collection: Journal

Fields:

* Title.
* Slug.
* Summary.
* Author.
* Publication date.
* Category.
* Hero media.
* Body.
* Related product.
* Related project.
* Featured state.
* Locale.

## Collection: FAQs

Fields:

* Question.
* Answer.
* Category.
* Related product.
* Sort order.
* Locale.

## Collection: Team

Fields:

* Name.
* Role.
* Biography.
* Photo.
* LinkedIn URL.
* Sort order.
* Locale.

---

# 23. Interaction implementation specification

## GSAP setup

Use GSAP only for interactions that cannot be handled cleanly with CSS.

Recommended plugins:

* ScrollTrigger.
* Flip, only where necessary.
* SplitText only when appropriately licensed.
* Observer only when justified.

Register plugins once.

Create one animation module per interaction.

Always provide cleanup methods for SPA-like page transitions or Webflow reinitialization.

## Reduced-motion handling

Detect:

```css
@media (prefers-reduced-motion: reduce)
```

And in JavaScript:

```ts
window.matchMedia("(prefers-reduced-motion: reduce)")
```

Reduced-motion behaviour:

* Remove scroll-linked rotation.
* Remove pinned scenes.
* Replace mask movement with opacity transition.
* Show final state immediately where practical.
* Keep cart and navigation feedback functional.

## Hero paper-trail logic

Pseudo-flow:

```text
initialize static hero
check reduced motion
check viewport size
check required DOM elements
load optional 3D scene
create GSAP timeline
connect timeline to ScrollTrigger
clean up on page unload or resize
```

## Text reveals

Use only for:

* Hero headline.
* Major brand statement.
* Final CTA.

Do not split long paragraphs into animated words or characters.

## Image masks

Allowed mask shapes:

* Paper sheet.
* Roll core.
* Heart emboss.
* Torn edge.
* Perforated rectangle.

## ScrollTrigger rules

* Avoid more than one pinned section on the homepage.
* Refresh after fonts and responsive images load.
* Disable heavy sequences on mobile.
* Do not create nested pinned sections.
* Ensure scroll position remains stable.

---

# 24. 3D implementation strategy

## Preferred implementation

Use either:

* Optimized Spline scene.
* Pre-rendered product animation.
* Lightweight Three.js scene where justified.

## Asset requirements

* Low polygon count.
* Compressed textures.
* Draco-compressed geometry where supported.
* Mobile-specific asset.
* Static WebP or AVIF fallback.
* Transparent background only when necessary.

## Loading strategy

1. Render headline and CTA.
2. Render static product image.
3. Load 3D after initial content.
4. Replace static image only when 3D is ready.
5. Preserve static version on low-performance devices.

## Failure strategy

When loading fails:

* Keep static image.
* Do not show an error to the user.
* Continue all page functionality.

---

# 25. Localization implementation

## Locale structure

Use Webflow Localization for:

* Page copy.
* Navigation.
* CMS content.
* Metadata.
* URLs.
* Language attributes.
* `hreflang`.

## Translation workflow

Each item requires:

* Source-locale complete.
* Machine or initial translation.
* Native review.
* Legal review where necessary.
* Published status.

## Locale-specific commerce

Each locale may require:

* Different currency.
* Different shipping destination.
* Different retailer.
* Different product availability.
* Different legal wording.

Do not assume language equals country.

## Locale selector

Show:

* Language.
* Country where commerce differs.

Avoid using flags as the only language indicator.

---

# 26. Accessibility requirements

Target WCAG 2.2 AA.

## Required implementation

* Semantic headings.
* One primary `h1` per page.
* Keyboard-operable navigation.
* Visible focus states.
* Sufficient colour contrast.
* Skip-to-content link.
* Form labels.
* Form error messages.
* Descriptive button labels.
* Descriptive alt text.
* Reduced-motion support.
* Accessible cart drawer.
* Accessible menu.
* No colour-only status communication.
* Correct language attributes.

## Animation accessibility

* No flashing.
* No forced motion.
* No essential information presented only through movement.
* No scroll hijacking.
* Pause controls for long autoplay media where required.

## 3D accessibility

The 3D scene is decorative unless it communicates essential product details.

When decorative:

```html
aria-hidden="true"
```

Provide equivalent product information in HTML.

---

# 27. Performance requirements

## Core targets

* LCP below 2.5 seconds.
* CLS below 0.1.
* INP below 200ms where practical.
* Lighthouse performance target above 85 on production mobile tests.
* Accessibility target above 95.
* SEO target above 90.

## Required optimizations

* AVIF or WebP images.
* Responsive image sizes.
* Lazy-loading below-the-fold media.
* Self-hosted or optimized fonts.
* Minimal font weights.
* Deferred noncritical JavaScript.
* Compressed 3D assets.
* No autoplay background video on mobile.
* Avoid multiple large GSAP timelines initializing simultaneously.
* Avoid loading Shopify data that is not displayed.

## Third-party script budget

Audit:

* Analytics.
* Consent management.
* Shopify integration.
* Reviews.
* Chat.
* Social embeds.
* Tracking pixels.

Every third-party script must have a documented purpose.

---

# 28. SEO requirements

## Technical SEO

* Unique page titles.
* Unique meta descriptions.
* Canonical URLs.
* XML sitemap.
* Robots configuration.
* Correct status codes.
* Structured headings.
* Descriptive image alt text.
* Open Graph metadata.
* Social preview images.
* Locale-specific `hreflang`.
* No duplicate product pages across systems.

## Structured data

Implement where appropriate:

* Organization.
* Product.
* Offer.
* BreadcrumbList.
* Article.
* FAQPage.
* LocalBusiness only where justified.

Product structured data must use Shopify price and availability as the source of truth.

## Redirect plan

Create a mapping from all existing indexed URLs to new equivalents.

Do not launch without testing redirects.

---

# 29. Analytics plan

## Recommended tools

* Google Analytics 4 or approved alternative.
* Google Tag Manager.
* Shopify analytics.
* Consent-management platform.
* Optional privacy-focused analytics.

## Core events

```text
hero_buy_click
hero_impact_click
product_view
product_gallery_interaction
add_to_cart
remove_from_cart
cart_open
cart_checkout_click
checkout_start
purchase
subscription_select
retailer_find_click
retailer_outbound_click
impact_project_view
impact_report_download
impact_methodology_view
language_change
country_change
b2b_form_start
b2b_form_submit
contact_form_submit
faq_expand
video_play
```

## Event properties

Where applicable:

* Product ID.
* Product name.
* Variant ID.
* Price.
* Currency.
* Locale.
* Country.
* Page type.
* Campaign.
* Referrer.
* Retailer.

Do not send sensitive personal information to analytics.

---

# 30. Form implementation

Forms:

* Contact.
* B2B.
* Newsletter.
* Optional retailer enquiry.

Requirements:

* Clear labels.
* Consent checkbox where legally required.
* Spam protection.
* Server-side or platform validation.
* Accessible error messages.
* Success message.
* No duplicate submission.
* Privacy-policy link.

Do not use placeholder text as the only label.

---

# 31. Cookie and privacy implementation

Requirements:

* Consent before nonessential tracking.
* Locale-aware consent text.
* Ability to revoke consent.
* Separate necessary, analytics and marketing categories.
* No preselected optional categories.
* Legal review before launch.

The Codex agent should implement technical controls but must not draft final legal text without approval.

---

# 32. Content migration plan

## Inventory

Create a spreadsheet or structured list containing:

* Current URL.
* Page title.
* Content type.
* Target page.
* Migration status.
* Redirect URL.
* Locale.
* Owner.
* Notes.

## Migration rules

* About content moves to About.
* Commitment content moves to Impact.
* Project stories move to Impact Projects.
* Company updates move to Journal.
* Vacancies move to Careers.
* Product facts move to Product.
* Legal pages retain dedicated routes.
* Duplicate or outdated content is archived.

Do not migrate low-quality content simply because it exists.

---

# 33. Build phases

## Phase 0: Discovery and access

Tasks:

* Confirm business requirements.
* Confirm ecommerce platform.
* Obtain Webflow access.
* Obtain Shopify access.
* Obtain domain and analytics access.
* Collect brand assets.
* Collect product data.
* Collect impact data.
* Collect legal requirements.

Deliverable:

* Confirmed implementation brief.
* List of unresolved dependencies.

---

## Phase 1: Foundation

Tasks:

* Create Webflow project.
* Configure breakpoints.
* Define variables.
* Establish class system.
* Build global container and spacing utilities.
* Configure typography.
* Configure buttons and form controls.
* Configure localization.
* Configure CMS collections.
* Create staging domain.

Deliverable:

* Functional design system page.

Acceptance criteria:

* All tokens are reusable.
* No page-specific arbitrary spacing.
* Components pass basic responsiveness checks.

---

## Phase 2: Global components

Build:

* Announcement bar.
* Header.
* Desktop navigation.
* Mobile menu.
* Locale selector.
* Cart trigger.
* Footer.
* Buttons.
* Product card.
* Impact card.
* Project card.
* Article card.
* FAQ accordion.
* Form fields.
* Modal or drawer.
* Cookie banner integration.

Deliverable:

* Component library page.

---

## Phase 3: Commerce integration

Tasks:

* Connect Shopify.
* Map products.
* Implement product retrieval.
* Implement variant selection.
* Implement cart state.
* Implement cart drawer.
* Implement checkout handoff.
* Implement stock state.
* Implement errors.
* Implement analytics events.

Acceptance criteria:

* Price matches Shopify.
* Stock matches Shopify.
* Cart persists.
* Checkout opens correctly.
* Errors are visible.
* Keyboard interaction works.

---

## Phase 4: Homepage static build

Build all sections without advanced animation.

Requirements:

* Complete content hierarchy.
* Responsive layout.
* Static product render.
* Working purchase controls.
* CMS-driven project and impact content.
* Working navigation.
* Working footer.

Do not begin complex animation until the static experience is approved.

---

## Phase 5: Product and shop pages

Build:

* Shop page.
* Product template.
* Product gallery.
* Product details.
* Subscription block.
* FAQs.
* Related products.
* Sticky mobile purchase bar.

---

## Phase 6: Impact system

Build:

* Impact landing page.
* Contribution diagram.
* Impact metrics.
* Project listing.
* Project template.
* Partner collection.
* Report downloads.
* Methodology section.

All figures must be CMS-driven.

---

## Phase 7: Secondary pages

Build:

* About.
* B2B.
* Journal.
* Article template.
* Support.
* Contact.
* Careers.
* Shipping.
* Returns.
* Privacy.
* Imprint.
* 404.

---

## Phase 8: Motion system

Implement in this order:

1. Reduced-motion detection.
2. Hero load sequence.
3. Hero product rotation.
4. Paper unrolling.
5. Perforated transition.
6. Brand-statement mask.
7. Product hover.
8. Impact line animation.
9. Metric reveal.
10. Final CTA animation.

Test after every major animation.

Do not implement all animation before performance testing.

---

## Phase 9: Localization

Tasks:

* Duplicate locale structure through Webflow Localization.
* Translate navigation.
* Translate static pages.
* Translate CMS content.
* Configure locale metadata.
* Configure country-specific purchase actions.
* Native-language QA.
* Legal-language QA.

---

## Phase 10: SEO and redirects

Tasks:

* Metadata.
* Structured data.
* Canonical URLs.
* `hreflang`.
* Open Graph.
* Sitemap.
* Redirect mapping.
* Broken-link scan.
* Indexing controls.

---

## Phase 11: QA

Test:

* Browsers.
* Devices.
* Locales.
* Commerce.
* Accessibility.
* Analytics.
* Performance.
* SEO.
* Forms.
* Legal pages.
* Reduced motion.
* 3D fallback.
* JavaScript-disabled fallback where practical.

---

## Phase 12: Launch

Tasks:

* Freeze content.
* Back up current site.
* Export redirect list.
* Configure production domain.
* Verify SSL.
* Publish.
* Test checkout.
* Verify analytics.
* Verify search indexing.
* Monitor errors.
* Monitor performance.
* Confirm forms.

---

# 34. Ticket-level work breakdown

## Epic A: Design system

### A1. Configure colour variables

Acceptance criteria:

* All primary colours use Webflow variables.
* No repeated hard-coded colour values in components.
* Contrast is documented.

### A2. Configure typography

Acceptance criteria:

* Display and body styles exist.
* Fluid type works across breakpoints.
* No text clipping.

### A3. Configure spacing and containers

Acceptance criteria:

* Large, medium and small containers exist.
* Section spacing is tokenized.
* Mobile spacing is consistent.

### A4. Build button system

Variants:

* Primary.
* Secondary.
* Text.
* Icon.
* Dark.
* Light.

States:

* Default.
* Hover.
* Focus.
* Active.
* Disabled.
* Loading.

---

## Epic B: Navigation

### B1. Desktop header

Acceptance criteria:

* Sticky behaviour.
* Working links.
* Active state.
* Cart count.
* Locale access.
* Keyboard access.

### B2. Mobile menu

Acceptance criteria:

* Focus trap.
* Escape closes.
* Background scroll locked.
* Focus restored.
* No content overflow.

---

## Epic C: Commerce

### C1. Shopify product connection

Acceptance criteria:

* Product ID mapped.
* Price retrieved.
* Availability retrieved.
* Variant retrieved.

### C2. Add-to-cart

Acceptance criteria:

* Correct variant added.
* Quantity respected.
* Loading state shown.
* Success feedback shown.
* Error displayed on failure.

### C3. Cart drawer

Acceptance criteria:

* Items editable.
* Items removable.
* Subtotal updates.
* Checkout works.
* Drawer accessible.

### C4. Analytics

Acceptance criteria:

* Commerce events appear in debug mode.
* No duplicate events.
* Product data is correct.

---

## Epic D: Homepage

### D1. Hero static structure

### D2. Hero 3D enhancement

### D3. Product-proof strip

### D4. Main product module

### D5. Impact mechanism

### D6. Product cards

### D7. Impact metrics

### D8. Featured project

### D9. Founder story

### D10. Final CTA

Each ticket requires:

* Desktop.
* Tablet.
* Mobile.
* Accessibility.
* Empty-state handling.
* CMS binding where applicable.

---

## Epic E: Impact system

### E1. Impact CMS

### E2. Impact dashboard

### E3. Project collection page

### E4. Project template

### E5. Partner collection

### E6. Report downloads

### E7. Methodology section

Acceptance criteria:

* All displayed data includes reporting period.
* Empty optional data does not create blank gaps.
* Documents open or download correctly.
* Project photography has alt text.

---

## Epic F: Motion

### F1. Reduced-motion utility

### F2. Hero load animation

### F3. Scroll-linked paper unroll

### F4. Paper-to-perforation transition

### F5. Text-mask reveal

### F6. Product hover motion

### F7. Impact timeline animation

### F8. Final CTA animation

Acceptance criteria for all motion tickets:

* No console errors.
* No layout shift.
* Disabled in reduced-motion mode.
* Mobile fallback implemented.
* Animation cleans up on resize.
* Content remains accessible before initialization.

---

## Epic G: Localization

### G1. Locale architecture

### G2. Navigation translation

### G3. CMS translation

### G4. Commerce-market routing

### G5. Metadata and `hreflang`

### G6. Locale QA

---

## Epic H: Quality

### H1. Accessibility audit

### H2. Performance audit

### H3. Commerce test suite

### H4. Analytics validation

### H5. SEO audit

### H6. Redirect validation

### H7. Form validation

### H8. Cross-browser QA

---

# 35. Browser and device testing matrix

## Browsers

* Current Chrome.
* Current Safari.
* Current Firefox.
* Current Edge.
* Mobile Safari.
* Mobile Chrome.

## Devices

Minimum test set:

* Recent iPhone.
* Older or lower-powered iPhone where available.
* Recent Android.
* Mid-range Android.
* iPad or equivalent tablet.
* 13-inch laptop.
* Large desktop monitor.

## Special modes

* Reduced motion.
* Keyboard only.
* Screen reader spot checks.
* Slow 4G.
* JavaScript failure.
* 200% zoom.
* High text scaling on mobile.

---

# 36. Definition of done

A page or component is complete only when:

* Desktop layout is complete.
* Tablet layout is complete.
* Mobile layout is complete.
* Content is CMS-driven where required.
* Empty states are handled.
* Hover state exists where appropriate.
* Focus state exists.
* Keyboard behaviour works.
* Reduced-motion behaviour works.
* Analytics hooks are included.
* No console errors appear.
* Performance has been reviewed.
* SEO fields exist.
* Copy placeholders are documented.
* QA acceptance criteria pass.

---

# 37. Launch acceptance criteria

The website may launch when:

* Primary purchase journey works.
* Checkout works in every launch market.
* Prices and inventory match Shopify.
* Impact claims are approved.
* Legal pages are approved.
* All launch locales are reviewed.
* Redirects are implemented.
* Analytics is verified.
* Forms are verified.
* Cookie consent is verified.
* Mobile performance is acceptable.
* Reduced-motion mode works.
* Static hero fallback works.
* No critical accessibility errors remain.
* No critical browser errors remain.
* Search indexing settings are correct.

---

# 38. Post-launch monitoring

Monitor during the initial period:

* Checkout errors.
* Add-to-cart failures.
* 404 errors.
* Broken redirects.
* Form failures.
* JavaScript errors.
* 3D scene failures.
* Core Web Vitals.
* Mobile bounce rate.
* Hero CTA click rate.
* Product-page conversion.
* Retailer handoff rate.
* Impact-page engagement.
* Locale switching.
* B2B enquiries.

Do not make animation changes based only on aesthetic preference after launch.

Use observed performance and user behaviour.

---

# 39. Recommended optimization experiments

After stable launch, test:

## Hero proposition

Version A:

> Soft on skin. Strong for children.

Version B:

> Pink toilet paper with a purpose.

## Primary action

Version A:

* Buy ROOSA.

Version B:

* Shop pink paper.

## Impact presentation

Version A:

* Contribution explanation near hero.

Version B:

* Contribution explanation after product proof.

## Product animation

Version A:

* Static product hero.

Version B:

* Scroll-linked roll animation.

## Buying options

Version A:

* Standard pack emphasized.

Version B:

* Subscription emphasized.

All experiments must use clearly defined success metrics.

---

# 40. Instructions to the Codex agent

## General operating rules

1. Build the static, accessible experience first.
2. Add commerce second.
3. Add animations only after functionality works.
4. Do not invent product, legal or impact information.
5. Use placeholders for missing business data.
6. Preserve progressive enhancement.
7. Keep JavaScript modular.
8. Use data attributes for interaction hooks.
9. Avoid dependencies that are not essential.
10. Document every external integration.
11. Include cleanup and error handling.
12. Treat mobile and reduced motion as first-class requirements.
13. Do not copy copyrighted template assets or code.
14. Use references only for patterns and inspiration.
15. Do not expose private Shopify credentials in client-side code.
16. Do not store personal information outside approved platforms.
17. Do not block checkout behind animation.
18. Do not publish unverified impact figures.
19. Do not optimize visual effects at the expense of LCP or INP.
20. Produce maintainable Webflow components rather than page-specific one-offs.

## Expected outputs from the agent

* Architecture documentation.
* CMS schema.
* Component inventory.
* Webflow build.
* Commerce integration.
* Modular interaction scripts.
* Analytics-event documentation.
* Localization documentation.
* Redirect map.
* QA report.
* Launch checklist.
* Known-issues list.
* Placeholder-data list.
* Post-launch monitoring instructions.

---

# 41. Suggested Codex starting prompt

Use this as the initial task message for the implementation agent:

> Build the ROOSA website redesign according to the supplied implementation specification. Start with a static, responsive and accessible Webflow-compatible component system before implementing ecommerce or motion. Use Webflow as the marketing and CMS layer, Shopify as the commerce source of truth, and GSAP only for interactions that cannot be handled with CSS.
>
> The central creative concept is “The Pink Paper Trail.” Major motion should derive from rolling, unrolling, folding, perforating, wrapping or embossing paper. The site must remain fully understandable and purchasable without advanced animation.
>
> Do not invent product specifications, prices, contribution values, certification details, partner names or legal text. Use explicit placeholders and maintain a missing-data register.
>
> Implement reduced-motion behaviour, static fallbacks, accessible navigation, an accessible cart drawer, responsive layouts, analytics hooks, SEO fields and graceful error handling.
>
> Work in the following order:
>
> 1. Architecture and assumptions.
> 2. Design tokens and class system.
> 3. Global components.
> 4. CMS collections.
> 5. Static homepage.
> 6. Shopify integration.
> 7. Shop and product templates.
> 8. Impact system.
> 9. Secondary pages.
> 10. Motion system.
> 11. Localization.
> 12. SEO, analytics and redirects.
> 13. Accessibility, performance and browser QA.
>
> At the end of each phase, provide:
>
> * Files or components changed.
> * Decisions made.
> * Unresolved dependencies.
> * Tests performed.
> * Acceptance criteria passed.
> * Known issues.
>
> Do not proceed with complex animation until the static experience and ecommerce flow meet the stated acceptance criteria.

---

# 42. Immediate next actions

The first implementation cycle should complete:

1. Platform confirmation.
2. Access and dependency inventory.
3. Design-token system.
4. CMS schema.
5. Global header and footer.
6. Static homepage structure.
7. Static product page.
8. Shopify connection proof of concept.
9. Static impact-data model.
10. Hero-animation technical prototype.

The first review should focus on:

* Product clarity.
* Purchase visibility.
* Impact credibility.
* Mobile layout.
* Performance feasibility.
* Whether the references feel integrated rather than combined indiscriminately.
