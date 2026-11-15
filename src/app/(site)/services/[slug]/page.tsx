import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { OfferingDetail } from "@/components/detail/OfferingDetail";
import { getService, getServices, getSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getServices()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = await getService((await params).slug);
  if (!s) return { title: "Service not found", robots: { index: false } };
  return buildMetadata({
    title: s.seoTitle || `${s.title} in Bahrain`,
    description: s.seoDescription || s.shortDescription,
    path: `/services/${s.slug}`,
    image: s.coverImage,
  });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const [service, all, settings] = await Promise.all([getService(slug), getServices(), getSettings()]);
  if (!service) notFound();
  return (
    <OfferingDetail doc={service} kind="services" related={all.filter((s) => s.slug !== slug)} whatsapp={settings.whatsapp} />
  );
}
