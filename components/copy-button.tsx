"use client";

import { useEffect, useState } from "react";

export function CopyButton({ text, label = "Copy prompt" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className={`min-h-10 shrink-0 rounded-lg px-4 py-2 text-[12.5px] font-extrabold uppercase tracking-[.5px] transition-[color,background-color,transform] active:scale-[.98] sm:text-[13.5px] ${
        copied
          ? "bg-gold-bright text-ink"
          : "bg-gradient-to-br from-gold to-orange text-ink hover:from-gold-bright hover:to-gold-bright"
      }`}
    >
      <span role="status">{copied ? <>Copied &#10003;</> : label}</span>
    </button>
  );
}
