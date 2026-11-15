import "server-only";
import { connectDB, isDbConfigured } from "@/lib/db";
import { Post, Product, Project, Service, Settings } from "@/models";
import { servicesSeed } from "@/data/services";
import { productsSeed } from "@/data/products";
import { projectsSeed } from "@/data/projects";
import { postsSeed } from "@/data/posts";
import { settingsSeed } from "@/data/settings";
import { serialize } from "@/lib/utils";
import type { PostDoc, ProductDoc, ProjectDoc, ServiceDoc, SettingsDoc } from "@/types";

/**
 * Public content access. Reads from MongoDB; if the database is not configured or unreachable,
 * falls back to the bundled seed content so the public site never goes down.
 */
let warned = false;
async function withFallback<T>(query: () => Promise<T>, fallback: () => T): Promise<T> {
  if (!isDbConfigured()) return fallback();
  try {
    await connectDB();
    return await query();
  } catch (err) {
    if (!warned) {
      warned = true;
      console.warn("[content] MongoDB unavailable, serving bundled seed content:", (err as Error).message);
    }
    return fallback();
  }
}

const bySort = <T extends { sortOrder: number }>(a: T, b: T) => a.sortOrder - b.sortOrder;

export function getServices(): Promise<ServiceDoc[]> {
  return withFallback(
    async () => serialize<ServiceDoc[]>(await Service.find({ published: true }).sort({ sortOrder: 1 }).lean()),
    () => [...servicesSeed].sort(bySort),
  );
}

export function getService(slug: string): Promise<ServiceDoc | null> {
  return withFallback(
    async () => serialize<ServiceDoc | null>(await Service.findOne({ slug, published: true }).lean()),
    () => servicesSeed.find((s) => s.slug === slug) ?? null,
  );
}

export function getProducts(): Promise<ProductDoc[]> {
  return withFallback(
    async () => serialize<ProductDoc[]>(await Product.find({ published: true }).sort({ sortOrder: 1 }).lean()),
    () => [...productsSeed].sort(bySort),
  );
}

export function getProduct(slug: string): Promise<ProductDoc | null> {
  return withFallback(
    async () => serialize<ProductDoc | null>(await Product.findOne({ slug, published: true }).lean()),
    () => productsSeed.find((s) => s.slug === slug) ?? null,
  );
}

export function getProjects(limit?: number): Promise<ProjectDoc[]> {
  return withFallback(
    async () => {
      const q = Project.find({ published: true }).sort({ featured: -1, year: -1, sortOrder: 1, createdAt: -1 });
      if (limit) q.limit(limit);
      return serialize<ProjectDoc[]>(await q.lean());
    },
    () => projectsSeed.slice(0, limit ?? projectsSeed.length),
  );
}

export function getProject(slug: string): Promise<ProjectDoc | null> {
  return withFallback(
    async () => serialize<ProjectDoc | null>(await Project.findOne({ slug, published: true }).lean()),
    () => projectsSeed.find((p) => p.slug === slug) ?? null,
  );
}

export function getPosts(limit?: number): Promise<PostDoc[]> {
  return withFallback(
    async () => {
      const q = Post.find({ published: true, publishedAt: { $lte: new Date() } }).sort({ publishedAt: -1 });
      if (limit) q.limit(limit);
      return serialize<PostDoc[]>(await q.lean());
    },
    () =>
      [...postsSeed]
        .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
        .slice(0, limit ?? postsSeed.length),
  );
}

export function getPost(slug: string): Promise<PostDoc | null> {
  return withFallback(
    async () =>
      serialize<PostDoc | null>(
        await Post.findOne({ slug, published: true, publishedAt: { $lte: new Date() } }).lean(),
      ),
    () => postsSeed.find((p) => p.slug === slug) ?? null,
  );
}

export function getSettings(): Promise<SettingsDoc> {
  return withFallback(
    async () => {
      const s = serialize<SettingsDoc | null>(await Settings.findOne().lean());
      return {
        ...settingsSeed,
        ...(s ?? {}),
        social: { ...settingsSeed.social, ...(s?.social ?? {}) },
        stats: { ...settingsSeed.stats, ...(s?.stats ?? {}) },
      };
    },
    () => settingsSeed,
  );
}
