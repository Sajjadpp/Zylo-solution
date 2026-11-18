"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  ExternalLink,
  FolderKanban,
  Inbox,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  Package,
  Settings,
  X,
} from "lucide-react";
import { Wordmark } from "@/components/brand/Wordmark";
import { NotificationBell, PushToggle } from "@/components/admin/Notifications";
import { ConfirmProvider } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: Inbox },
  { href: "/admin/services", label: "Services", icon: Layers },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/work", label: "Our Work", icon: FolderKanban },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }
  return (
    <div className="flex h-full flex-col">
      <Link href="/admin" onClick={onNavigate} className="px-6 pb-8 pt-7 text-[30px]" aria-label="Admin home">
        <Wordmark />
      </Link>
      <nav aria-label="Admin" className="flex-1 space-y-1 px-3">
        {NAV.map((n) => {
          const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-sm font-medium transition",
                active ? "bg-primary text-white shadow-[0_8px_20px_-10px_rgba(37,65,245,0.9)]" : "text-muted hover:bg-ink/[0.04] hover:text-ink",
              )}
            >
              <n.icon className={cn("h-[18px] w-[18px]", active && "text-accent")} aria-hidden />
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-line p-3">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-sm text-muted transition hover:bg-ink/[0.04] hover:text-ink">
          <ExternalLink className="h-[18px] w-[18px]" aria-hidden /> View website
        </a>
        <button type="button" onClick={logout} className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 text-sm text-muted transition hover:bg-ink/[0.04] hover:text-ink">
          <LogOut className="h-[18px] w-[18px]" aria-hidden /> Log out
        </button>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [drawer, setDrawer] = useState(false);
  const pathname = usePathname();
  useEffect(() => setDrawer(false), [pathname]);

  return (
    <MotionConfig reducedMotion="user">
    <ConfirmProvider>
      <div className="min-h-dvh bg-bg">
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-line bg-surface/60 lg:block">
          <Sidebar />
        </aside>

        <AnimatePresence>
          {drawer && (
            <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDrawer(false)} aria-hidden />
              <motion.aside
                className="absolute inset-y-0 left-0 w-72 border-r border-line bg-surface"
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", stiffness: 380, damping: 38 }}
              >
                <button type="button" onClick={() => setDrawer(false)} aria-label="Close menu" className="absolute right-3 top-5 grid h-11 w-11 place-items-center rounded-full text-muted">
                  <X className="h-5 w-5" aria-hidden />
                </button>
                <Sidebar onNavigate={() => setDrawer(false)} />
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="lg:pl-64">
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-bg/80 px-4 backdrop-blur-xl sm:px-6">
            <button type="button" onClick={() => setDrawer(true)} aria-label="Open menu" className="grid h-11 w-11 place-items-center rounded-full border border-line lg:hidden">
              <Menu className="h-5 w-5" aria-hidden />
            </button>
            <div className="flex-1" />
            <PushToggle compact />
            <NotificationBell />
          </header>
          <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">{children}</main>
        </div>
      </div>
    </ConfirmProvider>
    </MotionConfig>
  );
}

export function PageTitle({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
