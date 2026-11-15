"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, BellRing, CalendarClock, FolderKanban, Inbox, Layers, Newspaper, Package } from "lucide-react";
import { PageTitle } from "@/components/admin/AdminShell";
import { PushToggle, BOOKINGS_CHANGED } from "@/components/admin/Notifications";
import { Skeleton, StatusBadge } from "@/components/admin/ui";
import { api } from "@/components/admin/client";
import { cn, formatDate } from "@/lib/utils";

type Overview = {
  counts: Record<"bookings" | "newBookings" | "thisWeek" | "services" | "products" | "projects" | "posts" | "devices", number>;
  latest: { _id: string; name: string; company?: string; email: string; service?: string; status: string; seen: boolean; createdAt: string }[];
};

export default function OverviewPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    api<Overview>("/api/admin/overview")
      .then((d) => {
        setData(d);
        setError("");
      })
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    load();
    window.addEventListener(BOOKINGS_CHANGED, load);
    return () => window.removeEventListener(BOOKINGS_CHANGED, load);
  }, [load]);

  const cards = data
    ? [
        { label: "Bookings", value: data.counts.bookings, sub: `${data.counts.newBookings} new · ${data.counts.thisWeek} this week`, href: "/admin/bookings", icon: Inbox },
        { label: "Services", value: data.counts.services, href: "/admin/services", icon: Layers },
        { label: "Products", value: data.counts.products, href: "/admin/products", icon: Package },
        { label: "Projects", value: data.counts.projects, href: "/admin/work", icon: FolderKanban },
        { label: "Blog posts", value: data.counts.posts, href: "/admin/blog", icon: Newspaper },
      ]
    : [];

  return (
    <>
      <PageTitle title="Overview" description="Your website and booking activity at a glance." />

      {error && (
        <p role="alert" className="mb-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {data
          ? cards.map((c) => (
              <Link key={c.label} href={c.href} className={cn("card p-5 transition hover:-translate-y-0.5 hover:border-primary/40", c.label === "Bookings" && "sm:col-span-2 lg:col-span-1")}>
                <c.icon className="h-5 w-5 text-hl" aria-hidden />
                <p className="mt-4 font-display text-3xl font-bold">{c.value}</p>
                <p className="text-sm text-muted">{c.label}</p>
                {c.sub && <p className="mt-1 text-xs text-hl">{c.sub}</p>}
              </Link>
            ))
          : Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-3xl" />)}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="flex items-center gap-2 font-semibold">
              <CalendarClock className="h-4 w-4 text-hl" aria-hidden /> Latest bookings
            </h2>
            <Link href="/admin/bookings" className="inline-flex items-center gap-1 text-sm font-semibold text-hl hover:underline">
              View all <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          {!data ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14" />
              ))}
            </div>
          ) : data.latest.length ? (
            <ul>
              {data.latest.map((b) => (
                <li key={b._id}>
                  <Link href={`/admin/bookings/${b._id}`} className="flex items-center gap-4 border-b border-line px-5 py-3.5 transition last:border-0 hover:bg-ink/[0.03]">
                    <span className={cn("h-2 w-2 shrink-0 rounded-full", b.seen ? "bg-transparent" : "bg-accent")} aria-label={b.seen ? undefined : "Unread"} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {b.name}
                        {b.company && <span className="text-muted"> · {b.company}</span>}
                      </span>
                      <span className="block truncate text-xs text-muted">
                        {b.service || "General enquiry"} · {formatDate(b.createdAt, { dateStyle: "medium", timeStyle: "short" })}
                      </span>
                    </span>
                    <StatusBadge status={b.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-12 text-center text-sm text-muted">No bookings yet. They will appear here the moment someone books a demo.</p>
          )}
        </section>

        <section className="card p-5">
          <h2 className="flex items-center gap-2 font-semibold">
            <BellRing className="h-4 w-4 text-hl" aria-hidden /> Instant alerts
          </h2>
          <p className="mt-2 text-sm text-muted">
            Get a push notification on this device for every new demo request. Enable it on each phone or computer you use.
          </p>
          {data && <p className="mt-3 text-xs text-muted">Subscribed devices: {data.counts.devices}</p>}
          <div className="mt-5">
            <PushToggle />
          </div>
        </section>
      </div>
    </>
  );
}
