import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Building2, Calendar, CheckCircle2, MapPin, Tag } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CoverImage } from "@/components/ui/CoverImage";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { FinalCta } from "@/components/home/Sections";
import { JsonLd } from "@/components/seo/JsonLd";
import { getProject, getProjects, getSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProject((await params).slug);
  if (!p) return { title: "Project not found", robots: { index: false } };
  return buildMetadata({
    title: p.seoTitle || p.title,
    description: p.seoDescription || p.description,
    path: `/work/${p.slug}`,
    image: p.coverImage,
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [p, all, settings] = await Promise.all([getProject(slug), getProjects(), getSettings()]);
  if (!p) notFound();

  const facts = [
    { icon: Building2, label: "Client", value: p.client },
    { icon: Tag, label: "Industry", value: p.industry },
    { icon: MapPin, label: "Country", value: p.country },
    { icon: Calendar, label: "Year", value: String(p.year) },
  ].filter((f) => f.value);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: p.title,
          description: p.description,
          url: absoluteUrl(`/work/${p.slug}`),
          dateCreated: String(p.year),
          creator: { "@type": "Organization", name: SITE.name, url: SITE.url },
          about: p.tech,
          locationCreated: { "@type": "Place", name: p.country },
        }}
      />
      <PageHeader
        crumbs={[
          { name: "Our Work", href: "/work" },
          { name: p.title, href: `/work/${p.slug}` },
        ]}
        eyebrow={p.sample ? "Sample case study" : "Case study"}
        title={p.title}
        description={<p>{p.description}</p>}
      />

      <div className="container">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="bg-surface/90 p-5">
              <dt className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted">
                <f.icon className="h-3.5 w-3.5" aria-hidden /> {f.label}
              </dt>
              <dd className="mt-1.5 text-sm font-semibold">{f.value}</dd>
            </div>
          ))}
        </dl>
        {p.coverImage && (
          <CoverImage
            src={p.coverImage}
            alt={`${p.title} – ${p.industry}, ${p.country}`}
            sizes="(min-width: 1280px) 1176px, 100vw"
            priority
            className="mt-8 aspect-[16/9] rounded-[28px] border border-line"
          />
        )}
      </div>

      <div className="container grid gap-12 py-16 lg:grid-cols-[1fr_340px] lg:py-20">
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold">The challenge</h2>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-ink/80">{p.challenge}</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold">Our solution</h2>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-ink/80">{p.solution}</p>
          </section>
          {p.gallery.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold">Gallery</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {p.gallery.map((g, i) => (
                  <CoverImage key={g} src={g} alt={`${p.title} screenshot ${i + 1}`} sizes="(min-width: 1024px) 400px, 100vw" className="aspect-[4/3] rounded-2xl border border-line" />
                ))}
              </div>
            </section>
          )}
        </div>
        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          {p.results.length > 0 && (
            <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/20 to-card p-6">
              <h2 className="text-lg font-semibold">Results</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {p.results.map((r) => (
                  <li key={r} className="flex gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-hl" aria-hidden /> {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {p.tech.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold">Modules &amp; technology</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <li key={t} className="rounded-full border border-line px-3 py-1 text-xs text-ink/85">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {all.length > 1 && (
        <section className="pb-12">
          <div className="container">
            <h2 className="text-2xl font-bold">More projects</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {all
                .filter((x) => x.slug !== p.slug)
                .slice(0, 3)
                .map((x) => (
                  <ProjectCard key={x.slug} project={x} />
                ))}
            </div>
          </div>
        </section>
      )}
      <FinalCta whatsapp={settings.whatsapp} title="Want results like these?" />
    </>
  );
}
