import { adminRoute, json } from "@/lib/api";
import { Booking, Post, Product, Project, PushSubscription, Service } from "@/models";
import { serialize } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = adminRoute(async () => {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [bookings, newBookings, thisWeek, services, products, projects, posts, devices, latest] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ status: "new" }),
    Booking.countDocuments({ createdAt: { $gte: weekAgo } }),
    Service.countDocuments(),
    Product.countDocuments(),
    Project.countDocuments(),
    Post.countDocuments(),
    PushSubscription.countDocuments(),
    Booking.find().sort({ createdAt: -1 }).limit(6).select("name company email service status seen createdAt").lean(),
  ]);
  return json({
    counts: { bookings, newBookings, thisWeek, services, products, projects, posts, devices },
    latest: serialize(latest),
  });
});
