import { connectDB, dbState, isDbConfigured } from "@/lib/db";
import { isMailConfigured } from "@/lib/mail";
import { isPushConfigured } from "@/lib/push";
import { isCloudinaryConfigured } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  let db = "not-configured";
  if (isDbConfigured()) {
    try {
      const conn = await connectDB();
      await conn.connection.db?.admin().ping();
      db = dbState();
    } catch {
      db = "unreachable";
    }
  }
  const healthy = db === "connected";
  return Response.json(
    {
      status: healthy ? "ok" : "degraded",
      db,
      services: { email: isMailConfigured(), push: isPushConfigured(), uploads: isCloudinaryConfigured() },
      uptime: Math.round(process.uptime()),
      time: new Date().toISOString(),
    },
    { status: healthy ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
