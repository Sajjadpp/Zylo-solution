"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutGroup, motion } from "framer-motion";
import { CalendarCheck, FolderKanban, House, Layers, Newspaper, Package, Phone, type LucideIcon } from "lucide-react";
import { Wordmark } from "@/components/brand/Wordmark";
import { DemoButton } from "@/components/booking/DemoButton";
import { cn } from "@/lib/utils";

type NavItem = { key: string; label: string; href: string; icon: LucideIcon };

const NAV: NavItem[] = [
  { key: "home", label: "Home", href: "/", icon: House },
  { key: "services", label: "Services", href: "/services", icon: Layers },
  { key: "products", label: "Products", href: "/products", icon: Package },
  { key: "work", label: "Our Work", href: "/work", icon: FolderKanban },
  { key: "blog", label: "Blog", href: "/blog", icon: Newspaper },
  { key: "contact", label: "Contact", href: "/contact", icon: Phone },
];

/** Home page: highlight the section in view. Other pages: highlight by route. */
function useActiveKey() {
  const pathname = usePathname();
  const [spy, setSpy] = useState("home");

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

  if (pathname === "/") return spy;
  return NAV.find((n) => n.href !== "/" && pathname.startsWith(n.href))?.key ?? "";
}

function PillBg({ scrolled, className }: { scrolled: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      data-intro-fade
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 rounded-full border backdrop-blur-xl transition-colors duration-300",
        scrolled ? "border-ink/10 bg-white/90 shadow-[0_12px_36px_-16px_rgba(11,11,15,0.28)]" : "border-ink/[0.08] bg-white/70 shadow-[0_8px_30px_-18px_rgba(11,11,15,0.18)]",
        className,
      )}
    />
  );
}

export function Header() {
  const active = useActiveKey();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);

  // Hide while scrolling down, reveal on any scroll up. Always visible near the top.
  useEffect(() => {
    let lastY = window.scrollY;
    // re-read the position after client-side navigation scrolls the new page to the top
    const onNav = () => (lastY = window.scrollY);
    window.addEventListener("popstate", onNav);
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      setScrolled(y > 24);
      if (y < 120) setHidden(false);
      else if (delta > 6) setHidden(true);
      else if (delta < -6) setHidden(false);
      if (Math.abs(delta) > 6 || y < 120) lastY = y;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("popstate", onNav);
    };
  }, []);

  // New page: start with the header visible and forget any focus left over from the clicked link.
  useEffect(() => {
    setHidden(false);
    setFocusWithin(false);
  }, [pathname]);

  const isHidden = hidden && !focusWithin;

  return (
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
          "relative isolate mx-auto flex max-w-6xl flex-col gap-2 md:flex-row md:items-center md:gap-4 md:pl-6 md:pr-2 transition-[height] duration-300",
          scrolled ? "md:h-14" : "md:h-16",
        )}
      >
        <PillBg scrolled={scrolled} className="hidden md:block" />

        {/* Row 1 (mobile) / left side (desktop): logo + mobile demo button */}
        <div
          className={cn(
            "relative isolate flex items-center justify-between pl-5 pr-1.5 transition-[height] duration-300 md:contents",
            scrolled ? "h-12" : "h-14",
          )}
        >
          <PillBg scrolled={scrolled} className="md:hidden" />
          <Link href="/" aria-label="Zylo Solution home" className="flex items-center rounded-lg py-1">
            <div data-header-logo className="text-[22px] md:text-[24px]">
              <Wordmark />
            </div>
          </Link>
          <div data-intro-fade style={{ "--i": 2 } as React.CSSProperties} className="md:hidden">
            <DemoButton className="!min-h-[44px] !px-4 text-[13px]" aria-label="Book a demo">
              <CalendarCheck className="h-4 w-4" aria-hidden /> Book a Demo
            </DemoButton>
          </div>
        </div>

        {/* Row 2 (mobile icon nav) / centre (desktop text nav) */}
        <nav aria-label="Main" className="relative isolate md:flex-1">
          <PillBg scrolled={scrolled} className="md:hidden" />
          <LayoutGroup id="main-nav">
            <ul className="flex items-center justify-between px-1.5 py-1 md:justify-center md:gap-1 md:p-0">
              {NAV.map((item, i) => {
                const isActive = active === item.key;
                const IconCmp = item.icon;
                return (
                  <li key={item.key} data-intro-fade style={{ "--i": i + 1 } as React.CSSProperties}>
                    <Link
                      href={item.href}
                      aria-label={item.label}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "relative flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-full px-2.5 text-sm font-medium transition-colors md:px-4",
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
                      <IconCmp className="h-[18px] w-[18px] md:hidden" aria-hidden />
                      <span className={cn("text-[13px] md:text-sm", isActive ? "inline" : "hidden md:inline")}>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </LayoutGroup>
        </nav>

        <div data-intro-fade style={{ "--i": 7 } as React.CSSProperties} className="hidden md:block">
          <DemoButton className="!min-h-[44px]">
            <CalendarCheck className="h-4 w-4" aria-hidden /> Book a Demo
          </DemoButton>
        </div>
      </div>
    </header>
  );
}
