import { Hero } from "@/components/home/Hero";
import { FeaturedProducts, FinalCta, LatestWork, Process, TrustStrip, WhyZylo } from "@/components/home/Sections";
import { HorizontalServices } from "@/components/home/HorizontalServices";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { getProducts, getProjects, getServices, getSettings } from "@/lib/content";
import { buildMetadata, faqLd } from "@/lib/seo";
import { homeFaqs } from "@/data/home";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "Zylo Solution | Odoo ERP & Software Company in Bahrain",
  description:
    "ERP company in Manama: Odoo ERP implementation, barcode inventory systems, offline van sales apps and custom software for businesses in Bahrain and the GCC.",
  path: "/",
  keywords: [
    "Odoo ERP implementation Bahrain",
    "Odoo partner GCC",
    "ERP company in Manama",
    "software development company Bahrain",
    "barcode inventory system Bahrain",
    "van sales app Bahrain",
  ],
});

export default async function HomePage() {
  const [services, products, projects, settings] = await Promise.all([
    getServices(),
    getProducts(),
    getProjects(3),
    getSettings(),
  ]);

  return (
    <>
      <JsonLd data={faqLd(homeFaqs)} />
      <Hero whatsapp={settings.whatsapp} />
      <TrustStrip years={settings.stats.years} projects={settings.stats.projects} />
      <HorizontalServices services={services} />
      <FeaturedProducts products={products} />
      <Process />
      <LatestWork projects={projects} />
      <WhyZylo />
      <section aria-labelledby="faq-title" className="section pt-0">
        <div className="container max-w-3xl">
          <SectionHeading eyebrow="FAQ" title={<span id="faq-title">Questions, answered</span>} />
          <FaqAccordion faqs={homeFaqs} className="mt-12" />
        </div>
      </section>
      <FinalCta whatsapp={settings.whatsapp} />
    </>
  );
}
