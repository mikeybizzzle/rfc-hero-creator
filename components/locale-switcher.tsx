"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LABELS: Record<(typeof routing.locales)[number], string> = {
  en: "EN",
  it: "IT",
  es: "ES",
  de: "DE",
  fr: "FR",
  pt: "PT",
  ru: "RU",
  ar: "AR",
  zh: "ZH",
  hu: "HU",
};

export function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={locale}
      disabled={pending}
      aria-label={t("languageLabel")}
      onChange={(e) => {
        const next = e.target.value as (typeof routing.locales)[number];
        startTransition(() => {
          router.replace(pathname, { locale: next });
        });
      }}
      className="min-h-9 shrink-0 cursor-pointer appearance-none rounded-lg bg-blue-pill px-3 py-1.5 text-center text-[13px] font-bold text-white transition-colors hover:bg-[#5a74e6] disabled:opacity-60"
    >
      {routing.locales.map((l) => (
        <option key={l} value={l}>
          {LABELS[l]}
        </option>
      ))}
    </select>
  );
}
