import { revalidatePath } from "next/cache";
import { adminRoute, apiError, json } from "@/lib/api";
import { Settings } from "@/models";
import { settingsSchema, zodMessage } from "@/lib/validators";
import { settingsSeed } from "@/data/settings";
import { serialize } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = adminRoute(async () => {
  const s = await Settings.findOne().lean();
  return json({ item: serialize(s ?? settingsSeed) });
});

export const PUT = adminRoute(async (req) => {
  const parsed = settingsSchema.safeParse(await req.json());
  if (!parsed.success) return apiError(zodMessage(parsed.error), 422);
  const item = await Settings.findOneAndUpdate({}, parsed.data, { returnDocument: "after", upsert: true, setDefaultsOnInsert: true }).lean();
  revalidatePath("/", "layout");
  return json({ item: serialize(item) });
});
