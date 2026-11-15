"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { ICONS, ICON_NAMES } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { FAQ } from "@/types";

export function FieldShell({ id, label, help, required, children, count }: { id: string; label: string; help?: string; required?: boolean; children: React.ReactNode; count?: { n: number; max?: number } }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="label">
          {label} {required && <span className="text-hl">*</span>}
        </label>
        {count?.max && (
          <span className={cn("text-[11px] tabular-nums", count.n > count.max ? "text-amber-600" : "text-muted")}>
            {count.n}/{count.max}
          </span>
        )}
      </div>
      {children}
      {help && <p className="mt-1.5 text-xs text-muted">{help}</p>}
    </div>
  );
}

// ─── Markdown editor (write / preview) ─────────────────────────────
export function MarkdownField({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  const [tab, setTab] = useState<"write" | "preview">("write");
  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <div className="flex items-center justify-between border-b border-line bg-ink/[0.02] px-2 py-1.5">
        <div className="flex gap-1" role="tablist">
          {(["write", "preview"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn("rounded-lg px-3 py-1.5 text-xs font-semibold capitalize", tab === t ? "bg-ink/10 text-ink" : "text-muted hover:text-ink")}
            >
              {t}
            </button>
          ))}
        </div>
        <span className="pr-2 text-[11px] text-muted">Markdown: ## heading, **bold**, - list, [link](url)</span>
      </div>
      {tab === "write" ? (
        <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} rows={18} className="block w-full resize-y bg-surface/60 p-4 font-mono text-[13px] leading-relaxed text-ink focus:outline-none" />
      ) : (
        <div className="prose-zylo max-h-[600px] min-h-[300px] overflow-y-auto bg-bg/40 p-5">
          {value.trim() ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown> : <p className="text-muted">Nothing to preview yet.</p>}
        </div>
      )}
    </div>
  );
}

// ─── String list ───────────────────────────────────────────────────
export function ListField({ id, value, onChange, placeholder }: { id: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...value, v]);
    setDraft("");
  };
  const move = (i: number, d: -1 | 1) => {
    const next = [...value];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <input
            value={item}
            aria-label={`Item ${i + 1}`}
            onChange={(e) => onChange(value.map((v, j) => (j === i ? e.target.value : v)))}
            className="input !py-2.5"
          />
          <button type="button" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up" className="grid h-10 w-9 shrink-0 place-items-center rounded-lg text-muted hover:text-ink disabled:opacity-30">
            <ArrowUp className="h-4 w-4" aria-hidden />
          </button>
          <button type="button" disabled={i === value.length - 1} onClick={() => move(i, 1)} aria-label="Move down" className="grid h-10 w-9 shrink-0 place-items-center rounded-lg text-muted hover:text-ink disabled:opacity-30">
            <ArrowDown className="h-4 w-4" aria-hidden />
          </button>
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="Remove" className="grid h-10 w-9 shrink-0 place-items-center rounded-lg text-muted hover:text-red-600">
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      ))}
      <div className="flex gap-2">
        <input
          id={id}
          value={draft}
          placeholder={placeholder ?? "Type and press Enter"}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          className="input !py-2.5"
        />
        <button type="button" onClick={add} className="btn-ghost shrink-0 !min-h-[42px] px-3" aria-label="Add item">
          <Plus className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

// ─── FAQ list ──────────────────────────────────────────────────────
export function FaqField({ value, onChange }: { value: FAQ[]; onChange: (v: FAQ[]) => void }) {
  const update = (i: number, patch: Partial<FAQ>) => onChange(value.map((f, j) => (j === i ? { ...f, ...patch } : f)));
  return (
    <div className="space-y-3">
      {value.map((f, i) => (
        <div key={i} className="rounded-2xl border border-line bg-ink/[0.02] p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted">Question {i + 1}</span>
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-xs text-muted hover:text-red-600">
              Remove
            </button>
          </div>
          <input value={f.q} onChange={(e) => update(i, { q: e.target.value })} placeholder="Question" aria-label={`Question ${i + 1}`} className="input mt-2 !py-2.5" />
          <textarea value={f.a} onChange={(e) => update(i, { a: e.target.value })} placeholder="Answer" aria-label={`Answer ${i + 1}`} rows={3} className="input mt-2" />
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, { q: "", a: "" }])} className="btn-ghost">
        <Plus className="h-4 w-4" aria-hidden /> Add question
      </button>
    </div>
  );
}

// ─── Image upload (Cloudinary) or URL ──────────────────────────────
async function uploadFile(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.url as string;
}

function Preview({ src, alt }: { src: string; alt: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- admin preview of arbitrary URLs
  return <img src={src} alt={alt} className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.opacity = "0.15")} />;
}

export function ImageField({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  async function pick(files: FileList | null) {
    if (!files?.[0]) return;
    setBusy(true);
    try {
      onChange(await uploadFile(files[0]));
      toast.success("Image uploaded");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl border border-line bg-ink/[0.03] sm:w-48">
        {value ? <Preview src={value} alt="Cover preview" /> : <div className="grid h-full place-items-center text-xs text-muted">No image</div>}
      </div>
      <div className="flex-1 space-y-2">
        <input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder="/images/… or https://res.cloudinary.com/…" className="input !py-2.5" />
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => input.current?.click()} disabled={busy} className="btn-ghost !min-h-[40px]">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <ImagePlus className="h-4 w-4" aria-hidden />} Upload image
          </button>
          {value && (
            <button type="button" onClick={() => onChange("")} className="btn-ghost !min-h-[40px] text-muted">
              Remove
            </button>
          )}
        </div>
        <input ref={input} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files)} />
      </div>
    </div>
  );
}

export function GalleryField({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState("");
  async function pick(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      const urls: string[] = [];
      for (const f of Array.from(files)) urls.push(await uploadFile(f));
      onChange([...value, ...urls]);
      toast.success(`${urls.length} image${urls.length > 1 ? "s" : ""} uploaded`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }
  return (
    <div>
      {value.length > 0 && (
        <ul className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {value.map((src, i) => (
            <li key={src + i} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-line">
              <Preview src={src} alt={`Gallery image ${i + 1}`} />
              <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label={`Remove image ${i + 1}`} className="absolute right-1.5 top-1.5 grid h-8 w-8 place-items-center rounded-full bg-bg/80 text-ink">
                <X className="h-4 w-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-col gap-2 sm:flex-row">
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste image URL" aria-label="Image URL" className="input !py-2.5" />
        <button type="button" onClick={() => url.trim() && (onChange([...value, url.trim()]), setUrl(""))} className="btn-ghost shrink-0 !min-h-[42px]">
          Add URL
        </button>
        <button type="button" onClick={() => input.current?.click()} disabled={busy} className="btn-ghost shrink-0 !min-h-[42px]">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <ImagePlus className="h-4 w-4" aria-hidden />} Upload
        </button>
      </div>
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => pick(e.target.files)} />
    </div>
  );
}

// ─── Icon picker ───────────────────────────────────────────────────
export function IconField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-6 gap-2 sm:grid-cols-9" role="radiogroup" aria-label="Icon">
      {ICON_NAMES.map((name) => {
        const Cmp = ICONS[name];
        const active = value === name;
        return (
          <button
            key={name}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={name}
            title={name}
            onClick={() => onChange(name)}
            className={cn(
              "grid aspect-square place-items-center rounded-xl border transition",
              active ? "border-primary bg-primary/20 text-hl" : "border-line text-muted hover:text-ink",
            )}
          >
            <Cmp className="h-5 w-5" aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
