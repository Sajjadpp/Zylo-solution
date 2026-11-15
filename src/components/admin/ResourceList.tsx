"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ExternalLink, GripVertical, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageTitle } from "@/components/admin/AdminShell";
import { TableSkeleton, Toggle, useConfirm } from "@/components/admin/ui";
import { api } from "@/components/admin/client";
import type { ResourceConfig } from "@/lib/admin-config";
import { cn, formatDate } from "@/lib/utils";

type Item = { _id: string; title: string; slug: string; published: boolean; [k: string]: unknown };

export function ResourceList({ config }: { config: ResourceConfig }) {
  const [items, setItems] = useState<Item[] | null>(null);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const confirm = useConfirm();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const load = useCallback(async () => {
    try {
      const { items } = await api<{ items: Item[] }>(`/api/admin/${config.key}`);
      setItems(items);
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setItems([]);
    }
  }, [config.key]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = items?.filter((i) => !q || JSON.stringify([i.title, i.slug, i.client, i.country]).toLowerCase().includes(q.toLowerCase())) ?? null;
  const canDrag = config.reorderable && !q;

  async function onDragEnd(e: DragEndEvent) {
    if (!items || !e.over || e.active.id === e.over.id) return;
    const from = items.findIndex((i) => i._id === e.active.id);
    const to = items.findIndex((i) => i._id === e.over!.id);
    const next = arrayMove(items, from, to);
    setItems(next);
    try {
      await api(`/api/admin/${config.key}/reorder`, { method: "PUT", json: { ids: next.map((i) => i._id) } });
      toast.success("Order saved");
    } catch (err) {
      toast.error((err as Error).message);
      load();
    }
  }

  async function togglePublish(item: Item, published: boolean) {
    setItems((list) => list?.map((i) => (i._id === item._id ? { ...i, published } : i)) ?? null);
    try {
      await api(`/api/admin/${config.key}/${item._id}`, { method: "PATCH", json: { published } });
      toast.success(published ? `“${item.title}” is live` : `“${item.title}” hidden from the website`);
    } catch (err) {
      toast.error((err as Error).message);
      load();
    }
  }

  async function remove(item: Item) {
    const ok = await confirm({ title: `Delete “${item.title}”?`, message: `This ${config.singular} will be removed from the website permanently.` });
    if (!ok) return;
    try {
      await api(`/api/admin/${config.key}/${item._id}`, { method: "DELETE" });
      setItems((list) => list?.filter((i) => i._id !== item._id) ?? null);
      toast.success("Deleted");
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  return (
    <>
      <PageTitle
        title={config.label}
        description={config.reorderable ? "Drag rows to change the order shown on the website." : undefined}
        actions={
          <Link href={`/admin/${config.key}/new`} className="btn-primary">
            <Plus className="h-4 w-4" aria-hidden /> Add {config.singular}
          </Link>
        }
      />
      <label className="relative mb-4 block sm:max-w-xs">
        <span className="sr-only">Search {config.label}</span>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${config.label.toLowerCase()}…`} className="input pl-10" />
      </label>
      {error && <p className="mb-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="card overflow-hidden">
        {!filtered ? (
          <TableSkeleton />
        ) : filtered.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <p className="text-sm text-muted">No {config.label.toLowerCase()} yet.</p>
            <Link href={`/admin/${config.key}/new`} className="btn-ghost mt-4">
              <Plus className="h-4 w-4" aria-hidden /> Add the first one
            </Link>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={filtered.map((i) => i._id)} strategy={verticalListSortingStrategy}>
              <ul>
                {filtered.map((item) => (
                  <Row key={item._id} item={item} config={config} canDrag={canDrag} onToggle={togglePublish} onDelete={remove} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </>
  );
}

function Row({
  item,
  config,
  canDrag,
  onToggle,
  onDelete,
}: {
  item: Item;
  config: ResourceConfig;
  canDrag: boolean;
  onToggle: (i: Item, v: boolean) => void;
  onDelete: (i: Item) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item._id, disabled: !canDrag });
  const meta = config.columns
    .filter((c) => c.name !== "title")
    .map((c) => {
      const v = item[c.name];
      if (!v) return null;
      return c.name === "publishedAt" ? formatDate(v as string) : String(v);
    })
    .filter(Boolean)
    .join(" · ");

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("flex items-center gap-3 border-b border-line bg-card/40 px-3 py-3 last:border-0 sm:px-4", isDragging && "relative z-10 bg-card shadow-glow")}
    >
      {config.reorderable && (
        <button
          type="button"
          {...attributes}
          {...listeners}
          disabled={!canDrag}
          aria-label={`Reorder ${item.title}`}
          className="grid h-10 w-8 shrink-0 cursor-grab touch-none place-items-center rounded-lg text-muted hover:text-ink active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-30"
        >
          <GripVertical className="h-4 w-4" aria-hidden />
        </button>
      )}
      <Link href={`/admin/${config.key}/${item._id}`} className="min-w-0 flex-1 py-1">
        <p className="truncate font-medium hover:text-hl">{item.title}</p>
        <p className="truncate text-xs text-muted">
          {meta}
          {item.sample ? " · sample" : ""}
          {item.featured ? " · featured" : ""}
        </p>
      </Link>
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <span className="hidden text-xs text-muted sm:inline">{item.published ? "Live" : "Hidden"}</span>
        <Toggle checked={item.published} onChange={(v) => onToggle(item, v)} label={`Publish ${item.title}`} />
        <a
          href={`${config.publicBase}/${item.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${item.title} on the website`}
          className="hidden h-10 w-10 place-items-center rounded-full text-muted hover:text-ink sm:grid"
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
        </a>
        <Link href={`/admin/${config.key}/${item._id}`} aria-label={`Edit ${item.title}`} className="grid h-10 w-10 place-items-center rounded-full text-muted hover:text-ink">
          <Pencil className="h-4 w-4" aria-hidden />
        </Link>
        <button type="button" onClick={() => onDelete(item)} aria-label={`Delete ${item.title}`} className="grid h-10 w-10 place-items-center rounded-full text-muted hover:bg-red-500/10 hover:text-red-600">
          <Trash2 className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </li>
  );
}
