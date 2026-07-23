import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "it", "es", "de", "fr", "pt", "ru", "ar", "zh", "hu"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});
