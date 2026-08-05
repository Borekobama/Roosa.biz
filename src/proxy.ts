import { NextResponse, type NextRequest } from "next/server";
import { isLocale } from "@/lib/i18n";

export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  const segment = request.nextUrl.pathname.split("/").filter(Boolean)[0] ?? "en";
  headers.set("x-roosa-locale", isLocale(segment) ? segment : "en");
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
