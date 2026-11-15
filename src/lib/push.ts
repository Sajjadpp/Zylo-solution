import "server-only";
import * as webpush from "web-push";
import { PushSubscription } from "@/models";
import { SITE } from "@/lib/site";

let configured = false;

export function isPushConfigured() {
  return Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
}

function configure() {
  if (configured) return;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || `mailto:${SITE.email}`,
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  );
  configured = true;
}

export interface PushPayload {
  title: string;
  body: string;
  url: string;
  tag?: string;
}

/** Sends a notification to every stored admin device; prunes expired subscriptions. Requires an open DB connection. */
export async function notifyAdmins(payload: PushPayload) {
  if (!isPushConfigured()) {
    console.warn("[push] VAPID keys not configured – skipping push notification");
    return { sent: 0, removed: 0 };
  }
  configure();
  const subs = await PushSubscription.find().lean<{ _id: unknown; endpoint: string; keys: { p256dh: string; auth: string } }[]>();
  let sent = 0;
  const expired: unknown[] = [];
  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: s.keys }, JSON.stringify(payload), { TTL: 60 * 60 * 24 });
        sent++;
      } catch (e) {
        const code = (e as { statusCode?: number }).statusCode;
        if (code === 404 || code === 410) expired.push(s._id);
        else console.error("[push] send failed:", code, (e as Error).message);
      }
    }),
  );
  if (expired.length) await PushSubscription.deleteMany({ _id: { $in: expired } });
  return { sent, removed: expired.length };
}
