import Link from "next/link";
import { ArrowRight, Check, CheckCircle2, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CoverImage } from "@/components/ui/CoverImage";
import { Markdown } from "@/components/ui/Markdown";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { DemoButton } from "@/components/booking/DemoButton";
import { FinalCta } from "@/components/home/Sections";
import { JsonLd } from "@/components/seo/JsonLd";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { faqLd, serviceLd } from "@/lib/seo";
import { whatsappLink } from "@/lib/site";
import type { ProductDoc, ServiceDoc } from "@/types";

/** Shared layout for /services/[slug] and /products/[slug] – answer-first summary, audience, features, FAQ. */
export function OfferingDetail({
  doc,
  kind,
  related,
  whatsapp,
}: {
  doc: ServiceDoc | ProductDoc;
  kind: "services" | "products";
  related: (ServiceDoc | ProductDoc)[];
  whatsapp: string;
}) {
  const path = `/${kind}/${doc.slug}`;
  const chips = "chips" in doc ? doc.chips : [];
  const tagline = "tagline" in doc ? doc.tagline : "";

  return (
    <>
      <JsonLd data={[serviceLd(doc, path), faqLd(doc.faqs)]} />
      <PageHeader
        crumbs={[
          { name: kind === "services" ? "Services" : "Products", href: `/${kind}` },
          { name: doc.title, href: path },
        ]}
        eyebrow={tagline || (kind === "services" ? "Service" : "Product")}
        title={doc.title}
        description={<p className="text-ink/85">{doc.summary || doc.shortDescription}</p>}
      >
        {chips.length > 0 && (
          <ul className="mb-8 flex flex-wrap gap-2">
            {chips.map((c) => (
              <li key={c} className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold">
                <Check className="h-3.5 w-3.5 text-hl" aria-hidden /> {c}
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-col gap-3 sm:flex-row">
          <DemoButton service={doc.title}>
            Book a free demo <ArrowRight className="h-4 w-4" aria-hidden />
          </DemoButton>
          <a href={whatsappLink(whatsapp, `Hello Zylo Solution, I'd like to know more about ${doc.title}.`)} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            <WhatsAppIcon className="h-4 w-4 text-whatsapp" /> Ask on WhatsApp
          </a>
        </div>
      </PageHeader>

      {doc.coverImage && (
        <div className="container">
          <CoverImage
            src={doc.coverImage}
            alt={`${doc.title} by Zylo Solution, Bahrain`}
            sizes="(min-width: 1280px) 1176px, 100vw"
            priority
            className="aspect-[16/9] rounded-[28px] border border-line"
          />
        </div>
      )}

      <div className="container grid gap-12 py-16 lg:grid-cols-[1fr_360px] lg:gap-14 lg:py-20">
        <div className="min-w-0">
          <Markdown>{doc.longDescription}</Markdown>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          {doc.audience.length > 0 && (
            <div className="card p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Users className="h-5 w-5 text-hl" aria-hidden /> Who is this for?
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-ink/85">
                {doc.audience.map((a) => (
                  <li key={a} className="flex gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" aria-hidden /> {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/25 to-card p-6">
            <h2 className="text-lg font-semibold">See it in action</h2>
            <p className="mt-2 text-sm text-ink/75">A free 30-minute demo, tailored to your business.</p>
            <DemoButton service={doc.title} className="mt-5 w-full">
              Book a Demo
            </DemoButton>
          </div>
        </aside>
      </div>

      {doc.features.length > 0 && (
        <section aria-labelledby="features-title" className="border-y border-line bg-surface/40 py-16 lg:py-20">
          <div className="container">
            <h2 id="features-title" className="text-center text-3xl font-bold">
              Key features
            </h2>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {doc.features.map((f, i) => (
                <li key={f}>
                  <Reveal delay={(i % 3) * 0.05} className="flex h-full gap-3 rounded-2xl border border-line bg-card/50 p-5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/15 text-hl">
                      <Check className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="text-sm leading-relaxed text-ink/90">{f}</span>
                  </Reveal>
                </li>
              ))}
            </ul>
            {doc.benefits.length > 0 && (
              <>
                <h2 className="mt-16 text-center text-2xl font-bold">What you gain</h2>
                <ul className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-2">
                  {doc.benefits.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-ink/85">
                      <Icon name="Sparkles" className="h-4 w-4 shrink-0 text-hl" /> {b}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>
      )}

      {doc.faqs.length > 0 && (
        <section aria-labelledby="faq-title" className="section">
          <div className="container max-w-3xl">
            <h2 id="faq-title" className="text-center text-3xl font-bold">
              {doc.title}: common questions
            </h2>
            <FaqAccordion faqs={doc.faqs} className="mt-10" />
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="pb-16">
          <div className="container">
            <div className="flex items-end justify-between gap-4">
              <h2 id="related-title" className="text-2xl font-bold">
                Related {kind === "services" ? "services" : "solutions"}
              </h2>
              <Link href="/services" className="text-sm font-semibold text-hl hover:underline">
                All services
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.slice(0, 3).map((r) => (
                <ServiceCard key={r.slug} href={`/services/${r.slug}`} icon={r.icon} title={r.title} description={r.shortDescription} image={r.coverImage} />
              ))}
            </div>
          </div>
        </section>
      )}

      <FinalCta whatsapp={whatsapp} title={`Ready to talk about ${doc.title}?`} />
    </>
  );
}
