import type { ProductDoc } from "@/types";
import { servicesSeed } from "./services";

const base = (slug: string) => {
  const s = servicesSeed.find((x) => x.slug === slug)!;
  return { ...s };
};

export const productsSeed: ProductDoc[] = [
  {
    ...base("barcoding-systems"),
    sortOrder: 1,
    tagline: "Scan it. Track it. Trust your stock.",
    chips: ["Real-time Tracking", "Mobile Scanning", "Arabic Reporting"],
    coverImage: "/images/products/barcoding-systems.jpg",
    seoTitle: "Barcoding System for Inventory | Zylo Solution Bahrain",
  },
  {
    ...base("van-sale-module"),
    sortOrder: 2,
    tagline: "Your whole sales office, inside one phone.",
    chips: ["Offline Mode", "Inventory Sync", "Route Optimization"],
    coverImage: "/images/products/van-sale-module.jpg",
    seoTitle: "Van Sale Module | Offline Van Sales App for GCC",
  },
];
