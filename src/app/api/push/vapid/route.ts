export const dynamic = "force-dynamic";

/** Public VAPID key (safe to expose) used by the admin browser to create a push subscription. */
export async function GET() {
  const key = process.env.VAPID_PUBLIC_KEY;
  if (!key) return Response.json({ error: "Push notifications are not configured" }, { status: 503 });
  return Response.json({ publicKey: key });
}
