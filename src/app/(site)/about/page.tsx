import { PageHeader } from "@/components/layout/PageHeader";
import { FinalCta, Process, TrustStrip, WhyZylo } from "@/components/home/Sections";
import { Reveal } from "@/components/ui/Reveal";
import { getSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "About Zylo Solution: ERP Company in Manama, Bahrain",
  description:
    "Zylo Solution is an ERP and software company in Manama, Bahrain with 10+ years of experience and 200+ projects delivered for businesses across the GCC.",
  path: "/about",
});

export default async function AboutPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHeader
        crumbs={[{ name: "About", href: "/about" }]}
        eyebrow="About us"
        title="A Bahrain team helping Gulf businesses run better"
        description={`Zylo Solution is an ERP and software company based in Manama, Bahrain. For more than ${settings.stats.years} years we have helped companies across the GCC replace spreadsheets and disconnected tools with systems that just work.`}
      />
      <TrustStrip years={settings.stats.years} projects={settings.stats.projects} />
      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="text-3xl font-bold">What we believe</h2>
            <p className="mt-5 leading-relaxed text-ink/80">
              Good software should be easy to use, fit the way your team works, and keep working when the internet doesn&apos;t. We
              keep things simple: clear scope, honest advice, and a local team you can call.
            </p>
            <p className="mt-4 leading-relaxed text-ink/80">
              We specialise in Odoo ERP implementation, barcode inventory systems and offline van sales apps, and we build custom
              accounting software, websites and mobile apps when a business needs something unique.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <dl className="grid gap-4 sm:grid-cols-2">
              {[
                { k: "Headquarters", v: "Manama, Kingdom of Bahrain" },
                { k: "Markets", v: "Bahrain, UAE, Saudi Arabia, Kuwait, Qatar, Oman" },
                { k: "Specialities", v: "Odoo ERP, barcoding, van sales, custom software" },
                { k: "Languages", v: "English and Arabic reporting" },
              ].map((x) => (
                <div key={x.k} className="card p-5">
                  <dt className="text-xs uppercase tracking-wider text-muted">{x.k}</dt>
                  <dd className="mt-2 font-semibold">{x.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>
      <Process />
      <WhyZylo />
      <FinalCta whatsapp={settings.whatsapp} />
    </>
  );
}
