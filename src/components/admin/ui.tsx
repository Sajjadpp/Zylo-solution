"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { BOOKING_STATUSES } from "@/lib/site";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-ink/[0.05]", className)}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-ink/[0.06] to-transparent" />
    </div>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12" />
      ))}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition disabled:opacity-50",
        checked ? "bg-primary" : "bg-ink/15",
      )}
    >
      <span className={cn("inline-block h-5 w-5 rounded-full bg-white shadow transition", checked ? "translate-x-[22px]" : "translate-x-0.5")} />
    </button>
  );
}

export const STATUS_STYLES: Record<string, string> = {
  new: "bg-accent/15 text-hl border-accent/30",
  contacted: "bg-amber-400/10 text-amber-600 border-amber-400/30",
  scheduled: "bg-primary/20 text-primary border-primary/40",
  completed: "bg-emerald-400/10 text-emerald-600 border-emerald-400/30",
  cancelled: "bg-ink/5 text-muted border-ink/10",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize", STATUS_STYLES[status] ?? STATUS_STYLES.cancelled)}>
      {status}
    </span>
  );
}

// ─── Confirm dialog ────────────────────────────────────────────────
type ConfirmOpts = { title: string; message?: string; confirmLabel?: string; danger?: boolean };
const ConfirmCtx = createContext<(o: ConfirmOpts) => Promise<boolean>>(async () => false);
export const useConfirm = () => useContext(ConfirmCtx);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [opts, setOpts] = useState<ConfirmOpts | null>(null);
  const resolver = useRef<(v: boolean) => void>(() => {});

  const confirm = useCallback((o: ConfirmOpts) => {
    setOpts(o);
    return new Promise<boolean>((resolve) => (resolver.current = resolve));
  }, []);

  const close = (v: boolean) => {
    resolver.current(v);
    setOpts(null);
  };

  return (
    <ConfirmCtx.Provider value={confirm}>
      {children}
      <AnimatePresence>
        {opts && (
          <motion.div
            className="fixed inset-0 z-[100] grid place-items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onKeyDown={(e) => e.key === "Escape" && close(false)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => close(false)} aria-hidden />
            <motion.div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="confirm-title"
              className="relative w-full max-w-md rounded-3xl border border-line bg-surface p-6 shadow-glow"
              initial={{ scale: 0.96, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 10 }}
            >
              <div className="flex gap-4">
                {opts.danger !== false && (
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-red-500/15 text-red-600">
                    <AlertTriangle className="h-5 w-5" aria-hidden />
                  </span>
                )}
                <div>
                  <h2 id="confirm-title" className="text-lg font-semibold">
                    {opts.title}
                  </h2>
                  {opts.message && <p className="mt-1.5 text-sm text-muted">{opts.message}</p>}
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button type="button" className="btn-ghost" onClick={() => close(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  autoFocus
                  className={cn("btn", opts.danger === false ? "bg-primary text-white" : "bg-red-500 text-white hover:bg-red-400")}
                  onClick={() => close(true)}
                >
                  {opts.confirmLabel ?? "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ConfirmCtx.Provider>
  );
}

export function StatusSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Booking status"
      className={cn("rounded-full border bg-transparent px-3 py-1.5 text-xs font-semibold capitalize focus:outline-none focus:ring-2 focus:ring-primary/40", STATUS_STYLES[value])}
    >
      {BOOKING_STATUSES.map((s) => (
        <option key={s} value={s} className="bg-surface text-ink">
          {s}
        </option>
      ))}
    </select>
  );
}
