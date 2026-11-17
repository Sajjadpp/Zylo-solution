import { ArrowRight } from "lucide-react";
import { DemoButton } from "@/components/booking/DemoButton";
import { whatsappLink } from "@/lib/site";

/** Quiet closing call-to-action: one line, one button, one text link. */
export function MinimalCta({
  title,
  text,
  service,
  whatsapp,
}: {
  title: string;
  text?: string;
  service?: string;
  whatsapp: string;
}) {
  return (
    <section className="border-t border-line">
      <div className="container flex flex-col items-start gap-6 py-16 sm:py-20 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
          {text && <p className="mt-2 text-muted">{text}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <DemoButton service={service} className="h-12 px-6">
            Book a free demo <ArrowRight className="h-4 w-4" aria-hidden />
          </DemoButton>
          <a
            href={whatsappLink(whatsapp, service ? `Hello Zylo Solution, I'd like to know more about ${service}.` : undefined)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-ink underline-offset-4 hover:underline"
          >
            or ask on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
