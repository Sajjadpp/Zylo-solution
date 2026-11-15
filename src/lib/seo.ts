import type { Metadata } from "next";
import { SITE, absoluteUrl } from "@/lib/site";
import type { FAQ, PostDoc, ServiceDoc } from "@/types";
import { stripMarkdown } from "@/lib/utils";

interface MetaInput {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
  noindex?: boolean;
}

/** Unique title / description / canonical / OG / Twitter tags for every page. */
export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  keywords,
  noindex,
}: MetaInput): Metadata {
  const url = absoluteUrl(path);
  const img = absoluteUrl(image && !image.endsWith(".svg") ? image : "/og.png");
  // Brand the title exactly once (some SEO titles already contain "Zylo Solution").
  const full = title.toLowerCase().includes(SITE.name.toLowerCase()) ? title : `${title} | ${SITE.name}`;
  title = full;
  return {
    title: { absolute: full },
    description,
    keywords,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: SITE.name,
      locale: "en_BH",
      images: [{ url: img, alt: title }],
      ...(type === "article" ? { publishedTime, modifiedTime } : {}),
    },
    twitter: { card: "summary_large_image", title, description, images: [img] },
  };
}

// ─── JSON-LD builders ─────────────────────────────────────────────

const ORG_ID = `${SITE.url}/#organization`;
const BUSINESS_ID = `${SITE.url}/#localbusiness`;

export function organizationLd(social: string[] = []) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE.name,
    url: SITE.url,
    logo: absoluteUrl("/logo.png"),
    email: SITE.email,
    telephone: SITE.phone,
    description: SITE.description,
    address: postalAddress(),
    areaServed: SITE.areaServed.map((name) => ({ "@type": "Country", name })),
    sameAs: social.filter(Boolean),
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: SITE.phone,
        email: SITE.email,
        contactType: "sales",
        areaServed: ["BH", "AE", "SA", "KW", "QA", "OM"],
        availableLanguage: ["English", "Arabic"],
      },
    ],
  };
}

function postalAddress() {
  return {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.locality,
    addressRegion: SITE.address.region,
    addressCountry: SITE.address.countryCode,
  };
}

export function localBusinessLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    "@id": BUSINESS_ID,
    name: SITE.name,
    url: SITE.url,
    image: absoluteUrl("/logo.png"),
    logo: absoluteUrl("/logo.png"),
    telephone: SITE.phone,
    email: SITE.email,
    priceRange: "$$",
    address: postalAddress(),
    geo: { "@type": "GeoCoordinates", latitude: SITE.geo.latitude, longitude: SITE.geo.longitude },
    areaServed: SITE.areaServed.map((name) => ({ "@type": "Country", name })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    parentOrganization: { "@id": ORG_ID },
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
  };
}

export function serviceLd(s: ServiceDoc, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    serviceType: s.title,
    description: s.summary || s.shortDescription,
    url: absoluteUrl(path),
    image: s.coverImage ? absoluteUrl(s.coverImage) : undefined,
    provider: { "@id": BUSINESS_ID, "@type": "ProfessionalService", name: SITE.name },
    areaServed: SITE.areaServed.map((name) => ({ "@type": "Country", name })),
    hasOfferCatalog: s.features.length
      ? {
          "@type": "OfferCatalog",
          name: `${s.title} features`,
          itemListElement: s.features.map((f) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: f } })),
        }
      : undefined,
  };
}

export function faqLd(faqs: FAQ[]) {
  if (!faqs?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function articleLd(p: PostDoc) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.excerpt,
    image: [absoluteUrl(p.coverImage || "/logo.png")],
    datePublished: new Date(p.publishedAt).toISOString(),
    dateModified: new Date(p.updatedAt || p.publishedAt).toISOString(),
    author: { "@type": "Organization", name: p.author || SITE.name, url: SITE.url },
    publisher: { "@id": ORG_ID, "@type": "Organization", name: SITE.name, logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") } },
    mainEntityOfPage: absoluteUrl(`/blog/${p.slug}`),
    keywords: p.tags.join(", "),
    wordCount: stripMarkdown(p.content).split(" ").length,
  };
}

export function breadcrumbLd(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.href),
    })),
  };
}
