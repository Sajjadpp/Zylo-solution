import type { MetadataRoute } from "next";
import { getPosts, getProducts, getProjects, getServices } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, products, projects, posts] = await Promise.all([getServices(), getProducts(), getProjects(), getPosts()]);
  const now = new Date();
  const d = (v?: string) => (v ? new Date(v) : now);

  const statics: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/services"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/products"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/work"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/about"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: absoluteUrl("/book-demo"), lastModified: now, changeFrequency: "yearly", priority: 0.8 },
  ];

  return [
    ...statics,
    ...services.map((s) => ({ url: absoluteUrl(`/services/${s.slug}`), lastModified: d(s.updatedAt), changeFrequency: "monthly" as const, priority: 0.85 })),
    ...products.map((p) => ({ url: absoluteUrl(`/products/${p.slug}`), lastModified: d(p.updatedAt), changeFrequency: "monthly" as const, priority: 0.85 })),
    ...projects.map((p) => ({ url: absoluteUrl(`/work/${p.slug}`), lastModified: d(p.updatedAt), changeFrequency: "yearly" as const, priority: 0.5 })),
    ...posts.map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), lastModified: d(p.updatedAt || p.publishedAt), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
