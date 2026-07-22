"use client";

import Image from "next/image";
import { useState } from "react";
import type { ManifestImage } from "@/lib/data";

type Status = "idle" | "copied" | "saved";

async function writeImageToClipboard(url: string): Promise<boolean> {
  if (typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) return false;
  try {
    // Safari requires the ClipboardItem to be constructed synchronously in the
    // user gesture, with the blob supplied as a promise.
    const blobPromise = fetch(url).then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.blob();
    });
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blobPromise })]);
    return true;
  } catch {
    try {
      const blob = await (await fetch(url)).blob();
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
}: {
  image: ManifestImage;
  label: string;
  sizes: string;
  priority?: boolean;
}) {
  const [status, setStatus] = useState<Status>("idle");

  async function onClick() {
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
      className="card-frame overflow-hidden group text-left w-full snap-start"
      aria-label={`Copy ${label} to clipboard`}
    >
      <div className="relative aspect-square">
        <Image
          src={image.src}
          alt={label}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
        {status !== "idle" && (
          <span className="absolute inset-0 bg-bg/85 flex items-center justify-center hud text-xs text-gold">
            {status === "copied" ? "Copied" : "Saved"}
          </span>
        )}
      </div>
      <div className="px-2 py-1.5 flex items-baseline justify-between gap-2">
        <span className="hud text-[11px] text-cream truncate">{label}</span>
        <span className="hud text-[10px] text-muted group-hover:text-gold transition-colors shrink-0">
          Copy
        </span>
      </div>
    </button>
  );
}
