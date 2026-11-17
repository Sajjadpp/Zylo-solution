import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { CoverImage } from "@/components/ui/CoverImage";
import { Markdown } from "@/components/ui/Markdown";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { Reveal } from "@/components/ui/Reveal";
import { MinimalCta } from "@/components/ui/MinimalCta";
import { DemoButton } from "@/components/booking/DemoButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqLd, serviceLd } from "@/lib/seo";
import { whatsappLink } from "@/lib/site";
import type { ProductDoc, ProjectDoc } from "@/types";

const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

/** Minimal product page: one message, one picture, one action — details on demand. */
export function ProductDetail({
  product,
  others,
  caseStudy,
  whatsapp,
}: {
  product: ProductDoc;
  others: ProductDoc[];
  caseStudy: ProjectDoc | null;
  whatsapp: string;
}) {
  const path = `/products/${product.slug}`;

  return (
    <>
      <JsonLd data={[serviceLd(product, path), faqLd(product.faqs)]} />

      {/* ── Hero: title + tagline, picture, summary + one action ─────────── */}
      <section className="pb-16 pt-40 sm:pt-44 lg:pb-24">
        <div className="container">
          <div data-hero-item style={i(1)}>
            <Breadcrumbs items={[{ name: "Products", href: "/products" }, { name: product.title, href: path }]} />
          </div>
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div className="lg:col-start-1 lg:row-start-1">
              <h1 data-hero-item="lcp" style={i(2)} className="text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
                {product.title}
              </h1>
              {product.tagline && (
                <p data-hero-item style={i(3)} className="mt-4 text-xl text-muted sm:text-2xl">
                  {product.tagline}
                </p>
              )}
            </div>

            <div data-hero-item style={i(3)} className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
              <CoverImage
                src={product.coverImage}
                alt={`${product.title} by Zylo Solution`}
                sizes="(min-width: 1024px) 620px, 100vw"
                priority
                className="aspect-[16/10] rounded-3xl border border-line"
              />
            </div>

            <div data-hero-item style={i(4)} className="lg:col-start-1 lg:row-start-2 lg:self-start">
              {(product.summary || product.shortDescription) && (
                <p className="max-w-xl leading-relaxed text-ink/80">{product.summary || product.shortDescription}</p>
              )}
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <DemoButton service={product.title} className="h-12 px-6">
                  Book a free demo <ArrowRight className="h-4 w-4" aria-hidden />
                </DemoButton>
                <a
                  href={whatsappLink(whatsapp, `Hello Zylo Solution, I'd like to know more about ${product.title}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold underline-offset-4 hover:underline"
                >
                  or ask on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who it's for ─────────────────────────────────────────────────── */}
      {product.audience.length > 0 && (
        <Block title="Who it’s for">
          <ul className="grid gap-x-10 sm:grid-cols-2">
            {product.audience.map((a) => (
              <li key={a} className="border-b border-line py-4 text-ink/85">
                {a}
              </li>
            ))}
          </ul>
        </Block>
      )}

      {/* ── What it does (features, once) ────────────────────────────────── */}
      {product.features.length > 0 && (
        <Block title="What it does">
          <ol className="grid gap-x-10 sm:grid-cols-2">
            {product.features.map((f, n) => (
              <li key={f} className="flex gap-4 border-b border-line py-4">
                <span className="font-display text-sm font-semibold tabular-nums text-muted">{String(n + 1).padStart(2, "0")}</span>
                <span className="text-ink/85">{f}</span>
              </li>
            ))}
          </ol>
        </Block>
      )}

      {/* ── Results ──────────────────────────────────────────────────────── */}
      {product.benefits.length > 0 && (
        <Block title="What changes for you">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {product.benefits.map((b) => (
              <li key={b} className="border-l-2 border-primary pl-4 font-display text-lg font-semibold leading-snug">
                {b}
              </li>
            ))}
          </ul>
        </Block>
      )}

      {/* ── Proof: matching case study ───────────────────────────────────── */}
      {caseStudy && (
        <Block title="In practice">
          <Link href={`/work/${caseStudy.slug}`} className="group grid items-center gap-6 sm:grid-cols-[280px_1fr] sm:gap-10">
            <CoverImage
              src={caseStudy.coverImage}
              alt=""
              sizes="280px"
              className="aspect-[16/10] rounded-2xl border border-line"
            />
            <div>
              <p className="text-sm text-muted">
                {caseStudy.industry} · {caseStudy.country}
                {caseStudy.sample ? " · sample case study" : ""}
              </p>
              <h3 className="mt-2 text-xl font-semibold group-hover:text-primary">{caseStudy.title}</h3>
              {caseStudy.results[0] && <p className="mt-2 text-ink/80">{caseStudy.results[0]}</p>}
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Read the case study <ArrowRight className="h-4 w-4" aria-hidden />
              </span>
            </div>
          </Link>
        </Block>
      )}

      {/* ── Full details on demand (kept in the HTML for SEO) ────────────── */}
      {product.longDescription && (
        <Block title="Full details">
          <details className="group">
            <summary className="inline-flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-primary [&::-webkit-details-marker]:hidden">
              Read the full product details
              <ChevronDown className="h-4 w-4 transition group-open:rotate-180" aria-hidden />
            </summary>
            <div className="mt-8 max-w-3xl">
              <Markdown>{product.longDescription}</Markdown>
            </div>
          </details>
        </Block>
      )}

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      {product.faqs.length > 0 && (
        <Block title="Questions">
          <FaqAccordion faqs={product.faqs} className="max-w-3xl" />
        </Block>
      )}

      {/* ── Other products ───────────────────────────────────────────────── */}
      {others.length > 0 && (
        <Block title="Other products">
          <ul className="grid gap-6 sm:grid-cols-2">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/products/${o.slug}`} className="group flex items-center gap-5">
                  <CoverImage src={o.coverImage} alt="" sizes="160px" className="aspect-[16/10] w-36 shrink-0 rounded-xl border border-line sm:w-40" />
                  <span>
                    <span className="block font-semibold group-hover:text-primary">{o.title}</span>
                    {o.tagline && <span className="mt-1 block text-sm text-muted">{o.tagline}</span>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Block>
      )}

      <MinimalCta title={`Ready to see ${product.title}?`} text="A free 30-minute demo, tailored to your business." service={product.title} whatsapp={whatsapp} />
    </>
  );
}

/** Section with a label column on the left (desktop) and content on the right. */
function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line">
      <Reveal className="container grid gap-8 py-14 sm:py-16 lg:grid-cols-[240px_1fr] lg:gap-16">
        <h2 className="text-lg font-semibold text-muted">{title}</h2>
        <div className="min-w-0">{children}</div>
      </Reveal>
    </section>
  );
}
