import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetail } from "@/components/products/ProductDetail";
import { getProduct, getProducts, getProjects, getSettings } from "@/lib/content";
import { findCaseStudy } from "@/lib/products";
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
  const [product, products, projects, settings] = await Promise.all([getProduct(slug), getProducts(), getProjects(), getSettings()]);
  if (!product) notFound();
  return (
    <ProductDetail
      product={product}
      others={products.filter((p) => p.slug !== slug)}
      caseStudy={findCaseStudy(product, projects)}
      whatsapp={settings.whatsapp}
    />
  );
}
