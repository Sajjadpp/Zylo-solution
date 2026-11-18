import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Wordmark } from "@/components/brand/Wordmark";
import { FacebookIcon, InstagramIcon, LinkedInIcon, WhatsAppIcon, XIcon, YoutubeIcon } from "@/components/ui/SocialIcons";
import { GCC, SITE, whatsappLink } from "@/lib/site";
import type { ServiceDoc, SettingsDoc } from "@/types";

const QUICK = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Our Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Book a Demo", href: "/book-demo" },
];

export function Footer({ services, settings }: { services: ServiceDoc[]; settings: SettingsDoc }) {
  const socials = [
    { href: settings.social.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: settings.social.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: settings.social.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: settings.social.x, label: "X", Icon: XIcon },
    { href: settings.social.youtube, label: "YouTube", Icon: YoutubeIcon },
  ].filter((s) => s.href);
  const tel = settings.phone.replace(/[^\d+]/g, "");

  return (
    <footer className="theme-dark relative bg-bg" data-spy="contact">
      <div className="container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.3fr]">
        <div>
          <Link href="/" aria-label="Zylo Solution home" className="inline-block text-[38px]">
            <Wordmark />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
            ERP and software company in Manama, Bahrain. Odoo, barcoding, van sales and custom software for businesses across the GCC.
          </p>
          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Countries we serve">
            {GCC.map((c) => (
              <li key={c.code} className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted">
                {c.name}
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Quick links">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink/90">Quick links</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-muted md:grid-cols-1">
            {QUICK.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Services">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink/90">Services</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="transition hover:text-ink">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink/90">Contact</h2>
          <address className="mt-4 space-y-3 text-sm not-italic text-muted">
            <a href={`tel:${tel}`} className="flex items-center gap-3 transition hover:text-ink">
              <Phone className="h-4 w-4 text-hl" aria-hidden /> {settings.phone}
            </a>
            <a href={`mailto:${settings.email}`} className="flex items-center gap-3 transition hover:text-ink">
              <Mail className="h-4 w-4 text-hl" aria-hidden /> {settings.email}
            </a>
            <a href={whatsappLink(settings.whatsapp)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 transition hover:text-ink">
              <WhatsAppIcon className="h-4 w-4 text-whatsapp" /> WhatsApp us
            </a>
            <p className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-hl" aria-hidden /> {settings.address}
            </p>
          </address>
          {socials.length > 0 && (
            <ul className="mt-6 flex gap-2">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Zylo Solution on ${label}`}
                    className="grid h-11 w-11 place-items-center rounded-full border border-line text-muted transition hover:-translate-y-0.5 hover:border-ink/20 hover:text-ink"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container flex flex-col gap-2 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p>Manama, Kingdom of Bahrain · Serving Bahrain, UAE, Saudi Arabia, Kuwait, Qatar and Oman</p>
        </div>
      </div>
    </footer>
  );
}
