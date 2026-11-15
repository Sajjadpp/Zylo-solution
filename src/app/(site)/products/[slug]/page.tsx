import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { OfferingDetail } from "@/components/detail/OfferingDetail";
import { getProduct, getProducts, getServices, getSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  if (!p) return { title: "Product not found", robots: { index: false } };
  return buildMetadata({
    title: p.seoTitle || p.title,
    description: p.seoDescription || p.shortDescription,
    path: `/products/${p.slug}`,
    image: p.coverImage,
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, services, settings] = await Promise.all([getProduct(slug), getServices(), getSettings()]);
  if (!product) notFound();
  const related = services.filter((s) => s.slug !== slug && ["odoo-erp-implementation", "application-development", "software-development"].includes(s.slug));
  return <OfferingDetail doc={product} kind="products" related={related} whatsapp={settings.whatsapp} />;
}
