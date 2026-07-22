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
      className={`hud text-xs px-4 py-2.5 border transition-colors ${
        copied
          ? "border-gold bg-gold text-bg"
          : "border-gold text-gold hover:bg-gold hover:text-bg"
      }`}
    >
      {copied ? "Copied" : label}
    </button>
  );
}
