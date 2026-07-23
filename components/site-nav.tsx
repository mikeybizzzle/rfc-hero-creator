"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["Hero (From Image)", "/hero"],
  ["Custom Image", "/custom"],
  ["Hero (Without Image)", "/unique"],
  ["Gallery", "/gallery"],
] as const;

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="mx-auto w-full max-w-6xl px-4 py-4 flex items-center justify-between gap-3 flex-wrap">
      <Link href="/" className="flex items-center gap-2.5 text-cream">
        <span className="display text-lg leading-none bg-gradient-to-br from-gold to-orange text-ink px-2.5 py-1 rounded-[10px]">
          RfC
        </span>
        <span className="display text-xl leading-none">Hero Forge</span>
      </Link>
      <nav className="flex gap-4 flex-wrap font-bold text-sm">
        {links.map(([label, href]) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`transition-colors ${
                active ? "text-gold-bright" : "text-gold hover:text-gold-bright"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
