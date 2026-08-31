# ROOSA AI integration audit

Status: phases 1–4 reviewed; phase 5 validation complete
Date: 2026-08-31
Scope: deployed `v6` application. Root and older `v2`–`v5` snapshots are included only where deployment or generated-output drift affects risk.

## Executive decision

Yes, ROOSA can use both Anthropic and OpenAI for browsing, customer cart assistance, and authenticated admin workflows. Current product is not ready for those integrations:

- deployed commerce is explicitly a demo;
- no live Shopify connection, payment flow, database, authentication, admin panel, email provider, or password-reset flow exists;
- English commerce uses static HTML and a demo checkout, while German/French commerce uses a separate React cart with checkout disabled;
- AI SDKs and provider keys are absent.

Recommended shape: one server-side domain/tool layer, two thin provider adapters. Use provider browsing for current external knowledge; use ROOSA-owned catalog, policy, inventory, and order tools for product truth. Do not let a model edit the admin UI through browser automation.

## Review log

| Phase | Result | Evidence |
|---|---|---|
| 1. Enable both skills | Complete | Anthropic/Codex API playbook and OpenAI official API guidance already available locally; no skill package install required. |
| 2. Extract functionality | Complete | Source inventory below; deployed source is `v6`. |
| 3. Independent reviews | Complete | Separate Anthropic and OpenAI assessments below. |
| 4. Dynamic audit | Complete | Findings and env register updated from source/runtime checks. |
| 5. Validate | Complete | `npm ci`, `npm run lint`, `npm run build`, and V6 release QA passed. QA covers English release routes; localized commerce parity still fails by design. |

## Product functionality inventory

### Public routes and navigation

- Locale-aware routes: `/en`, `/de`, `/fr` and localized versions of home, shop, products, impact, projects, about, B2B, journal, articles, careers, roles, support, contact, privacy, imprint, shipping, and returns.
- `/wireframe` exists for internal presentation and is blocked from indexing.
- Root `/` redirects to `/en`.
- Header contains logo/home navigation, shop, impact, about, journal, B2B, contact, locale switcher, menu toggle, skip link, and cart affordance where applicable.
- Mobile menu has focus handling; modal/drawer flows handle escape, backdrop click, focus return, and keyboard focus trapping.
- Static English routes are selected in [`v6/src/proxy.ts`](../v6/src/proxy.ts): home, shop, three product pages, subscription, B2B supply, and cart.
- Non-static routes receive locale/path headers from proxy.

### Homepage and editorial presentation

- Hero with product animation, buy CTA, impact CTA, and reduced-motion fallback.
- Product/category blocks, trust placeholders, impact preview, editorial sections, and footer navigation.
- Locale switching emits a local analytics event.
- Image, typography, responsive layout, and progressive animation system are present.
- Reduced-motion path hides animation canvas and keeps fallback content visible.

### Commerce and product discovery

- Product catalog in [`v6/src/lib/content.ts`](../v6/src/lib/content.ts): standard pack, family bundle, and subscription concept.
- Product cards and product detail pages with price, pack facts, materials, origin, certification status, gallery image swap, FAQ disclosures, related products, shipping/returns placeholders, and sticky purchase bar.
- Product pages emit Product JSON-LD.
- English static commerce includes product-specific add-to-cart and buy-now controls.
- React commerce supports localized product discovery and local catalog rendering.
- Product values, stock, certification, shipping, and impact allocation are marked demo/pending where unapproved.

### Cart behavior

- Static English cart: localStorage key `roosa-v2-demo-cart`; add, buy-now, quantity update, remove, drawer open/close, count, subtotal, shipping, total, and empty state.
- Static cart quantity is capped at 20 and data fields are escaped before insertion into drawer markup.
- React localized cart: `CartProvider` uses localStorage key `roosa-cart`; validates IDs against local products, merges duplicate product IDs, clamps quantity to 20, removes items, and opens drawer after add.
- React cart drawer has empty state, line quantity controls, remove controls, subtotal placeholder, disabled checkout when Shopify is not configured, and focus/escape behavior.
- Static and React carts do not share storage keys or runtime state.

### Checkout/API

- Only API route: `/api/demo/checkout`.
- Rejects empty carts; normalizes up to 20 client items; clamps quantity and unit price; calculates demo shipping and total; returns a `DEMO-*` reference.
- Response explicitly says `demo: true`, `paymentCollected: false`, and `status: simulated`.
- No payment capture, order creation, inventory reservation, customer account, webhook, idempotency, or persisted order.
- The endpoint still accepts client-provided product ID, name, and price. Safe for labelled demo only; unsafe foundation for live commerce.

### Impact and reporting

- Impact page contains contribution mechanism, illustrative period, demo metrics, named demo project record, partner logos, methodology, FAQ, governance copy, and disabled report-download button.
- Metrics and project records are local demo data. Production report/PDF connection is absent.
- Product impact receipt is pending approval for amount, partner, timing, and reporting period.

### Journal and safeguarding

- Journal categories, translated German/English copy, French fallback notice, source URLs, dates, images, article routes, and related content are present.
- `safeguarding` flags stories naming children or families and UI copy requires review before publication.
- At least one migrated article contains child names, age, diagnosis, family names, health context, and location in source content. Treat as protected editorial data; AI retrieval/admin tools must have explicit allowlists and redaction rules.

### B2B, contact, careers, and support

- B2B page collects company, country, business type, estimated volume, contact name, email, and message.
- Contact page collects name, email, topic, message, and consent.
- Both forms prevent default and show an explicit “not connected” status. No request is sent or stored.
- Careers lists roles and role detail pages with application CTA/content, but no application submission backend.
- Support page provides static FAQ/help content.

### SEO, legal, and infrastructure

- Metadata, canonical/alternate locale URLs, Open Graph fields, robots policy, sitemap, Product JSON-LD, `noindex` internal routes, and asset exclusions exist.
- Legal pages are approval placeholders for entity, privacy, processors, retention, rights, and cookie policy.
- Security headers tested: `nosniff` and strict-origin referrer policy.
- Analytics helper dispatches browser `roosa:analytics` events and logs in development; no external transport or consent system is configured.
- Docker deploy builds `v6`; root `compose.yaml` passes only `NODE_ENV` and `TZ` to container.
- Docker build does not run the scripts that generate older/static commerce output. Committed generated HTML is therefore a release input and can drift from source data.

### Explicitly absent

- Admin route/panel.
- Login, roles, sessions, customer accounts, password reset, or email verification.
- Resend or any email provider.
- Database or persistent server-side cart/order/audit state.
- Live Shopify Storefront/Admin API integration.
- Payment provider and order fulfillment flow.
- Inventory sync, subscriptions, refunds, returns processing, or webhooks.
- Production impact data, reconciled report download, and content publishing workflow.

## Independent vendor reviews

### Anthropic

Anthropic fit: strong for a single conversational agent with custom server tools and hosted web search/fetch. Client tools let Claude request application actions; the server performs those actions and returns tool results. Strict custom tool schemas and human confirmation should protect writes.

Suggested Anthropic tools:

- Customer read: `search_catalog`, `get_product`, `get_shipping_policy`, `get_impact_record`.
- Customer cart: `get_cart`, `add_to_cart`, `update_cart_item`, `remove_from_cart`.
- Checkout handoff: `prepare_checkout`; require explicit user confirmation before any final order/payment action.
- Admin read: `list_products`, `get_inventory`, `list_orders`, `get_contact_submissions`.
- Admin write: `update_product`, `update_inventory`, `publish_content`, `send_contact_reply`; expose only to authenticated staff with role checks and an approval step.
- External browsing: Anthropic hosted web search/fetch for approved external sources, never as source of price, stock, order state, or internal customer data.

Anthropic blockers:

- No Anthropic SDK dependency or `ANTHROPIC_API_KEY`.
- No auth boundary for admin tools.
- No persistent cart, order, or audit-log service.
- No live product/variant/inventory source.
- Tool loop must preserve tool-use/tool-result state and handle server-tool pause/resume behavior.

Assessment: implementable after backend/auth foundations. Do not start with browser/computer control; direct domain tools are smaller, safer, and more testable.

### OpenAI

OpenAI fit: strong for the Responses API with hosted web search and custom function tools. Strict schemas, controlled tool choice, disabled parallel calls around writes, structured outputs, and visible clickable citations are appropriate for ROOSA.

Suggested OpenAI tools:

- Same shared domain contract as Anthropic; provider adapters should translate only request/response/tool-call formats.
- Hosted `web_search` for current external sources, with domain allowlists where possible.
- Custom functions for catalog, cart, checkout preparation, admin reads, and approved admin writes.
- `parallel_tool_calls: false` around inventory, content, order, and other side-effecting operations.
- Structured response for assistant UI state: answer, citations, cart delta, confirmation requirement, and next action.

OpenAI blockers:

- No OpenAI SDK dependency or `OPENAI_API_KEY`.
- No auth boundary for admin tools.
- No persistent cart, order, or audit-log service.
- No live product/variant/inventory source.
- No citation UI or source policy for browsing results.

Assessment: implementable after backend/auth foundations. Use custom functions for ROOSA data/actions; use hosted web search only for external current information. Never accept model-provided price, inventory, role, or order identity as authority.

### Shared architecture decision

```text
OpenAI Responses / Anthropic Messages
                 ↓ provider adapter
        shared typed ROOSA tool contract
                 ↓ authorization + validation
     domain services: catalog/cart/admin/email
                 ↓
        Shopify + database + Resend
```

Keep provider code out of domain services. A shared contract avoids duplicating security logic and makes provider comparison/evaluation possible. Tool calls must be server-side, authenticated, scoped to current user/session, validated against authoritative records, idempotent where side effects exist, and logged with actor/provider/tool/arguments/result.

## Findings

### High

#### H1 — Requested live commerce and admin capabilities are absent

Locations: [`v6/src/lib/shopify.ts`](../v6/src/lib/shopify.ts), [`v6/src/app/api/demo/checkout/route.ts`](../v6/src/app/api/demo/checkout/route.ts), `v6/src/app/api/`.

`shopify.ts` returns local demo products and only checks whether two public env vars exist. The only API route is simulated checkout. No admin/auth/order backend exists. AI cannot safely add these capabilities until domain services exist.

Action: choose Shopify as commerce source of truth, then add server-side catalog/cart/order services, auth, roles, and audit log before exposing tools.

#### H2 — Two commerce runtimes create locale and state divergence

Locations: [`v6/src/proxy.ts`](../v6/src/proxy.ts), [`v6/public/v6-shop/commerce.js`](../v6/public/v6-shop/commerce.js), [`v6/src/components/CartProvider.tsx`](../v6/src/components/CartProvider.tsx).

English paths use generated static HTML and `roosa-v2-demo-cart`; German/French paths use React and `roosa-cart`. Checkout behavior and cart state differ by locale. A user can add an English static item, navigate to a React route, and see an empty React cart.

Action: consolidate to one commerce runtime and one cart identifier before AI cart tools. Keep static pages only if they call the same server/cart implementation.

#### H3 — Demo checkout trusts client commerce values

Location: [`v6/src/app/api/demo/checkout/route.ts`](../v6/src/app/api/demo/checkout/route.ts).

The endpoint clamps client `id`, `name`, `quantity`, and `unitPrice`, then calculates totals from those values. It collects no money, so current exposure is limited; promoting this path to live checkout would allow price/name manipulation.

Action: resolve product/variant, price, currency, inventory, shipping, and customer context server-side. Add authorization, idempotency, replay protection, and payment-provider confirmation.

#### H4 — No server identity or persistent state exists

Locations: cart providers, localStorage scripts, absent auth/database routes.

Cart state is browser-local. There is no account/session binding, cross-device cart, order history, admin audit trail, or durable tool result state.

Action: create session-bound cart/order state through Shopify or a database. Never give model tools direct localStorage or client database authority.

#### H5 — Contact/B2B flows do not send; reset-password example is not implemented

Locations: [`v6/src/components/ContactForm.tsx`](../v6/src/components/ContactForm.tsx), `v6/src/components/v2-editorial/ContactForm.tsx`.

Forms only prevent default and show a not-connected message. No auth or reset-password route exists, so Resend is not merely misconfigured: password reset is not implemented.

Action: choose auth provider and email delivery path, then add server validation, consent handling, rate limiting, delivery status, and Resend templates/keys. Mark current forms as unavailable until connected.

### Medium

#### M1 — Generated/static catalog can drift from React catalog

Locations: `v6/scripts/build-v2-commerce.mjs`, `v6/public/v6-*`, [`v6/src/lib/content.ts`](../v6/src/lib/content.ts), `v6/Dockerfile`.

Product data and markup exist in multiple sources. Docker builds committed static output but does not regenerate it. AI reads could disagree with visible page prices or names.

Action: remove duplicate catalog definitions or make build fail when generated output is stale. Expose one server catalog to UI and AI tools.

#### M2 — Localized routes are not covered by current release QA

The release script validates English routes/assets/metadata and demo API. It does not prove `de`/`fr` commerce parity, shared cart behavior, or localized checkout.

Action: add one cross-locale cart test after consolidation; include mobile, refresh, route transition, empty cart, duplicate item, quantity cap, and checkout confirmation cases.

#### M3 — Shopify env absence disables React checkout by design

`shopifyConfigured` is false because Storefront domain/token variables are absent. React cart checkout remains disabled, while static English demo checkout remains callable.

Action: do not only add env keys. First implement and verify actual Storefront/cart flow, then enable the button behind server-side readiness checks.

#### M4 — Analytics has no external destination or consent gate

The helper dispatches browser events only. No durable analytics transport, consent preference, retention rule, or privacy implementation is configured.

Action: decide whether analytics is required; if yes, add consent-aware transport and document it in approved privacy/cookie copy.

#### M5 — Public editorial data needs AI retrieval boundaries

Journal source contains names and health information about a child/family. Existing safeguarding flag is good, but AI search/admin tools could expose or summarize it without editorial approval.

Action: default AI retrieval to approved product/support/impact content; exclude flagged articles until consent, safeguarding, and publication review are complete.

### Low

#### L1 — Static HTML hardcodes English navigation targets

Generated static pages contain many `/en/*` links. This compounds the localized React/static split and can send users across runtimes.

Action: fix during commerce consolidation; no separate AI feature needed.

#### L2 — Product, legal, shipping, returns, and impact copy remains approval-pending

The UI correctly labels many values as demo or pending. AI must not turn placeholders into factual claims.

Action: tag content status in source and have tools retrieve only approved records for customer answers.

## Environment and key gap register

Current root `.env` and `.env.example` contain deployment names only: `PROJECT`, `BUILDER`, `NGINX_APP_PORT`, `NGINX_DOMAIN`, `SITE_DOMAIN`, `NGINX_INCLUDE_AAPANEL_EXT`, `NGINX_REPLACE_SYSTEM_CONF`, and `TZ`. No `v6/.env*` file exists.

| Variable/config | Status | Blocks |
|---|---|---|
| `OPENAI_API_KEY` | Missing | OpenAI server calls. |
| `ANTHROPIC_API_KEY` | Missing | Anthropic server calls. |
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | Missing | Current React `shopifyConfigured` check. |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` | Missing | Current React Storefront readiness check; no API client exists yet. |
| Shopify Admin/private token | Missing | Server-side product, inventory, order, and admin operations. Exact name depends on chosen integration. |
| Shopify webhook secret | Missing | Verified catalog/order/inventory webhooks. |
| `DATABASE_URL` or approved persistence config | Missing | Durable cart, orders, admin audit log, tool idempotency. |
| Auth provider/client secrets and `AUTH_SECRET` | Missing | Login, sessions, roles, admin panel, password reset. Exact names depend on chosen auth provider. |
| `RESEND_API_KEY` | Missing | Transactional email and contact/B2B delivery. |
| Resend sender/recipient config | Missing | Verified `from`, support inbox, reset-password and form destinations. |
| AI model/routing config | Not present | Optional; provider model can remain server-side until model policy is chosen. |

Password reset status: **not implemented**, not “broken Resend.” Add Resend only after auth/session/reset ownership and account recovery rules are selected.

## Phased implementation plan

### Phase 0 — decisions and source of truth

Confirm `v6` as release source, Shopify store/market/currency, product/variant IDs, shipping rules, subscription provider, admin roles, auth provider, email destination, and approved content set.

Acceptance: written tool/data ownership map; no unresolved demo values in production commerce path.

### Phase 1 — provider and domain foundation

Add `openai` and `@anthropic-ai/sdk` only when implementation starts. Add shared tool schemas, server-only provider adapters, request tracing, error boundaries, rate limits, and feature flags. Keep keys server-side.

Acceptance: both providers can answer a read-only fixture request through identical domain tools; no write tools exposed.

### Phase 2 — consolidate commerce

Replace duplicate static/React product/cart behavior with one authoritative catalog and one server/cart contract. Add server-side price and inventory resolution.

Acceptance: all locales share cart state and totals; refresh, route transition, and replay tests pass.

### Phase 3 — customer assistant

Ship read-only catalog, product, shipping, returns, support, and approved impact retrieval. Add citations for external browsing and clear “not available” responses for pending data.

Acceptance: assistant cannot invent stock, price, policy, or impact figures in eval cases.

### Phase 4 — customer cart tools

Add session-bound get/add/update/remove tools. Require confirmation for checkout preparation and final order/payment. Use idempotency keys for mutations.

Acceptance: tool calls cannot cross sessions, exceed quantity/inventory limits, or create duplicate orders on retry.

### Phase 5 — authenticated admin read

Build minimal admin panel/auth first. Add read-only product, inventory, order, submission, and content review views.

Acceptance: role matrix, audit identity, tenant/store scope, and no customer-agent access to admin tools.

### Phase 6 — controlled admin write

Add product/inventory/content/email tools behind staff roles, explicit confirmation, approval for publish/price changes, optimistic concurrency, audit log, and rollback path.

Acceptance: every mutation is attributable, replay-safe, reviewable, and reversible where possible.

### Phase 7 — forms, email, and account recovery

Connect contact/B2B submissions, Resend delivery, auth emails, password reset, consent, rate limits, and delivery/error status.

Acceptance: test messages reach approved inboxes; reset tokens expire, are single-use, and do not reveal account existence.

### Phase 8 — evaluation and rollout

Run provider-parity evals for browsing citations, product truth, cart math, authorization, prompt injection, PII retrieval, retries, and admin approval. Roll out one provider first; activate second behind the shared adapter only if it adds measurable value.

Acceptance: red-team cases fail closed; dashboards show tool errors, latency, cost, blocked writes, and human approvals.

## Official implementation references

- [OpenAI Responses API](https://developers.openai.com/api/reference/cli/resources/responses/methods/create)
- [OpenAI model guidance](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5)
- [OpenAI function calling](https://developers.openai.com/api/docs/guides/function-calling)
- [OpenAI web search](https://developers.openai.com/api/docs/guides/tools-web-search)
- [Anthropic tool use overview](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/tool-use-with-claude)
- [Anthropic tool implementation](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/implement-tool-use)
- [Anthropic web search](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/web-search-tool)

## Verification record

- `npm ci` in `v6`: completed; audit reported 0 vulnerabilities.
- `npm run lint` in `v6`: passed.
- `npm run build` in `v6`: passed; 80 pages generated.
- `scripts/test-v6-release.py` through production server: passed English release routes, assets, metadata basics, accessibility, links, and demo API.
- No AI SDKs, provider keys, Shopify credentials, auth secrets, database URL, Resend credentials, or live admin capabilities were added in this audit phase.
