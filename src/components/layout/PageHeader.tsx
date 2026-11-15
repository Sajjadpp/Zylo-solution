import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

/** Top of every inner page. Server-rendered h1 (LCP) + breadcrumbs; joins the intro reveal when it plays. */
export function PageHeader({
  crumbs,
  eyebrow,
  title,
  description,
  children,
}: {
  crumbs: { name: string; href: string }[];
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pb-12 pt-40 sm:pt-44 lg:pb-16">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0" />
        <div className="absolute -top-48 left-1/2 h-[460px] w-[820px] -translate-x-1/2 rounded-full bg-primary/[0.08] blur-[130px]" />
        <div className="absolute -right-24 top-10 h-[300px] w-[300px] rounded-full bg-accent/[0.14] blur-[110px]" />
      </div>
      <div className="container">
        <div data-hero-item style={i(1)}>
          <Breadcrumbs items={crumbs} />
        </div>
        <div className="mt-8 max-w-3xl">
          {eyebrow && (
            <p data-hero-item style={i(2)} className="eyebrow">
              {eyebrow}
            </p>
          )}
          <h1 data-hero-item="lcp" style={i(3)} className="mt-5 text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-[3.5rem]">
            {title}
          </h1>
          {description && (
            <div data-hero-item style={i(4)} className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
              {description}
            </div>
          )}
          {children && (
            <div data-hero-item style={i(5)} className="mt-8">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
