import { revalidatePath } from "next/cache";
import { adminRoute, apiError, json } from "@/lib/api";
import { getResource } from "@/lib/resources.server";
import { zodMessage } from "@/lib/validators";
import { serialize } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ resource: string }> };

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const GET = adminRoute<Ctx>(async (req, { params }) => {
  const res = getResource((await params).resource);
  if (!res) return apiError("Unknown resource", 404);
  const q = new URL(req.url).searchParams.get("q")?.trim();
  const filter = q ? { $or: res.searchFields.map((f) => ({ [f]: { $regex: escapeRe(q), $options: "i" } })) } : {};
  const items = await res.model
    .find(filter)
    .sort(res.sort)
    .select("-longDescription -content -challenge -solution")
    .lean();
  return json({ items: serialize(items) });
});

export const POST = adminRoute<Ctx>(async (req, { params }) => {
  const res = getResource((await params).resource);
  if (!res) return apiError("Unknown resource", 404);
  const parsed = res.schema.safeParse(await req.json());
  if (!parsed.success) return apiError(zodMessage(parsed.error), 422);
  const data = parsed.data as Record<string, unknown>;
  if (res.reorderable && !data.sortOrder) {
    const last = await res.model.findOne().sort({ sortOrder: -1 }).select("sortOrder").lean<{ sortOrder?: number }>();
    data.sortOrder = (last?.sortOrder ?? 0) + 1;
  }
  const doc = await res.model.create(data);
  revalidatePath("/", "layout");
  return json({ item: serialize(doc.toObject()) }, 201);
});
