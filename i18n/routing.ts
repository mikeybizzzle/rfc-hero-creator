import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "it", "es", "de", "fr"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});
