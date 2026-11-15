import {
  Award,
  BarChart3,
  Boxes,
  Briefcase,
  Building2,
  Calculator,
  Code,
  Compass,
  Globe,
  Headphones,
  Languages,
  Layers,
  LifeBuoy,
  MapPin,
  MonitorSmartphone,
  Package,
  PenTool,
  Rocket,
  Route,
  ScanBarcode,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Truck,
  Warehouse,
  WifiOff,
  Zap,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

/** Curated icon set selectable from the admin panel (keeps the bundle small – no import-all). */
export const ICONS: Record<string, LucideIcon> = {
  Boxes,
  ScanBarcode,
  Truck,
  Code,
  Globe,
  Calculator,
  Smartphone,
  Layers,
  Package,
  Warehouse,
  Route,
  BarChart3,
  MonitorSmartphone,
  Building2,
  Briefcase,
  ShieldCheck,
  Zap,
  Headphones,
  Languages,
  WifiOff,
  Rocket,
  Compass,
  PenTool,
  LifeBuoy,
  Award,
  MapPin,
  Sparkles,
};

export const ICON_NAMES = Object.keys(ICONS);

export function Icon({ name, ...props }: { name?: string } & LucideProps) {
  const Cmp = (name && ICONS[name]) || Layers;
  return <Cmp aria-hidden {...props} />;
}
