# ROOSA v2 implementation map

| Plan requirement | v2 location | Source contract |
| --- | --- | --- |
| Announcement bar | Homepage top | ROOSA plan |
| Header/navigation | GiveWell navbar DOM | GiveWell |
| Hero | GiveWell hero DOM with ROOSA product layers | GiveWell + Coca-Cola |
| Product-proof strip | Hero/mission transition | GiveWell rhythm |
| Main product module | Homepage commerce insertion and product route | Soma |
| Brand statement | GiveWell mission section | GiveWell |
| How impact works | GiveWell empowerment tabs | GiveWell |
| Product options | Inserted store module and shop route | Soma + Bovist |
| Impact metrics | GiveWell statistics grid | GiveWell |
| Featured project | Impact route and statistics sequence | GiveWell |
| Founder/origin | GiveWell team section | GiveWell |
| Retailer/trust | Pre-footer content | ROOSA plan |
| Final purchase CTA | GiveWell draggable footer CTA | GiveWell |
| Footer | GiveWell footer DOM with plan link groups | GiveWell |
| Product gallery/detail | Product route | Soma |
| Quantity/cart/stock | Product, shop, and cart routes | Bovist |
| Signature product motion | Homepage hero only | Coca-Cola |
| Text/image masks | Selected homepage transitions only | Sitasys |
| Impact/project editorial pages | `/[locale]/impact/**` | GiveWell |
| About/B2B/Journal/support/legal | Existing localized v2 routes | GiveWell editorial system |

## Business-data rule

The v2 preview must not invent product, certification, contribution, partner,
reporting, price, availability, shipping, or legal data. Missing values remain
visible bracketed placeholders from the implementation plan.

## Version boundary

- Original implementation: repository root, port 3000.
- New implementation: `v2/`, port 3001.
- No v2 generator may write outside `v2/`.

