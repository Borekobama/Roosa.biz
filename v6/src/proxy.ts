import { NextResponse, type NextRequest } from "next/server";
import { isLocale } from "@/lib/i18n";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const staticRoutes: Record<string, string> = {
    "/": "/v6-home/index.html",
    "/en": "/v6-home/index.html",
    "/en/": "/v6-home/index.html",
    "/en/shop": "/v6-shop/index.html",
    "/en/product/roosa-pink": "/v6-product/index.html",
    "/en/product/pink-toilet-paper": "/v6-product/pink-toilet-paper/index.html",
    "/en/product/family-bundle": "/v6-product/family-bundle/index.html",
    "/en/product/subscription": "/v6-product/subscription/index.html",
    "/en/product/b2b-supply": "/v6-product/b2b-supply/index.html",
    "/en/cart": "/v6-cart/index.html",
  };
  const staticTarget = staticRoutes[pathname];
  if (staticTarget) {
    return NextResponse.rewrite(new URL(staticTarget, request.url));
  }

  const headers = new Headers(request.headers);
  const segment = request.nextUrl.pathname.split("/").filter(Boolean)[0] ?? "en";
  headers.set("x-roosa-locale", isLocale(segment) ? segment : "en");
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|robots.txt|sitemap.xml|v6-home|v6-shop|v6-product|v6-cart|v5-home|v5-shop|v5-product|v5-cart|v4-home|v4-shop|v4-product|v4-cart|v3-home|v3-shop|v3-product|v3-cart|v2-home|v2-shop|v2-product|v2-cart).*)"],
};
