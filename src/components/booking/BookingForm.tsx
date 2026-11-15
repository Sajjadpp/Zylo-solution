"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { bookingSchema } from "@/lib/validators";
import { SITE, TIME_SLOTS, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";

type Fields = {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
};

const EMPTY: Fields = {
  name: "",
  company: "",
  email: "",
  phone: "",
  service: "",
  preferredDate: "",
  preferredTime: "",
  message: "",
};

function todayInBahrain() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Bahrain" }).format(new Date());
}

export function BookingForm({
  services,
  defaultService = "",
  source = "book-demo",
  compact = false,
  onDone,
}: {
  services: string[];
  defaultService?: string;
  source?: string;
  compact?: boolean;
  onDone?: () => void;
}) {
  const [values, setValues] = useState<Fields>({ ...EMPTY, service: defaultService });
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [serverError, setServerError] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const startedAt = useRef(0);
  const minDate = useMemo(todayInBahrain, []);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    setValues((v) => ({ ...v, service: defaultService || v.service }));
  }, [defaultService]);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    const payload = { ...values, source, website: honeypot, startedAt: startedAt.current };
    const parsed = bookingSchema.safeParse(payload);
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors as Record<string, string[] | undefined>;
      setErrors(Object.fromEntries(Object.entries(fe).map(([k, v]) => [k, v?.[0]])) as typeof errors);
      const first = Object.keys(fe)[0];
      document.getElementById(`bf-${first}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.fields) {
          setErrors(Object.fromEntries(Object.entries(data.fields as Record<string, string[]>).map(([k, v]) => [k, v?.[0]])));
        }
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setStatus("done");
    } catch (err) {
      setServerError((err as Error).message);
      setStatus("idle");
    }
  }

  if (status === "done") {
    return <SuccessState name={values.name} onDone={onDone} />;
  }

  const field = (k: keyof Fields) => ({
    id: `bf-${k}`,
    name: k,
    value: values[k],
    onChange: set(k),
    "aria-invalid": Boolean(errors[k]) || undefined,
    "aria-describedby": errors[k] ? `bf-${k}-err` : undefined,
    className: cn("input", errors[k] && "border-red-400/70 focus:border-red-400 focus:ring-red-400/20"),
  });
  const err = (k: keyof Fields) =>
    errors[k] ? (
      <p id={`bf-${k}-err`} className="mt-1.5 text-xs text-red-600">
        {errors[k]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="relative">
      <div className={cn("grid gap-4", compact ? "sm:grid-cols-2" : "sm:grid-cols-2 sm:gap-5")}>
        <div>
          <label htmlFor="bf-name" className="label">
            Full name <span className="text-hl">*</span>
          </label>
          <input {...field("name")} autoComplete="name" placeholder="Your name" required />
          {err("name")}
        </div>
        <div>
          <label htmlFor="bf-company" className="label">
            Company
          </label>
          <input {...field("company")} autoComplete="organization" placeholder="Company name" />
          {err("company")}
        </div>
        <div>
          <label htmlFor="bf-email" className="label">
            Email <span className="text-hl">*</span>
          </label>
          <input {...field("email")} type="email" autoComplete="email" inputMode="email" placeholder="you@company.com" required />
          {err("email")}
        </div>
        <div>
          <label htmlFor="bf-phone" className="label">
            Phone / WhatsApp <span className="text-hl">*</span>
          </label>
          <input {...field("phone")} type="tel" autoComplete="tel" inputMode="tel" placeholder="+973 3xxx xxxx" required />
          {err("phone")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="bf-service" className="label">
            Service of interest
          </label>
          <select {...field("service")}>
            <option value="">Not sure yet</option>
            {services.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="bf-preferredDate" className="label">
            Preferred date
          </label>
          <input {...field("preferredDate")} type="date" min={minDate} />
          {err("preferredDate")}
        </div>
        <div>
          <label htmlFor="bf-preferredTime" className="label">
            Preferred time (Bahrain)
          </label>
          <select {...field("preferredTime")}>
            <option value="">Any time</option>
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="bf-message" className="label">
            What would you like to see?
          </label>
          <textarea
            {...field("message")}
            rows={compact ? 3 : 4}
            placeholder="Tell us a little about your business and what you need."
          />
          {err("message")}
        </div>
      </div>

      {/* Honeypot: hidden from people, visible to naive bots */}
      <div aria-hidden className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="bf-website">Website</label>
        <input id="bf-website" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      {serverError && (
        <p role="alert" className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
          {serverError}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="btn-primary w-full sm:w-auto" disabled={status === "sending"}>
          {status === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending…
            </>
          ) : (
            <>
              Book my free demo <ArrowRight className="h-4 w-4" aria-hidden />
            </>
          )}
        </button>
        <p className="text-xs text-muted">We reply within one business day. No spam, ever.</p>
      </div>
    </form>
  );
}

function SuccessState({ name, onDone }: { name: string; onDone?: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center py-8 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="relative grid h-20 w-20 place-items-center">
          <motion.span
            className="absolute inset-0 rounded-full bg-accent/20"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: [0.4, 1.25, 1], opacity: [0, 1, 1] }}
            transition={{ duration: 0.7 }}
          />
          <svg viewBox="0 0 52 52" className="relative h-14 w-14" aria-hidden>
            <motion.circle
              cx="26"
              cy="26"
              r="24"
              fill="none"
              stroke="#2541F5"
              strokeWidth="2.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            <motion.path
              d="M15 27l7 7 15-16"
              fill="none"
              stroke="#0B0B0F"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, delay: 0.5, ease: "easeOut" }}
            />
          </svg>
        </div>
        <h3 className="mt-6 text-2xl font-bold">Thank you, {name.split(" ")[0]}!</h3>
        <p className="mt-3 max-w-sm text-muted">
          Your demo request is in. Our team in Manama will contact you within one business day. A confirmation has been sent to
          your email.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
            <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
          </a>
          {onDone && (
            <button type="button" onClick={onDone} className="btn-ghost">
              Close
            </button>
          )}
        </div>
        <p className="mt-4 text-xs text-muted">Need us now? Call {SITE.phone}</p>
      </motion.div>
    </AnimatePresence>
  );
}
