import { adminRoute, json } from "@/lib/api";
import { Booking } from "@/models";
import { BOOKING_STATUSES } from "@/lib/site";
import { serialize } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const GET = adminRoute(async (req) => {
  const sp = new URL(req.url).searchParams;
  const q = sp.get("q")?.trim();
  const status = sp.get("status");
  const page = Math.max(1, Number(sp.get("page") || 1));
  const limit = Math.min(100, Math.max(5, Number(sp.get("limit") || 25)));

  const filter: Record<string, unknown> = {};
  if (status && (BOOKING_STATUSES as readonly string[]).includes(status)) filter.status = status;
  if (q) {
    const re = { $regex: escapeRe(q), $options: "i" };
    filter.$or = [{ name: re }, { email: re }, { company: re }, { phone: re }, { service: re }];
  }

  const [items, total, counts] = await Promise.all([
    Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-notes -userAgent -ip")
      .lean(),
    Booking.countDocuments(filter),
    Booking.aggregate<{ _id: string; n: number }>([{ $group: { _id: "$status", n: { $sum: 1 } } }]),
  ]);

  return json({
    items: serialize(items),
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
    counts: Object.fromEntries(counts.map((c) => [c._id, c.n])),
  });
});
