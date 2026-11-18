"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight, MoveRight } from "lucide-react";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { DemoButton } from "@/components/booking/DemoButton";
import type { ServiceDoc } from "@/types";
import { cn } from "@/lib/utils";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** "full" pinned → "compact" pinned (short screens) → "row" (swipe, no pin). */
type Mode = "row" | "full" | "compact";

/** Space reserved at the top of the pinned screen for the floating header. */
const HEADER_SPACE = 92;

/**
 * Home "Services": the section pins to the screen and the cards travel right → left while the
 * visitor scrolls down (smoothed by Lenis). The layout measures itself so cards always fit the
 * viewport: full layout, then a compact one for short windows, then a swipeable row.
 * Server HTML is the plain row (SEO / no-JS).
 */
export function HorizontalServices({ services }: { services: ServiceDoc[] }) {
  const section = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const [rowProgress, setRowProgress] = useState(0.04);
  const [mode, setMode] = useState<Mode>("row");
  const [distance, setDistance] = useState(0);
  const [index, setIndex] = useState(1);
  const pinned = mode !== "row";
  const compact = mode === "compact";

  // On mount and on every resize: start from the full layout and let the fit-check step down.
  useIsoLayoutEffect(() => {
    const reset = () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setMode(reduce || window.innerHeight < 480 ? "row" : "full");
    };
    reset();
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(reset, 120);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Fit check: if the pinned content is taller than the screen, step down one level.
  useIsoLayoutEffect(() => {
    const measureDistance = () => track.current && setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    measureDistance();
    if (pinned && content.current) {
      const fits = content.current.offsetHeight + HEADER_SPACE + 16 <= window.innerHeight;
      if (!fits) {
        setMode(mode === "full" ? "compact" : "row");
        return;
      }
    }
    const ro = new ResizeObserver(measureDistance);
    if (track.current) ro.observe(track.current);
    return () => ro.disconnect();
  }, [mode, pinned]);

  // Section height changed → let Lenis re-measure the page.
  useEffect(() => {
    window.__lenis?.resize();
  }, [mode, distance]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  // A soft spring between the scroll position and the cards: they ease in and settle instead of moving rigidly.
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6, restDelta: 0.0005 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);
  const progress = useTransform(smooth, [0, 1], [0.04, 1]);

  const toIndex = (v: number) => Math.min(services.length, Math.max(1, Math.round(v * (services.length - 1)) + 1));

  // Pinned: the vertical scroll drives the counter.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (pinned) setIndex(toIndex(v));
  });

  // Swipe row: the horizontal scroll of the row drives the counter.
  const onRowScroll = () => {
    const el = row.current;
    if (!el || pinned) return;
    const v = el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth);
    setRowProgress(Math.max(0.04, v));
    setIndex(toIndex(v));
  };
  useEffect(() => {
    if (pinned) return;
    setIndex(1);
    setRowProgress(0.04);
    if (row.current) row.current.scrollLeft = 0;
  }, [pinned]);

  const total = String(services.length).padStart(2, "0");
  const cardW = compact ? "w-[78vw] sm:w-[340px] lg:w-[360px]" : "w-[82vw] sm:w-[380px] lg:w-[400px]";

  return (
    <section
      ref={section}
      id="services"
      data-spy="services"
      aria-labelledby="services-title"
      className="relative"
      style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div
        className={cn(pinned ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden" : "section")}
        style={pinned ? { paddingTop: HEADER_SPACE } : undefined}
      >
        <div ref={content}>
          <div className="container">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
              <div className="max-w-xl">
                <p className="eyebrow">Services</p>
                <h2 id="services-title" className={cn("font-bold leading-tight", compact ? "mt-3 text-2xl sm:text-3xl" : "mt-4 text-3xl sm:text-4xl")}>
                  Everything your business runs on
                </h2>
                <p className={cn("mt-3 text-base text-muted sm:text-lg", compact && "sr-only")}>
                  From Odoo ERP to custom apps, one Bahrain team handles it end to end.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-display text-sm font-semibold tabular-nums text-muted" aria-hidden>
                  <span className="text-2xl text-ink">{String(index).padStart(2, "0")}</span> / {total}
                </span>
                <div className="h-1.5 w-40 overflow-hidden rounded-full bg-ink/10 sm:w-56" aria-hidden>
                  <motion.div className="h-full origin-left rounded-full bg-primary" style={{ scaleX: pinned ? progress : rowProgress }} />
                </div>
              </div>
            </div>
            {!pinned && (
              <p className="mt-4 flex items-center gap-2 text-sm text-muted md:hidden">
                Swipe to see all <MoveRight className="h-4 w-4" aria-hidden />
              </p>
            )}
          </div>

          <div
            ref={row}
            onScroll={onRowScroll}
            data-lenis-prevent-horizontal
            className={cn(compact ? "mt-6" : "mt-8 sm:mt-10", !pinned && "no-scrollbar snap-x snap-mandatory overflow-x-auto pb-2")}
          >
            <motion.div
              ref={track}
              style={pinned ? { x } : undefined}
              className="flex w-max items-stretch gap-5 px-4 will-change-transform sm:gap-6 sm:px-6 lg:px-[max(2rem,calc((100vw-1176px)/2))]"
            >
              {services.map((s) => (
                <Slide key={s.slug} x={x} active={pinned} className={cn(cardW, "shrink-0 snap-start")}>
                  <ServiceCard
                    href={`/services/${s.slug}`}
                    icon={s.icon}
                    title={s.title}
                    description={s.shortDescription}
                    image={s.coverImage}
                    compact={compact}
                  />
                </Slide>
              ))}
              <Slide x={x} active={pinned} className={cn(cardW, "flex shrink-0 snap-start flex-col justify-center rounded-3xl bg-black p-8 text-white")}>
                <span className="h-3 w-3 rounded-full bg-accent" aria-hidden />
                <h3 className="mt-5 text-2xl font-bold text-white">Not sure where to start?</h3>
                <p className={cn("mt-3 text-white/70", compact && "hidden")}>Tell us your goal. We&apos;ll recommend the simplest solution, for free.</p>
                <DemoButton variant="none" className={cn("btn-yellow self-start", compact ? "mt-5" : "mt-7")}>
                  Get a free consultation <ArrowRight className="h-4 w-4" aria-hidden />
                </DemoButton>
              </Slide>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * One card in the pinned track. Near the focus point (a little left of centre) it is full size and fully
 * visible; towards the edges it shrinks slightly, drops a little, tilts and fades – so cards seem to rise
 * into place as the row slides. Geometry is measured on resize, not every frame.
 */
function Slide({
  x,
  active,
  className,
  children,
}: {
  x: MotionValue<number>;
  active: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const geo = useRef({ left: 0, width: 1, vw: 1 });

  useEffect(() => {
    const measure = () => {
      if (!ref.current) return;
      geo.current = { left: ref.current.offsetLeft, width: ref.current.offsetWidth, vw: window.innerWidth };
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (ref.current) ro.observe(ref.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // signed distance from the focus point, roughly −1 (far left) … 1 (far right)
  const dist = useTransform(x, (xv) => {
    const { left, width, vw } = geo.current;
    const center = left + xv + width / 2;
    return Math.max(-1, Math.min(1, (center - vw * 0.42) / (vw * 0.62)));
  });
  const scale = useTransform(dist, (d) => 1 - 0.07 * Math.abs(d));
  const y = useTransform(dist, (d) => 26 * Math.abs(d) ** 1.4);
  const rotate = useTransform(dist, (d) => d * 0.8);
  const opacity = useTransform(dist, (d) => 1 - 0.25 * Math.max(0, Math.abs(d) - 0.35) / 0.65);

  return (
    <motion.div ref={ref} className={className} style={active ? { scale, y, rotate, opacity } : undefined}>
      {children}
    </motion.div>
  );
}
