import type { ProductDoc, ProjectDoc } from "@/types";

/** Finds the case study that used this product (matched by name in the project's tech list). */
export function findCaseStudy(product: ProductDoc, projects: ProjectDoc[]) {
  const key = product.title.toLowerCase().replace(/s$/, "");
  return projects.find((p) => p.tech.some((t) => t.toLowerCase().includes(key))) ?? null;
}
