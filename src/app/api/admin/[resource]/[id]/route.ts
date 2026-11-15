import { revalidatePath } from "next/cache";
import { isValidObjectId } from "mongoose";
import { adminRoute, apiError, json } from "@/lib/api";
import { getResource } from "@/lib/resources.server";
import { zodMessage } from "@/lib/validators";
import { serialize } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ resource: string; id: string }> };

async function resolve(ctx: Ctx) {
  const { resource, id } = await ctx.params;
  const res = getResource(resource);
  if (!res) return { error: apiError("Unknown resource", 404) };
  if (!isValidObjectId(id)) return { error: apiError("Invalid id", 400) };
  return { res, id };
}

export const GET = adminRoute<Ctx>(async (_req, ctx) => {
  const r = await resolve(ctx);
  if ("error" in r) return r.error!;
  const item = await r.res.model.findById(r.id).lean();
  if (!item) return apiError("Not found", 404);
  return json({ item: serialize(item) });
});

export const PUT = adminRoute<Ctx>(async (req, ctx) => {
  const r = await resolve(ctx);
  if ("error" in r) return r.error!;
  const parsed = r.res.schema.safeParse(await req.json());
  if (!parsed.success) return apiError(zodMessage(parsed.error), 422);
  const item = await r.res.model
    .findByIdAndUpdate(r.id, parsed.data as object, { returnDocument: "after", runValidators: true })
    .lean();
  if (!item) return apiError("Not found", 404);
  revalidatePath("/", "layout");
  return json({ item: serialize(item) });
});

/** Partial update – used by the publish toggle in list views. */
export const PATCH = adminRoute<Ctx>(async (req, ctx) => {
  const r = await resolve(ctx);
  if ("error" in r) return r.error!;
  const body = (await req.json()) as { published?: unknown; featured?: unknown };
  const update: Record<string, boolean> = {};
  if (typeof body.published === "boolean") update.published = body.published;
  if (typeof body.featured === "boolean") update.featured = body.featured;
  if (!Object.keys(update).length) return apiError("Nothing to update", 400);
  const item = await r.res.model.findByIdAndUpdate(r.id, update, { returnDocument: "after" }).lean();
  if (!item) return apiError("Not found", 404);
  revalidatePath("/", "layout");
  return json({ item: serialize(item) });
});

export const DELETE = adminRoute<Ctx>(async (_req, ctx) => {
  const r = await resolve(ctx);
  if ("error" in r) return r.error!;
  const item = await r.res.model.findByIdAndDelete(r.id);
  if (!item) return apiError("Not found", 404);
  revalidatePath("/", "layout");
  return json({ ok: true });
});
