import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { SITE, whatsappLink } from "@/lib/site";

export function WhatsAppButton({ number = SITE.whatsapp }: { number?: string }) {
  return (
    <a
      href={whatsappLink(number)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Zylo Solution on WhatsApp"
      className="group fixed bottom-5 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.7)] transition hover:-translate-y-0.5 hover:brightness-110 sm:bottom-6 sm:right-6"
    >
      <span className="absolute inset-0 animate-pulseRing rounded-full bg-whatsapp motion-reduce:hidden" aria-hidden />
      <WhatsAppIcon className="relative h-7 w-7" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink opacity-0 transition group-hover:opacity-100 sm:block">
        Chat on WhatsApp
      </span>
    </a>
  );
}
