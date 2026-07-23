"use client";

import { useState } from "react";

export function CopyButton({ text, label = "Copy prompt" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className={`font-extrabold text-[13.5px] tracking-[.5px] uppercase px-[18px] py-[9px] rounded-full transition-colors shrink-0 ${
        copied
          ? "bg-gold-bright text-ink"
          : "bg-gradient-to-br from-gold to-orange text-ink hover:from-gold-bright hover:to-gold-bright"
      }`}
    >
      <span role="status">{copied ? <>Copied &#10003;</> : label}</span>
    </button>
  );
}
