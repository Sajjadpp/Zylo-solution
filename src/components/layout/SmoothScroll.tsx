"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Lenis smooth scrolling for the public site. Skipped when the visitor prefers reduced motion.
 * Exposed on window.__lenis so overlays (e.g. the demo modal) can pause it.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      smoothWheel: true,
      anchors: { offset: -100 },
      // let scrollable inner areas (modal, menus) scroll natively
      prevent: (node) => node.closest?.("[data-lenis-prevent]") != null,
    });
    window.__lenis = lenis;
    return () => {
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  // New page: re-measure the document height (content changed).
  useEffect(() => {
    const id = requestAnimationFrame(() => window.__lenis?.resize());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
