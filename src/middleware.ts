import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, verifyAdminToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const session = await verifyAdminToken(req.cookies.get(AUTH_COOKIE)?.value).catch(() => null);
  const isLogin = pathname === "/admin/login";

  if (pathname.startsWith("/api/admin")) {
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.next();
  }

  if (isLogin) {
    return session ? NextResponse.redirect(new URL("/admin", req.url)) : NextResponse.next();
  }

  if (!session) {
    const url = new URL("/admin/login", req.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
