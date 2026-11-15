import { isValidObjectId } from "mongoose";
import { adminRoute, apiError, json } from "@/lib/api";
import { Booking } from "@/models";
import { bookingUpdateSchema, zodMessage } from "@/lib/validators";
import { serialize } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export const GET = adminRoute<Ctx>(async (_req, { params }) => {
  const { id } = await params;
  if (!isValidObjectId(id)) return apiError("Invalid id", 400);
  // Opening a booking marks it as read.
  const item = await Booking.findByIdAndUpdate(id, { seen: true }, { returnDocument: "after" }).lean();
  if (!item) return apiError("Booking not found", 404);
  return json({ item: serialize(item) });
});

export const PATCH = adminRoute<Ctx>(async (req, { params }) => {
  const { id } = await params;
  if (!isValidObjectId(id)) return apiError("Invalid id", 400);
  const parsed = bookingUpdateSchema.safeParse(await req.json());
  if (!parsed.success) return apiError(zodMessage(parsed.error), 422);
  const { note, ...rest } = parsed.data;
  const update: Record<string, unknown> = { $set: rest };
  if (note) update.$push = { notes: { text: note, createdAt: new Date() } };
  const item = await Booking.findByIdAndUpdate(id, update, { returnDocument: "after" }).lean();
  if (!item) return apiError("Booking not found", 404);
  return json({ item: serialize(item) });
});

export const DELETE = adminRoute<Ctx>(async (_req, { params }) => {
  const { id } = await params;
  if (!isValidObjectId(id)) return apiError("Invalid id", 400);
  const item = await Booking.findByIdAndDelete(id);
  if (!item) return apiError("Booking not found", 404);
  return json({ ok: true });
});
