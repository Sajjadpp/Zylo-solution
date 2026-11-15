import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbLd(all)} />
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          {all.map((it, i) => {
            const last = i === all.length - 1;
            return (
              <li key={it.href} className="flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className="text-ink/90">
                    {it.name}
                  </span>
                ) : (
                  <>
                    <Link href={it.href} className="transition hover:text-ink">
                      {it.name}
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
