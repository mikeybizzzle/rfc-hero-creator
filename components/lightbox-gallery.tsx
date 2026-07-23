"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ManifestImage } from "@/lib/data";

export type GalleryItem = ManifestImage & { name: string };

export function LightboxGallery({ items }: { items: GalleryItem[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (dir: number) => {
      setIndex((i) => (i === null ? i : (i + dir + items.length) % items.length));
    },
    [items.length]
  );

  useEffect(() => {
    if (index === null) return;
    closeButtonRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, step]);

  useEffect(() => {
    if (index === null) {
      triggerRef.current?.focus();
      triggerRef.current = null;
    }
  }, [index]);

  return (
    <>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3.5 lg:grid-cols-4">
        {items.map((item, i) => (
          <button
            key={item.slug}
            onClick={(e) => {
              triggerRef.current = e.currentTarget;
              setIndex(i);
            }}
            className="interactive-card group card-frame overflow-hidden text-left"
            aria-label={`View ${item.name}`}
          >
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={item.src}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                priority={i < 4}
              />
            </div>
            <p className="truncate px-3 py-2.5 text-[12.5px] font-bold text-muted transition-colors group-hover:text-gold">
              {item.name}
            </p>
          </button>
        ))}
      </div>

      {index !== null && (
        <div
          ref={dialogRef}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg/92 p-3 backdrop-blur-xl sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={items[index].name}
          onClick={close}
        >
          <div
            className="relative aspect-square w-full max-w-3xl overflow-hidden rounded-2xl border border-line bg-raised shadow-[0_28px_90px_rgba(0,0,0,.6)]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={items[index].src}
              alt={items[index].name}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-contain"
              priority
            />
          </div>
          <div
            className="mt-3 flex max-w-full items-center gap-2 rounded-xl border border-line bg-surface/90 p-1.5 sm:mt-4 sm:gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => step(-1)}
              className="flex min-h-11 items-center rounded-lg px-3 py-2 text-xs font-extrabold uppercase tracking-[.6px] text-muted transition-colors hover:bg-raised hover:text-gold"
            >
              Prev
            </button>
            <span className="min-w-0 truncate px-1 text-sm font-bold text-cream">
              {items[index].name}
            </span>
            <button
              onClick={() => step(1)}
              className="flex min-h-11 items-center rounded-lg px-3 py-2 text-xs font-extrabold uppercase tracking-[.6px] text-muted transition-colors hover:bg-raised hover:text-gold"
            >
              Next
            </button>
          </div>
          <button
            ref={closeButtonRef}
            onClick={close}
            className="absolute right-3 top-3 flex min-h-11 items-center rounded-lg border border-line bg-bg/75 px-3 py-2 text-xs font-extrabold uppercase tracking-[.6px] text-cream backdrop-blur-md transition-colors hover:border-gold hover:text-gold sm:right-5 sm:top-5"
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}
