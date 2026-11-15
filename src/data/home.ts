import type { FAQ } from "@/types";

export const homeFaqs: FAQ[] = [
  {
    q: "What does Zylo Solution do?",
    a: "Zylo Solution is an ERP and software company based in Manama, Bahrain. We implement Odoo ERP, build barcode inventory systems and offline van sales apps, and develop custom accounting software, websites and mobile apps for businesses across the GCC.",
  },
  {
    q: "Which countries do you serve?",
    a: "We serve clients in Bahrain, the United Arab Emirates, Saudi Arabia, Kuwait, Qatar and Oman. Our team is based in Manama and supports GCC clients on-site and remotely.",
  },
  {
    q: "Are you an Odoo implementation partner in Bahrain?",
    a: "Yes. Zylo Solution delivers end-to-end Odoo ERP implementation in Bahrain and the GCC, including setup, customization, data migration, Arabic and English reporting, training and support.",
  },
  {
    q: "How long does it take to go live with an ERP?",
    a: "Most small and mid-sized Odoo projects go live in 6 to 12 weeks. Larger multi-branch or multi-company projects can take 3 to 6 months. We agree a written timeline after a short discovery phase.",
  },
  {
    q: "Do your systems support Arabic?",
    a: "Yes. Invoices, reports, labels and documents can be produced in Arabic, English or bilingual layouts, including VAT-compliant tax invoices for GCC countries.",
  },
  {
    q: "How do I book a demo?",
    a: "Click 'Book a Demo' on any page and choose a date and time, or message us on WhatsApp at +973 3435 1010. We reply within one business day.",
  },
];

export const processSteps = [
  { title: "Discover", text: "We learn how your business runs today and what needs to change.", icon: "Compass" },
  { title: "Design", text: "You get a clear plan: modules, features, timeline and cost.", icon: "PenTool" },
  { title: "Implement", text: "We build, migrate your data and train your team before go-live.", icon: "Rocket" },
  { title: "Support", text: "Our Manama team stays with you for fixes, questions and growth.", icon: "LifeBuoy" },
];

export const benefits = [
  { title: "Local expertise", text: "A team in Manama that understands GCC business, VAT and culture.", icon: "MapPin" },
  { title: "Arabic reporting", text: "Invoices, labels and reports in Arabic, English or both.", icon: "Languages" },
  { title: "Deep Odoo know-how", text: "Certified-level Odoo skills across sales, stock, accounting and more.", icon: "Award" },
  { title: "Fast support", text: "Same time zone, direct WhatsApp line, quick answers.", icon: "Headphones" },
  { title: "Built to scale", text: "Add users, branches and countries without starting over.", icon: "BarChart3" },
  { title: "Offline-ready mobile", text: "Field apps keep working without signal and sync later.", icon: "WifiOff" },
];
