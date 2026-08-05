import { NextResponse, type NextRequest } from "next/server";
import { isLocale } from "@/lib/i18n";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const staticRoutes: Record<string, string> = {
    "/": "/v4-home/index.html",
    "/en": "/v4-home/index.html",
    "/en/": "/v4-home/index.html",
    "/en/shop": "/v4-shop/index.html",
    "/en/product/roosa-pink": "/v4-product/index.html",
    "/en/product/pink-toilet-paper": "/v4-product/pink-toilet-paper/index.html",
    "/en/product/family-bundle": "/v4-product/family-bundle/index.html",
    "/en/product/subscription": "/v4-product/subscription/index.html",
    "/en/product/b2b-supply": "/v4-product/b2b-supply/index.html",
    "/en/cart": "/v4-cart/index.html",
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
  matcher: ["/((?!_next|favicon.ico|robots.txt|sitemap.xml|v4-home|v4-shop|v4-product|v4-cart|v3-home|v3-shop|v3-product|v3-cart|v2-home|v2-shop|v2-product|v2-cart).*)"],
};
