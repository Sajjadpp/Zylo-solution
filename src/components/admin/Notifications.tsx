"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, BellOff, BellRing, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/components/admin/client";
import { cn, formatDate } from "@/lib/utils";

const POLL_MS = 15_000;
export const BOOKINGS_CHANGED = "zylo:bookings-changed";

type Unread = { count: number; latest: { _id: string; name: string; company?: string; service?: string; createdAt: string }[] };

/** Bell with unread badge. Polls every 15s (paused in background tabs) and reacts instantly to push messages. */
export function NotificationBell() {
  const [data, setData] = useState<Unread>({ count: 0, latest: [] });
  const [open, setOpen] = useState(false);
  const seenIds = useRef<Set<string> | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const d = await api<Unread>("/api/admin/bookings/unread");
      if (seenIds.current) {
        const fresh = d.latest.filter((b) => !seenIds.current!.has(b._id));
        if (fresh.length) {
          fresh.slice(0, 2).forEach((b) =>
            toast(`New demo request from ${b.name}`, {
              description: [b.company, b.service].filter(Boolean).join(" · ") || undefined,
              action: { label: "Open", onClick: () => (window.location.href = `/admin/bookings/${b._id}`) },
            }),
          );
          window.dispatchEvent(new Event(BOOKINGS_CHANGED));
        }
      }
      seenIds.current = new Set(d.latest.map((b) => b._id));
      setData(d);
    } catch {
      /* offline / DB down – keep last state */
    }
  }, []);

  useEffect(() => {
    load();
    let id = setInterval(load, POLL_MS);
    const onVis = () => {
      clearInterval(id);
      if (document.visibilityState === "visible") {
        load();
        id = setInterval(load, POLL_MS);
      }
    };
    const onSw = (e: MessageEvent) => e.data?.type === "booking:new" && load();
    const onChanged = () => load();
    document.addEventListener("visibilitychange", onVis);
    navigator.serviceWorker?.addEventListener("message", onSw);
    window.addEventListener("zylo:bookings-read", onChanged);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
      navigator.serviceWorker?.removeEventListener("message", onSw);
      window.removeEventListener("zylo:bookings-read", onChanged);
    };
  }, [load]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function markAll() {
    await api("/api/admin/bookings/unread", { method: "POST" }).catch(() => {});
    setData({ count: 0, latest: [] });
    seenIds.current = new Set();
    window.dispatchEvent(new Event(BOOKINGS_CHANGED));
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${data.count ? `, ${data.count} unread` : ""}`}
        aria-expanded={open}
        className="relative grid h-11 w-11 place-items-center rounded-full border border-line text-ink/80 transition hover:text-ink"
      >
        {data.count ? <BellRing className="h-5 w-5" aria-hidden /> : <Bell className="h-5 w-5" aria-hidden />}
        <AnimatePresence>
          {data.count > 0 && (
            <motion.span
              key={data.count}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-black"
            >
              {data.count > 99 ? "99+" : data.count}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute right-0 z-50 mt-2 w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-surface shadow-glow"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="text-sm font-semibold">New bookings</p>
              {data.count > 0 && (
                <button type="button" onClick={markAll} className="text-xs font-semibold text-hl hover:underline">
                  Mark all read
                </button>
              )}
            </div>
            {data.latest.length ? (
              <ul className="max-h-80 overflow-y-auto">
                {data.latest.map((b) => (
                  <li key={b._id}>
                    <Link
                      href={`/admin/bookings/${b._id}`}
                      onClick={() => setOpen(false)}
                      className="block border-b border-line px-4 py-3 transition last:border-0 hover:bg-ink/[0.04]"
                    >
                      <p className="text-sm font-medium">{b.name}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {[b.company, b.service].filter(Boolean).join(" · ") || "Demo request"} ·{" "}
                        {formatDate(b.createdAt, { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-8 text-center text-sm text-muted">You&apos;re all caught up.</p>
            )}
            <Link href="/admin/bookings" onClick={() => setOpen(false)} className="block border-t border-line px-4 py-3 text-center text-sm font-semibold hover:bg-ink/[0.04]">
              View all bookings
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

type PushState = "loading" | "unsupported" | "denied" | "off" | "on";

/** "Enable notifications": registers /sw.js, subscribes with the VAPID key and stores the subscription in MongoDB. */
export function PushToggle({ compact }: { compact?: boolean }) {
  const [state, setState] = useState<PushState>("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
        return setState("unsupported");
      }
      if (Notification.permission === "denied") return setState("denied");
      const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        // keep server copy fresh (e.g. after DB reset)
        api("/api/admin/push", { method: "POST", json: sub.toJSON() }).catch(() => {});
      }
      setState(sub ? "on" : "off");
    })().catch(() => setState("unsupported"));
  }, []);

  async function enable() {
    setBusy(true);
    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        setState(perm === "denied" ? "denied" : "off");
        toast.error("Notifications were not allowed in this browser.");
        return;
      }
      const { publicKey } = await api<{ publicKey: string }>("/api/push/vapid");
      const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      await navigator.serviceWorker.ready;
      const sub =
        (await reg.pushManager.getSubscription()) ??
        (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(publicKey) }));
      const r = await api<{ devices: number }>("/api/admin/push", { method: "POST", json: sub.toJSON() });
      setState("on");
      toast.success(`Notifications enabled on this device (${r.devices} device${r.devices === 1 ? "" : "s"} total).`);
    } catch (e) {
      toast.error((e as Error).message || "Could not enable notifications");
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration("/");
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await api("/api/admin/push", { method: "DELETE", json: { endpoint: sub.endpoint } });
        await sub.unsubscribe();
      }
      setState("off");
      toast.success("Notifications turned off for this device.");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function test() {
    try {
      const r = await api<{ sent: number }>("/api/admin/push", { method: "PUT" });
      toast.success(`Test sent to ${r.sent} device${r.sent === 1 ? "" : "s"}.`);
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  if (state === "loading") return null;
  if (state === "unsupported") {
    return compact ? null : <p className="text-xs text-muted">Push notifications are not supported in this browser (iPhone: add the admin to your Home Screen first).</p>;
  }
  if (state === "denied") {
    return (
      <span className={cn("inline-flex items-center gap-2 text-xs text-muted", compact && "hidden sm:inline-flex")}>
        <BellOff className="h-4 w-4" aria-hidden /> Notifications blocked in browser settings
      </span>
    );
  }
  if (state === "on") {
    return compact ? (
      <button type="button" onClick={test} className="hidden items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-600 sm:inline-flex" title="Send a test notification">
        <BellRing className="h-4 w-4" aria-hidden /> Notifications on
      </button>
    ) : (
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={test} className="btn-ghost">
          Send test notification
        </button>
        <button type="button" onClick={disable} disabled={busy} className="btn-ghost">
          Turn off on this device
        </button>
      </div>
    );
  }
  return (
    <button type="button" onClick={enable} disabled={busy} className={cn(compact ? "btn-primary !min-h-[40px] px-4 text-xs" : "btn-primary")}>
      {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Bell className="h-4 w-4" aria-hidden />}
      Enable notifications
    </button>
  );
}
