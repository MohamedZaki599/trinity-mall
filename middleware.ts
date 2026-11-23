import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const expectedUser = process.env.SITE_AUTH_USER;
  const expectedPassword = process.env.SITE_AUTH_PASSWORD;

  // Keep local development unchanged until production credentials are configured.
  if (!expectedUser || !expectedPassword) {
    return NextResponse.next();
  }

  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Basic ")) {
    try {
      const decoded = atob(authorization.slice("Basic ".length));
      const separator = decoded.indexOf(":");
      const user = separator >= 0 ? decoded.slice(0, separator) : "";
      const password = separator >= 0 ? decoded.slice(separator + 1) : "";

      if (user === expectedUser && password === expectedPassword) {
        return NextResponse.next();
      }
    } catch {
      // Treat malformed credentials as unauthorised.
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Trinity Mall"',
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
