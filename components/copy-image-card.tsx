"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ManifestImage } from "@/lib/data";
import { copyImageAsset } from "@/lib/image-clipboard";

type Status = "idle" | "copied" | "saved";

export function CopyImageCard({
  image,
  label,
  sizes,
  priority,
  prefix,
  prefixClass,
  selected,
  onCopy,
}: {
  image: ManifestImage;
  label: string;
  sizes: string;
  priority?: boolean;
  prefix?: string;
  prefixClass?: string;
  selected?: boolean;
  onCopy?: () => void;
}) {
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (status === "idle") return;
    const timer = setTimeout(() => setStatus("idle"), 2000);
    return () => clearTimeout(timer);
  }, [status]);

  async function onClick() {
    onCopy?.();
    const url = image.download ?? image.src;
    const result = await copyImageAsset(url, image.file);
    if (result === "copied") {
      setStatus("copied");
    } else {
      setStatus("saved");
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`interactive-card card-frame group w-full snap-start overflow-hidden rounded-xl bg-raised text-left ${
        selected ? "border-gold" : "hover:border-gold"
      }`}
      aria-label={`Copy ${prefix ?? ""}${label} to clipboard`}
    >
      <div className="relative aspect-square">
        <Image
          src={image.src}
          alt={`${prefix ?? ""}${label}`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
        />
        {status !== "idle" && (
          <span
            role="status"
            className={`absolute inset-0 bg-bg/80 grid place-items-center text-center px-2 text-gold-bright transition-opacity duration-150 starting:opacity-0 ${
              status === "copied" ? "display text-lg" : "font-bold text-xs"
            }`}
          >
            {status === "copied" ? <>COPIED &#10003;</> : "Downloaded — attach in ChatGPT"}
          </span>
        )}
      </div>
      <div className="flex min-h-9 items-center justify-between gap-1.5 px-2 py-1.5 sm:gap-2 sm:px-2.5 sm:py-2">
        <span className="truncate text-[11.5px] font-bold text-cream/90 sm:text-[12.5px]">
          {prefix && <span className={prefixClass}>{prefix}</span>}
          {label}
        </span>
        <span
          className={`shrink-0 text-[10px] font-extrabold uppercase tracking-[.5px] transition-colors sm:text-[11px] ${
            selected ? "text-gold" : "text-muted group-hover:text-gold"
          }`}
        >
          {selected ? "Selected" : "Copy"}
        </span>
      </div>
    </button>
  );
}
