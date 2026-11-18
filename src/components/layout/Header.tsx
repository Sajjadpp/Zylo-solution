"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  FolderKanban,
  House,
  Layers,
  Mail,
  Menu,
  Newspaper,
  Package,
  Phone,
  X,
  type LucideIcon,
} from "lucide-react";
import { Wordmark } from "@/components/brand/Wordmark";
import { DemoButton } from "@/components/booking/DemoButton";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { SITE, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

type NavItem = { key: string; label: string; href: string; icon: LucideIcon };

const NAV: NavItem[] = [
  { key: "home", label: "Home", href: "/", icon: House },
  { key: "services", label: "Services", href: "/services", icon: Layers },
  { key: "products", label: "Products", href: "/products", icon: Package },
  { key: "about", label: "About", href: "/about", icon: Building2 },
  { key: "work", label: "Our Work", href: "/work", icon: FolderKanban },
  { key: "blog", label: "Blog", href: "/blog", icon: Newspaper },
  { key: "contact", label: "Contact", href: "/contact", icon: Phone },
];

/**
 * Home page: highlight the section in view. Other pages: highlight by route.
 *
 * The active item is only decided in the browser, after mount. The server (and Vercel's cached /
 * ISR copies, where the pathname can differ, e.g. "/index") always renders "nothing active", so
 * server HTML and the first client render are identical – no hydration mismatch, which would
 * otherwise make React re-render the whole page and cut the intro animation short.
 */
function useActiveKey() {
  const rawPath = usePathname();
  const pathname = rawPath === "/index" ? "/" : rawPath;
  const [mounted, setMounted] = useState(false);
  const [spy, setSpy] = useState("home");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (pathname !== "/") return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-spy]"));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setSpy(visible[0].target.getAttribute("data-spy") || "home");
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  if (!mounted) return "";
  if (pathname === "/") return spy;
  return NAV.find((n) => n.href !== "/" && pathname.startsWith(n.href))?.key ?? "";
}

export function Header() {
  const active = useActiveKey();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  // Hide while the visitor scrolls down; reveal on any scroll up, and again as soon as they stop
  // (≈0.35s after the last wheel turn / finger movement – even if the smooth-scroll glide is still
  // settling). Always visible near the top.
  useEffect(() => {
    const IDLE_MS = 350;
    let idle: ReturnType<typeof setTimeout> | undefined;
    let lastInput = 0;
    let lastY = window.scrollY;
    // re-read the position after client-side navigation scrolls the new page to the top
    const onNav = () => (lastY = window.scrollY);
    window.addEventListener("popstate", onNav);

    const markInput = () => {
      lastInput = Date.now();
      clearTimeout(idle);
      idle = setTimeout(() => setHidden(false), IDLE_MS);
    };

    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      const userIsScrolling = Date.now() - lastInput < IDLE_MS;
      setScrolled(y > 24);
      if (y < 120) setHidden(false);
      // only hide while the visitor is actively scrolling – not during the glide after they stop
      else if (delta > 6 && userIsScrolling) setHidden(true);
      else if (delta < -6) setHidden(false);
      if (Math.abs(delta) > 6 || y < 120) lastY = y;
      ticking = false;
    };
    const onScroll = () => {
      // Scroll that Lenis is animating comes from a wheel/key input we already saw. Anything else
      // (touch momentum, scrollbar drag, no Lenis) counts as the visitor scrolling.
      if (window.__lenis?.isScrolling !== "smooth") markInput();
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "Home", "End"].includes(e.key)) markInput();
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", markInput, { passive: true });
    window.addEventListener("touchmove", markInput, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(idle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", markInput);
      window.removeEventListener("touchmove", markInput);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onNav);
    };
  }, []);

  // New page: start with the header visible, the menu closed, and no leftover focus.
  useEffect(() => {
    setHidden(false);
    setFocusWithin(false);
    setMenuOpen(false);
  }, [pathname]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButton.current?.focus();
  }, []);

  const isHidden = hidden && !focusWithin && !menuOpen;

  return (
    <>
      <header
        // Only keyboard focus keeps the header pinned (mouse/touch clicks also focus links).
        onFocus={(e) => setFocusWithin((e.target as HTMLElement).matches(":focus-visible"))}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setFocusWithin(false)}
        className={cn(
          "fixed inset-x-0 top-0 z-50 px-3 transition-[padding,transform] duration-300 ease-out will-change-transform sm:px-4",
          scrolled ? "pt-2" : "pt-3 sm:pt-5",
          isHidden && "-translate-y-[calc(100%+12px)]",
        )}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <div
          className={cn(
            "relative isolate mx-auto flex max-w-6xl items-center gap-3 pl-5 pr-2 transition-[height] duration-300 lg:gap-4 lg:pl-7",
            scrolled ? "h-14 lg:h-16" : "h-16 lg:h-[72px]",
          )}
        >
          {/* pill background (fades in with the intro) */}
          <span
            aria-hidden
            data-intro-fade
            className={cn(
              "pointer-events-none absolute inset-0 -z-10 rounded-full border backdrop-blur-xl transition-colors duration-300",
              scrolled
                ? "border-ink/10 bg-white/90 shadow-[0_12px_36px_-16px_rgba(11,11,15,0.28)]"
                : "border-ink/[0.08] bg-white/70 shadow-[0_8px_30px_-18px_rgba(11,11,15,0.18)]",
            )}
          />

          <Link href="/" aria-label="Zylo Solution home" className="flex shrink-0 items-center rounded-lg py-1">
            <div data-header-logo className="text-[30px] lg:text-[34px]">
              <Wordmark />
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Main" className="hidden flex-1 lg:block">
            <LayoutGroup id="main-nav">
              <ul className="flex items-center justify-center gap-0.5 xl:gap-1">
                {NAV.map((item, i) => {
                  const isActive = active === item.key;
                  return (
                    <li key={item.key} data-intro-fade style={{ "--i": i + 1 } as React.CSSProperties}>
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "relative flex min-h-[44px] items-center rounded-full px-3.5 text-sm font-medium transition-colors xl:px-4",
                          isActive ? "text-white" : "text-muted hover:text-ink",
                        )}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="nav-pill"
                            className="absolute inset-0 -z-10 rounded-full bg-primary shadow-[0_6px_20px_-8px_rgba(37,65,245,0.9)]"
                            transition={{ type: "spring", stiffness: 420, damping: 34 }}
                          />
                        )}
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </LayoutGroup>
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <div data-intro-fade style={{ "--i": 8 } as React.CSSProperties}>
              <DemoButton className="!min-h-[44px] !px-4 text-[13px] lg:!px-5 lg:text-sm" aria-label="Book a demo">
                <CalendarCheck className="h-4 w-4" aria-hidden />
                <span className="hidden min-[380px]:inline">Book a Demo</span>
                <span className="min-[380px]:hidden">Demo</span>
              </DemoButton>
            </div>
            <button
              ref={menuButton}
              type="button"
              data-intro-fade
              style={{ "--i": 9 } as React.CSSProperties}
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="grid h-11 w-11 place-items-center rounded-full border border-ink/10 bg-white text-ink transition hover:border-ink/25 lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        active={active}
        onClose={closeMenu}
      />
    </>
  );
}

/** Slide-in sidebar navigation for phones and tablets (rendered at <body> level). */
function MobileMenu({ open, active, onClose }: { open: boolean; active: string; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();
    const t = setTimeout(() => panel.current?.querySelector<HTMLElement>("a,button")?.focus(), 80);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled])");
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
          e.preventDefault();
          f[0].focus();
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
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden
          />
          <motion.div
            ref={panel}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            data-lenis-prevent
            className="absolute inset-y-0 right-0 flex w-[86vw] max-w-sm flex-col overflow-y-auto bg-bg shadow-[-20px_0_60px_-20px_rgba(11,11,15,0.35)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
          >
            <div className="flex items-center justify-between px-6 pb-4 pt-6">
              <Link href="/" onClick={onClose} aria-label="Zylo Solution home" className="text-[30px]">
                <Wordmark />
              </Link>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="grid h-11 w-11 place-items-center rounded-full border border-ink/10 text-ink transition hover:border-ink/25"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <nav aria-label="Mobile" className="px-4 py-2">
              <ul className="space-y-1">
                {NAV.map((item, i) => {
                  const isActive = active === item.key;
                  const IconCmp = item.icon;
                  return (
                    <motion.li
                      key={item.key}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 + i * 0.035, duration: 0.3 }}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex min-h-[52px] items-center gap-4 rounded-2xl px-4 text-base font-semibold transition",
                          isActive ? "bg-primary text-white" : "text-ink hover:bg-ink/[0.04]",
                        )}
                      >
                        <IconCmp className={cn("h-5 w-5", isActive ? "text-accent" : "text-muted")} aria-hidden />
                        {item.label}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            <div className="mt-auto space-y-5 border-t border-line px-6 pb-8 pt-6">
              <div onClickCapture={onClose}>
                <DemoButton className="h-12 w-full">
                  Book a free demo <ArrowRight className="h-4 w-4" aria-hidden />
                </DemoButton>
              </div>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href={SITE.phoneHref} className="flex items-center gap-3 text-ink/80 hover:text-ink">
                    <Phone className="h-4 w-4 text-primary" aria-hidden /> {SITE.phone}
                  </a>
                </li>
                <li>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-ink/80 hover:text-ink">
                    <WhatsAppIcon className="h-4 w-4 text-whatsapp" /> WhatsApp us
                  </a>
                </li>
                <li>
                  <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 text-ink/80 hover:text-ink">
                    <Mail className="h-4 w-4 text-primary" aria-hidden /> {SITE.email}
                  </a>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
