import type { BookingStatus } from "@/lib/site";

export interface FAQ {
  q: string;
  a: string;
}

interface Base {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface SeoFields {
  seoTitle?: string;
  seoDescription?: string;
}

export interface ServiceDoc extends Base, SeoFields {
  title: string;
  slug: string;
  shortDescription: string;
  summary: string; // answer-first paragraph for GEO
  longDescription: string; // markdown
  icon: string;
  features: string[];
  benefits: string[];
  audience: string[]; // "Who is this for?"
  faqs: FAQ[];
  coverImage?: string;
  sortOrder: number;
  published: boolean;
}

export interface ProductDoc extends ServiceDoc {
  tagline: string;
  chips: string[];
}

export interface ProjectDoc extends Base, SeoFields {
  title: string;
  slug: string;
  client: string;
  industry: string;
  country: string;
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  tech: string[];
  coverImage?: string;
  gallery: string[];
  year: number;
  featured: boolean;
  sample: boolean;
  sortOrder: number;
  published: boolean;
}

export interface PostDoc extends Base, SeoFields {
  title: string;
  slug: string;
  excerpt: string;
  content: string; // markdown
  coverImage?: string;
  tags: string[];
  author: string;
  faqs: FAQ[];
  publishedAt: string;
  published: boolean;
}

export interface BookingNote {
  _id?: string;
  text: string;
  createdAt: string;
}

export interface BookingDoc extends Base {
  name: string;
  company?: string;
  email: string;
  phone: string;
  service?: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
  source: string;
  status: BookingStatus;
  seen: boolean;
  notes: BookingNote[];
  ip?: string;
  userAgent?: string;
}

export interface SettingsDoc extends Base {
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  hours: string;
  social: { linkedin?: string; instagram?: string; facebook?: string; x?: string; youtube?: string };
  stats: { years: number; projects: number };
}
