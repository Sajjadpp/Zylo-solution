import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-4 text-center">
      <div>
        <Link href="/" aria-label="Zylo Solution home" className="inline-block text-4xl">
          <Wordmark />
        </Link>
        <p className="mt-10 font-display text-7xl font-bold text-gradient">404</p>
        <h1 className="mt-4 text-2xl font-bold">This page doesn&apos;t exist</h1>
        <p className="mt-3 text-muted">It may have moved. Try one of these instead:</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            Go home
          </Link>
          <Link href="/services" className="btn-ghost">
            Services
          </Link>
          <Link href="/contact" className="btn-ghost">
            Contact
          </Link>
        </div>
      </div>
    </main>
  );
}
