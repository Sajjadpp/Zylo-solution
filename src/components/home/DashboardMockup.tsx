"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PackageCheck, ScanBarcode, TrendingUp, Truck, Wifi } from "lucide-react";

const BARS = [42, 58, 50, 72, 64, 86, 78];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const FEED = [
  { icon: Truck, text: "Van 07 synced 14 invoices", meta: "Riffa route" },
  { icon: ScanBarcode, text: "Warehouse A received 240 units", meta: "PO-2291" },
  { icon: PackageCheck, text: "Order SO-1842 delivered", meta: "Seef branch" },
  { icon: TrendingUp, text: "Daily sales target reached", meta: "112%" },
];

/** Decorative product dashboard for the hero. Lightweight: DOM + SVG, no images. */
export function DashboardMockup() {
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setTick((t) => t + 1), 2800);
    return () => clearInterval(id);
  }, [reduce]);

  const feed = [0, 1, 2].map((i) => FEED[(tick + i) % FEED.length]);

  return (
    <div role="img" aria-label="Zylo ERP dashboard showing sales, stock accuracy and live van sales sync" className="relative mx-auto w-full max-w-[560px]">
      <div className="absolute -inset-6 -z-10 rounded-[40px] bg-gradient-to-tr from-primary/25 via-transparent to-accent/20 blur-3xl" aria-hidden />

      <div className="theme-dark rounded-[28px] border border-ink/10 bg-gradient-to-b from-card to-bg p-4 shadow-glow sm:p-5">
        {/* window bar */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Live
          </span>
        </div>

        {/* KPIs */}
        <div className="mt-4 grid grid-cols-3 gap-2.5 sm:gap-3">
          {[
            { k: "Sales today", v: "BHD 8,420", d: "+12%" },
            { k: "Orders", v: "1,284", d: "+8%" },
            { k: "Stock accuracy", v: "99.4%", d: "+3.1%" },
          ].map((m) => (
            <div key={m.k} className="rounded-2xl border border-line bg-ink/[0.03] p-2.5 sm:p-3">
              <p className="text-[10px] text-muted sm:text-[11px]">{m.k}</p>
              <p className="mt-1 font-display text-sm font-bold sm:text-lg">{m.v}</p>
              <p className="text-[10px] font-semibold text-emerald-400">{m.d}</p>
            </div>
          ))}
        </div>

        {/* chart */}
        <div className="mt-3 rounded-2xl border border-line bg-ink/[0.02] p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-ink/90">Weekly revenue</p>
            <p className="text-[10px] text-muted">All branches</p>
          </div>
          <div className="relative mt-3 h-28 sm:h-32">
            <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
              <defs>
                <linearGradient id="dm-line" x1="0" x2="1">
                  <stop offset="0" stopColor="#4C66FF" />
                  <stop offset="1" stopColor="#FFC914" />
                </linearGradient>
              </defs>
              <motion.path
                d="M0 70 C 30 62, 50 66, 75 52 S 125 50, 150 40 S 200 44, 225 28 S 270 22, 300 14"
                fill="none"
                stroke="url(#dm-line)"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.6, delay: 0.4, ease: "easeInOut" }}
              />
            </svg>
            <div className="absolute inset-x-0 bottom-0 flex h-full items-end justify-between gap-2 sm:gap-3">
              {BARS.map((h, i) => (
                <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                  <motion.div
                    className="w-full max-w-[26px] rounded-t-md bg-gradient-to-t from-primary/20 to-primary/60"
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.07, ease: [0.2, 0.7, 0.2, 1] }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-1.5 flex justify-between text-[9px] text-muted sm:text-[10px]">
            {DAYS.map((d) => (
              <span key={d} className="flex-1 text-center">
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* live feed */}
        <div className="mt-3 space-y-2">
          <AnimatePresence initial={false} mode="popLayout">
            {feed.map((f, i) => (
              <motion.div
                key={tick + i}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1 - i * 0.22, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-3 rounded-xl border border-line bg-ink/[0.025] px-3 py-2"
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary-400">
                  <f.icon className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1 truncate text-xs text-ink/90">{f.text}</span>
                <span className="hidden text-[10px] text-muted sm:inline">{f.meta}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* floating chips */}
      <div className="absolute -left-3 top-24 hidden items-center gap-2 rounded-2xl border border-ink/10 bg-surface/90 px-3 py-2 text-xs shadow-card backdrop-blur sm:flex lg:-left-10">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent/15 text-hl">
          <Wifi className="h-3.5 w-3.5" aria-hidden />
        </span>
        <span>
          <span className="block font-semibold">Offline-ready</span>
          <span className="text-[10px] text-muted">Syncs when back online</span>
        </span>
      </div>
      <div className="absolute -right-2 bottom-16 hidden items-center gap-2 rounded-2xl border border-ink/10 bg-surface/90 px-3 py-2 text-xs shadow-card backdrop-blur sm:flex lg:-right-8">
        <span className="font-display text-base font-bold text-ink">ع / EN</span>
        <span className="text-[10px] leading-tight text-muted">
          Arabic &amp; English
          <br />
          reports
        </span>
      </div>
    </div>
  );
}
