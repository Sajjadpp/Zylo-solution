import { z } from "zod";
import { BOOKING_STATUSES } from "@/lib/site";

const phoneRe = /^[+()\d\s-]{7,20}$/;

export const bookingSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(80),
  company: z.string().trim().max(120).optional().default(""),
  email: z.string().trim().email("Please enter a valid email address").max(160),
  phone: z.string().trim().regex(phoneRe, "Please enter a valid phone or WhatsApp number"),
  service: z.string().trim().max(120).optional().default(""),
  preferredDate: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), "Please choose a valid date"),
  preferredTime: z.string().trim().max(60).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
  source: z.string().trim().max(40).optional().default("book-demo"),
  // anti-spam
  website: z.string().optional().default(""), // honeypot – must stay empty
  startedAt: z.coerce.number().optional(),
});
export type BookingInput = z.input<typeof bookingSchema>;

export const bookingUpdateSchema = z.object({
  status: z.enum(BOOKING_STATUSES).optional(),
  seen: z.boolean().optional(),
  note: z.string().trim().min(1).max(2000).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

const faq = z.object({ q: z.string().trim().min(1), a: z.string().trim().min(1) });
const str = (max = 500) => z.string().trim().max(max).optional().default("");
const list = z.array(z.string().trim().min(1)).optional().default([]);
const slug = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug may only contain lowercase letters, numbers and dashes");
const seo = { seoTitle: str(120), seoDescription: str(320) };

export const serviceSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug,
  shortDescription: str(300),
  summary: str(1200),
  longDescription: str(30000),
  icon: str(40),
  features: list,
  benefits: list,
  audience: list,
  faqs: z.array(faq).optional().default([]),
  coverImage: str(600),
  sortOrder: z.coerce.number().optional().default(0),
  published: z.boolean().optional().default(true),
  ...seo,
});

export const productSchema = serviceSchema.extend({ tagline: str(200), chips: list });

export const projectSchema = z.object({
  title: z.string().trim().min(2).max(160),
  slug,
  client: str(160),
  industry: str(120),
  country: str(80),
  description: str(2000),
  challenge: str(4000),
  solution: str(4000),
  results: list,
  tech: list,
  coverImage: str(600),
  gallery: list,
  year: z.coerce.number().int().min(1990).max(2100),
  featured: z.boolean().optional().default(false),
  sample: z.boolean().optional().default(false),
  sortOrder: z.coerce.number().optional().default(0),
  published: z.boolean().optional().default(true),
  ...seo,
});

export const postSchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug,
  excerpt: str(500),
  content: str(100000),
  coverImage: str(600),
  tags: list,
  author: str(120),
  faqs: z.array(faq).optional().default([]),
  publishedAt: z.coerce.date(),
  published: z.boolean().optional().default(true),
  ...seo,
});

export const settingsSchema = z.object({
  phone: str(40),
  email: z.string().trim().email(),
  whatsapp: z.string().trim().regex(/^\d{8,15}$/, "Digits only, with country code, e.g. 97334351010"),
  address: str(300),
  hours: str(200),
  social: z.object({
    linkedin: str(300),
    instagram: str(300),
    facebook: str(300),
    x: str(300),
    youtube: str(300),
  }),
  stats: z.object({ years: z.coerce.number().int().min(0), projects: z.coerce.number().int().min(0) }),
});

export const pushSubscriptionSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({ p256dh: z.string().min(1), auth: z.string().min(1) }),
});

export function zodMessage(err: z.ZodError) {
  return err.issues.map((i) => `${i.path.join(".") || "field"}: ${i.message}`).join("; ");
}
