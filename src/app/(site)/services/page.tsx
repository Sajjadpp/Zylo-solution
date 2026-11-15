import { PageHeader } from "@/components/layout/PageHeader";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { Reveal } from "@/components/ui/Reveal";
import { FinalCta, Process } from "@/components/home/Sections";
import { JsonLd } from "@/components/seo/JsonLd";
import { getServices, getSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "ERP & Software Services in Bahrain",
  description:
    "Odoo ERP implementation, barcoding systems, van sales, custom accounting software, websites and apps. Services by Zylo Solution, an ERP company in Manama serving the GCC.",
  path: "/services",
});

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getServices(), getSettings()]);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Zylo Solution services",
          itemListElement: services.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: absoluteUrl(`/services/${s.slug}`),
            name: s.title,
          })),
        }}
      />
      <PageHeader
        crumbs={[{ name: "Services", href: "/services" }]}
        eyebrow="Services"
        title="ERP and software services for GCC businesses"
        description="Zylo Solution is a software development company in Bahrain. We implement Odoo ERP, build barcode and van sales systems, and develop custom software, websites and apps for companies across the Gulf."
      />
      <section className="pb-8">
        <div className="container grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 0.06} className="h-full">
              <ServiceCard href={`/services/${s.slug}`} icon={s.icon} title={s.title} description={s.shortDescription} image={s.coverImage} />
            </Reveal>
          ))}
        </div>
      </section>
      <Process />
      <FinalCta whatsapp={settings.whatsapp} />
    </>
  );
}
