import { FeaturedProducts, FinalCta } from "@/components/home/Sections";
import { PageHeader } from "@/components/layout/PageHeader";
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
        eyebrow="Products"
        title="Products built for Gulf operations"
        description="Two proven Zylo products that plug straight into Odoo ERP: barcode inventory for warehouses and retail, and an offline-ready van sales app for field teams."
      />
      <div className="-mt-16">
        <FeaturedProducts products={products} />
      </div>
      <FinalCta whatsapp={settings.whatsapp} />
    </>
  );
}
