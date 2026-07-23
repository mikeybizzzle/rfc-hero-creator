"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("Wall");
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
      flash(t("copiedToast", { name: item.name }), item.src);
    } catch {
      flash(t("copyBlockedToast"));
    }
  }

  const loop = [...items, ...items];

  return (
    <div className="overflow-hidden pb-2.5 pt-0.5 sm:[mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]">
      <div className="flex w-max [animation:marquee_112.5s_linear_infinite] hover:[animation-play-state:paused]">
        {loop.map((item, i) => (
          <button
            key={`${item.src}-${i}`}
            type="button"
            onClick={() => copyImage(item)}
            title={t("copyImageTitle")}
            aria-hidden={i >= items.length || undefined}
            tabIndex={i >= items.length ? -1 : undefined}
            className="relative mr-2.5 w-[min(31vw,160px)] shrink-0 cursor-pointer overflow-hidden rounded-xl border border-line bg-surface text-left transition-[border-color,transform] hover:-translate-y-0.5 hover:border-gold active:scale-[.99]"
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
                {t("copied")}
              </span>
            )}
          </button>
        ))}
      </div>
      {toast && (
        <div
          role="status"
          className="fixed bottom-[max(22px,env(safe-area-inset-bottom))] left-1/2 z-50 max-w-[90vw] -translate-x-1/2 rounded-xl bg-gradient-to-b from-amber to-orange px-[18px] py-[11px] text-center text-sm font-extrabold text-white shadow-[0_10px_32px_rgba(0,0,0,.55)]"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
