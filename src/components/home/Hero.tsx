import { ArrowRight, CheckCircle2 } from "lucide-react";
import { DemoButton } from "@/components/booking/DemoButton";
import { DashboardMockup } from "@/components/home/DashboardMockup";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { whatsappLink } from "@/lib/site";

const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

export function Hero({ whatsapp }: { whatsapp: string }) {
  return (
    <section id="home" data-spy="home" className="relative overflow-hidden pb-16 pt-40 sm:pt-44 lg:pb-24 lg:pt-48">
      {/* background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0" />
        <div className="absolute -top-56 left-1/3 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-primary/[0.09] blur-[140px]" />
        <div className="absolute right-[-6%] top-1/4 h-[380px] w-[380px] rounded-full bg-accent/[0.16] blur-[120px]" />
      </div>

      <div className="container grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div className="text-center lg:text-left">
          <p data-hero-item style={i(1)} className="eyebrow">
            ERP &amp; software company in Manama, Bahrain
          </p>
          <h1
            data-hero-item="lcp"
            style={i(2)}
            className="mt-6 text-[2.4rem] font-bold leading-[1.05] sm:text-6xl lg:text-[4rem]"
          >
            Smart ERP &amp; Software Solutions for Growing <span className="text-primary">GCC Businesses</span>
            <span aria-hidden className="ml-1 inline-block h-[0.2em] w-[0.2em] rounded-full bg-accent align-baseline" />
          </h1>
          <p data-hero-item style={i(3)} className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg lg:mx-0">
            Odoo ERP, barcode inventory and offline van sales, set up by a local team in Bahrain and supported across the Gulf.
          </p>
          <div data-hero-item style={i(4)} className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <DemoButton className="h-12 px-7 text-[15px]">
              Book a Free Demo <ArrowRight className="h-4 w-4" aria-hidden />
            </DemoButton>
            <a href={whatsappLink(whatsapp)} target="_blank" rel="noopener noreferrer" className="btn-ghost h-12 px-7 text-[15px]">
              <WhatsAppIcon className="h-4 w-4 text-whatsapp" /> WhatsApp Us
            </a>
          </div>
          <ul data-hero-item style={i(5)} className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted lg:justify-start">
            {["Odoo specialists", "Arabic & English", "Local support"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-hl" aria-hidden /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div data-hero-item style={i(4)}>
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}
