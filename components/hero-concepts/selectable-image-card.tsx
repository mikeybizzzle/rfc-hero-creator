"use client";

import Image from "next/image";
import type { ManifestImage } from "@/lib/data";

export function SelectableImageCard({
  image,
  label,
  selected,
  onSelect,
  sizes,
  priority,
  compact = false,
  className = "",
}: {
  image: ManifestImage;
  label: string;
  selected: boolean;
  onSelect: () => void;
  sizes: string;
  priority?: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={`Select ${label}`}
      onClick={onSelect}
      className={`group relative shrink-0 overflow-hidden rounded-xl border text-left transition-[border-color,box-shadow,transform] duration-200 active:scale-[.985] ${
        selected
          ? "border-gold shadow-[0_0_0_2px_rgba(255,208,90,.18),0_16px_36px_rgba(20,9,2,.38)]"
          : "border-line hover:border-gold/70"
      } ${className}`}
    >
      <div className="relative aspect-square overflow-hidden bg-raised">
        <Image
          src={image.src}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.025]"
        />
        <span
          aria-hidden="true"
          className={`absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full border text-[11px] font-black transition-colors ${
            selected
              ? "border-gold bg-gold text-ink"
              : "border-cream/40 bg-bg/70 text-transparent"
          }`}
        >
          ✓
        </span>
      </div>
      {!compact && (
        <span className="flex min-h-8 items-center justify-between gap-1 bg-surface/95 px-2 py-1.5">
          <span className="truncate text-[11px] font-bold text-cream/90">
            {label}
          </span>
          <span
            className={`text-[9px] font-extrabold uppercase tracking-[.06em] ${
              selected ? "text-gold" : "text-muted"
            }`}
          >
            {selected ? "Picked" : "Pick"}
          </span>
        </span>
      )}
    </button>
  );
}
