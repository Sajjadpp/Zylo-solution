import { apiError, json, requireAdmin } from "@/lib/api";
import { isCloudinaryConfigured, uploadImage } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif", "image/svg+xml"];

export async function POST(req: Request) {
  if (!(await requireAdmin())) return apiError("Unauthorized", 401);
  if (!isCloudinaryConfigured()) {
    return apiError("Image uploads are not configured. Add CLOUDINARY_* env vars, or paste an image URL instead.", 503);
  }
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return apiError("No file received", 400);
  if (!TYPES.includes(file.type)) return apiError("Only JPG, PNG, WebP, AVIF, GIF or SVG images are allowed", 415);
  if (file.size > MAX_BYTES) return apiError("Image must be 8 MB or smaller", 413);
  try {
    const result = await uploadImage(Buffer.from(await file.arrayBuffer()), file.name);
    return json(result, 201);
  } catch (e) {
    console.error("[upload]", e);
    return apiError("Upload failed. Check your Cloudinary credentials.", 502);
  }
}
