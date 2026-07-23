"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";

function pillClass(active: boolean) {
  return `shrink-0 rounded-lg px-3 py-1.5 text-[13px] font-bold transition-colors ${
    active
      ? "bg-blue-pill text-gold"
      : "bg-blue-pill text-white hover:bg-[#5a74e6]"
  }`;
}

export function SiteNav() {
  const t = useTranslations("Nav");
  const pathname = usePathname();

  const links = [
    { label: t("hero"), mobileLabel: t("heroMobile"), href: "/hero" },
    { label: t("custom"), mobileLabel: t("customMobile"), href: "/custom" },
    { label: t("unique"), mobileLabel: t("uniqueMobile"), href: "/unique" },
    { label: t("gallery"), mobileLabel: t("galleryMobile"), href: "/gallery" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-black">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-5 px-4">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 text-white"
          aria-label={t("homeAria")}
        >
          <span className="display rounded-[9px] bg-gradient-to-b from-amber to-orange px-2.5 py-1 text-lg leading-none text-white transition-transform duration-200 group-hover:-rotate-2 group-hover:scale-105">
            RfC
          </span>
          <span className="display text-xl leading-none">Hero Forge</span>
        </Link>

        <div className="flex items-center gap-2">
          <nav aria-label={t("mainAria")} className="hidden items-center gap-2 sm:flex">
            {links.map(({ label, href }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={pillClass(active)}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <LocaleSwitcher />
        </div>
      </div>

      <nav
        aria-label={t("mainAria")}
        className="scrollbar-none mx-auto flex w-full max-w-6xl gap-2 overflow-x-auto border-t border-white/10 px-3 py-1.5 sm:hidden"
      >
        {links.map(({ mobileLabel, href }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`min-h-9 ${pillClass(active)} flex items-center`}
            >
              {mobileLabel}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
