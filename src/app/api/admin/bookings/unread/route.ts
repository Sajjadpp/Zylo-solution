import { adminRoute, json } from "@/lib/api";
import { Booking } from "@/models";
import { serialize } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Polled by the admin bell every ~15s. */
export const GET = adminRoute(async () => {
  const [count, latest] = await Promise.all([
    Booking.countDocuments({ seen: false }),
    Booking.find({ seen: false }).sort({ createdAt: -1 }).limit(6).select("name company service createdAt").lean(),
  ]);
  return json({ count, latest: serialize(latest) }, { headers: { "Cache-Control": "no-store" } });
});

/** Mark all as read. */
export const POST = adminRoute(async () => {
  await Booking.updateMany({ seen: false }, { $set: { seen: true } });
  return json({ ok: true });
});
