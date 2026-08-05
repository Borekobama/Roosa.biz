# Analytics events

The typed event contract lives in `src/lib/analytics.ts`. Current UI hooks dispatch a `roosa:analytics` browser event; an approved consent-aware analytics provider can subscribe to it.

Core event families:

- Acquisition: `hero_buy_click`, `hero_impact_click`.
- Commerce: `product_view`, `add_to_cart`, `remove_from_cart`, `cart_open`, `cart_checkout_click`.
- Impact: `impact_project_view`, `impact_report_download`.
- Forms: `b2b_form_start`, `b2b_form_submit`, `contact_form_submit`.
- UX: `language_change`, `faq_expand`.

No email address, name, free-form message or other personal information may be included in event properties.
