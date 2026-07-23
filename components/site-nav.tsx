"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { label: "Hero (From Image)", href: "/hero" },
  { label: "Custom Image", href: "/custom" },
  { label: "Hero (Without Image)", href: "/unique" },
  { label: "Gallery", href: "/gallery" },
] as const;

function pillClass(active: boolean) {
  return `shrink-0 rounded-lg px-3 py-1.5 text-[13px] font-bold transition-colors ${
    active
      ? "bg-blue-pill text-gold"
      : "bg-blue-pill text-white hover:bg-[#5a74e6]"
  }`;
}

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 bg-black">
      <div className="relative mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-5 px-4">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 text-white"
          aria-label="RfC Hero Forge home"
        >
          <span className="display rounded-[9px] bg-gradient-to-b from-amber to-orange px-2.5 py-1 text-lg leading-none text-white transition-transform duration-200 group-hover:-rotate-2 group-hover:scale-105">
            RfC
          </span>
          <span className="display text-xl leading-none">Hero Forge</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-2 sm:flex">
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

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-1.5 grid h-10 w-10 place-items-center rounded-lg text-white transition-colors hover:bg-white/10 sm:hidden"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <>
                <path d="M4 4l12 12" />
                <path d="M16 4L4 16" />
              </>
            ) : (
              <>
                <path d="M3 5h14" />
                <path d="M3 10h14" />
                <path d="M3 15h14" />
              </>
            )}
          </svg>
        </button>

        {open && (
          <nav
            id="mobile-nav"
            aria-label="Main navigation"
            className="absolute inset-x-0 top-full grid gap-1.5 border-t border-white/10 bg-black px-4 pb-4 pt-3 shadow-[0_18px_32px_rgba(0,0,0,0.6)] sm:hidden"
          >
            {links.map(({ label, href }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-11 items-center rounded-lg px-3.5 text-sm font-bold transition-colors ${
                    active ? "bg-blue-pill text-gold" : "bg-blue-pill text-white"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
