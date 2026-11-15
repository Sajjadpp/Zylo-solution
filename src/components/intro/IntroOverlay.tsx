"use client";

import { useEffect, useRef, useState } from "react";
import { Wordmark } from "@/components/brand/Wordmark";

declare global {
  interface Window {
    __introStart?: number;
  }
}

/** CSS letter/dot/line reveal finishes at about this time (ms after first paint). */
const REVEAL_DONE = 1150;
/** Latest moment the fly-to-header may start; after that the CSS failsafe (3.6s) takes over. */
const LATEST_FLY = 2500;

// Start downloading GSAP as soon as this module is evaluated (before hydration), but only when
// the intro is actually going to play. Keeps GSAP out of every other page load.
const gsapReady =
  typeof window !== "undefined" && document.documentElement.getAttribute("data-intro") === "play"
    ? Promise.all([import("gsap"), import("gsap/Flip")])
    : null;

/**
 * Intro: letters + yellow dot + blue line reveal with pure CSS from the first paint (so it shows
 * even on slow phones), then GSAP Flip flies the logo into the header and the header + hero fade in.
 * If JS arrives too late, CSS simply fades the overlay out. Purely visual; content is server-rendered.
 */
export function IntroOverlay() {
  const root = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (html.getAttribute("data-intro") !== "play" || !gsapReady) {
      setGone(true);
      return;
    }
    let cancelled = false;
    let kill: (() => void) | null = null;
    const finish = () => {
      html.setAttribute("data-intro", "done");
      setGone(true);
    };
    const elapsed = () => performance.now() - (window.__introStart ?? 0);

    gsapReady
      .then(async ([{ gsap }, { Flip }]) => {
        if (cancelled) return;
        // Too late: the CSS failsafe is already fading the overlay — just hand over.
        if (elapsed() > LATEST_FLY || !mark.current || !root.current) {
          setTimeout(finish, Math.max(0, 4100 - elapsed()));
          return;
        }
        // Let the CSS reveal finish.
        await new Promise((r) => setTimeout(r, Math.max(0, REVEAL_DONE - elapsed())));
        if (cancelled || !mark.current || !root.current) return;

        gsap.registerPlugin(Flip);
        // Freeze the CSS animations at their end state and cancel the failsafe.
        html.setAttribute("data-intro", "fly");
        const target = Array.from(document.querySelectorAll<HTMLElement>("[data-header-logo]")).find((el) => el.offsetParent !== null);
        const t = gsap.timeline({ onComplete: finish });
        kill = () => t.kill();
        if (target) {
          t.add(Flip.fit(mark.current, target, { scale: true, duration: 0.85, ease: "power3.inOut" }) as gsap.core.Tween, 0);
        } else {
          t.to(mark.current, { opacity: 0, scale: 0.6, duration: 0.6 }, 0);
        }
        t.to(root.current.querySelector("[data-intro-bg]"), { opacity: 0, duration: 0.55, ease: "power1.out" }, 0.45)
          // as the logo lands: reveal header + hero (CSS transitions keyed off data-intro="done")
          .call(() => html.setAttribute("data-intro", "done"), [], 0.75)
          .to(mark.current, { opacity: 0, duration: 0.15 }, 0.85);
      })
      .catch(finish);

    return () => {
      cancelled = true;
      kill?.();
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={root} className="intro-overlay pointer-events-none fixed inset-0 z-[100] items-center justify-center" aria-hidden>
      <div data-intro-bg className="absolute inset-0 bg-bg">
        <div className="absolute left-[38%] top-1/2 h-[32vmax] w-[32vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[110px]" />
        <div className="absolute left-[62%] top-1/2 h-[22vmax] w-[22vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[110px]" />
      </div>
      <div className="relative flex flex-col items-center">
        <div ref={mark} className="origin-top-left" style={{ fontSize: "clamp(4.5rem, 22vw, 10rem)" }}>
          <Wordmark />
        </div>
        <div className="intro-line absolute -bottom-6 left-0 right-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>
    </div>
  );
}
