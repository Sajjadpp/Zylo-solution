import type { SettingsDoc } from "@/types";
import { SITE } from "@/lib/site";

export const settingsSeed: SettingsDoc = {
  phone: SITE.phone,
  email: SITE.email,
  whatsapp: SITE.whatsapp,
  address: "Manama, Kingdom of Bahrain",
  hours: SITE.hours,
  social: { ...SITE.social },
  stats: { ...SITE.stats },
};
