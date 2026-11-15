"use client";

import Link from "next/link";
import { useDemoModal } from "@/components/booking/DemoModal";
import { cn } from "@/lib/utils";

/**
 * Opens the booking modal. Rendered as a real link to /book-demo so it works without JS,
 * with middle-click / new tab, and is crawlable.
 */
export function DemoButton({
  children,
  service,
  className,
  variant = "primary",
  ...rest
}: {
  children: React.ReactNode;
  service?: string;
  className?: string;
  variant?: "primary" | "ghost" | "none";
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const { open } = useDemoModal();
  return (
    <Link
      href={service ? `/book-demo?service=${encodeURIComponent(service)}` : "/book-demo"}
      prefetch={false}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        open(service);
      }}
      className={cn(variant === "primary" && "btn-primary", variant === "ghost" && "btn-ghost", className)}
      {...rest}
    >
      {children}
    </Link>
  );
}
