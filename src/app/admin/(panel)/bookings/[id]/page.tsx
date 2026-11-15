"use client";

import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, CalendarDays, Clock, Loader2, Mail, MessageSquare, Phone, StickyNote, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton, StatusSelect, useConfirm } from "@/components/admin/ui";
import { api } from "@/components/admin/client";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { formatDate } from "@/lib/utils";
import type { BookingDoc } from "@/types";

type Booking = BookingDoc & { _id: string; createdAt: string };

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const confirm = useConfirm();
  const [b, setB] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const { item } = await api<{ item: Booking }>(`/api/admin/bookings/${id}`);
      setB(item);
      window.dispatchEvent(new Event("zylo:bookings-read")); // opening marks it read → refresh the bell
    } catch (e) {
      setError((e as Error).message);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function patch(body: Record<string, unknown>, msg: string) {
    setSaving(true);
    try {
      const { item } = await api<{ item: Booking }>(`/api/admin/bookings/${id}`, { method: "PATCH", json: body });
      setB(item);
      toast.success(msg);
      return true;
    } catch (e) {
      toast.error((e as Error).message);
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    if (await patch({ note: note.trim() }, "Note added")) setNote("");
  }

  async function remove() {
    if (!b || !(await confirm({ title: `Delete booking from ${b.name}?`, message: "This cannot be undone." }))) return;
    try {
      await api(`/api/admin/bookings/${id}`, { method: "DELETE" });
      toast.success("Booking deleted");
      router.replace("/admin/bookings");
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <p className="text-red-700">{error}</p>
        <Link href="/admin/bookings" className="btn-ghost mt-6">
          Back to bookings
        </Link>
      </div>
    );
  }

  if (!b) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    );
  }

  const phoneDigits = b.phone.replace(/\D/g, "");
  const details = [
    { icon: Building2, label: "Company", value: b.company },
    { icon: Mail, label: "Email", value: b.email, href: `mailto:${b.email}` },
    { icon: Phone, label: "Phone / WhatsApp", value: b.phone, href: `tel:${b.phone.replace(/[^\d+]/g, "")}` },
    { icon: CalendarDays, label: "Preferred date", value: b.preferredDate ? formatDate(b.preferredDate, { dateStyle: "full" }) : "" },
    { icon: Clock, label: "Preferred time", value: b.preferredTime },
  ];

  return (
    <>
      <Link href="/admin/bookings" className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden /> All bookings
      </Link>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{b.name}</h1>
          <p className="mt-1 text-sm text-muted">
            {b.service || "General enquiry"} · received {formatDate(b.createdAt, { dateStyle: "medium", timeStyle: "short" })} · via {b.source}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusSelect value={b.status} onChange={(v) => patch({ status: v }, `Status changed to ${v}`)} />
          <button type="button" onClick={remove} className="btn-ghost !min-h-[40px] px-3 text-red-600" aria-label="Delete booking">
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="font-semibold">Details</h2>
            <dl className="mt-5 grid gap-5 sm:grid-cols-2">
              {details
                .filter((d) => d.value)
                .map((d) => (
                  <div key={d.label}>
                    <dt className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted">
                      <d.icon className="h-3.5 w-3.5" aria-hidden /> {d.label}
                    </dt>
                    <dd className="mt-1.5 text-sm font-medium">
                      {d.href ? (
                        <a href={d.href} className="hover:text-hl">
                          {d.value}
                        </a>
                      ) : (
                        d.value
                      )}
                    </dd>
                  </div>
                ))}
            </dl>
            {b.message && (
              <div className="mt-6 rounded-2xl border border-line bg-ink/[0.02] p-4">
                <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted">
                  <MessageSquare className="h-3.5 w-3.5" aria-hidden /> Message
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{b.message}</p>
              </div>
            )}
          </section>

          <section className="card p-6">
            <h2 className="flex items-center gap-2 font-semibold">
              <StickyNote className="h-4 w-4 text-hl" aria-hidden /> Internal notes
            </h2>
            <form onSubmit={addNote} className="mt-4">
              <label htmlFor="note" className="sr-only">
                Add a note
              </label>
              <textarea id="note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Called, demo set for Tuesday 11am…" className="input" />
              <button type="submit" disabled={saving || !note.trim()} className="btn-primary mt-3">
                {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} Add note
              </button>
            </form>
            {b.notes.length > 0 ? (
              <ul className="mt-6 space-y-3">
                {[...b.notes].reverse().map((n, i) => (
                  <li key={n._id ?? i} className="rounded-2xl border border-line bg-ink/[0.02] p-4">
                    <p className="whitespace-pre-wrap text-sm">{n.text}</p>
                    <p className="mt-2 text-xs text-muted">{formatDate(n.createdAt, { dateStyle: "medium", timeStyle: "short" })}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 text-sm text-muted">No notes yet. Notes are only visible to admins.</p>
            )}
          </section>
        </div>

        <aside className="card h-fit p-6">
          <h2 className="font-semibold">Quick actions</h2>
          <div className="mt-4 grid gap-2">
            <a
              href={`https://wa.me/${phoneDigits}?text=${encodeURIComponent(`Hello ${b.name.split(" ")[0]}, this is Zylo Solution regarding your demo request.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp justify-start"
            >
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp {b.name.split(" ")[0]}
            </a>
            <a href={`mailto:${b.email}?subject=${encodeURIComponent("Your Zylo Solution demo")}`} className="btn-ghost justify-start">
              <Mail className="h-4 w-4" aria-hidden /> Send email
            </a>
            <a href={`tel:${b.phone.replace(/[^\d+]/g, "")}`} className="btn-ghost justify-start">
              <Phone className="h-4 w-4" aria-hidden /> Call
            </a>
          </div>
          <p className="mt-6 text-xs text-muted">Tip: set the status to “scheduled” once the demo time is confirmed.</p>
        </aside>
      </div>
    </>
  );
}
