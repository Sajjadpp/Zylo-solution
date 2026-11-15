import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { DemoModalProvider } from "@/components/booking/DemoModal";
import { IntroOverlay } from "@/components/intro/IntroOverlay";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { JsonLd } from "@/components/seo/JsonLd";
import { getServices, getSettings } from "@/lib/content";
import { localBusinessLd, organizationLd, websiteLd } from "@/lib/seo";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [services, settings] = await Promise.all([getServices(), getSettings()]);
  const social = Object.values(settings.social).filter(Boolean) as string[];

  return (
    <>
      <JsonLd data={[organizationLd(social), localBusinessLd(), websiteLd()]} />
      <DemoModalProvider services={services.map((s) => s.title)}>
        <SmoothScroll />
        <IntroOverlay />
        <Header />
        <main id="main" className="relative overflow-x-clip">
          {children}
        </main>
        <Footer services={services} settings={settings} />
        <WhatsAppButton number={settings.whatsapp} />
      </DemoModalProvider>
    </>
  );
}
