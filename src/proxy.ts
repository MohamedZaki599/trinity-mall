import { getIronSession, nextProxyCookies } from "iron-session";
import { NextResponse, type NextRequest } from "next/server";
import { units } from "@/content/project";
import { SESSION_COOKIE, type AdminSession } from "@/lib/auth/types";
import { env } from "@/lib/env";

const unitSlugs = new Set(units.map((unit) => unit.slug));

const notFoundHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>404 | Trinity Mall</title>
<style>
body{margin:0;min-height:100vh;display:grid;place-items:center;background:#07090d;color:#f6f0e5;font-family:Tahoma,Arial,sans-serif;padding:24px}
main{max-width:620px}
p.k{color:#f2d995;font-size:12px;letter-spacing:.12em;font-weight:700}
h1{font-size:clamp(34px,6vw,56px);line-height:1.1;margin:12px 0 16px}
p{color:#a7adb8;line-height:1.8}
a{display:inline-block;margin-top:20px;background:#cba960;color:#17120a;padding:12px 20px;border-radius:4px;font-weight:700;text-decoration:none}
small{display:block;color:#7c8492;margin-top:28px}
</style>
</head>
<body>
<main>
<p class="k">404</p>
<h1>هذه الصفحة غير متاحة.<br>This page is unavailable.</h1>
<p>قد يكون الرابط قديمًا أو مكتوبًا بشكل غير صحيح. The link may be outdated or mistyped.</p>
<a href="/units">استكشف المساحات / Explore spaces</a>
<small>Trinity Mall — New Assiut City</small>
</main>
</body>
</html>`;

// Optimistic checks only. Every admin page and action re-checks the session.
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/units/")) {
    const slug = pathname.slice("/units/".length);
    if (!unitSlugs.has(slug)) {
      return new NextResponse(notFoundHtml, {
        status: 404,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  const response = NextResponse.next();
  const session = await getIronSession<AdminSession>(nextProxyCookies(request, response), {
    password: env().SESSION_SECRET,
    cookieName: SESSION_COOKIE,
  });

  if (session.admin) return response;

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/units/:slug"],
};
