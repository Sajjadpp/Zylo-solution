"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { FAQ } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Accessible accordion. Answers stay in the DOM (hidden) when closed so crawlers and
 * AI assistants can read every Q&A in the server HTML.
 */
export function FaqAccordion({ faqs, className }: { faqs: FAQ[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  return (
    <div className={cn("divide-y divide-line rounded-3xl border border-line bg-card/50", className)}>
      {faqs.map((f, i) => {
        const isOpen = open === i;
        const id = `${base}-${i}`;
        return (
          <div key={i}>
            <h3 className="text-base font-semibold">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${id}-panel`}
                id={`${id}-btn`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-sans transition hover:text-primary sm:px-6"
              >
                <span>{f.q}</span>
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line transition duration-300",
                    isOpen && "rotate-45 border-primary/50 bg-primary/15 text-hl",
                  )}
                >
                  <Plus className="h-4 w-4" aria-hidden />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <p id={`${id}-panel`} role="region" aria-labelledby={`${id}-btn`} className="px-5 pb-5 leading-relaxed text-muted sm:px-6">
                    {f.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            {!isOpen && (
              <p id={`${id}-panel`} hidden>
                {f.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
