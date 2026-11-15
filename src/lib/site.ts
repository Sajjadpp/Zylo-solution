/** Single source of truth for NAP (name, address, phone) and site-wide constants. */
export const SITE = {
  name: "Zylo Solution",
  legalName: "Zylo Solution W.L.L.",
  tagline: "ERP & Software Solutions for GCC Businesses",
  description:
    "Zylo Solution is an ERP and software company in Manama, Bahrain. We deliver Odoo ERP implementation, barcode inventory systems, offline van sales apps, custom accounting software, websites and mobile apps for businesses across the GCC.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  phone: "+973 3435 1010",
  phoneHref: "tel:+97334351010",
  email: "Info@zylosolution.com",
  whatsapp: "97334351010",
  whatsappMessage: "Hello Zylo Solution, I'd like to know more about your services.",
  address: {
    street: "Manama",
    locality: "Manama",
    region: "Capital Governorate",
    country: "Bahrain",
    countryCode: "BH",
  },
  geo: { latitude: 26.2235, longitude: 50.5876 },
  areaServed: ["Bahrain", "United Arab Emirates", "Saudi Arabia", "Kuwait", "Qatar", "Oman"],
  hours: "Sunday to Thursday, 9:00 AM to 6:00 PM (AST)",
  stats: { years: 10, projects: 200 },
  social: {
    linkedin: "https://www.linkedin.com/company/zylo-solution",
    instagram: "https://www.instagram.com/zylosolution",
    facebook: "https://www.facebook.com/zylosolution",
    x: "",
  },
} as const;

export const GCC = [
  { code: "BH", name: "Bahrain" },
  { code: "AE", name: "UAE" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "KW", name: "Kuwait" },
  { code: "QA", name: "Qatar" },
  { code: "OM", name: "Oman" },
];

export const TIME_SLOTS = [
  "Morning (9:00 AM – 12:00 PM)",
  "Afternoon (12:00 PM – 3:00 PM)",
  "Late afternoon (3:00 PM – 6:00 PM)",
] as const;

export const BOOKING_STATUSES = ["new", "contacted", "scheduled", "completed", "cancelled"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export function whatsappLink(number: string = SITE.whatsapp, message: string = SITE.whatsappMessage) {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}
