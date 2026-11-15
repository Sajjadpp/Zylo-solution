/** Client-safe description of each admin resource: fields for the form, columns for the list. */

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "slug"
  | "number"
  | "toggle"
  | "date"
  | "icon"
  | "image"
  | "gallery"
  | "list"
  | "faqs";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  placeholder?: string;
  rows?: number;
  max?: number;
  group: "main" | "content" | "media" | "seo" | "publish";
}

export interface ResourceConfig {
  key: string;
  label: string;
  singular: string;
  publicBase: string;
  reorderable: boolean;
  columns: { name: string; label: string }[];
  fields: FieldDef[];
  defaults: Record<string, unknown>;
}

const seoFields: FieldDef[] = [
  { name: "seoTitle", label: "SEO title", type: "text", max: 70, group: "seo", help: "Shown in Google results. Aim for 50–60 characters." },
  { name: "seoDescription", label: "SEO description", type: "textarea", rows: 3, max: 160, group: "seo", help: "Aim for 140–160 characters." },
];

const offeringFields = (kind: "service" | "product"): FieldDef[] => [
  { name: "title", label: "Title", type: "text", required: true, group: "main" },
  { name: "slug", label: "URL slug", type: "slug", required: true, group: "main", help: "Lowercase words separated by dashes." },
  ...(kind === "product"
    ? ([
        { name: "tagline", label: "Tagline", type: "text", group: "main", placeholder: "Short catchy line" },
        { name: "chips", label: "Feature chips", type: "list", group: "main", help: "Short labels shown as chips (2–4 recommended)." },
      ] as FieldDef[])
    : []),
  { name: "icon", label: "Icon", type: "icon", group: "main" },
  { name: "shortDescription", label: "Short description", type: "textarea", rows: 2, max: 160, group: "main", help: "One line, shown on cards." },
  {
    name: "summary",
    label: "Answer-first summary",
    type: "textarea",
    rows: 4,
    group: "content",
    help: "2–3 factual sentences at the top of the page. Mention Zylo Solution, Bahrain/GCC and what it does (helps AI assistants quote you).",
  },
  { name: "longDescription", label: "Long description", type: "markdown", group: "content" },
  { name: "audience", label: "Who is this for?", type: "list", group: "content" },
  { name: "features", label: "Features", type: "list", group: "content" },
  { name: "benefits", label: "Benefits", type: "list", group: "content" },
  { name: "faqs", label: "FAQs", type: "faqs", group: "content", help: "4–6 real questions customers ask." },
  { name: "coverImage", label: "Cover image", type: "image", group: "media" },
  ...seoFields,
  { name: "published", label: "Published", type: "toggle", group: "publish" },
];

export const ADMIN_RESOURCES: Record<string, ResourceConfig> = {
  services: {
    key: "services",
    label: "Services",
    singular: "service",
    publicBase: "/services",
    reorderable: true,
    columns: [
      { name: "title", label: "Title" },
      { name: "slug", label: "Slug" },
    ],
    fields: offeringFields("service"),
    defaults: { icon: "Layers", published: true, features: [], benefits: [], audience: [], faqs: [] },
  },
  products: {
    key: "products",
    label: "Products",
    singular: "product",
    publicBase: "/products",
    reorderable: true,
    columns: [
      { name: "title", label: "Title" },
      { name: "slug", label: "Slug" },
    ],
    fields: offeringFields("product"),
    defaults: { icon: "Package", published: true, chips: [], features: [], benefits: [], audience: [], faqs: [] },
  },
  work: {
    key: "work",
    label: "Our Work",
    singular: "project",
    publicBase: "/work",
    reorderable: true,
    columns: [
      { name: "title", label: "Title" },
      { name: "client", label: "Client" },
      { name: "country", label: "Country" },
      { name: "year", label: "Year" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, group: "main" },
      { name: "slug", label: "URL slug", type: "slug", required: true, group: "main" },
      { name: "client", label: "Client", type: "text", group: "main" },
      { name: "industry", label: "Industry", type: "text", group: "main" },
      { name: "country", label: "Country", type: "text", group: "main" },
      { name: "year", label: "Year", type: "number", group: "main" },
      { name: "description", label: "Short description", type: "textarea", rows: 3, group: "main" },
      { name: "challenge", label: "Challenge", type: "textarea", rows: 5, group: "content" },
      { name: "solution", label: "Solution", type: "textarea", rows: 5, group: "content" },
      { name: "results", label: "Results", type: "list", group: "content" },
      { name: "tech", label: "Modules / technology used", type: "list", group: "content" },
      { name: "coverImage", label: "Cover image", type: "image", group: "media" },
      { name: "gallery", label: "Gallery", type: "gallery", group: "media" },
      ...seoFields,
      { name: "published", label: "Published", type: "toggle", group: "publish" },
      { name: "featured", label: "Featured", type: "toggle", group: "publish" },
      { name: "sample", label: "Label as sample case study", type: "toggle", group: "publish" },
    ],
    defaults: { year: new Date().getFullYear(), country: "Bahrain", published: true, featured: false, sample: false, results: [], tech: [], gallery: [] },
  },
  blog: {
    key: "blog",
    label: "Blog",
    singular: "post",
    publicBase: "/blog",
    reorderable: false,
    columns: [
      { name: "title", label: "Title" },
      { name: "publishedAt", label: "Publish date" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, group: "main" },
      { name: "slug", label: "URL slug", type: "slug", required: true, group: "main" },
      { name: "excerpt", label: "Excerpt", type: "textarea", rows: 3, group: "main", help: "Summary shown on cards and at the top of the post." },
      { name: "author", label: "Author", type: "text", group: "main" },
      { name: "tags", label: "Tags", type: "list", group: "main" },
      { name: "content", label: "Content", type: "markdown", group: "content" },
      { name: "faqs", label: "FAQs", type: "faqs", group: "content" },
      { name: "coverImage", label: "Cover image", type: "image", group: "media" },
      ...seoFields,
      { name: "publishedAt", label: "Publish date", type: "date", group: "publish", help: "Future dates are scheduled." },
      { name: "published", label: "Published", type: "toggle", group: "publish" },
    ],
    defaults: { author: "Zylo Solution Team", published: true, tags: [], faqs: [], publishedAt: new Date().toISOString() },
  },
};

export const GROUP_LABELS: Record<FieldDef["group"], string> = {
  main: "Basics",
  content: "Content",
  media: "Images",
  seo: "SEO",
  publish: "Publishing",
};
