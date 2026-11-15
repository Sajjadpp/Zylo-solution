import mongoose from "mongoose";

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null; failedAt: number };

const g = globalThis as unknown as { __mongoose?: Cache };
const cache: Cache = g.__mongoose ?? (g.__mongoose = { conn: null, promise: null, failedAt: 0 });

/** How long to skip reconnect attempts after a failure (keeps builds/pages fast when the DB is down). */
const RETRY_AFTER_MS = 15_000;

export function isDbConfigured() {
  return Boolean(process.env.MONGODB_URI);
}

/**
 * Connect to MongoDB (local or Atlas – same code path, only MONGODB_URI changes).
 * The connection is cached on globalThis so hot reloads and serverless invocations reuse it.
 */
export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (cache.conn && mongoose.connection.readyState === 1) return cache.conn;
  if (!cache.promise) {
    if (cache.failedAt && Date.now() - cache.failedAt < RETRY_AFTER_MS) {
      throw new Error("MongoDB recently unreachable – skipping reconnect");
    }
    mongoose.set("strictQuery", true);
    cache.promise = mongoose
      .connect(uri, { bufferCommands: false, serverSelectionTimeoutMS: 5000, maxPoolSize: 10 })
      .then((m) => {
        cache.failedAt = 0;
        return m;
      })
      .catch((err) => {
        cache.promise = null;
        cache.failedAt = Date.now();
        throw err;
      });
  }
  cache.conn = await cache.promise;
  return cache.conn;
}

export function dbState() {
  return ["disconnected", "connected", "connecting", "disconnecting"][mongoose.connection.readyState] ?? "unknown";
}
