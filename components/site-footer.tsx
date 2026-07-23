"use client";

import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname.startsWith("/hero/concepts") || pathname.startsWith("/redesign")) return null;

  return (
    <footer className="mt-14 border-t border-line bg-raised/55">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-7 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="display text-base text-gold">RfC alliance</span>
          <span aria-hidden="true" className="text-line">
            /
          </span>
          <span>Last Z: Survival Shooter</span>
        </div>
        <span>Works with the ChatGPT app or chatgpt.com</span>
      </div>
    </footer>
  );
}
