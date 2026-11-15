"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageTitle } from "@/components/admin/AdminShell";
import { BOOKINGS_CHANGED } from "@/components/admin/Notifications";
import { StatusSelect, TableSkeleton, useConfirm } from "@/components/admin/ui";
import { api } from "@/components/admin/client";
import { BOOKING_STATUSES } from "@/lib/site";
import { cn, formatDate } from "@/lib/utils";
import type { BookingDoc } from "@/types";

type Row = BookingDoc & { _id: string; createdAt: string };
type Resp = { items: Row[]; total: number; page: number; pages: number; counts: Record<string, number> };

export default function BookingsPage() {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Resp | null>(null);
  const [error, setError] = useState("");
  const confirm = useConfirm();

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(q);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  const load = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (debounced) params.set("q", debounced);
      if (status) params.set("status", status);
      setData(await api<Resp>(`/api/admin/bookings?${params}`));
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  }, [page, debounced, status]);

  useEffect(() => {
    load();
  }, [load]);

  // New bookings detected by the bell → refresh instantly.
  useEffect(() => {
    window.addEventListener(BOOKINGS_CHANGED, load);
    return () => window.removeEventListener(BOOKINGS_CHANGED, load);
  }, [load]);

  async function changeStatus(id: string, next: string) {
    setData((d) => d && { ...d, items: d.items.map((r) => (r._id === id ? { ...r, status: next as Row["status"] } : r)) });
    try {
      await api(`/api/admin/bookings/${id}`, { method: "PATCH", json: { status: next } });
      toast.success(`Status changed to ${next}`);
      load();
    } catch (e) {
      toast.error((e as Error).message);
      load();
    }
  }

  async function remove(row: Row) {
    if (!(await confirm({ title: `Delete booking from ${row.name}?`, message: "This permanently removes the booking and its notes." }))) return;
    try {
      await api(`/api/admin/bookings/${row._id}`, { method: "DELETE" });
      toast.success("Booking deleted");
      load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  const total = data ? Object.values(data.counts).reduce((a, b) => a + b, 0) : 0;
  const tabs = [{ key: "", label: "All", n: total }, ...BOOKING_STATUSES.map((s) => ({ key: s, label: s, n: data?.counts[s] ?? 0 }))];

  return (
    <>
      <PageTitle title="Bookings" description="Demo requests and enquiries from the website." />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 lg:mx-0 lg:px-0" role="tablist" aria-label="Filter by status">
          {tabs.map((t) => (
            <button
              key={t.key || "all"}
              type="button"
              role="tab"
              aria-selected={status === t.key}
              onClick={() => {
                setStatus(t.key);
                setPage(1);
              }}
              className={cn(
                "inline-flex min-h-[40px] shrink-0 items-center gap-2 rounded-full border px-3.5 text-sm capitalize transition",
                status === t.key ? "border-primary bg-primary text-white" : "border-line text-muted hover:text-ink",
              )}
            >
              {t.label}
              <span className="rounded-full bg-ink/10 px-1.5 text-[11px] tabular-nums">{t.n}</span>
            </button>
          ))}
        </div>
        <label className="relative block lg:w-72">
          <span className="sr-only">Search bookings</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, company…" className="input pl-10" />
        </label>
      </div>

      {error && <p className="mb-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="card overflow-hidden">
        {!data ? (
          <TableSkeleton />
        ) : data.items.length === 0 ? (
          <p className="px-5 py-16 text-center text-sm text-muted">No bookings found.</p>
        ) : (
          <>
            {/* desktop table */}
            <table className="hidden w-full text-left text-sm md:table">
              <thead className="border-b border-line text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-3 py-3 font-medium">Service</th>
                  <th className="px-3 py-3 font-medium">Preferred</th>
                  <th className="px-3 py-3 font-medium">Received</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {data.items.map((r) => (
                  <tr key={r._id} className="border-b border-line last:border-0 hover:bg-ink/[0.02]">
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/bookings/${r._id}`} className="group flex items-center gap-2.5">
                        <span className={cn("h-2 w-2 shrink-0 rounded-full", r.seen ? "bg-transparent" : "bg-accent")} />
                        <span>
                          <span className="block font-medium group-hover:text-hl">{r.name}</span>
                          <span className="block text-xs text-muted">{r.company || r.email}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-3 py-3.5 text-muted">{r.service || "—"}</td>
                    <td className="px-3 py-3.5 text-xs text-muted">
                      {r.preferredDate ? formatDate(r.preferredDate) : "—"}
                      {r.preferredTime && <span className="block">{r.preferredTime.split(" (")[0]}</span>}
                    </td>
                    <td className="px-3 py-3.5 text-xs text-muted">{formatDate(r.createdAt, { dateStyle: "medium", timeStyle: "short" })}</td>
                    <td className="px-3 py-3.5">
                      <StatusSelect value={r.status} onChange={(v) => changeStatus(r._id, v)} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button type="button" onClick={() => remove(r)} aria-label={`Delete booking from ${r.name}`} className="grid h-9 w-9 place-items-center rounded-full text-muted transition hover:bg-red-500/10 hover:text-red-600">
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* mobile cards */}
            <ul className="md:hidden">
              {data.items.map((r) => (
                <li key={r._id} className="border-b border-line p-4 last:border-0">
                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/admin/bookings/${r._id}`} className="min-w-0">
                      <p className="flex items-center gap-2 font-medium">
                        {!r.seen && <span className="h-2 w-2 rounded-full bg-accent" />}
                        {r.name}
                      </p>
                      <p className="truncate text-xs text-muted">{[r.company, r.service].filter(Boolean).join(" · ") || r.email}</p>
                      <p className="mt-1 text-xs text-muted">{formatDate(r.createdAt, { dateStyle: "medium", timeStyle: "short" })}</p>
                    </Link>
                    <button type="button" onClick={() => remove(r)} aria-label={`Delete booking from ${r.name}`} className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-muted hover:text-red-600">
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                  <div className="mt-3">
                    <StatusSelect value={r.status} onChange={(v) => changeStatus(r._id, v)} />
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {data && data.pages > 1 && (
        <div className="mt-5 flex items-center justify-between text-sm text-muted">
          <span>
            Page {data.page} of {data.pages} · {data.total} bookings
          </span>
          <div className="flex gap-2">
            <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="btn-ghost !min-h-[40px] px-3" aria-label="Previous page">
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <button type="button" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)} className="btn-ghost !min-h-[40px] px-3" aria-label="Next page">
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
