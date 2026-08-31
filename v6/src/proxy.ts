import { NextResponse, type NextRequest } from "next/server";
import { isLocale } from "@/lib/i18n";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const headers = new Headers(request.headers);
  const segment = request.nextUrl.pathname.split("/").filter(Boolean)[0] ?? "en";
  headers.set("x-roosa-locale", isLocale(segment) ? segment : "en");
  headers.set("x-roosa-pathname", pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|robots.txt|sitemap.xml|v6-home|v6-shop|v6-product|v6-cart|v5-home|v5-shop|v5-product|v5-cart|v4-home|v4-shop|v4-product|v4-cart|v3-home|v3-shop|v3-product|v3-cart|v2-home|v2-shop|v2-product|v2-cart).*)"],
};
