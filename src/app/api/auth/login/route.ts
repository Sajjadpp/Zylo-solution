import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { apiError, clientIp, json } from "@/lib/api";
import { loginSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";
import { AUTH_COOKIE, authCookieOptions, signAdminToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limit = rateLimit(`login:${clientIp(req)}`, 8, 15 * 60 * 1000);
  if (!limit.ok) return apiError("Too many login attempts. Try again later.", 429);

  const parsed = loginSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return apiError("Enter a valid email and password", 422);

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const hash = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (!adminEmail || !hash || !process.env.JWT_SECRET) {
    return apiError("Admin login is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD_HASH and JWT_SECRET.", 500);
  }

  const emailOk = parsed.data.email.toLowerCase() === adminEmail;
  // Always run bcrypt so response time doesn't reveal whether the email matched.
  const passOk = await bcrypt.compare(parsed.data.password, hash);
  if (!emailOk || !passOk) return apiError("Incorrect email or password", 401);

  const token = await signAdminToken(adminEmail);
  (await cookies()).set(AUTH_COOKIE, token, authCookieOptions);
  return json({ ok: true });
}
