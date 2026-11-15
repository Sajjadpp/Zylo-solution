import { CalendarCheck, CheckCircle2, MessageSquare, MonitorSmartphone } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { BookingForm } from "@/components/booking/BookingForm";
import { getServices } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "Book a Free Demo",
  description:
    "Book a free 30-minute demo of Odoo ERP, our barcode inventory system or the Van Sale Module with Zylo Solution, Bahrain. Choose your date and time.",
  path: "/book-demo",
});

const STEPS = [
  { icon: CalendarCheck, title: "Pick a time", text: "Choose a date and time slot that suits you." },
  { icon: MessageSquare, title: "We confirm", text: "Our team contacts you within one business day." },
  { icon: MonitorSmartphone, title: "See it live", text: "A 30-minute demo tailored to your business." },
];

export default async function BookDemoPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const [services, sp] = await Promise.all([getServices(), searchParams]);
  const titles = services.map((s) => s.title);
  const preset = sp.service && titles.includes(sp.service) ? sp.service : "";
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Book a Demo", href: "/book-demo" }]}
        eyebrow="Free demo"
        title="Book your free demo"
        description="See how Zylo Solution can simplify your operations. No cost, no obligation."
      />
      <section className="pb-24">
        <div className="container grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="card p-6 sm:p-8">
            <BookingForm services={titles} defaultService={preset} source="book-demo" />
          </div>
          <aside className="space-y-4">
            <ol className="space-y-3">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-4 rounded-2xl border border-line bg-card/50 p-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-hl">
                    <s.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="text-xs text-muted">Step {i + 1}</span>
                    <span className="block font-semibold">{s.title}</span>
                    <span className="mt-1 block text-sm text-muted">{s.text}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="rounded-2xl border border-line p-5 text-sm text-muted">
              {["Odoo ERP walkthrough", "Barcode scanning on real devices", "Van sales in offline mode"].map((t) => (
                <p key={t} className="flex items-center gap-2 py-1">
                  <CheckCircle2 className="h-4 w-4 text-hl" aria-hidden /> {t}
                </p>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
