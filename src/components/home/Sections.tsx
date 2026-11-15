import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { DemoButton } from "@/components/booking/DemoButton";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { GCC, whatsappLink } from "@/lib/site";
import { benefits, processSteps } from "@/data/home";
import type { ProductDoc, ProjectDoc, ServiceDoc } from "@/types";

export function TrustStrip({ years, projects }: { years: number; projects: number }) {
  return (
    <section aria-label="Zylo Solution in numbers" data-spy="home" className="relative">
      <div className="container">
        <Reveal className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-3">
          <div className="bg-surface/90 px-6 py-8 text-center sm:py-10">
            <p className="font-display text-4xl font-bold sm:text-5xl">
              <Counter value={years} suffix="+" />
            </p>
            <p className="mt-2 text-sm text-muted">Years of experience</p>
          </div>
          <div className="bg-surface/90 px-6 py-8 text-center sm:py-10">
            <p className="font-display text-4xl font-bold sm:text-5xl">
              <Counter value={projects} suffix="+" />
            </p>
            <p className="mt-2 text-sm text-muted">Projects delivered</p>
          </div>
          <div className="bg-surface/90 px-6 py-8 text-center sm:py-10">
            <p className="font-display text-4xl font-bold sm:text-5xl">
              <Counter value={GCC.length} />
            </p>
            <p className="mt-2 text-sm text-muted">GCC countries served</p>
          </div>
        </Reveal>
        <ul className="mt-6 flex flex-wrap justify-center gap-2" aria-label="Countries served">
          {GCC.map((c) => (
            <li key={c.code} className="rounded-full border border-line bg-ink/[0.02] px-3.5 py-1.5 text-xs font-medium text-muted">
              {c.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ServicesGrid({ services }: { services: ServiceDoc[] }) {
  return (
    <section id="services" data-spy="services" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Services"
          title="Everything your business runs on"
          description="From Odoo ERP implementation to custom apps, one Bahrain team handles it end to end."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 0.06} className="h-full">
              <ServiceCard href={`/services/${s.slug}`} icon={s.icon} title={s.title} description={s.shortDescription} image={s.coverImage} />
            </Reveal>
          ))}
          <Reveal delay={0.12} className="h-full">
            <div className="flex h-full flex-col justify-center rounded-3xl border border-dashed border-ink/15 p-7">
              <h3 className="text-lg font-semibold">Not sure where to start?</h3>
              <p className="mt-2 text-sm text-muted">Tell us your goal. We&apos;ll recommend the simplest solution.</p>
              <DemoButton variant="none" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-hl hover:underline">
                Get a free consultation <ArrowRight className="h-4 w-4" aria-hidden />
              </DemoButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function FeaturedProducts({ products }: { products: ProductDoc[] }) {
  return (
    <section id="products" data-spy="products" className="section relative">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[500px] -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(37,65,245,0.07),transparent_65%)]" />
      <div className="container">
        <SectionHeading
          eyebrow="Products"
          title="Ready-made tools for stock and field sales"
          description="Built by Zylo, connected to Odoo, and running at businesses across the GCC."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08} className="h-full">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[32px] border border-line bg-gradient-to-b from-card to-surface p-7 transition duration-300 hover:-translate-y-1 hover:border-primary/40 sm:p-9">
                <div aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl transition group-hover:bg-primary/30" />
                <div className="relative flex items-start justify-between gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-white shadow-[0_12px_30px_-10px_rgba(37,65,245,0.9)]">
                    <Icon name={p.icon} className="h-7 w-7" />
                  </span>
                  <span className="rounded-full border border-line px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted">
                    Zylo product
                  </span>
                </div>
                <p className="relative mt-8 text-sm font-medium text-hl">{p.tagline}</p>
                <h3 className="relative mt-2 text-2xl font-bold sm:text-3xl">{p.title}</h3>
                <p className="relative mt-3 flex-1 leading-relaxed text-muted">{p.shortDescription}</p>
                <ul className="relative mt-6 flex flex-wrap gap-2">
                  {p.chips.map((c) => (
                    <li key={c} className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-ink">
                      <Check className="h-3.5 w-3.5 text-hl" aria-hidden /> {c}
                    </li>
                  ))}
                </ul>
                <div className="relative mt-8 flex flex-wrap gap-3">
                  <Link href={`/products/${p.slug}`} className="btn-ghost">
                    Explore {p.title} <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <DemoButton service={p.title} variant="none" className="btn px-3 text-hl hover:text-ink">
                    Book a demo
                  </DemoButton>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section aria-labelledby="process-title" className="section">
      <div className="container">
        <SectionHeading eyebrow="How we work" title={<span id="process-title">Four simple steps to go live</span>} />
        <div className="relative mt-14">
          <div aria-hidden className="absolute left-[23px] top-6 h-[calc(100%-48px)] w-px bg-gradient-to-b from-primary/60 via-primary/20 to-transparent md:left-6 md:right-6 md:top-6 md:h-px md:w-auto md:bg-gradient-to-r" />
          <ol className="relative grid gap-6 md:grid-cols-4 md:gap-5">
            {processSteps.map((s, i) => (
              <li key={s.title}>
                <Reveal delay={i * 0.08} className="relative flex gap-5 md:block">
                  <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-primary/40 bg-surface text-primary-400">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                  <div className="md:mt-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Step {i + 1}</p>
                    <h3 className="mt-1 text-lg font-semibold">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function LatestWork({ projects }: { projects: ProjectDoc[] }) {
  return (
    <section id="work" data-spy="work" className="section">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            align="left"
            className="text-center md:text-left"
            eyebrow="Our work"
            title="Real results for Gulf businesses"
            description="A look at recent ERP, barcoding and van sales projects."
          />
          <Link href="/work" className="btn-ghost shrink-0">
            View all projects <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06} className="h-full">
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyZylo() {
  return (
    <section aria-labelledby="why-title" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Why Zylo"
          title={<span id="why-title">A partner that speaks your business</span>}
          description="Big-company know-how with the speed and care of a local team."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={(i % 3) * 0.06} className="h-full">
              <div className="h-full rounded-3xl border border-line bg-card/40 p-6 transition duration-300 hover:-translate-y-1 hover:bg-card/70 sm:p-7">
                <Icon name={b.icon} className="h-6 w-6 text-hl" />
                <h3 className="mt-5 text-lg font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta({ whatsapp, title, text }: { whatsapp: string; title?: string; text?: string }) {
  return (
    <section id="contact" data-spy="contact" className="pb-24 pt-8 sm:pb-28">
      <div className="container">
        <Reveal>
          <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-primary to-primary-600 px-6 py-14 text-center sm:px-12 sm:py-20">
            <div aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent" />
            <div aria-hidden className="absolute -left-10 bottom-[-70px] h-40 w-40 rounded-full border-[18px] border-white/10" />
                        <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold text-white sm:text-5xl">{title ?? "See Zylo running with your business"}</h2>
              <p className="mt-5 text-base text-white/80 sm:text-lg">
                {text ?? "Book a free 30-minute demo. We'll show you exactly how it works for your team."}
              </p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <DemoButton variant="none" className="btn-yellow h-12 px-7 text-[15px]">
                  Book a Demo <ArrowRight className="h-4 w-4" aria-hidden />
                </DemoButton>
                <a
                  href={whatsappLink(whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn h-12 border border-white/40 px-7 text-[15px] text-white hover:-translate-y-0.5 hover:bg-white/10"
                >
                  <WhatsAppIcon className="h-4 w-4" /> WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
