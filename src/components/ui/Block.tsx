import { Reveal } from "@/components/ui/Reveal";

/** Minimal section: a small label on the left (desktop) and the content on the right, separated by a thin line. */
export function Block({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="border-t border-line">
      <Reveal className="container grid gap-8 py-14 sm:py-16 lg:grid-cols-[240px_1fr] lg:gap-16">
        <h2 className="text-lg font-semibold text-muted">{title}</h2>
        <div className="min-w-0">{children}</div>
      </Reveal>
    </section>
  );
}
