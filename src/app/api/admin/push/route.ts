import { adminRoute, apiError, json } from "@/lib/api";
import { PushSubscription } from "@/models";
import { pushSubscriptionSchema } from "@/lib/validators";
import { notifyAdmins } from "@/lib/push";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Store (or refresh) this device's push subscription. */
export const POST = adminRoute(async (req) => {
  const parsed = pushSubscriptionSchema.safeParse(await req.json());
  if (!parsed.success) return apiError("Invalid subscription", 422);
  await PushSubscription.findOneAndUpdate(
    { endpoint: parsed.data.endpoint },
    { ...parsed.data, userAgent: req.headers.get("user-agent")?.slice(0, 300) },
    { upsert: true, returnDocument: "after" },
  );
  const count = await PushSubscription.countDocuments();
  return json({ ok: true, devices: count });
});

/** Remove this device's subscription. */
export const DELETE = adminRoute(async (req) => {
  const { endpoint } = (await req.json().catch(() => ({}))) as { endpoint?: string };
  if (endpoint) await PushSubscription.deleteOne({ endpoint });
  return json({ ok: true });
});

/** Send a test notification to every subscribed device. */
export const PUT = adminRoute(async () => {
  const r = await notifyAdmins({
    title: "Test notification",
    body: "Push notifications are working on this device.",
    url: "/admin/bookings",
    tag: "test",
  });
  return json(r);
});
