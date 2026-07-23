"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Hero (From Image)", mobileLabel: "From photo", href: "/hero" },
  { label: "Custom Image", mobileLabel: "Custom", href: "/custom" },
  { label: "Hero (Without Image)", mobileLabel: "No photo", href: "/unique" },
  { label: "Gallery", mobileLabel: "Gallery", href: "/gallery" },
] as const;

export function SiteNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/hero/concepts")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-5 px-4">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 text-cream"
          aria-label="RfC Hero Forge home"
        >
          <span className="display rounded-[9px] bg-gradient-to-br from-gold to-orange px-2.5 py-1 text-lg leading-none text-ink shadow-[0_6px_20px_rgba(242,106,32,.18)] transition-transform duration-200 group-hover:-rotate-2 group-hover:scale-105">
            RfC
          </span>
          <span className="display text-xl leading-none">Hero Forge</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 sm:flex">
          {links.map(({ label, href }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-[13px] font-extrabold transition-colors ${
                  active
                    ? "bg-gold/10 text-gold-bright"
                    : "text-muted hover:bg-surface hover:text-cream"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <nav
        aria-label="Main navigation"
        className="scrollbar-none mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto border-t border-line/70 px-3 py-1.5 sm:hidden"
      >
        {links.map(({ mobileLabel, href }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`min-h-10 shrink-0 rounded-lg px-3 py-2 text-[13px] font-extrabold transition-colors ${
                active
                  ? "bg-gold/12 text-gold-bright"
                  : "text-muted hover:bg-surface hover:text-cream"
              }`}
            >
              {mobileLabel}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
