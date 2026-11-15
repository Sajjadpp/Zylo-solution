"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { CalendarCheck, X } from "lucide-react";
import { BookingForm } from "@/components/booking/BookingForm";

type Ctx = { open: (service?: string) => void; services: string[] };
const DemoContext = createContext<Ctx>({ open: () => {}, services: [] });
export const useDemoModal = () => useContext(DemoContext);

export function DemoModalProvider({ services, children }: { services: string[]; children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [service, setService] = useState("");
  const [formKey, setFormKey] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const open = useCallback((s?: string) => {
    lastFocus.current = document.activeElement as HTMLElement;
    setService(s ?? "");
    setFormKey((k) => k + 1);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!isOpen) {
      lastFocus.current?.focus?.();
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();
    const t = setTimeout(() => dialogRef.current?.querySelector<HTMLElement>("input,select,textarea,button")?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([tabindex="-1"]),select,textarea',
        );
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.__lenis?.start();
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  return (
    <DemoContext.Provider value={{ open, services }}>
      <MotionConfig reducedMotion="user">
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={close} aria-hidden />
            <motion.div
              ref={dialogRef}
              data-lenis-prevent
              role="dialog"
              aria-modal="true"
              aria-labelledby="demo-modal-title"
              className="relative max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-line bg-surface p-5 shadow-glow sm:rounded-3xl sm:p-8"
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <button
                type="button"
                onClick={close}
                className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-line text-muted transition hover:text-ink"
                aria-label="Close"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
              <div className="mb-6 pr-12">
                <p className="eyebrow">
                  <CalendarCheck className="h-3.5 w-3.5" aria-hidden /> Free 30-minute demo
                </p>
                <h2 id="demo-modal-title" className="mt-3 text-2xl font-bold sm:text-3xl">
                  Book a demo
                </h2>
                <p className="mt-2 text-sm text-muted">See the system running with your kind of business. No obligation.</p>
              </div>
              <BookingForm key={formKey} services={services} defaultService={service} source="modal" compact onDone={close} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </MotionConfig>
    </DemoContext.Provider>
  );
}
