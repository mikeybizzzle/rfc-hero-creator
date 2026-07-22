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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((item, i) => (
          <button
            key={item.slug}
            onClick={(e) => {
              triggerRef.current = e.currentTarget;
              setIndex(i);
            }}
            className="group card-frame overflow-hidden text-left"
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
            <p className="hud text-xs text-muted group-hover:text-gold px-3 py-2.5 truncate transition-colors">
              {item.name}
            </p>
          </button>
        ))}
      </div>

      {index !== null && (
        <div
          ref={dialogRef}
          className="fixed inset-0 z-50 bg-bg/95 flex flex-col items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={items[index].name}
          onClick={close}
        >
          <div
            className="relative w-full max-w-3xl aspect-square"
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
            className="flex items-center gap-6 mt-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => step(-1)}
              className="hud text-xs text-muted hover:text-gold px-3 py-2 min-h-11 flex items-center"
            >
              Prev
            </button>
            <span className="hud text-sm text-cream">{items[index].name}</span>
            <button
              onClick={() => step(1)}
              className="hud text-xs text-muted hover:text-gold px-3 py-2 min-h-11 flex items-center"
            >
              Next
            </button>
          </div>
          <button
            ref={closeButtonRef}
            onClick={close}
            className="absolute top-4 right-4 hud text-xs text-cream border border-line px-3 py-2 min-h-11 flex items-center hover:border-gold hover:text-gold"
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}
