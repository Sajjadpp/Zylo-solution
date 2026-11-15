import { PageHeader } from "@/components/layout/PageHeader";
import { PostCard } from "@/components/cards/PostCard";
import { Reveal } from "@/components/ui/Reveal";
import { FinalCta } from "@/components/home/Sections";
import { getPosts, getSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "Blog: ERP, Odoo & Inventory Guides for GCC Businesses",
  description:
    "Practical guides on Odoo ERP costs, barcode inventory, offline van sales and Arabic ERP reporting for companies in Bahrain and the GCC.",
  path: "/blog",
});

export default async function BlogPage() {
  const [posts, settings] = await Promise.all([getPosts(), getSettings()]);
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Blog", href: "/blog" }]}
        eyebrow="Blog"
        title="Guides for smarter operations"
        description="Plain-language advice on ERP, inventory and field sales for businesses in Bahrain and across the Gulf."
      />
      <section className="pb-20">
        <div className="container grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.06} className="h-full">
              <PostCard post={p} priority={i < 3} />
            </Reveal>
          ))}
        </div>
      </section>
      <FinalCta whatsapp={settings.whatsapp} />
    </>
  );
}
