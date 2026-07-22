"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { ManifestImage } from "@/lib/data";

export type GalleryItem = ManifestImage & { name: string };

export function LightboxGallery({ items }: { items: GalleryItem[] }) {
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (dir: number) => {
      setIndex((i) => (i === null ? i : (i + dir + items.length) % items.length));
    },
    [items.length]
  );

  useEffect(() => {
    if (index === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, step]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((item, i) => (
          <button
            key={item.slug}
            onClick={() => setIndex(i)}
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
            <button onClick={() => step(-1)} className="hud text-xs text-muted hover:text-gold px-3 py-2">
              Prev
            </button>
            <span className="hud text-sm text-cream">{items[index].name}</span>
            <button onClick={() => step(1)} className="hud text-xs text-muted hover:text-gold px-3 py-2">
              Next
            </button>
          </div>
          <button
            onClick={close}
            className="absolute top-4 right-4 hud text-xs text-cream border border-line px-3 py-2 hover:border-gold hover:text-gold"
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}
