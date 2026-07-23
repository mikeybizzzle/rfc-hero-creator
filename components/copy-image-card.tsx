"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ManifestImage } from "@/lib/data";

type Status = "idle" | "copied" | "saved";

async function toPngBlob(blob: Blob): Promise<Blob> {
  if (blob.type === "image/png") return blob;
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png")
  );
}

async function writeImageToClipboard(url: string): Promise<boolean> {
  if (typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) return false;
  try {
    // Safari requires the ClipboardItem to be constructed synchronously in the
    // user gesture, with the blob supplied as a promise.
    const blobPromise = fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.blob();
      })
      .then(toPngBlob);
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blobPromise })]);
    return true;
  } catch {
    try {
      const blob = await (await fetch(url)).blob().then(toPngBlob);
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      return true;
    } catch {
      return false;
    }
  }
}

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
    if (await writeImageToClipboard(url)) {
      setStatus("copied");
    } else {
      const a = document.createElement("a");
      a.href = url;
      a.download = "";
      a.click();
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
