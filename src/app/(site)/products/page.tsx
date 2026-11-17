import { PageHeader } from "@/components/layout/PageHeader";
import { ProductGuide, ProductRow } from "@/components/products/ProductRow";
import { MinimalCta } from "@/components/ui/MinimalCta";
import { getProducts, getSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "Products: Barcoding System & Van Sale Module",
  description:
    "Zylo Solution products for GCC businesses: a barcode inventory system for retail and warehouses, and an offline van sales app with real-time inventory sync.",
  path: "/products",
});

export default async function ProductsPage() {
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Products", href: "/products" }]}
        title="Products"
        description="Ready-made tools that plug straight into Odoo ERP, built by Zylo in Bahrain."
      />
      <div className="container">
        <div className="grid gap-x-8 gap-y-12 border-t border-line pb-14 pt-12 sm:grid-cols-2 sm:pb-16 lg:grid-cols-3">
          {products.map((p, i) => (
            <ProductRow key={p.slug} product={p} index={i} />
          ))}
        </div>
        <ProductGuide products={products} />
      </div>
      <MinimalCta title="Not sure which one fits?" text="Tell us how your team works. We’ll show you the right tool in a free demo." whatsapp={settings.whatsapp} />
    </>
  );
}
