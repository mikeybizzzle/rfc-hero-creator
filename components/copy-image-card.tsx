"use client";

import Image from "next/image";
import { useState } from "react";
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
    setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`card-frame rounded-xl bg-raised overflow-hidden group text-left w-full snap-start transition-colors active:border-gold active:scale-[0.99] transition-transform duration-100 ${
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
          className="object-cover"
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
      <div className="px-2.5 py-2 flex items-center justify-between gap-2">
        <span className="font-bold text-[12.5px] text-cream/90 truncate">
          {prefix && <span className={prefixClass}>{prefix}</span>}
          {label}
        </span>
        <span
          className={`text-[11px] font-extrabold uppercase tracking-[.5px] transition-colors shrink-0 ${
            selected ? "text-gold" : "text-muted group-hover:text-gold"
          }`}
        >
          {selected ? "Selected" : "Copy"}
        </span>
      </div>
    </button>
  );
}
