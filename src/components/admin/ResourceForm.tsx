"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Loader2, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { FaqField, FieldShell, GalleryField, IconField, ImageField, ListField, MarkdownField } from "@/components/admin/Fields";
import { Skeleton, Toggle, useConfirm } from "@/components/admin/ui";
import { api } from "@/components/admin/client";
import { GROUP_LABELS, type FieldDef, type ResourceConfig } from "@/lib/admin-config";
import { slugify } from "@/lib/utils";

type Doc = Record<string, unknown> & { _id?: string };

function toDateInput(v: unknown) {
  if (!v) return "";
  const d = new Date(v as string);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

export function ResourceForm({ config, id }: { config: ResourceConfig; id: string }) {
  const isNew = id === "new";
  const router = useRouter();
  const confirm = useConfirm();
  const [doc, setDoc] = useState<Doc | null>(isNew ? { ...config.defaults } : null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);
  const slugTouched = useRef(!isNew);

  useEffect(() => {
    if (isNew) return;
    api<{ item: Doc }>(`/api/admin/${config.key}/${id}`)
      .then(({ item }) => setDoc(item))
      .catch((e) => setError(e.message));
  }, [config.key, id, isNew]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const groups = useMemo(() => {
    const g = new Map<FieldDef["group"], FieldDef[]>();
    for (const f of config.fields) g.set(f.group, [...(g.get(f.group) ?? []), f]);
    return Array.from(g.entries());
  }, [config.fields]);

  const set = (name: string, value: unknown) => {
    setDirty(true);
    setDoc((d) => {
      const next = { ...d, [name]: value };
      if (name === "title" && !slugTouched.current) next.slug = slugify(String(value));
      if (name === "slug") slugTouched.current = true;
      return next;
    });
  };

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!doc) return;
    setSaving(true);
    try {
      const payload: Doc = {};
      for (const f of config.fields) {
        let v = doc[f.name];
        if (f.type === "list" || f.type === "gallery") v = ((v as string[]) ?? []).map((s) => s.trim()).filter(Boolean);
        if (f.type === "faqs") v = ((v as { q: string; a: string }[]) ?? []).filter((x) => x.q.trim() && x.a.trim());
        if (f.type === "toggle") v = Boolean(v);
        if (v === undefined || v === null) v = f.type === "number" ? undefined : "";
        payload[f.name] = v;
      }
      if (config.reorderable && doc.sortOrder !== undefined) payload.sortOrder = doc.sortOrder;
      const { item } = await api<{ item: Doc }>(isNew ? `/api/admin/${config.key}` : `/api/admin/${config.key}/${id}`, {
        method: isNew ? "POST" : "PUT",
        json: payload,
      });
      setDirty(false);
      toast.success(isNew ? `${config.singular[0].toUpperCase()}${config.singular.slice(1)} created` : "Changes saved");
      if (isNew) router.replace(`/admin/${config.key}/${item._id}`);
      else setDoc(item);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!doc?._id) return;
    if (!(await confirm({ title: `Delete “${String(doc.title)}”?`, message: "This cannot be undone." }))) return;
    try {
      await api(`/api/admin/${config.key}/${doc._id}`, { method: "DELETE" });
      setDirty(false);
      toast.success("Deleted");
      router.replace(`/admin/${config.key}`);
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <p className="text-red-700">{error}</p>
        <Link href={`/admin/${config.key}`} className="btn-ghost mt-6">
          Back
        </Link>
      </div>
    );
  }
  if (!doc) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-72 rounded-3xl" />
        <Skeleton className="h-72 rounded-3xl" />
      </div>
    );
  }

  const render = (f: FieldDef) => {
    const id = `f-${f.name}`;
    const v = doc[f.name];
    const str = (v as string) ?? "";
    switch (f.type) {
      case "text":
      case "slug":
        return (
          <FieldShell key={f.name} id={id} label={f.label} help={f.help} required={f.required} count={f.max ? { n: str.length, max: f.max } : undefined}>
            <input
              id={id}
              value={str}
              required={f.required}
              placeholder={f.placeholder}
              onChange={(e) => set(f.name, f.type === "slug" ? e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") : e.target.value)}
              className="input"
            />
          </FieldShell>
        );
      case "textarea":
        return (
          <FieldShell key={f.name} id={id} label={f.label} help={f.help} count={f.max ? { n: str.length, max: f.max } : undefined}>
            <textarea id={id} value={str} rows={f.rows ?? 4} onChange={(e) => set(f.name, e.target.value)} className="input" />
          </FieldShell>
        );
      case "number":
        return (
          <FieldShell key={f.name} id={id} label={f.label} help={f.help}>
            <input id={id} type="number" value={(v as number) ?? ""} onChange={(e) => set(f.name, e.target.value === "" ? undefined : Number(e.target.value))} className="input" />
          </FieldShell>
        );
      case "date":
        return (
          <FieldShell key={f.name} id={id} label={f.label} help={f.help}>
            <input id={id} type="date" value={toDateInput(v)} onChange={(e) => set(f.name, e.target.value)} className="input" />
          </FieldShell>
        );
      case "toggle":
        return (
          <div key={f.name} className="flex items-center justify-between gap-4 rounded-xl border border-line px-4 py-3">
            <span className="text-sm font-medium">{f.label}</span>
            <Toggle checked={Boolean(v)} onChange={(x) => set(f.name, x)} label={f.label} />
          </div>
        );
      case "markdown":
        return (
          <FieldShell key={f.name} id={id} label={f.label} help={f.help}>
            <MarkdownField id={id} value={str} onChange={(x) => set(f.name, x)} />
          </FieldShell>
        );
      case "list":
        return (
          <FieldShell key={f.name} id={id} label={f.label} help={f.help}>
            <ListField id={id} value={(v as string[]) ?? []} onChange={(x) => set(f.name, x)} />
          </FieldShell>
        );
      case "faqs":
        return (
          <FieldShell key={f.name} id={id} label={f.label} help={f.help}>
            <FaqField value={(v as { q: string; a: string }[]) ?? []} onChange={(x) => set(f.name, x)} />
          </FieldShell>
        );
      case "image":
        return (
          <FieldShell key={f.name} id={id} label={f.label} help={f.help ?? "Upload to Cloudinary or use a path like /images/services/name.jpg"}>
            <ImageField id={id} value={str} onChange={(x) => set(f.name, x)} />
          </FieldShell>
        );
      case "gallery":
        return (
          <FieldShell key={f.name} id={id} label={f.label} help={f.help}>
            <GalleryField value={(v as string[]) ?? []} onChange={(x) => set(f.name, x)} />
          </FieldShell>
        );
      case "icon":
        return (
          <FieldShell key={f.name} id={id} label={f.label} help={f.help}>
            <IconField value={str} onChange={(x) => set(f.name, x)} />
          </FieldShell>
        );
    }
  };

  const mainGroups = groups.filter(([g]) => g !== "publish" && g !== "seo");
  const side = groups.filter(([g]) => g === "publish" || g === "seo");

  return (
    <form onSubmit={save}>
      <Link href={`/admin/${config.key}`} className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden /> {config.label}
      </Link>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">{isNew ? `New ${config.singular}` : String(doc.title || "Untitled")}</h1>
        <div className="flex flex-wrap gap-2">
          {!isNew && Boolean(doc.slug) && (
            <a href={`${config.publicBase}/${String(doc.slug)}`} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <ExternalLink className="h-4 w-4" aria-hidden /> View
            </a>
          )}
          {!isNew && (
            <button type="button" onClick={remove} className="btn-ghost text-red-600">
              <Trash2 className="h-4 w-4" aria-hidden /> Delete
            </button>
          )}
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />} {isNew ? "Create" : "Save changes"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {mainGroups.map(([g, fields]) => (
            <section key={g} className="card space-y-5 p-5 sm:p-6">
              <h2 className="font-semibold">{GROUP_LABELS[g]}</h2>
              {fields.map(render)}
            </section>
          ))}
        </div>
        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {side
            .sort(([a]) => (a === "publish" ? -1 : 1))
            .map(([g, fields]) => (
              <section key={g} className="card space-y-4 p-5">
                <h2 className="font-semibold">{GROUP_LABELS[g]}</h2>
                {fields.map(render)}
                {g === "seo" && (
                  <div className="rounded-xl border border-line bg-ink/[0.02] p-3">
                    <p className="text-[11px] uppercase tracking-wider text-muted">Google preview</p>
                    <p className="mt-1.5 truncate text-sm text-[#8AB4F8]">{String(doc.seoTitle || doc.title || "Page title")}</p>
                    <p className="truncate text-[11px] text-emerald-600/80">
                      zylosolution.com{config.publicBase}/{String(doc.slug || "")}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted">{String(doc.seoDescription || doc.shortDescription || doc.excerpt || doc.description || "")}</p>
                  </div>
                )}
              </section>
            ))}
        </div>
      </div>
    </form>
  );
}
