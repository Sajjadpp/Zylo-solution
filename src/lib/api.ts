import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, verifyAdminToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";

export function json<T>(data: T, init?: number | ResponseInit) {
  return NextResponse.json(data, typeof init === "number" ? { status: init } : init);
}

export function apiError(message: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

/** Defence in depth: middleware already guards /api/admin, this re-checks inside the handler. */
export async function requireAdmin() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  return verifyAdminToken(token);
}

type Handler<C> = (req: Request, ctx: C) => Promise<Response>;

/** Wraps an admin handler: checks auth, connects the DB, converts thrown errors into JSON responses. */
export function adminRoute<C>(handler: Handler<C>): Handler<C> {
  return async (req, ctx) => {
    if (!(await requireAdmin())) return apiError("Unauthorized", 401);
    try {
      await connectDB();
    } catch (e) {
      return apiError("Database unavailable. Check MONGODB_URI and that MongoDB is running.", 503, {
        detail: (e as Error).message,
      });
    }
    try {
      return await handler(req, ctx);
    } catch (e) {
      const err = e as { code?: number; name?: string; message?: string; keyValue?: Record<string, unknown> };
      if (err.code === 11000) return apiError(`Duplicate value: ${JSON.stringify(err.keyValue)}`, 409);
      if (err.name === "ValidationError" || err.name === "CastError") return apiError(err.message ?? "Invalid data", 400);
      console.error("[admin api]", e);
      return apiError("Something went wrong", 500);
    }
  };
}

export function clientIp(req: Request) {
  const h = req.headers;
  return (h.get("x-forwarded-for")?.split(",")[0] || h.get("x-real-ip") || "unknown").trim();
}
