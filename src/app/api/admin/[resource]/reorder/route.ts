import { revalidatePath } from "next/cache";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { adminRoute, apiError, json } from "@/lib/api";
import { getResource } from "@/lib/resources.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ resource: string }> };
const bodySchema = z.object({ ids: z.array(z.string().refine(isValidObjectId)).min(1).max(500) });

/** Saves drag-and-drop order: position in `ids` becomes sortOrder (1-based). */
export const PUT = adminRoute<Ctx>(async (req, { params }) => {
  const res = getResource((await params).resource);
  if (!res || !res.reorderable) return apiError("Resource cannot be reordered", 400);
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) return apiError("Invalid ids", 422);
  await res.model.bulkWrite(
    parsed.data.ids.map((id, i) => ({ updateOne: { filter: { _id: id }, update: { $set: { sortOrder: i + 1 } } } })),
  );
  revalidatePath("/", "layout");
  return json({ ok: true });
});
