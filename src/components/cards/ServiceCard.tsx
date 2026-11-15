import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { CoverImage } from "@/components/ui/CoverImage";
import { cn } from "@/lib/utils";

export function ServiceCard({
  href,
  icon,
  title,
  description,
  image,
  compact = false,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
  image?: string;
  /** Shorter card for tight spaces (e.g. pinned carousel on short screens). */
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-card transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card"
    >
      <div className="relative">
        <CoverImage
          src={image}
          alt={`${title} illustration`}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className={cn(compact ? "aspect-[2/1]" : "aspect-[16/9]", "border-b border-line transition duration-500 group-hover:scale-[1.03]")}
        />
        {/* icon badge overlapping the image edge */}
        <span className="absolute -bottom-6 left-6 grid h-12 w-12 place-items-center rounded-2xl bg-primary text-white shadow-[0_10px_24px_-10px_rgba(37,65,245,0.9)] ring-4 ring-card transition group-hover:bg-black group-hover:text-accent sm:left-7">
          <Icon name={icon} className="h-6 w-6" />
        </span>
      </div>
      <div className={cn("flex flex-1 flex-col p-6 sm:p-7", compact ? "pt-9 sm:pt-9" : "pt-10 sm:pt-11")}>
        <h3 className="text-lg font-semibold">{title}</h3>
        {compact ? <p className="sr-only">{description}</p> : <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{description}</p>}
        <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink/90 transition group-hover:text-hl">
          Learn more <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
