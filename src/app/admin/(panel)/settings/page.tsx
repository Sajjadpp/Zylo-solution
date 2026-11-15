"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { PageTitle } from "@/components/admin/AdminShell";
import { PushToggle } from "@/components/admin/Notifications";
import { Skeleton } from "@/components/admin/ui";
import { api } from "@/components/admin/client";
import type { SettingsDoc } from "@/types";

export default function SettingsPage() {
  const [s, setS] = useState<SettingsDoc | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ item: SettingsDoc }>("/api/admin/settings")
      .then(({ item }) => setS({ ...item, social: item.social ?? {}, stats: item.stats ?? { years: 10, projects: 200 } }))
      .catch((e) => setError(e.message));
  }, []);

  const set = (path: string, value: string | number) =>
    setS((prev) => {
      if (!prev) return prev;
      const [a, b] = path.split(".");
      if (b) return { ...prev, [a]: { ...(prev[a as keyof SettingsDoc] as object), [b]: value } };
      return { ...prev, [a]: value };
    });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!s) return;
    setSaving(true);
    try {
      const { phone, email, whatsapp, address, hours, social, stats } = s;
      await api("/api/admin/settings", { method: "PUT", json: { phone, email, whatsapp, address, hours, social, stats } });
      toast.success("Settings saved. The website updates within a minute.");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (error) return <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">{error}</p>;
  if (!s)
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );

  const input = (path: string, label: string, opts: { type?: string; help?: string; placeholder?: string } = {}) => {
    const [a, b] = path.split(".");
    const raw = b ? (s[a as keyof SettingsDoc] as Record<string, unknown>)?.[b] : s[a as keyof SettingsDoc];
    return (
      <div>
        <label htmlFor={path} className="label">
          {label}
        </label>
        <input
          id={path}
          type={opts.type ?? "text"}
          value={(raw as string | number | undefined) ?? ""}
          placeholder={opts.placeholder}
          onChange={(e) => set(path, opts.type === "number" ? Number(e.target.value) : e.target.value)}
          className="input"
        />
        {opts.help && <p className="mt-1 text-xs text-muted">{opts.help}</p>}
      </div>
    );
  };

  return (
    <>
      <PageTitle title="Settings" description="Contact details, social links and homepage stats used across the website." />
      <form onSubmit={save} className="space-y-6">
        <section className="card grid gap-5 p-6 sm:grid-cols-2">
          <h2 className="font-semibold sm:col-span-2">Contact</h2>
          {input("phone", "Phone")}
          {input("email", "Email", { type: "email" })}
          {input("whatsapp", "WhatsApp number", { help: "Digits only with country code, e.g. 97334351010" })}
          {input("hours", "Working hours")}
          <div className="sm:col-span-2">{input("address", "Address")}</div>
        </section>
        <section className="card grid gap-5 p-6 sm:grid-cols-2">
          <h2 className="font-semibold sm:col-span-2">Social links</h2>
          {input("social.linkedin", "LinkedIn URL", { type: "url", placeholder: "https://" })}
          {input("social.instagram", "Instagram URL", { type: "url", placeholder: "https://" })}
          {input("social.facebook", "Facebook URL", { type: "url", placeholder: "https://" })}
          {input("social.x", "X (Twitter) URL", { type: "url", placeholder: "https://" })}
          {input("social.youtube", "YouTube URL", { type: "url", placeholder: "https://" })}
        </section>
        <section className="card grid gap-5 p-6 sm:grid-cols-2">
          <h2 className="font-semibold sm:col-span-2">Homepage stats</h2>
          {input("stats.years", "Years of experience", { type: "number" })}
          {input("stats.projects", "Projects delivered", { type: "number" })}
        </section>
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />} Save settings
          </button>
        </div>
      </form>

      <section className="card mt-8 p-6">
        <h2 className="font-semibold">Push notifications on this device</h2>
        <p className="mb-4 mt-1 text-sm text-muted">Receive an alert on this browser whenever a new demo request arrives.</p>
        <PushToggle />
      </section>
    </>
  );
}
