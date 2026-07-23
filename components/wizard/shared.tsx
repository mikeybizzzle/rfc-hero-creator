"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { copyImageAsset } from "@/lib/image-clipboard";

export function useCopyToast() {
  const t = useTranslations("Wizard.shared");
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

  async function copyImage(url: string, name: string, filename?: string) {
    const result = await copyImageAsset(url, filename);
    if (result === "copied") {
      flash(t("copiedToast", { name }), url);
    } else if (result === "downloaded") {
      flash(t("downloadedToast", { name }), url);
    } else {
      flash(t("copyBlockedToast"));
    }
  }

  return { toast, copied, flash, copyImage };
}

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      role="status"
      className="fixed bottom-[150px] left-1/2 z-50 max-w-[90vw] -translate-x-1/2 rounded-full bg-gradient-to-b from-amber to-orange px-[18px] py-[11px] text-center text-sm font-extrabold text-white shadow-[0_6px_24px_rgba(0,0,0,.5)]"
    >
      {message}
    </div>
  );
}

export function TopActions({ onHow }: { onHow: () => void }) {
  const t = useTranslations("Wizard.shared");
  return (
    <div className="mb-3 flex gap-2">
      <button
        type="button"
        onClick={onHow}
        className="min-h-11 flex-1 rounded-xl border border-line bg-raised px-3 py-2.5 text-[11.5px] font-extrabold tracking-[.4px] text-gold transition-colors hover:border-gold"
      >
        {t("how")}
      </button>
    </div>
  );
}

export function StepSection({
  index,
  title,
  step,
  onOpen,
  cta,
  onNext,
  ctaVariant = "solid",
  children,
}: {
  index: number;
  title: string;
  step: number;
  onOpen: (step: number) => void;
  cta: string;
  onNext: () => void;
  ctaVariant?: "solid" | "outline";
  children: React.ReactNode;
}) {
  const open = step === index;
  const done = step > index;
  const bodyId = `step-${index}-body`;

  return (
    <section
      className={`overflow-hidden rounded-xl border transition-colors ${
        open ? "border-line bg-surface" : "border-line/50 bg-raised"
      }`}
    >
      <button
        type="button"
        onClick={() => {
          if (done) onOpen(index);
        }}
        disabled={!done}
        aria-expanded={open}
        aria-controls={bodyId}
        className={`flex min-h-12 w-full items-center gap-2.5 px-3.5 py-2.5 text-left ${
          done ? "cursor-pointer" : ""
        }`}
      >
        <span
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[13px] font-extrabold ${
            open
              ? "bg-gradient-to-b from-amber to-orange text-white"
              : done
                ? "border border-line bg-surface text-gold"
                : "border border-line/60 bg-raised text-muted/50"
          }`}
        >
          {done ? "✓" : index}
        </span>
        <span
          className={`display text-[17px] leading-tight ${
            open ? "text-cream" : done ? "text-gold" : "text-muted/50"
          }`}
        >
          {title}
        </span>
        {done && (
          <span aria-hidden="true" className="ml-auto text-[11px] text-muted">
            ▼
          </span>
        )}
      </button>
      {open && (
        <div id={bodyId} className="px-3.5 pb-4">
          {children}
          <button
            type="button"
            onClick={onNext}
            className={
              ctaVariant === "outline"
                ? "mt-3.5 min-h-12 w-full rounded-xl border border-line bg-raised px-4 py-3 text-sm font-extrabold tracking-[.5px] text-gold transition-colors hover:border-gold"
                : "lz-cta mt-3.5 min-h-12 w-full px-4 py-3 text-sm font-extrabold tracking-[.5px]"
            }
          >
            {cta}
          </button>
        </div>
      )}
    </section>
  );
}

export type ChatImage = { src: string; alt: string };

export function CopyTile({
  src,
  alt,
  label,
  copied,
  onCopy,
  className = "",
  sizes,
  selected,
  title,
}: {
  src: string;
  alt: string;
  label: string;
  copied: boolean;
  onCopy: () => void;
  className?: string;
  sizes: string;
  selected?: boolean;
  title?: string;
}) {
  const t = useTranslations("Wizard.shared");
  return (
    <button
      type="button"
      onClick={onCopy}
      title={title ?? t("copyImageTitle")}
      className={`relative cursor-pointer overflow-hidden rounded-xl border ${
        selected ? "border-gold" : "border-line"
      } bg-raised text-left transition-[border-color,transform] hover:-translate-y-0.5 hover:border-gold active:scale-[.99] ${className}`}
    >
      <div className="relative aspect-square">
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      </div>
      <div className="overflow-hidden text-ellipsis whitespace-nowrap px-2 py-1.5 text-center text-[11px] font-bold text-cream/90">
        {label}
      </div>
      {copied && (
        <span className="display absolute inset-0 grid place-items-center bg-bg/85 text-sm text-gold-bright">
          {t("copied")}
        </span>
      )}
    </button>
  );
}

export const inputClass =
  "w-full min-w-0 bg-raised border border-line rounded-[10px] px-3 py-2.5 text-base text-cream placeholder:text-muted/60 outline-none transition-[border-color] focus:border-gold";

export const labelClass = "grid gap-1 text-xs font-bold text-cream/90";

const RANK_ICONS: Record<"S" | "A" | "B", string> = {
  S: "/icons/rank-s.png",
  A: "/icons/rank-a.png",
  B: "/icons/rank-b.png",
};

export function RankPicker({
  rank,
  custom,
  onPickRank,
  onPickCustom,
  customLetter,
  customColor,
  onLetter,
  onColor,
}: {
  rank: "S" | "A" | "B";
  custom: boolean;
  onPickRank: (rank: "S" | "A" | "B") => void;
  onPickCustom: () => void;
  customLetter: string;
  customColor: string;
  onLetter: (v: string) => void;
  onColor: (v: string) => void;
}) {
  const t = useTranslations("Wizard.shared");
  return (
    <>
      <div
        className="mb-2.5 flex flex-wrap items-center gap-1.5"
        role="radiogroup"
        aria-label={t("rankAria")}
      >
        <span className="text-[12.5px] font-extrabold text-cream/90">
          {t("rankLabel")}
        </span>
        {(["S", "A", "B"] as const).map((letter) => {
          const selected = !custom && letter === rank;
          return (
            <button
              key={letter}
              type="button"
              role="radio"
              aria-checked={selected}
              title={t("rankTitle", { letter })}
              onClick={() => onPickRank(letter)}
              className={`grid min-h-11 place-items-center rounded-xl border-2 px-3 py-1 transition-[border-color,opacity] ${
                selected
                  ? "border-gold bg-surface opacity-100"
                  : "border-line bg-raised opacity-50 hover:opacity-80"
              }`}
            >
              <Image
                src={RANK_ICONS[letter]}
                alt={t("rankTitle", { letter })}
                width={17}
                height={28}
                className="h-7 w-auto"
              />
            </button>
          );
        })}
        <button
          type="button"
          role="radio"
          aria-checked={custom}
          onClick={onPickCustom}
          className={`min-h-11 rounded-xl border-2 px-3 py-2 text-[12.5px] font-extrabold transition-colors ${
            custom
              ? "border-transparent bg-gradient-to-b from-amber to-orange text-white"
              : "border-line bg-raised text-cream/90 hover:border-gold"
          }`}
        >
          {t("customRank")}
        </button>
      </div>
      {custom && (
        <div className="mb-2.5 grid grid-cols-2 gap-2">
          <label className={labelClass}>
            {t("rankLetter")}
            <input
              type="text"
              value={customLetter}
              onChange={(e) => onLetter(e.target.value)}
              maxLength={3}
              placeholder={t("rankLetterPlaceholder")}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            {t("themeColor")}
            <input
              type="text"
              value={customColor}
              onChange={(e) => onColor(e.target.value)}
              placeholder={t("themeColorPlaceholder")}
              className={inputClass}
            />
          </label>
        </div>
      )}
    </>
  );
}

export function PromptActions({
  prompt,
  copyLabel,
  viewLabel,
  onFail,
}: {
  prompt: string;
  copyLabel?: string;
  viewLabel?: string;
  onFail: (msg: string) => void;
}) {
  const t = useTranslations("Wizard.shared");
  const copyText = copyLabel ?? t("copyPrompt");
  const viewText = viewLabel ?? t("fullPrompt");
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      onFail(t("copyFailedToast"));
    }
  }

  return (
    <div className="grid gap-2">
      <button
        type="button"
        onClick={copy}
        aria-live="polite"
        className="lz-cta min-h-12 w-full px-4 py-3 text-sm font-extrabold tracking-[.5px]"
      >
        <span role="status">{copied ? t("copied") : copyText}</span>
      </button>
      <a
        href={`https://chatgpt.com/?q=${encodeURIComponent(prompt)}`}
        target="_blank"
        rel="noopener"
        className="grid min-h-11 w-full place-items-center rounded-xl border border-line bg-raised px-3 py-2.5 text-xs font-extrabold tracking-[.5px] text-gold transition-colors hover:border-gold"
      >
        {t("openChatGpt")}
      </a>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="min-h-11 w-full rounded-xl border border-line bg-raised px-3 py-2.5 text-xs font-extrabold tracking-[.5px] text-gold transition-colors hover:border-gold"
      >
        {open
          ? t("hideLabel", { label: viewText })
          : t("viewLabel", { label: viewText })}
      </button>
      {open && (
        <pre
          tabIndex={0}
          role="region"
          aria-label={t("promptRegionAria")}
          className="prompt-block max-h-[220px] overflow-auto rounded-xl border border-line bg-raised p-3 text-cream/90"
        >
          {prompt}
        </pre>
      )}
    </div>
  );
}
