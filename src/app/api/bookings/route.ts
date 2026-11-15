import { after } from "next/server";
import { apiError, clientIp, json } from "@/lib/api";
import { bookingSchema, zodMessage } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";
import { connectDB } from "@/lib/db";
import { Booking } from "@/models";
import { sendBookingEmails } from "@/lib/mail";
import { notifyAdmins } from "@/lib/push";
import { serialize } from "@/lib/utils";
import type { BookingDoc } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_FILL_MS = 2500; // humans need a few seconds to fill the form

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limit = rateLimit(`booking:${ip}`, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return apiError("Too many requests. Please try again in a few minutes or WhatsApp us.", 429, {
      retryAfter: limit.retryAfter,
    });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return apiError("Invalid request body", 400);
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(zodMessage(parsed.error), 422, { fields: parsed.error.flatten().fieldErrors });
  }
  const { website, startedAt, ...data } = parsed.data;

  // Honeypot filled or form submitted impossibly fast → pretend success, store nothing.
  if (website || (startedAt && Date.now() - startedAt < MIN_FILL_MS)) {
    return json({ ok: true });
  }

  try {
    await connectDB();
  } catch (e) {
    console.error("[booking] DB unavailable:", (e as Error).message);
    return apiError("We could not save your request right now. Please WhatsApp or call us on +973 3435 1010.", 503);
  }

  const doc = await Booking.create({
    ...data,
    status: "new",
    seen: false,
    ip,
    userAgent: req.headers.get("user-agent")?.slice(0, 300) ?? "",
  });
  const booking = serialize<BookingDoc & { _id: string }>(doc.toObject());

  // Email + push run after the response is sent, so the visitor gets instant feedback.
  after(async () => {
    await Promise.allSettled([
      sendBookingEmails(booking),
      notifyAdmins({
        title: `New demo request from ${booking.name}`,
        body: [booking.company, booking.service].filter(Boolean).join(" · ") || booking.email,
        url: `/admin/bookings/${booking._id}`,
        tag: `booking-${booking._id}`,
      }),
    ]);
  });

  return json({ ok: true, id: booking._id }, 201);
}
