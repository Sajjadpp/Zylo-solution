import mongoose, { Schema, type Model } from "mongoose";
import { BOOKING_STATUSES } from "@/lib/site";

const faq = new Schema({ q: { type: String, required: true }, a: { type: String, required: true } }, { _id: false });

const seo = {
  seoTitle: { type: String, default: "", maxlength: 120 },
  seoDescription: { type: String, default: "", maxlength: 320 },
};

const serviceFields = {
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  shortDescription: { type: String, default: "" },
  summary: { type: String, default: "" },
  longDescription: { type: String, default: "" },
  icon: { type: String, default: "Layers" },
  features: { type: [String], default: [] },
  benefits: { type: [String], default: [] },
  audience: { type: [String], default: [] },
  faqs: { type: [faq], default: [] },
  coverImage: { type: String, default: "" },
  sortOrder: { type: Number, default: 0, index: true },
  published: { type: Boolean, default: true },
  ...seo,
};

const ServiceSchema = new Schema(serviceFields, { timestamps: true });
const ProductSchema = new Schema(
  { ...serviceFields, tagline: { type: String, default: "" }, chips: { type: [String], default: [] } },
  { timestamps: true },
);

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    client: { type: String, default: "" },
    industry: { type: String, default: "" },
    country: { type: String, default: "Bahrain" },
    description: { type: String, default: "" },
    challenge: { type: String, default: "" },
    solution: { type: String, default: "" },
    results: { type: [String], default: [] },
    tech: { type: [String], default: [] },
    coverImage: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    year: { type: Number, default: () => new Date().getFullYear() },
    featured: { type: Boolean, default: false },
    sample: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    ...seo,
  },
  { timestamps: true },
);

const PostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    tags: { type: [String], default: [] },
    author: { type: String, default: "Zylo Solution Team" },
    faqs: { type: [faq], default: [] },
    publishedAt: { type: Date, default: Date.now, index: true },
    published: { type: Boolean, default: true },
    ...seo,
  },
  { timestamps: true },
);

const NoteSchema = new Schema({ text: { type: String, required: true }, createdAt: { type: Date, default: Date.now } });

const BookingSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, default: "" },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    service: { type: String, default: "" },
    preferredDate: { type: String, default: "" },
    preferredTime: { type: String, default: "" },
    message: { type: String, default: "" },
    source: { type: String, default: "book-demo" },
    status: { type: String, enum: BOOKING_STATUSES, default: "new", index: true },
    seen: { type: Boolean, default: false, index: true },
    notes: { type: [NoteSchema], default: [] },
    ip: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: true },
);
BookingSchema.index({ createdAt: -1 });

const SettingsSchema = new Schema(
  {
    phone: String,
    email: String,
    whatsapp: String,
    address: String,
    hours: String,
    social: { linkedin: String, instagram: String, facebook: String, x: String, youtube: String },
    stats: { years: { type: Number, default: 10 }, projects: { type: Number, default: 200 } },
  },
  { timestamps: true },
);

const PushSubscriptionSchema = new Schema(
  {
    endpoint: { type: String, required: true, unique: true },
    keys: { p256dh: String, auth: String },
    userAgent: String,
  },
  { timestamps: true },
);

// Schemas are intentionally untyped: documents are serialized to the plain DTOs in @/types before use.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyModel = Model<any>;
function model(name: string, schema: Schema): AnyModel {
  return (mongoose.models[name] as AnyModel) || mongoose.model(name, schema);
}

export const Service = model("Service", ServiceSchema);
export const Product = model("Product", ProductSchema);
export const Project = model("Project", ProjectSchema);
export const Post = model("Post", PostSchema);
export const Booking = model("Booking", BookingSchema);
export const Settings = model("Settings", SettingsSchema);
export const PushSubscription = model("PushSubscription", PushSubscriptionSchema);
