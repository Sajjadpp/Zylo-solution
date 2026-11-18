import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { CoverImage } from "@/components/ui/CoverImage";
import { cn } from "@/lib/utils";

const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

/**
 * Top of every inner page. Server-rendered h1 (LCP) + breadcrumbs; joins the intro reveal when it plays.
 * With `image`, the picture sits to the right of the text on desktop and directly under the title on phones.
 */
export function PageHeader({
  crumbs,
  eyebrow,
  title,
  description,
  children,
  image,
}: {
  crumbs: { name: string; href: string }[];
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  image?: { src?: string; alt: string };
}) {
  const withImage = Boolean(image?.src);

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
        <div className={cn("mt-8", withImage ? "grid items-center gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-x-14 lg:gap-y-0" : "max-w-3xl")}>
          <div className={cn(withImage && "lg:col-start-1 lg:row-start-1 lg:self-end")}>
            {eyebrow && (
              <p data-hero-item style={i(2)} className="eyebrow">
                {eyebrow}
              </p>
            )}
            <h1
              data-hero-item="lcp"
              style={i(3)}
              className={cn(
                "font-bold leading-[1.08]",
                eyebrow && "mt-5",
                withImage ? "text-3xl sm:text-4xl lg:text-[2.75rem]" : "text-4xl sm:text-5xl lg:text-[3.5rem]",
              )}
            >
              {title}
            </h1>
          </div>

          {withImage && (
            <div data-hero-item style={i(3)} className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
              <CoverImage
                src={image!.src}
                alt={image!.alt}
                sizes="(min-width: 1024px) 600px, 100vw"
                priority
                className="aspect-[16/10] rounded-3xl border border-line"
              />
            </div>
          )}

          {(description || children) && (
            <div className={cn(withImage && "lg:col-start-1 lg:row-start-2 lg:self-start")}>
              {description && (
                <div data-hero-item style={i(4)} className={cn("text-base leading-relaxed text-muted sm:text-lg", withImage ? "lg:mt-6" : "mt-6")}>
                  {description}
                </div>
              )}
              {children && (
                <div data-hero-item style={i(5)} className="mt-8">
                  {children}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
