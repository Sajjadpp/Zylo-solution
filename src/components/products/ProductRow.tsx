import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CoverImage } from "@/components/ui/CoverImage";
import { Reveal } from "@/components/ui/Reveal";
import type { ProductDoc } from "@/types";

/** One product on /products: a compact card – picture, name, tagline, short text, 3 features, one link. */
export function ProductRow({
  product,
  index,
  headingAs: Heading = "h2",
}: {
  product: ProductDoc;
  index: number;
  /** h2 on /products, h3 when the cards sit inside another section (home page). */
  headingAs?: "h2" | "h3";
}) {
  const href = `/products/${product.slug}`;
  const features = (product.chips.length ? product.chips : product.features).slice(0, 3);

  return (
    <Reveal delay={(index % 2) * 0.06} className="h-full">
      <article className="group relative flex h-full flex-col">
        <div className="overflow-hidden rounded-2xl border border-line">
          <CoverImage
            src={product.coverImage}
            alt=""
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            priority={index < 2}
            className="aspect-[16/9] transition duration-700 group-hover:scale-[1.02]"
          />
        </div>
        <div className="flex flex-1 flex-col pt-5">
          <Heading className="text-xl font-bold sm:text-2xl">
            {/* stretched link: the whole card is clickable */}
            <Link href={href} className="after:absolute after:inset-0 group-hover:text-primary">
              {product.title}
            </Link>
          </Heading>
          {product.tagline && <p className="mt-1 text-muted">{product.tagline}</p>}
          {product.shortDescription && <p className="mt-3 text-sm leading-relaxed text-ink/75">{product.shortDescription}</p>}
          {features.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-ink/80">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          )}
          <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-primary">
            View product <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
          </span>
        </div>
      </article>
    </Reveal>
  );
}

/** Lowercase the first letter for mid-sentence use, but keep abbreviations like "FMCG" intact. */
const lowerFirst = (s: string) => (/^[A-Z][a-z]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s);

/** "Which one do I need?" – a two-line guide built from each product's audience. */
export function ProductGuide({ products }: { products: ProductDoc[] }) {
  const usable = products.filter((p) => p.audience.length > 0);
  if (usable.length < 2) return null;
  return (
    <section aria-labelledby="guide-title" className="border-t border-line py-14 sm:py-16">
      <h2 id="guide-title" className="text-2xl font-bold">
        Which one do I need?
      </h2>
      <dl className="mt-8 divide-y divide-line border-y border-line">
        {usable.map((p) => (
          <div key={p.slug} className="grid gap-2 py-5 sm:grid-cols-[240px_1fr_auto] sm:items-center sm:gap-8">
            <dt className="font-semibold">{p.title}</dt>
            <dd className="text-sm text-muted">Best for {p.audience.slice(0, 2).map(lowerFirst).join(" and ")}.</dd>
            <dd>
              <Link href={`/products/${p.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                View <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
