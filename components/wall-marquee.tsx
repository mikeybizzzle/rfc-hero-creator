"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export type WallItem = {
  src: string;
  copyUrl: string;
  name: string;
};

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

export function WallMarquee({ items }: { items: WallItem[] }) {
  const [toast, setToast] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function flash(msg: string, src?: string) {
    setToast(msg);
    setCopied(src ?? null);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setToast(null);
      setCopied(null);
    }, 2600);
  }

  async function copyImage(item: WallItem) {
    try {
      // Safari requires the ClipboardItem to be constructed synchronously in the
      // user gesture, with the blob supplied as a promise.
      const blobPromise = fetch(item.copyUrl)
        .then((r) => {
          if (!r.ok) throw new Error(String(r.status));
          return r.blob();
        })
        .then(toPngBlob);
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blobPromise })]);
      flash(`${item.name} copied — paste it into ChatGPT`, item.src);
    } catch {
      flash("Copy blocked here — press & hold (or right-click) the image to copy/save it");
    }
  }

  const loop = [...items, ...items];

  return (
    <div className="overflow-hidden pt-0.5 pb-2.5">
      <div className="flex w-max [animation:marquee_112.5s_linear_infinite] hover:[animation-play-state:paused]">
        {loop.map((item, i) => (
          <button
            key={`${item.src}-${i}`}
            type="button"
            onClick={() => copyImage(item)}
            title="Copy image"
            aria-hidden={i >= items.length || undefined}
            tabIndex={i >= items.length ? -1 : undefined}
            className="relative w-[min(31vw,160px)] shrink-0 mr-2.5 cursor-pointer text-left border border-line rounded-xl overflow-hidden bg-surface hover:border-gold transition-colors"
          >
            <div className="relative aspect-square">
              <Image
                src={item.src}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 31vw, 160px"
                className="object-cover"
              />
            </div>
            <div className="px-2 py-1.5 font-bold text-[12.5px] text-cream/90 whitespace-nowrap overflow-hidden text-ellipsis">
              {item.name}
            </div>
            {copied === item.src && (
              <span className="absolute inset-0 grid place-items-center bg-bg/80 text-gold-bright display text-lg">
                COPIED &#10003;
              </span>
            )}
          </button>
        ))}
      </div>
      {toast && (
        <div
          role="status"
          className="fixed left-1/2 bottom-[22px] -translate-x-1/2 bg-gradient-to-br from-gold to-orange text-ink font-extrabold text-sm px-[18px] py-[11px] rounded-full shadow-[0_6px_24px_rgba(0,0,0,.5)] z-50 max-w-[90vw] text-center"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
