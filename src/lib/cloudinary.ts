import "server-only";
import { v2 as cloudinary } from "cloudinary";

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET,
  );
}

/** Uploads an image buffer and returns its secure URL. Only the URL is stored in MongoDB. */
export async function uploadImage(buffer: Buffer, filename: string) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return new Promise<{ url: string; width: number; height: number }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: process.env.CLOUDINARY_FOLDER || "zylo",
        resource_type: "image",
        public_id: filename.replace(/\.[^.]+$/, "").replace(/[^a-z0-9-_]/gi, "-").slice(0, 60) + "-" + Date.now(),
        overwrite: false,
      },
      (err, result) => {
        if (err || !result) return reject(err ?? new Error("Upload failed"));
        resolve({ url: result.secure_url, width: result.width, height: result.height });
      },
    );
    stream.end(buffer);
  });
}
