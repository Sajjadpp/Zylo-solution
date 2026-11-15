import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { FinalCta } from "@/components/home/Sections";
import { getProjects, getSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "Our Work: ERP & Software Case Studies",
  description:
    "Case studies from Zylo Solution: Odoo ERP rollouts, barcode inventory systems and van sales apps for businesses in Bahrain, Saudi Arabia, the UAE and the GCC.",
  path: "/work",
});

export default async function WorkPage() {
  const [projects, settings] = await Promise.all([getProjects(), getSettings()]);
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Our Work", href: "/work" }]}
        eyebrow="Our work"
        title="Projects that changed how teams work"
        description="ERP, barcoding and field sales projects for companies across the GCC, with the problem, the solution and the results."
      />
      <section className="pb-20">
        <div className="container">
          {projects.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 3) * 0.06} className="h-full">
                  <ProjectCard project={p} priority={i < 3} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-muted">New case studies are coming soon.</p>
          )}
        </div>
      </section>
      <FinalCta whatsapp={settings.whatsapp} title="Your project could be next" />
    </>
  );
}
