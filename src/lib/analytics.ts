export type AnalyticsEvent =
  | "hero_buy_click"
  | "hero_impact_click"
  | "product_view"
  | "add_to_cart"
  | "remove_from_cart"
  | "cart_open"
  | "cart_checkout_click"
  | "language_change"
  | "impact_project_view"
  | "impact_report_download"
  | "b2b_form_start"
  | "b2b_form_submit"
  | "contact_form_submit"
  | "faq_expand";

export function track(event: AnalyticsEvent, properties: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("roosa:analytics", { detail: { event, properties } }));
  if (process.env.NODE_ENV === "development") console.info("[ROOSA analytics]", event, properties);
}
