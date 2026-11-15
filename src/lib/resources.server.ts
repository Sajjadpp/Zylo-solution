import "server-only";
import type { Model } from "mongoose";
import type { ZodTypeAny } from "zod";
import { Post, Product, Project, Service } from "@/models";
import { postSchema, productSchema, projectSchema, serviceSchema } from "@/lib/validators";

export interface ResourceDef {
  model: Model<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  schema: ZodTypeAny;
  publicBase: string; // public URL prefix, used for revalidation
  sort: Record<string, 1 | -1>;
  searchFields: string[];
  reorderable: boolean;
}

export const RESOURCES: Record<string, ResourceDef> = {
  services: {
    model: Service,
    schema: serviceSchema,
    publicBase: "/services",
    sort: { sortOrder: 1 },
    searchFields: ["title", "slug"],
    reorderable: true,
  },
  products: {
    model: Product,
    schema: productSchema,
    publicBase: "/products",
    sort: { sortOrder: 1 },
    searchFields: ["title", "slug"],
    reorderable: true,
  },
  work: {
    model: Project,
    schema: projectSchema,
    publicBase: "/work",
    sort: { sortOrder: 1, year: -1 },
    searchFields: ["title", "client", "industry", "country"],
    reorderable: true,
  },
  blog: {
    model: Post,
    schema: postSchema,
    publicBase: "/blog",
    sort: { publishedAt: -1 },
    searchFields: ["title", "slug", "tags"],
    reorderable: false,
  },
};

export function getResource(key: string) {
  return Object.prototype.hasOwnProperty.call(RESOURCES, key) ? RESOURCES[key] : null;
}
