# Missing-data register

The UI intentionally exposes bracketed placeholders where source-of-truth data is unavailable.

- Product: name approval, price, price per roll, pack size, roll count, sheets, ply, material, origin, packaging, dye details, certifications, dermatological evidence, variants and inventory.
- Impact: contribution mechanism/amount, recipient, reporting period, project names, approved objectives/results, reporting methodology and report files.
- Commerce: Shopify domain/token, product/variant handles, markets, taxes, shipping, discounts, checkout, returns and subscription provider.
- Brand: approved claims, founder biography/portrait, team information, press/reviewer permissions and partner-logo approvals.
- Legal: privacy, imprint, cookie, shipping, returns and form-consent copy.

Placeholders are defined in `src/lib/content.ts` or directly next to their explanatory UI. They must be replaced only with approved source data.
