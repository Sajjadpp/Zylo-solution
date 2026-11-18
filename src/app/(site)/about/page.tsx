import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Process, TrustStrip } from "@/components/home/Sections";
import { Block } from "@/components/ui/Block";
import { Icon } from "@/components/ui/Icon";
import { MinimalCta } from "@/components/ui/MinimalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { getServices, getSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { GCC, SITE, absoluteUrl } from "@/lib/site";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "About Zylo Solution: ERP Company in Manama, Bahrain",
  description:
    "Zylo Solution is an ERP and software company in Manama, Bahrain. We implement Odoo ERP and build barcoding, van sales, accounting and custom software for businesses across the GCC.",
  path: "/about",
});

const VALUES = [
  { icon: "Sparkles", title: "Keep it simple", text: "Software your team can learn in a day, not a month." },
  { icon: "ShieldCheck", title: "Honest advice", text: "We recommend what fits your business, even when it is the smaller project." },
  { icon: "MapPin", title: "Close and reachable", text: "A Manama team in your time zone, on the phone and on WhatsApp." },
  { icon: "Award", title: "Built to last", text: "Clean setups and clear documentation, so systems keep working as you grow." },
];

const INDUSTRIES = [
  "Trading & distribution",
  "Retail chains",
  "FMCG & food",
  "Warehousing & logistics",
  "Manufacturing",
  "Pharmacy & medical supply",
  "Contracting & property",
  "Professional services",
];

export default async function AboutPage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);
  const { years, projects } = settings.stats;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: `About ${SITE.name}`,
          url: absoluteUrl("/about"),
          about: { "@id": `${SITE.url}/#organization` },
        }}
      />
      <PageHeader
        crumbs={[{ name: "About", href: "/about" }]}
        eyebrow="About us"
        title="A Bahrain team helping Gulf businesses run better"
        description={`Zylo Solution is an ERP and software company based in Manama, Bahrain. For more than ${years} years we have helped companies across the GCC replace spreadsheets and disconnected tools with systems that simply work.`}
      />

      <TrustStrip years={years} projects={projects} />

      <div className="mt-16 sm:mt-20">
        <Block title="Who we are">
          <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-ink/80">
            <p>
              We are a software company from Manama. Our work sits where business and technology meet: we sit with your team, understand
              how you buy, sell, stock and account, and then set up the systems that make that work easier.
            </p>
            <p>
              Most of our projects are <strong className="text-ink">Odoo ERP implementations</strong>, often combined with our own{" "}
              <strong className="text-ink">barcoding</strong> and <strong className="text-ink">van sales</strong> products. When a business
              needs something unique, we build custom accounting software, websites and mobile apps.
            </p>
          </div>
        </Block>

        <Block title="Mission & vision">
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Mission</p>
              <p className="mt-3 font-display text-2xl font-semibold leading-snug">
                Give every growing Gulf business the clear, reliable systems that large companies take for granted.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Vision</p>
              <p className="mt-3 font-display text-2xl font-semibold leading-snug">
                To be the most trusted ERP and software partner for businesses across the GCC.
              </p>
            </div>
          </div>
        </Block>

        <Block title="What we value">
          <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {VALUES.map((v) => (
              <li key={v.title} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary">
                  <Icon name={v.icon} className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-semibold">{v.title}</span>
                  <span className="mt-1 block text-ink/70">{v.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="What we do">
          <ul className="grid gap-x-10 sm:grid-cols-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="group flex items-center justify-between gap-4 border-b border-line py-4">
                  <span className="flex items-center gap-3">
                    <Icon name={s.icon} className="h-5 w-5 text-primary" />
                    <span className="font-medium group-hover:text-primary">{s.title}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Industries we serve">
          <ul className="flex flex-wrap gap-2.5">
            {INDUSTRIES.map((i) => (
              <li key={i} className="rounded-full border border-line px-4 py-2 text-sm text-ink/85">
                {i}
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Where we work">
          <div className="grid gap-8 sm:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="flex items-center gap-2 font-semibold">
                <MapPin className="h-4 w-4 text-primary" aria-hidden /> Headquarters
              </p>
              <p className="mt-2 text-ink/75">{settings.address}</p>
              <p className="mt-1 text-sm text-muted">{settings.hours}</p>
            </div>
            <div>
              <p className="font-semibold">Serving the GCC</p>
              <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-ink/75 sm:grid-cols-3">
                {GCC.map((c) => (
                  <li key={c.code} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                    {c.name}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted">On-site in Bahrain, and on-site or remote across the Gulf.</p>
            </div>
          </div>
        </Block>
      </div>

      <div className="border-t border-line">
        <Process />
      </div>

      <MinimalCta
        title="Let’s talk about your business"
        text="A free 30-minute call with our team in Manama. No obligation."
        whatsapp={settings.whatsapp}
      />
    </>
  );
}
