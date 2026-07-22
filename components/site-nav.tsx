"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  ["Guide", "/guide"],
  ["Builder", "/builder"],
  ["Templates", "/templates"],
  ["Gallery", "/gallery"],
  ["Walkthroughs", "/walkthroughs"],
] as const;

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 flex items-center justify-between h-14">
        <Link href="/" className="flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span className="display text-gold text-xl leading-none">RFC</span>
          <span className="hud text-xs text-cream">Hero Creator</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          {links.map(([label, href]) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`hud text-xs transition-colors ${
                  active ? "text-gold" : "text-muted hover:text-cream"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="md:hidden hud text-xs text-cream border border-line px-3 py-2"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-line bg-bg">
          {links.map(([label, href]) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 hud text-sm border-b border-line/50 ${
                  active ? "text-gold" : "text-cream"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
