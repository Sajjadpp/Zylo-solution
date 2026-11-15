import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { BookingForm } from "@/components/booking/BookingForm";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { getServices, getSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { whatsappLink } from "@/lib/site";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "Contact Zylo Solution | Manama, Bahrain",
  description:
    "Contact Zylo Solution in Manama, Bahrain. Call or WhatsApp +973 3435 1010 or email Info@zylosolution.com for Odoo ERP, barcoding, van sales and software projects.",
  path: "/contact",
});

export default async function ContactPage() {
  const [services, s] = await Promise.all([getServices(), getSettings()]);
  const tel = s.phone.replace(/[^\d+]/g, "");
  const cards = [
    { icon: Phone, label: "Call us", value: s.phone, href: `tel:${tel}` },
    { icon: WhatsAppIcon, label: "WhatsApp", value: "Chat with our team", href: whatsappLink(s.whatsapp), external: true },
    { icon: Mail, label: "Email", value: s.email, href: `mailto:${s.email}` },
    { icon: MapPin, label: "Office", value: s.address },
    { icon: Clock, label: "Hours", value: s.hours },
  ];
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Contact", href: "/contact" }]}
        eyebrow="Contact"
        title="Let's talk about your business"
        description="Call, WhatsApp or send us a message. Our team in Manama replies within one business day."
      />
      <section className="pb-24">
        <div className="container grid gap-8 lg:grid-cols-[380px_1fr]">
          <ul className="space-y-3">
            {cards.map((c) => {
              const inner = (
                <>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-hl">
                    <c.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-muted">{c.label}</span>
                    <span className="mt-0.5 block font-semibold">{c.value}</span>
                  </span>
                </>
              );
              return (
                <li key={c.label}>
                  {c.href ? (
                    <a
                      href={c.href}
                      {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="flex items-center gap-4 rounded-2xl border border-line bg-card/50 p-4 transition hover:-translate-y-0.5 hover:border-primary/40"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 rounded-2xl border border-line bg-card/50 p-4">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="card p-6 sm:p-8">
            <h2 className="text-2xl font-bold">Send us a message</h2>
            <p className="mt-2 text-sm text-muted">Tell us what you need. We&apos;ll suggest the simplest way forward.</p>
            <div className="mt-8">
              <BookingForm services={services.map((x) => x.title)} source="contact" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
